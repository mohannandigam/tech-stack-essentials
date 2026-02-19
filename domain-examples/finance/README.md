# Finance - Trading Platform

## Overview

This example demonstrates a high-frequency trading platform with real-time market data processing, order management, and portfolio tracking. It showcases event sourcing, CQRS, and financial transaction patterns.

## 🎯 Domain Requirements

### Business Goals

- Execute trades with minimal latency (< 100ms)
- Maintain accurate portfolio positions
- Provide real-time market data feeds
- Ensure audit trail for all transactions
- Support multiple asset classes (stocks, options, futures)

### Technical Challenges

- **High throughput**: Process 10,000+ orders per second
- **Low latency**: Sub-100ms order execution
- **Consistency**: ACID transactions for order execution
- **Audit requirements**: Complete historical record
- **Regulatory compliance**: MiFID II, SEC regulations
- **Data integrity**: Financial calculations must be exact (Decimal, not Float)

## 🏗️ Architecture

### Pattern: Event Sourcing + CQRS + Microservices

```
┌─────────────────────────────────────────────────────────────┐
│                    Trading Clients                           │
│            (Web, Mobile, API, FIX Protocol)                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway + Rate Limiting                │
│                   (NGINX + Kong Gateway)                     │
└───────┬────────────────┬────────────────┬───────────────────┘
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│   Order      │  │  Portfolio   │  │   Market Data    │
│  Management  │  │   Service    │  │     Service      │
│   Service    │  │              │  │                  │
└──────┬───────┘  └──────┬───────┘  └────────┬─────────┘
       │                 │                   │
       │ Write Commands  │                   │ Subscribe
       ▼                 │                   ▼
┌──────────────────────────────────────────────────────────────┐
│                    Event Store (PostgreSQL)                   │
│         - OrderPlaced, OrderExecuted, OrderCancelled          │
│         - TradeSettled, PositionUpdated                       │
└───────────────────────────┬──────────────────────────────────┘
                            │ Event Stream
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                  Event Processor (Kafka)                      │
└───┬────────────┬────────────┬────────────┬───────────────────┘
    │            │            │            │
    ▼            ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌──────────┐ ┌────────────────┐
│Position │ │ Risk    │ │Reporting │ │  Notification  │
│Tracker  │ │ Engine  │ │ Service  │ │    Service     │
└────┬────┘ └────┬────┘ └────┬─────┘ └────────────────┘
     │           │           │
     ▼           ▼           ▼
┌─────────────────────────────────┐
│     Read Models (PostgreSQL)     │
│  - Current Positions             │
│  - Account Balances              │
│  - Trade History                 │
│  - Risk Metrics                  │
└──────────────────────────────────┘
```

## 💻 Code Examples

### Domain Models

```typescript
// models/order.ts
import { Decimal } from "decimal.js";

export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP = "STOP",
  STOP_LIMIT = "STOP_LIMIT",
}

export enum OrderStatus {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  PARTIALLY_FILLED = "PARTIALLY_FILLED",
  FILLED = "FILLED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export interface Order {
  orderId: string;
  accountId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: Decimal;
  price?: Decimal; // Optional for MARKET orders
  stopPrice?: Decimal; // For STOP orders
  status: OrderStatus;
  filledQuantity: Decimal;
  remainingQuantity: Decimal;
  averageFillPrice?: Decimal;
  submittedAt: Date;
  updatedAt: Date;
}

export interface Trade {
  tradeId: string;
  orderId: string;
  symbol: string;
  side: OrderSide;
  quantity: Decimal;
  price: Decimal;
  commission: Decimal;
  executedAt: Date;
}

export interface Position {
  accountId: string;
  symbol: string;
  quantity: Decimal;
  averagePrice: Decimal;
  marketValue: Decimal;
  unrealizedPnl: Decimal;
  realizedPnl: Decimal;
}
```

### Event Sourcing

```typescript
// events/order-events.ts
export interface DomainEvent {
  eventId: string;
  aggregateId: string; // orderId
  eventType: string;
  timestamp: Date;
  version: number;
  data: any;
}

export class OrderPlacedEvent implements DomainEvent {
  eventType = "OrderPlaced";

  constructor(
    public eventId: string,
    public aggregateId: string,
    public timestamp: Date,
    public version: number,
    public data: {
      accountId: string;
      symbol: string;
      side: OrderSide;
      type: OrderType;
      quantity: string; // Decimal as string
      price?: string;
    },
  ) {}
}

export class OrderExecutedEvent implements DomainEvent {
  eventType = "OrderExecuted";

  constructor(
    public eventId: string,
    public aggregateId: string,
    public timestamp: Date,
    public version: number,
    public data: {
      tradeId: string;
      fillQuantity: string;
      fillPrice: string;
      commission: string;
    },
  ) {}
}
```

### Order Service (Write Model)

```typescript
// services/order-service.ts
import { v4 as uuidv4 } from "uuid";
import { Decimal } from "decimal.js";
import { EventStore } from "../infrastructure/event-store";
import { Order, OrderSide, OrderType, OrderStatus } from "../models/order";

export class OrderService {
  constructor(private eventStore: EventStore) {}

  async placeOrder(
    accountId: string,
    symbol: string,
    side: OrderSide,
    type: OrderType,
    quantity: Decimal,
    price?: Decimal,
  ): Promise<string> {
    // Validate order
    await this.validateOrder(accountId, symbol, side, quantity, price);

    // Create order ID
    const orderId = uuidv4();

    // Create OrderPlaced event
    const event = new OrderPlacedEvent(
      uuidv4(),
      orderId,
      new Date(),
      1, // version
      {
        accountId,
        symbol,
        side,
        type,
        quantity: quantity.toString(),
        price: price?.toString(),
      },
    );

    // Store event
    await this.eventStore.append(orderId, [event]);

    // Publish for processing
    await this.eventStore.publish(event);

    return orderId;
  }

  async cancelOrder(orderId: string, accountId: string): Promise<void> {
    // Load order events
    const events = await this.eventStore.getEvents(orderId);

    // Rebuild order state
    const order = this.replayEvents(events);

    // Validate cancellation
    if (order.accountId !== accountId) {
      throw new Error("Unauthorized");
    }

    if (
      ![
        OrderStatus.PENDING,
        OrderStatus.SUBMITTED,
        OrderStatus.PARTIALLY_FILLED,
      ].includes(order.status)
    ) {
      throw new Error("Order cannot be cancelled");
    }

    // Create OrderCancelled event
    const event = new OrderCancelledEvent(
      uuidv4(),
      orderId,
      new Date(),
      events.length + 1,
      {},
    );

    await this.eventStore.append(orderId, [event]);
    await this.eventStore.publish(event);
  }

  private async validateOrder(
    accountId: string,
    symbol: string,
    side: OrderSide,
    quantity: Decimal,
    price?: Decimal,
  ): Promise<void> {
    // Check account exists and has sufficient funds/securities
    // Check symbol is valid
    // Check quantity is within limits
    // Check price is within market bounds
  }

  private replayEvents(events: DomainEvent[]): Order {
    // Rebuild order state from events
    let order: Order = null;

    for (const event of events) {
      switch (event.eventType) {
        case "OrderPlaced":
          order = this.applyOrderPlaced(event as OrderPlacedEvent);
          break;
        case "OrderExecuted":
          order = this.applyOrderExecuted(order, event as OrderExecutedEvent);
          break;
        case "OrderCancelled":
          order = this.applyOrderCancelled(order);
          break;
      }
    }

    return order;
  }

  private applyOrderPlaced(event: OrderPlacedEvent): Order {
    return {
      orderId: event.aggregateId,
      accountId: event.data.accountId,
      symbol: event.data.symbol,
      side: event.data.side,
      type: event.data.type,
      quantity: new Decimal(event.data.quantity),
      price: event.data.price ? new Decimal(event.data.price) : undefined,
      status: OrderStatus.PENDING,
      filledQuantity: new Decimal(0),
      remainingQuantity: new Decimal(event.data.quantity),
      submittedAt: event.timestamp,
      updatedAt: event.timestamp,
    };
  }

  private applyOrderExecuted(order: Order, event: OrderExecutedEvent): Order {
    const fillQty = new Decimal(event.data.fillQuantity);
    const newFilledQty = order.filledQuantity.plus(fillQty);
    const newRemainingQty = order.quantity.minus(newFilledQty);

    // Calculate average fill price
    const prevTotal = order.filledQuantity.times(order.averageFillPrice || 0);
    const newTotal = prevTotal.plus(fillQty.times(event.data.fillPrice));
    const avgPrice = newTotal.dividedBy(newFilledQty);

    return {
      ...order,
      status: newRemainingQty.isZero()
        ? OrderStatus.FILLED
        : OrderStatus.PARTIALLY_FILLED,
      filledQuantity: newFilledQty,
      remainingQuantity: newRemainingQty,
      averageFillPrice: avgPrice,
      updatedAt: event.timestamp,
    };
  }

  private applyOrderCancelled(order: Order): Order {
    return {
      ...order,
      status: OrderStatus.CANCELLED,
      updatedAt: new Date(),
    };
  }
}
```

### Position Tracker (Read Model)

```typescript
// projections/position-tracker.ts
import { Decimal } from "decimal.js";
import { KafkaConsumer } from "../infrastructure/kafka-consumer";
import { Position } from "../models/order";

export class PositionTracker {
  private positions: Map<string, Position> = new Map();

  constructor(private kafkaConsumer: KafkaConsumer) {}

  async start(): Promise<void> {
    // Subscribe to trade events
    await this.kafkaConsumer.subscribe("trade-events", async (event) => {
      await this.handleTradeEvent(event);
    });
  }

  private async handleTradeEvent(event: any): Promise<void> {
    const { accountId, symbol, side, quantity, price, commission } = event.data;

    const key = `${accountId}:${symbol}`;
    let position =
      this.positions.get(key) || this.createEmptyPosition(accountId, symbol);

    const qty = new Decimal(quantity);
    const fillPrice = new Decimal(price);
    const comm = new Decimal(commission);

    if (side === "BUY") {
      // Buying increases position
      const currentValue = position.quantity.times(position.averagePrice);
      const newValue = currentValue.plus(qty.times(fillPrice));
      const newQuantity = position.quantity.plus(qty);

      position.quantity = newQuantity;
      position.averagePrice = newValue.dividedBy(newQuantity);
    } else {
      // Selling decreases position and realizes P&L
      const costBasis = qty.times(position.averagePrice);
      const saleProceeds = qty.times(fillPrice);
      const realizedPnl = saleProceeds.minus(costBasis).minus(comm);

      position.quantity = position.quantity.minus(qty);
      position.realizedPnl = position.realizedPnl.plus(realizedPnl);
    }

    // Update market value (would come from market data feed)
    await this.updateMarketValue(position);

    // Save to database
    await this.savePosition(position);

    this.positions.set(key, position);
  }

  private createEmptyPosition(accountId: string, symbol: string): Position {
    return {
      accountId,
      symbol,
      quantity: new Decimal(0),
      averagePrice: new Decimal(0),
      marketValue: new Decimal(0),
      unrealizedPnl: new Decimal(0),
      realizedPnl: new Decimal(0),
    };
  }

  private async updateMarketValue(position: Position): Promise<void> {
    // Get current market price
    const marketPrice = await this.getMarketPrice(position.symbol);

    position.marketValue = position.quantity.times(marketPrice);
    position.unrealizedPnl = position.marketValue.minus(
      position.quantity.times(position.averagePrice),
    );
  }

  private async getMarketPrice(symbol: string): Promise<Decimal> {
    // Fetch from market data service
    return new Decimal(100); // Placeholder
  }

  private async savePosition(position: Position): Promise<void> {
    // Save to PostgreSQL read model
  }
}
```

### Risk Engine

```typescript
// services/risk-engine.ts
import { Decimal } from "decimal.js";

export interface RiskLimits {
  maxOrderValue: Decimal;
  maxDailyLoss: Decimal;
  maxPositionSize: Decimal;
  maxLeverage: Decimal;
}

export class RiskEngine {
  async validateOrder(
    accountId: string,
    symbol: string,
    side: OrderSide,
    quantity: Decimal,
    estimatedPrice: Decimal,
  ): Promise<{ approved: boolean; reason?: string }> {
    // Get risk limits for account
    const limits = await this.getRiskLimits(accountId);

    // Check order value
    const orderValue = quantity.times(estimatedPrice);
    if (orderValue.greaterThan(limits.maxOrderValue)) {
      return {
        approved: false,
        reason: `Order value $${orderValue} exceeds limit $${limits.maxOrderValue}`,
      };
    }

    // Check position size
    const currentPosition = await this.getPosition(accountId, symbol);
    const newPosition =
      side === "BUY"
        ? currentPosition.plus(quantity)
        : currentPosition.minus(quantity);

    if (newPosition.abs().greaterThan(limits.maxPositionSize)) {
      return {
        approved: false,
        reason: `Position size ${newPosition} exceeds limit ${limits.maxPositionSize}`,
      };
    }

    // Check daily loss
    const dailyPnl = await this.getDailyPnL(accountId);
    if (dailyPnl.lessThan(limits.maxDailyLoss.negated())) {
      return {
        approved: false,
        reason: `Daily loss limit reached: $${dailyPnl}`,
      };
    }

    // Check leverage
    const accountValue = await this.getAccountValue(accountId);
    const totalExposure = await this.getTotalExposure(accountId);
    const newExposure = totalExposure.plus(orderValue);
    const leverage = newExposure.dividedBy(accountValue);

    if (leverage.greaterThan(limits.maxLeverage)) {
      return {
        approved: false,
        reason: `Leverage ${leverage}x exceeds limit ${limits.maxLeverage}x`,
      };
    }

    return { approved: true };
  }

  private async getRiskLimits(accountId: string): Promise<RiskLimits> {
    // Fetch from database
    return {
      maxOrderValue: new Decimal(100000),
      maxDailyLoss: new Decimal(10000),
      maxPositionSize: new Decimal(1000),
      maxLeverage: new Decimal(4),
    };
  }
}
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- 8GB RAM minimum
- PostgreSQL, Kafka, Redis

### Start the System

```bash
cd domain-examples/finance

# Start infrastructure
docker-compose up -d

# Run database migrations
npm run migrate

# Start services
npm run dev
```

### Place a Test Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "symbol": "AAPL",
    "side": "BUY",
    "type": "MARKET",
    "quantity": "100"
  }'
```

## 📊 Key Features

1. **Event Sourcing**: Complete audit trail of all orders
2. **CQRS**: Separate write (commands) and read (queries) models
3. **Exact Decimal Math**: No floating-point errors in financial calculations
4. **Risk Management**: Pre-trade risk checks
5. **Real-time Updates**: WebSocket feeds for market data and order updates
6. **High Availability**: Stateless services, horizontal scaling

## 🧪 Testing

### Unit Tests

```typescript
describe("OrderService", () => {
  it("should place a valid market order", async () => {
    const orderId = await orderService.placeOrder(
      "ACC-001",
      "AAPL",
      OrderSide.BUY,
      OrderType.MARKET,
      new Decimal(100),
    );

    expect(orderId).toBeDefined();
  });

  it("should reject order exceeding risk limits", async () => {
    await expect(
      orderService.placeOrder(
        "ACC-001",
        "AAPL",
        OrderSide.BUY,
        OrderType.MARKET,
        new Decimal(1000000), // Exceeds limit
      ),
    ).rejects.toThrow("Order value exceeds limit");
  });
});
```

## 🔒 Security Considerations

- **Authentication**: OAuth 2.0 + JWT
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: TLS for all communications
- **Audit Logging**: All API calls and order actions
- **Rate Limiting**: Prevent market manipulation
- **Data Integrity**: Checksums and versioning

## 📈 Performance

- **Order Latency**: < 50ms p99
- **Throughput**: 10,000 orders/second
- **Market Data**: 100,000 updates/second
- **Event Sourcing**: Replay 1M events in < 10 seconds

## 🔗 Related Patterns

- [Event Sourcing](../../architectures/event-driven/README.md)
- [CQRS](../../architectures/microservices/README.md)
- [Microservices](../../architectures/microservices/README.md)

---

**Note**: This is a learning example. Real trading systems require extensive testing, regulatory compliance, and professional risk management.
