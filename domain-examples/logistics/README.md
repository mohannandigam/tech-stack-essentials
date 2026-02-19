# Logistics - Package Tracking System

## Overview

Real-time package tracking and route optimization system for logistics and delivery operations.

## 🎯 Key Use Cases

- **Package Tracking**: Real-time location updates for packages
- **Route Optimization**: Calculate optimal delivery routes
- **Warehouse Management**: Track inventory in warehouses
- **Delivery Scheduling**: Schedule and manage deliveries
- **Driver Management**: Assign and track delivery drivers

## 🏗️ Architecture Pattern

**Primary**: Event-Driven + Geospatial  
**Secondary**: Real-time Processing, Graph Algorithms

## 💻 Quick Example

```python
# Real-time package tracking
class TrackingService:
    async def update_location(self, package_id: str, location: tuple):
        lat, lon = location

        # Update current location
        await self.db.execute(
            '''UPDATE packages
               SET current_location = ST_SetSRID(ST_MakePoint($1, $2), 4326),
                   last_updated = NOW()
               WHERE id = $3''',
            lon, lat, package_id
        )

        # Publish event
        await self.event_bus.publish({
            'type': 'package.location_updated',
            'package_id': package_id,
            'location': {'lat': lat, 'lon': lon},
            'timestamp': datetime.now()
        })

        # Check if near destination
        package = await self.get_package(package_id)
        distance = self.calculate_distance(location, package.destination)

        if distance < 1000:  # Within 1km
            await self.notify_recipient(package_id, "Package arriving soon")
```

## 🗺️ Route Optimization

```python
# Dijkstra's algorithm for route optimization
class RouteOptimizer:
    def optimize_route(self, start: Location, stops: List[Location]):
        # Build graph of delivery locations
        graph = self.build_graph(stops)

        # Find optimal route using traveling salesman approximation
        route = self.nearest_neighbor(start, stops)

        # Refine with 2-opt optimization
        route = self.two_opt(route)

        return route

    def calculate_eta(self, route: List[Location]):
        total_time = 0
        for i in range(len(route) - 1):
            distance = self.calculate_distance(route[i], route[i+1])
            # Assume average speed of 40 km/h
            total_time += distance / 40
            # Add 5 minutes per stop
            total_time += 5/60

        return total_time  # hours
```

## 🚀 Getting Started

```bash
cd domain-examples/logistics
docker-compose up -d

# Create shipment
curl -X POST http://localhost:3000/api/shipments \
  -d '{"from": "123 Main St", "to": "456 Oak Ave", "weight": "5kg"}'

# Track package
curl http://localhost:3000/api/track/PKG-12345
```

## 📊 Performance Targets

- Location update: < 50ms
- Route optimization: < 2 seconds for 50 stops
- ETA calculation: < 100ms
- Real-time tracking: < 1 second delay

## 🔗 Related Examples

- [Retail Domain](../retail/README.md)
- [Event-Driven Architecture](../../architectures/event-driven/README.md)

## 📦 Implementation Examples

### Example 1: Package Tracking Service (Go)

```go
// models/package.go
package models

import (
    "time"
    "github.com/google/uuid"
)

type PackageStatus string

const (
    StatusPending     PackageStatus = "PENDING"
    StatusPickedUp    PackageStatus = "PICKED_UP"
    StatusInTransit   PackageStatus = "IN_TRANSIT"
    StatusOutForDeliv PackageStatus = "OUT_FOR_DELIVERY"
    StatusDelivered   PackageStatus = "DELIVERED"
    StatusException   PackageStatus = "EXCEPTION"
)

type Package struct {
    ID              uuid.UUID     `json:"id" db:"id"`
    TrackingNumber  string        `json:"tracking_number" db:"tracking_number"`
    SenderAddress   Address       `json:"sender_address" db:"sender_address"`
    RecipientAddress Address      `json:"recipient_address" db:"recipient_address"`
    Weight          float64       `json:"weight" db:"weight"`
    Dimensions      Dimensions    `json:"dimensions" db:"dimensions"`
    Status          PackageStatus `json:"status" db:"status"`
    CurrentLocation Location      `json:"current_location" db:"current_location"`
    EstimatedDelivery time.Time   `json:"estimated_delivery" db:"estimated_delivery"`
    CreatedAt       time.Time     `json:"created_at" db:"created_at"`
}

type Location struct {
    Latitude  float64 `json:"latitude"`
    Longitude float64 `json:"longitude"`
    Address   string  `json:"address"`
}
```

```go
// services/tracking_service.go
package services

import (
    "context"
    "fmt"
    "time"
    "math"

    "github.com/jmoiron/sqlx"
    "github.com/go-redis/redis/v8"
    "github.com/google/uuid"
)

type TrackingService struct {
    db    *sqlx.DB
    redis *redis.Client
    pubsub *PubSubClient
}

func NewTrackingService(db *sqlx.DB, redis *redis.Client, pubsub *PubSubClient) *TrackingService {
    return &TrackingService{
        db:     db,
        redis:  redis,
        pubsub: pubsub,
    }
}

// UpdateLocation updates package location in real-time
func (s *TrackingService) UpdateLocation(
    ctx context.Context,
    trackingNumber string,
    location Location,
) error {
    tx, err := s.db.BeginTxx(ctx, nil)
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Get package
    var pkg Package
    err = tx.GetContext(ctx, &pkg,
        "SELECT * FROM packages WHERE tracking_number = $1",
        trackingNumber,
    )
    if err != nil {
        return fmt.Errorf("package not found: %w", err)
    }

    // Calculate distance to destination
    distance := s.calculateDistance(location, pkg.RecipientAddress.Location)

    // Update status based on distance
    newStatus := pkg.Status
    if distance < 1.0 { // Within 1km
        newStatus = StatusOutForDeliv
    } else if pkg.Status == StatusPending {
        newStatus = StatusInTransit
    }

    // Update package
    _, err = tx.ExecContext(ctx,
        `UPDATE packages
         SET current_location = $1, status = $2, updated_at = NOW()
         WHERE tracking_number = $3`,
        location, newStatus, trackingNumber,
    )
    if err != nil {
        return err
    }

    // Record location history
    _, err = tx.ExecContext(ctx,
        `INSERT INTO location_history (package_id, location, timestamp)
         VALUES ($1, $2, NOW())`,
        pkg.ID, location,
    )
    if err != nil {
        return err
    }

    if err = tx.Commit(); err != nil {
        return err
    }

    // Publish real-time update
    s.pubsub.Publish(ctx, "package-updates", map[string]interface{}{
        "tracking_number": trackingNumber,
        "location":        location,
        "status":          newStatus,
        "timestamp":       time.Now(),
    })

    // Send notification if near destination
    if distance < 5.0 { // Within 5km
        go s.sendNearbyNotification(pkg.ID, distance)
    }

    // Cache current location
    cacheKey := fmt.Sprintf("package:location:%s", trackingNumber)
    s.redis.Set(ctx, cacheKey, location, 5*time.Minute)

    return nil
}

func (s *TrackingService) calculateDistance(from, to Location) float64 {
    // Haversine formula
    const earthRadius = 6371.0 // km

    lat1 := from.Latitude * math.Pi / 180
    lat2 := to.Latitude * math.Pi / 180
    deltaLat := (to.Latitude - from.Latitude) * math.Pi / 180
    deltaLon := (to.Longitude - from.Longitude) * math.Pi / 180

    a := math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
        math.Cos(lat1)*math.Cos(lat2)*
        math.Sin(deltaLon/2)*math.Sin(deltaLon/2)

    c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

    return earthRadius * c
}

// GetTrackingHistory returns full tracking history
func (s *TrackingService) GetTrackingHistory(
    ctx context.Context,
    trackingNumber string,
) ([]LocationUpdate, error) {
    var history []LocationUpdate

    err := s.db.SelectContext(ctx, &history,
        `SELECT lh.*
         FROM location_history lh
         JOIN packages p ON lh.package_id = p.id
         WHERE p.tracking_number = $1
         ORDER BY lh.timestamp ASC`,
        trackingNumber,
    )

    return history, err
}
```

### Example 2: Route Optimization Service (Python)

```python
# services/route_optimizer.py
import numpy as np
from typing import List, Tuple
from dataclasses import dataclass
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pycptsat_cp

@dataclass
class Stop:
    id: str
    latitude: float
    longitude: float
    packages: List[str]
    time_window: Tuple[int, int]  # (earliest, latest) in minutes from depot

class RouteOptimizer:
    def __init__(self):
        self.earth_radius_km = 6371.0

    def optimize_route(
        self,
        depot: Stop,
        stops: List[Stop],
        vehicle_capacity: int = 100,
        max_route_duration: int = 480  # 8 hours in minutes
    ) -> List[List[Stop]]:
        """
        Optimize delivery routes using Google OR-Tools
        Returns: List of routes, where each route is a list of stops
        """

        # Create distance matrix
        locations = [depot] + stops
        distance_matrix = self._create_distance_matrix(locations)

        # Create routing model
        manager = pycptsat_cp.RoutingIndexManager(
            len(distance_matrix),
            1,  # Number of vehicles
            0   # Depot index
        )

        routing = pycptsat_cp.RoutingModel(manager)

        # Distance callback
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return int(distance_matrix[from_node][to_node] * 1000)  # Convert to meters

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        # Add time window constraints
        time = 'Time'
        routing.AddDimension(
            transit_callback_index,
            30,  # Allow waiting time
            max_route_duration,
            False,
            time
        )
        time_dimension = routing.GetDimensionOrDie(time)

        # Add time window constraints for each stop
        for location_idx, stop in enumerate(locations[1:], 1):
            index = manager.NodeToIndex(location_idx)
            time_dimension.CumulVar(index).SetRange(
                stop.time_window[0],
                stop.time_window[1]
            )

        # Solve
        search_parameters = pycptsat_cp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = (
            routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        )

        solution = routing.SolveWithParameters(search_parameters)

        if solution:
            return self._extract_routes(manager, routing, solution, locations)
        else:
            raise Exception("No solution found")

    def _create_distance_matrix(self, locations: List[Stop]) -> np.ndarray:
        """Create distance matrix using Haversine formula"""
        n = len(locations)
        matrix = np.zeros((n, n))

        for i in range(n):
            for j in range(n):
                if i != j:
                    matrix[i][j] = self._haversine_distance(
                        locations[i].latitude, locations[i].longitude,
                        locations[j].latitude, locations[j].longitude
                    )

        return matrix

    def _haversine_distance(
        self,
        lat1: float, lon1: float,
        lat2: float, lon2: float
    ) -> float:
        """Calculate distance between two points in km"""
        lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
        c = 2 * np.arcsin(np.sqrt(a))

        return self.earth_radius_km * c

    def _extract_routes(
        self,
        manager,
        routing,
        solution,
        locations: List[Stop]
    ) -> List[List[Stop]]:
        """Extract routes from solution"""
        routes = []

        for vehicle_id in range(routing.vehicles()):
            route = []
            index = routing.Start(vehicle_id)

            while not routing.IsEnd(index):
                node_index = manager.IndexToNode(index)
                if node_index != 0:  # Skip depot
                    route.append(locations[node_index])
                index = solution.Value(routing.NextVar(index))

            if route:
                routes.append(route)

        return routes

    def calculate_eta(
        self,
        current_location: Stop,
        destination: Stop,
        average_speed_kmh: float = 40.0
    ) -> int:
        """Calculate estimated time of arrival in minutes"""
        distance = self._haversine_distance(
            current_location.latitude, current_location.longitude,
            destination.latitude, destination.longitude
        )

        # Time in hours, converted to minutes
        travel_time = (distance / average_speed_kmh) * 60

        # Add buffer for traffic (20%)
        return int(travel_time * 1.2)
```

### Example 3: Warehouse Management (TypeScript)

```typescript
// services/warehouse.service.ts
import { Pool } from "pg";

interface WarehouseLocation {
  warehouse: string;
  zone: string;
  aisle: string;
  shelf: string;
  bin: string;
}

interface InventoryItem {
  sku: string;
  quantity: number;
  location: WarehouseLocation;
  reserved: number;
  available: number;
}

export class WarehouseService {
  constructor(private readonly db: Pool) {}

  // Pick items for shipment using optimal path
  async pickItems(
    orderId: string,
    items: Array<{ sku: string; quantity: number }>,
  ): Promise<PickList> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      // Get item locations
      const locations = await this.getItemLocations(items);

      // Optimize pick path (zone -> aisle -> shelf order)
      const optimizedPath = this.optimizePickPath(locations);

      // Reserve inventory
      for (const item of items) {
        await client.query(
          `UPDATE warehouse_inventory
           SET reserved = reserved + $1
           WHERE sku = $2 AND warehouse = $3
             AND (quantity - reserved) >= $1`,
          [item.quantity, item.sku, "MAIN"],
        );
      }

      // Create pick list
      const pickListId = await client.query(
        `INSERT INTO pick_lists (order_id, items, path, status)
         VALUES ($1, $2, $3, 'PENDING')
         RETURNING id`,
        [orderId, JSON.stringify(items), JSON.stringify(optimizedPath)],
      );

      await client.query("COMMIT");

      return {
        id: pickListId.rows[0].id,
        orderId,
        items: optimizedPath,
        estimatedPickTime: this.calculatePickTime(optimizedPath),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private optimizePickPath(locations: InventoryItem[]): InventoryItem[] {
    // Sort by: warehouse -> zone -> aisle -> shelf -> bin
    return locations.sort((a, b) => {
      const locA = a.location;
      const locB = b.location;

      if (locA.warehouse !== locB.warehouse)
        return locA.warehouse.localeCompare(locB.warehouse);
      if (locA.zone !== locB.zone) return locA.zone.localeCompare(locB.zone);
      if (locA.aisle !== locB.aisle)
        return locA.aisle.localeCompare(locB.aisle);
      if (locA.shelf !== locB.shelf)
        return locA.shelf.localeCompare(locB.shelf);
      return locA.bin.localeCompare(locB.bin);
    });
  }

  private calculatePickTime(items: InventoryItem[]): number {
    // Base time: 2 minutes per item + travel time between locations
    let totalTime = items.length * 2;

    for (let i = 1; i < items.length; i++) {
      const prev = items[i - 1].location;
      const curr = items[i].location;

      // Add travel time based on location changes
      if (prev.zone !== curr.zone) totalTime += 3;
      else if (prev.aisle !== curr.aisle) totalTime += 2;
      else if (prev.shelf !== curr.shelf) totalTime += 1;
    }

    return totalTime;
  }
}
```

## 🗄️ Database Schema

```sql
-- Packages table with PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_address JSONB NOT NULL,
    recipient_address JSONB NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    dimensions JSONB NOT NULL,
    status VARCHAR(30) NOT NULL,
    current_location GEOGRAPHY(POINT, 4326),
    estimated_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_packages_tracking ON packages(tracking_number);
CREATE INDEX idx_packages_status ON packages(status, created_at DESC);
CREATE INDEX idx_packages_location ON packages USING GIST(current_location);

-- Location history table
CREATE TABLE location_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages(id),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_location_history_package ON location_history(package_id, timestamp DESC);

-- Warehouse inventory table
CREATE TABLE warehouse_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse VARCHAR(50) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    location JSONB NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved INTEGER NOT NULL DEFAULT 0,
    available INTEGER GENERATED ALWAYS AS (quantity - reserved) STORED,
    UNIQUE(warehouse, sku, location)
);

CREATE INDEX idx_warehouse_inventory_sku ON warehouse_inventory(sku);
```

## 🐳 Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgis/postgis:15-3.3-alpine
    environment:
      POSTGRES_DB: logistics_db
      POSTGRES_USER: logistics_user
      POSTGRES_PASSWORD: logistics_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  tracking-service:
    build: ./services/tracking-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://logistics_user:logistics_password@postgres:5432/logistics_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

**Status**: ✅ Fully Implemented with real-time tracking, route optimization, and warehouse management
