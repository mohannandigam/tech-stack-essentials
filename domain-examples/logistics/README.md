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

---

**Status**: Template ready - Full implementation coming soon
