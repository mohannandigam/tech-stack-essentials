# Stripe - API Design Excellence

## Overview
Stripe built the gold standard for developer-friendly APIs. Their design principles enable millions of developers to integrate payments with minimal friction.

## Design Principles

### 1. Consistency
Every endpoint follows same patterns:
- RESTful URLs
- Consistent error format
- Standard HTTP status codes

### 2. Idempotency
```python
# Safe to retry - won't double-charge
stripe.Charge.create(
    amount=1000,
    currency='usd',
    idempotency_key='unique-key-123'
)
```

### 3. Versioning
- URL versioning: `/v1/charges`
- Header versioning for minor changes
- Gradual migration, no breaking changes

### 4. Webhooks for Async
```javascript
// Event-driven notifications
{
  "type": "payment_intent.succeeded",
  "data": { ... },
  "created": 1638360000
}
```

### 5. Developer Experience
- Excellent documentation
- Interactive API explorer
- Clear error messages
- SDKs in 10+ languages

## Key Decisions
1. **Test Mode First**: Sandbox environment for testing
2. **Expandable Objects**: Reduce API calls
3. **Pagination via Cursors**: Consistent results
4. **Rate Limiting with Headers**: Clear feedback

## Results
- Millions of API calls/day
- 99.999% uptime
- Industry-leading NPS
- Billions in payment volume

## Lessons
- Developer experience is product
- Consistency reduces friction
- Idempotency prevents errors
- Good docs save support time
