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
      'SELECT * FROM inventory WHERE sku = $1 AND location = $2 FOR UPDATE',
      [sku, location]
    );
    
    if (item.quantity + quantity < 0) {
      throw new Error('Insufficient stock');
    }
    
    // Update stock
    await this.db.query(
      'UPDATE inventory SET quantity = quantity + $1, updated_at = NOW() WHERE sku = $2 AND location = $3',
      [quantity, sku, location]
    );
    
    // Publish event
    await this.eventBus.publish({
      type: 'inventory.updated',
      data: { sku, location, quantity: item.quantity + quantity }
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

---

**Status**: Template ready - Full implementation coming soon
