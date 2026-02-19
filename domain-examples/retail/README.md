# Retail - Omnichannel Inventory Management

## Overview

Modern retail inventory system demonstrating real-time stock management across multiple channels (online, in-store, mobile) with point-of-sale integration.

## 🎯 Key Use Cases

- **Inventory Tracking**: Real-time stock levels across all locations
- **Point of Sale**: In-store checkout and payment processing
- **Order Management**: Process online and in-store orders
- **Stock Allocation**: Reserve items for online orders
- **Replenishment**: Automatic reorder when stock is low

## 🏗️ Architecture Pattern

**Primary**: Event-Driven + CQRS  
**Secondary**: Microservices

## 💻 Quick Example

```typescript
// Real-time inventory update
class InventoryService {
  async updateStock(sku: string, location: string, quantity: number) {
    // Optimistic locking to prevent overselling
    const item = await this.db.query(
      "SELECT * FROM inventory WHERE sku = $1 AND location = $2 FOR UPDATE",
      [sku, location],
    );

    if (item.quantity + quantity < 0) {
      throw new Error("Insufficient stock");
    }

    // Update stock
    await this.db.query(
      "UPDATE inventory SET quantity = quantity + $1, updated_at = NOW() WHERE sku = $2 AND location = $3",
      [quantity, sku, location],
    );

    // Publish event
    await this.eventBus.publish({
      type: "inventory.updated",
      data: { sku, location, quantity: item.quantity + quantity },
    });

    // Check reorder threshold
    if (item.quantity + quantity < item.reorder_point) {
      await this.createReorderRequest(sku, location);
    }
  }
}
```

## 🚀 Getting Started

```bash
cd domain-examples/retail
docker-compose up -d

# Add product
curl -X POST http://localhost:3000/api/products \
  -d '{"sku": "SHIRT-001", "name": "Blue Shirt", "price": "29.99"}'

# Update inventory
curl -X PATCH http://localhost:3000/api/inventory/SHIRT-001 \
  -d '{"location": "STORE-001", "quantity": 50}'
```

## 📊 Performance Targets

- Stock check: < 50ms
- Order processing: < 200ms
- Inventory sync: < 1 second
- POS transaction: < 3 seconds

## 🔗 Related Examples

- [E-Commerce](../../examples/microservices-ecommerce/README.md)
- [Logistics Domain](../logistics/README.md)

## 📦 Implementation Examples

### Example 1: Inventory Management Service (TypeScript/Node.js)

```typescript
// src/models/inventory.model.ts
import { z } from "zod";

export const InventoryItemSchema = z.object({
  sku: z.string().min(1).max(50),
  productName: z.string(),
  location: z.string(), // Store ID or warehouse code
  quantity: z.number().int().min(0),
  reserved: z.number().int().min(0).default(0),
  available: z.number().int().min(0), // quantity - reserved
  reorderPoint: z.number().int(),
  reorderQuantity: z.number().int(),
  lastRestocked: z.date().optional(),
  lastUpdated: z.date(),
  version: z.number().int(), // For optimistic locking
});

export const StockTransactionSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  location: z.string(),
  type: z.enum([
    "RESTOCK",
    "SALE",
    "RETURN",
    "ADJUSTMENT",
    "TRANSFER",
    "RESERVATION",
    "RELEASE",
  ]),
  quantity: z.number().int(),
  reference: z.string().optional(), // Order ID, PO number, etc.
  timestamp: z.date(),
  userId: z.string(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;
export type StockTransaction = z.infer<typeof StockTransactionSchema>;
```

```typescript
// src/services/inventory.service.ts
import { Pool } from "pg";
import { Kafka, Producer } from "kafkajs";
import { InventoryItem, StockTransaction } from "../models/inventory.model";

export class InventoryService {
  constructor(
    private readonly db: Pool,
    private readonly eventProducer: Producer,
  ) {}

  // Update stock with optimistic locking to prevent overselling
  async updateStock(
    sku: string,
    location: string,
    quantity: number,
    type: StockTransaction["type"],
    reference?: string,
    userId?: string,
  ): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      // Get current inventory with row lock
      const result = await client.query<InventoryItem>(
        `SELECT * FROM inventory
         WHERE sku = $1 AND location = $2
         FOR UPDATE`,
        [sku, location],
      );

      if (result.rows.length === 0) {
        throw new Error(`Inventory item not found: ${sku} at ${location}`);
      }

      const item = result.rows[0];
      const newQuantity = item.quantity + quantity;

      // Validate sufficient stock for sales/reservations
      if (["SALE", "RESERVATION"].includes(type) && newQuantity < 0) {
        throw new Error(
          `Insufficient stock for ${sku} at ${location}. Available: ${item.quantity}, Requested: ${Math.abs(quantity)}`,
        );
      }

      // Update inventory with optimistic locking
      const updateResult = await client.query(
        `UPDATE inventory
         SET quantity = $1,
             available = quantity - reserved,
             last_updated = NOW(),
             version = version + 1
         WHERE sku = $2 AND location = $3 AND version = $4
         RETURNING *`,
        [newQuantity, sku, location, item.version],
      );

      if (updateResult.rows.length === 0) {
        throw new Error("Concurrent update detected. Please retry.");
      }

      const updatedItem = updateResult.rows[0];

      // Record transaction
      await client.query(
        `INSERT INTO stock_transactions
         (sku, location, type, quantity, reference, user_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [sku, location, type, quantity, reference, userId],
      );

      await client.query("COMMIT");

      // Publish event
      await this.publishInventoryEvent({
        type: "inventory.updated",
        sku,
        location,
        quantity: updatedItem.quantity,
        available: updatedItem.available,
        transactionType: type,
      });

      // Check reorder point
      if (updatedItem.quantity <= item.reorderPoint) {
        await this.createReorderRequest(sku, location, item.reorderQuantity);
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Reserve stock for online orders
  async reserveStock(
    sku: string,
    location: string,
    quantity: number,
    orderId: string,
  ): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const result = await client.query(
        `UPDATE inventory
         SET reserved = reserved + $1,
             available = quantity - (reserved + $1),
             version = version + 1
         WHERE sku = $2 AND location = $3
           AND (quantity - reserved) >= $1
         RETURNING *`,
        [quantity, sku, location],
      );

      if (result.rows.length === 0) {
        throw new Error(
          `Unable to reserve ${quantity} units of ${sku} at ${location}`,
        );
      }

      // Record reservation
      await client.query(
        `INSERT INTO stock_reservations (sku, location, quantity, order_id, expires_at)
         VALUES ($1, $2, $3, $4, NOW() + INTERVAL '15 minutes')`,
        [sku, location, quantity, orderId],
      );

      await client.query("COMMIT");

      await this.publishInventoryEvent({
        type: "inventory.reserved",
        sku,
        location,
        quantity,
        orderId,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Release expired reservations (run as scheduled job)
  async releaseExpiredReservations(): Promise<void> {
    const result = await this.db.query(
      `SELECT sku, location, quantity, order_id
       FROM stock_reservations
       WHERE expires_at < NOW() AND released_at IS NULL`,
    );

    for (const reservation of result.rows) {
      await this.releaseReservation(
        reservation.sku,
        reservation.location,
        reservation.quantity,
        reservation.order_id,
      );
    }
  }

  async releaseReservation(
    sku: string,
    location: string,
    quantity: number,
    orderId: string,
  ): Promise<void> {
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `UPDATE inventory
         SET reserved = reserved - $1,
             available = quantity - (reserved - $1)
         WHERE sku = $2 AND location = $3`,
        [quantity, sku, location],
      );

      await client.query(
        `UPDATE stock_reservations
         SET released_at = NOW()
         WHERE sku = $1 AND location = $2 AND order_id = $3`,
        [sku, location, orderId],
      );

      await client.query("COMMIT");

      await this.publishInventoryEvent({
        type: "inventory.reservation_released",
        sku,
        location,
        quantity,
        orderId,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Get real-time inventory across all locations
  async getInventory(sku: string): Promise<InventoryItem[]> {
    const result = await this.db.query<InventoryItem>(
      `SELECT * FROM inventory WHERE sku = $1 ORDER BY location`,
      [sku],
    );
    return result.rows;
  }

  // Automatic reorder
  async createReorderRequest(
    sku: string,
    location: string,
    quantity: number,
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO reorder_requests (sku, location, quantity, status)
       VALUES ($1, $2, $3, 'PENDING')
       ON CONFLICT (sku, location) WHERE status = 'PENDING'
       DO UPDATE SET quantity = reorder_requests.quantity + $3, updated_at = NOW()`,
      [sku, location, quantity],
    );

    await this.publishInventoryEvent({
      type: "inventory.reorder_requested",
      sku,
      location,
      quantity,
    });
  }

  private async publishInventoryEvent(event: any): Promise<void> {
    await this.eventProducer.send({
      topic: "inventory-events",
      messages: [
        {
          key: `${event.sku}-${event.location}`,
          value: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
  }
}
```

### Example 2: Point of Sale Service (Java/Spring Boot)

```java
// models/POSTransaction.java
package com.retail.pos.models;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class POSTransaction {
    private UUID id;
    private String storeId;
    private String registerId;
    private String cashierId;
    private List<LineItem> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private PaymentMethod paymentMethod;
    private TransactionStatus status;
    private LocalDateTime timestamp;
    private String receiptNumber;
}

@Data
class LineItem {
    private String sku;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
    private BigDecimal discount;
}

enum PaymentMethod {
    CASH, CREDIT_CARD, DEBIT_CARD, MOBILE_PAYMENT, GIFT_CARD
}

enum TransactionStatus {
    PENDING, COMPLETED, CANCELLED, REFUNDED
}
```

```java
// services/POSService.java
package com.retail.pos.services;

import com.retail.pos.models.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.kafka.core.KafkaTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class POSService {

    private final TransactionRepository transactionRepo;
    private final InventoryService inventoryService;
    private final PaymentProcessor paymentProcessor;
    private final KafkaTemplate<String, String> kafkaTemplate;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.08"); // 8% sales tax

    @Transactional
    public POSTransaction processTransaction(POSTransactionRequest request) {
        // 1. Validate inventory availability
        for (LineItem item : request.getItems()) {
            if (!inventoryService.checkAvailability(item.getSku(), request.getStoreId(), item.getQuantity())) {
                throw new InsufficientStockException(
                    String.format("Insufficient stock for SKU: %s", item.getSku())
                );
            }
        }

        // 2. Calculate totals
        BigDecimal subtotal = calculateSubtotal(request.getItems());
        BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(tax);

        // 3. Process payment
        PaymentResult paymentResult = paymentProcessor.processPayment(
            total,
            request.getPaymentMethod(),
            request.getPaymentDetails()
        );

        if (!paymentResult.isSuccessful()) {
            throw new PaymentFailedException("Payment processing failed: " + paymentResult.getMessage());
        }

        // 4. Update inventory
        for (LineItem item : request.getItems()) {
            inventoryService.decrementStock(
                item.getSku(),
                request.getStoreId(),
                item.getQuantity(),
                "POS_SALE"
            );
        }

        // 5. Create transaction record
        POSTransaction transaction = new POSTransaction();
        transaction.setId(UUID.randomUUID());
        transaction.setStoreId(request.getStoreId());
        transaction.setRegisterId(request.getRegisterId());
        transaction.setCashierId(request.getCashierId());
        transaction.setItems(request.getItems());
        transaction.setSubtotal(subtotal);
        transaction.setTax(tax);
        transaction.setTotal(total);
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setReceiptNumber(generateReceiptNumber());

        transactionRepo.save(transaction);

        // 6. Publish event
        publishTransactionEvent(transaction);

        return transaction;
    }

    @Transactional
    public void processRefund(UUID transactionId, List<LineItem> itemsToRefund) {
        POSTransaction original = transactionRepo.findById(transactionId)
            .orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

        // Validate refund
        if (original.getStatus() != TransactionStatus.COMPLETED) {
            throw new InvalidRefundException("Transaction cannot be refunded");
        }

        // Calculate refund amount
        BigDecimal refundAmount = itemsToRefund.stream()
            .map(LineItem::getLineTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal refundTax = refundAmount.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalRefund = refundAmount.add(refundTax);

        // Process refund payment
        paymentProcessor.processRefund(
            totalRefund,
            original.getPaymentMethod(),
            original.getId()
        );

        // Return items to inventory
        for (LineItem item : itemsToRefund) {
            inventoryService.incrementStock(
                item.getSku(),
                original.getStoreId(),
                item.getQuantity(),
                "REFUND"
            );
        }

        // Create refund transaction
        POSTransaction refundTransaction = new POSTransaction();
        refundTransaction.setId(UUID.randomUUID());
        refundTransaction.setStoreId(original.getStoreId());
        refundTransaction.setItems(itemsToRefund);
        refundTransaction.setSubtotal(refundAmount.negate());
        refundTransaction.setTax(refundTax.negate());
        refundTransaction.setTotal(totalRefund.negate());
        refundTransaction.setStatus(TransactionStatus.REFUNDED);
        refundTransaction.setTimestamp(LocalDateTime.now());

        transactionRepo.save(refundTransaction);

        // Update original transaction status
        original.setStatus(TransactionStatus.REFUNDED);
        transactionRepo.save(original);

        publishTransactionEvent(refundTransaction);
    }

    private BigDecimal calculateSubtotal(List<LineItem> items) {
        return items.stream()
            .map(item -> item.getUnitPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()))
                .subtract(item.getDiscount()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String generateReceiptNumber() {
        return String.format("RCP-%s-%d",
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")),
            System.currentTimeMillis() % 1000000);
    }

    private void publishTransactionEvent(POSTransaction transaction) {
        String event = String.format(
            "{\"type\":\"pos.transaction\",\"id\":\"%s\",\"total\":%.2f,\"timestamp\":\"%s\"}",
            transaction.getId(),
            transaction.getTotal(),
            transaction.getTimestamp()
        );

        kafkaTemplate.send("pos-transactions", transaction.getStoreId(), event);
    }
}
```

### Example 3: Product Catalog Service (Python/FastAPI)

```python
# models/product.py
from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from enum import Enum

class ProductCategory(str, Enum):
    CLOTHING = "clothing"
    ELECTRONICS = "electronics"
    HOME = "home"
    FOOD = "food"
    BOOKS = "books"
    TOYS = "toys"
    SPORTS = "sports"

class Product(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: ProductCategory
    brand: Optional[str] = None
    price: Decimal = Field(..., gt=0, decimal_places=2)
    cost: Decimal = Field(..., gt=0, decimal_places=2)
    msrp: Optional[Decimal] = None
    barcode: Optional[str] = None
    weight: Optional[Decimal] = None
    dimensions: Optional[dict] = None
    attributes: dict = Field(default_factory=dict)
    images: List[str] = Field(default_factory=list)
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PriceHistory(BaseModel):
    sku: str
    price: Decimal
    effective_date: datetime
    reason: Optional[str] = None
```

```python
# services/product_service.py
from typing import List, Optional
from decimal import Decimal
import asyncpg
from redis import Redis
import json

from models.product import Product, ProductCategory, PriceHistory

class ProductService:
    def __init__(self, db_pool: asyncpg.Pool, redis_client: Redis):
        self.db = db_pool
        self.redis = redis_client
        self.cache_ttl = 300  # 5 minutes

    async def create_product(self, product: Product) -> str:
        """Create new product with price history"""
        async with self.db.transaction():
            # Insert product
            await self.db.execute(
                """
                INSERT INTO products (
                    sku, name, description, category, brand, price, cost, msrp,
                    barcode, weight, dimensions, attributes, images, active
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                """,
                product.sku, product.name, product.description, product.category.value,
                product.brand, product.price, product.cost, product.msrp, product.barcode,
                product.weight, json.dumps(product.dimensions), json.dumps(product.attributes),
                json.dumps(product.images), product.active
            )

            # Record initial price
            await self.db.execute(
                """
                INSERT INTO price_history (sku, price, effective_date, reason)
                VALUES ($1, $2, NOW(), $3)
                """,
                product.sku, product.price, "Initial price"
            )

        # Invalidate cache
        self.redis.delete(f"product:{product.sku}")

        return product.sku

    async def get_product(self, sku: str) -> Optional[Product]:
        """Get product with caching"""
        # Check cache
        cache_key = f"product:{sku}"
        cached = self.redis.get(cache_key)
        if cached:
            return Product.parse_raw(cached)

        # Query database
        row = await self.db.fetchrow(
            "SELECT * FROM products WHERE sku = $1 AND active = true",
            sku
        )

        if not row:
            return None

        product = Product(
            sku=row['sku'],
            name=row['name'],
            description=row['description'],
            category=ProductCategory(row['category']),
            brand=row['brand'],
            price=row['price'],
            cost=row['cost'],
            msrp=row['msrp'],
            barcode=row['barcode'],
            weight=row['weight'],
            dimensions=row['dimensions'],
            attributes=row['attributes'],
            images=row['images'],
            active=row['active'],
            created_at=row['created_at'],
            updated_at=row['updated_at']
        )

        # Cache result
        self.redis.setex(cache_key, self.cache_ttl, product.json())

        return product

    async def update_price(
        self,
        sku: str,
        new_price: Decimal,
        reason: Optional[str] = None
    ) -> None:
        """Update product price with history tracking"""
        async with self.db.transaction():
            # Update price
            result = await self.db.execute(
                """
                UPDATE products
                SET price = $1, updated_at = NOW()
                WHERE sku = $2 AND active = true
                """,
                new_price, sku
            )

            if result == "UPDATE 0":
                raise ValueError(f"Product not found: {sku}")

            # Record price history
            await self.db.execute(
                """
                INSERT INTO price_history (sku, price, effective_date, reason)
                VALUES ($1, $2, NOW(), $3)
                """,
                sku, new_price, reason or "Price update"
            )

        # Invalidate cache
        self.redis.delete(f"product:{sku}")

        # Publish price change event
        await self.publish_event({
            'type': 'product.price_changed',
            'sku': sku,
            'new_price': str(new_price),
            'timestamp': datetime.utcnow().isoformat()
        })

    async def search_products(
        self,
        query: Optional[str] = None,
        category: Optional[ProductCategory] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Product]:
        """Search products with filters"""
        conditions = ["active = true"]
        params = []
        param_count = 1

        if query:
            conditions.append(f"(name ILIKE ${param_count} OR description ILIKE ${param_count})")
            params.append(f"%{query}%")
            param_count += 1

        if category:
            conditions.append(f"category = ${param_count}")
            params.append(category.value)
            param_count += 1

        if min_price is not None:
            conditions.append(f"price >= ${param_count}")
            params.append(min_price)
            param_count += 1

        if max_price is not None:
            conditions.append(f"price <= ${param_count}")
            params.append(max_price)
            param_count += 1

        where_clause = " AND ".join(conditions)
        params.extend([limit, offset])

        rows = await self.db.fetch(
            f"""
            SELECT * FROM products
            WHERE {where_clause}
            ORDER BY name
            LIMIT ${param_count} OFFSET ${param_count + 1}
            """,
            *params
        )

        return [Product(**dict(row)) for row in rows]

    async def get_price_history(self, sku: str, days: int = 30) -> List[PriceHistory]:
        """Get price history for a product"""
        rows = await self.db.fetch(
            """
            SELECT sku, price, effective_date, reason
            FROM price_history
            WHERE sku = $1 AND effective_date >= NOW() - INTERVAL '%s days'
            ORDER BY effective_date DESC
            """,
            sku, days
        )

        return [PriceHistory(**dict(row)) for row in rows]
```

## 🗄️ Database Schema

```sql
-- Products table
CREATE TABLE products (
    sku VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    cost DECIMAL(10, 2) NOT NULL CHECK (cost > 0),
    msrp DECIMAL(10, 2),
    barcode VARCHAR(50) UNIQUE,
    weight DECIMAL(10, 3),
    dimensions JSONB,
    attributes JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category) WHERE active = true;
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_price ON products(price) WHERE active = true;

-- Inventory table
CREATE TABLE inventory (
    sku VARCHAR(50) NOT NULL REFERENCES products(sku),
    location VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    available INTEGER GENERATED ALWAYS AS (quantity - reserved) STORED,
    reorder_point INTEGER NOT NULL DEFAULT 10,
    reorder_quantity INTEGER NOT NULL DEFAULT 50,
    last_restocked TIMESTAMP,
    last_updated TIMESTAMP DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (sku, location),
    CHECK (reserved <= quantity)
);

CREATE INDEX idx_inventory_location ON inventory(location);
CREATE INDEX idx_inventory_low_stock ON inventory(sku, location)
    WHERE quantity <= reorder_point;

-- Stock transactions table
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('RESTOCK', 'SALE', 'RETURN', 'ADJUSTMENT', 'TRANSFER', 'RESERVATION', 'RELEASE')),
    quantity INTEGER NOT NULL,
    reference VARCHAR(100),
    user_id VARCHAR(50),
    timestamp TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (sku, location) REFERENCES inventory(sku, location)
);

CREATE INDEX idx_stock_transactions_sku ON stock_transactions(sku, timestamp DESC);
CREATE INDEX idx_stock_transactions_reference ON stock_transactions(reference);

-- Stock reservations table
CREATE TABLE stock_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    order_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    released_at TIMESTAMP,
    FOREIGN KEY (sku, location) REFERENCES inventory(sku, location)
);

CREATE INDEX idx_reservations_expiry ON stock_reservations(expires_at)
    WHERE released_at IS NULL;
CREATE INDEX idx_reservations_order ON stock_reservations(order_id);

-- Reorder requests table
CREATE TABLE reorder_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'ORDERED', 'RECEIVED', 'CANCELLED')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (sku, location, status) WHERE status = 'PENDING'
);

-- POS transactions table
CREATE TABLE pos_transactions (
    id UUID PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    register_id VARCHAR(50) NOT NULL,
    cashier_id VARCHAR(50) NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
    timestamp TIMESTAMP NOT NULL,
    receipt_number VARCHAR(50) UNIQUE NOT NULL
);

CREATE INDEX idx_pos_transactions_store ON pos_transactions(store_id, timestamp DESC);
CREATE INDEX idx_pos_transactions_receipt ON pos_transactions(receipt_number);

-- Price history table
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL REFERENCES products(sku),
    price DECIMAL(10, 2) NOT NULL,
    effective_date TIMESTAMP NOT NULL DEFAULT NOW(),
    reason TEXT
);

CREATE INDEX idx_price_history_sku ON price_history(sku, effective_date DESC);
```

## 🐳 Docker Compose Setup

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: retail_db
      POSTGRES_USER: retail_user
      POSTGRES_PASSWORD: retail_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  inventory-service:
    build: ./services/inventory-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://retail_user:retail_password@postgres:5432/retail_db
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
    depends_on:
      - postgres
      - redis
      - kafka

  product-service:
    build: ./services/product-service
    ports:
      - "3002:3000"
    environment:
      DATABASE_URL: postgresql://retail_user:retail_password@postgres:5432/retail_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

## 🧪 Testing Examples

### Unit Tests (TypeScript)

```typescript
describe("InventoryService", () => {
  describe("updateStock", () => {
    it("should prevent overselling with optimistic locking", async () => {
      // Simulate concurrent updates
      const promises = [
        service.updateStock("SKU-001", "STORE-1", -5, "SALE"),
        service.updateStock("SKU-001", "STORE-1", -5, "SALE"),
      ];

      const results = await Promise.allSettled(promises);

      // One should succeed, one should fail
      const succeeded = results.filter((r) => r.status === "fulfilled");
      const failed = results.filter((r) => r.status === "rejected");

      expect(succeeded).toHaveLength(1);
      expect(failed).toHaveLength(1);
      expect(failed[0].reason.message).toContain("Concurrent update detected");
    });

    it("should create reorder request when below threshold", async () => {
      await service.updateStock("SKU-002", "STORE-1", -45, "SALE");

      const reorderRequests = await db.query(
        "SELECT * FROM reorder_requests WHERE sku = $1 AND location = $2",
        ["SKU-002", "STORE-1"],
      );

      expect(reorderRequests.rows).toHaveLength(1);
      expect(reorderRequests.rows[0].status).toBe("PENDING");
    });
  });
});
```

---

**Status**: ✅ Fully Implemented with comprehensive examples in TypeScript, Java, and Python
