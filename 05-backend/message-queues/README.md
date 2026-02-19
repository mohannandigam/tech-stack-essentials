# Message Queues

## What is a Message Queue?

A message queue is a **communication system** that lets different parts of your application talk to each other **asynchronously**. Instead of one service calling another directly and waiting for a response, the sender puts a message in a queue and continues working. A separate worker picks up the message later and processes it.

Think of a message queue like a restaurant:
- **Without a queue**: You tell the chef directly what you want, then stand there waiting while they cook (synchronous)
- **With a queue**: You give your order to the waiter, get a number, and sit down. The kitchen processes orders in the order received, and you're called when your food is ready (asynchronous)

The waiter's notepad is the queue—it decouples you (the customer) from the kitchen (the worker), allowing both to operate independently and efficiently.

## Why Do Message Queues Matter?

Message queues solve critical problems in modern applications:

- **Decoupling**: Services don't need to know about each other or be online at the same time
- **Scalability**: Add more workers to process messages faster without changing producers
- **Reliability**: Messages are persisted—even if a worker crashes, the message isn't lost
- **Load leveling**: Handle traffic spikes by queuing requests instead of overwhelming servers
- **Asynchronous processing**: Free up API endpoints to respond quickly while heavy work happens in background
- **Retry logic**: Automatically retry failed messages without manual intervention

Without message queues, your application would struggle with long-running tasks (email sending, video processing, report generation), temporary failures (third-party API down), and traffic bursts (Black Friday sales).

## Simple Analogy

Imagine you're in a hospital emergency room:

**Synchronous System** (No Queue):
- Each patient waits at the doctor's door
- Doctor treats patients one at a time
- If doctor is busy, patient stands there waiting
- Patient blocks other patients from seeing different doctors
- If doctor goes on break, patients are stuck

**Message Queue System**:
- Triage nurse assigns priority and puts patients in queue
- Multiple doctors pick up patients from queue
- Patients can wait comfortably in waiting room
- High-priority cases (emergencies) get handled first
- If a doctor is unavailable, other doctors continue working
- If a case is too complex, it goes back to queue for a specialist

The queue (triage system) enables:
- **Decoupling**: Patients don't need specific doctors
- **Load balancing**: Work distributed across available doctors
- **Priority handling**: Emergencies jump the line
- **Resilience**: System keeps working even if one doctor leaves

## When to Use Message Queues

### Use a Message Queue When:

**1. Task Takes Longer Than User Will Wait**
```python
# Without queue - user waits 30 seconds
@app.route("/api/send-email", methods=["POST"])
def send_email():
    email_service.send(to, subject, body)  # Takes 30 seconds
    return {"message": "Email sent"}  # User waited 30 seconds!

# With queue - user gets instant response
@app.route("/api/send-email", methods=["POST"])
def send_email():
    queue.enqueue(send_email_task, to, subject, body)
    return {"message": "Email queued"}  # Returns in 50ms
```

**2. Need to Handle Traffic Spikes**
- Black Friday: 10,000 orders in 1 minute
- Queue absorbs spike, workers process at sustainable rate
- Without queue: servers crash or requests fail

**3. External Service is Unreliable**
- Payment gateway is down
- Queue retries automatically
- Without queue: user sees error immediately

**4. Processing Requires Multiple Steps**
- Video upload → transcode → thumbnail → notify
- Each step handled by specialized worker
- Without queue: complex orchestration code

**5. Need to Decouple Services**
- Order service publishes "order created" event
- Inventory service, shipping service, email service all react
- Without queue: order service must know about all consumers

### Don't Use a Message Queue When:

- User needs immediate response (balance check, search)
- Operation is very fast (<100ms)
- Single-server application with no scaling needs
- Strong consistency required (use database transaction instead)

## Core Concepts

### Producer

**Who**: The service that creates and sends messages.

**Example**: API endpoint that receives file upload and queues processing job.

```python
# Producer: API endpoint
@app.route("/api/upload", methods=["POST"])
def upload_file():
    file = request.files['file']
    file_path = save_file(file)

    # Enqueue message
    queue.send_message({
        "task": "process_video",
        "file_path": file_path,
        "user_id": current_user.id
    })

    return {"message": "File uploaded, processing started"}
```

### Consumer / Worker

**Who**: The service that receives and processes messages.

**Example**: Background worker that processes video files.

```python
# Consumer: Background worker
def process_messages():
    while True:
        message = queue.receive_message()

        if message:
            # Process message
            process_video(message['file_path'], message['user_id'])

            # Acknowledge (delete from queue)
            queue.delete_message(message)
```

### Queue

**What**: The buffer that holds messages between producer and consumer.

**Properties**:
- **FIFO** (First In, First Out): Usually messages processed in order
- **Persistence**: Messages stored on disk, survive restarts
- **Visibility timeout**: After worker picks up message, it's invisible to others for X seconds
- **Dead letter queue**: Failed messages moved here after max retries

### Message

**What**: The data sent through the queue.

**Structure**:
```python
{
    "id": "msg-12345",
    "body": {
        "task": "send_email",
        "to": "user@example.com",
        "subject": "Welcome!",
        "body": "Thanks for signing up..."
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "attempt": 1,  # Retry count
    "metadata": {
        "user_id": 123,
        "trace_id": "abc-def"
    }
}
```

## Message Queue Technologies

### RabbitMQ

**What it is**: Feature-rich message broker with sophisticated routing.

**Strengths**:
- Complex routing patterns (direct, topic, fanout, headers)
- Message priorities
- Guaranteed delivery
- Enterprise-grade
- Wide language support

**Use cases**:
- Traditional messaging between services
- Task queues
- RPC (request-response) patterns
- Complex routing requirements

**Basic Usage** (Python with Pika):

```python
import pika
import json

# Connect to RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# Declare queue (creates if doesn't exist)
channel.queue_declare(queue='tasks', durable=True)

# Producer: Send message
def send_task(task_data):
    channel.basic_publish(
        exchange='',
        routing_key='tasks',
        body=json.dumps(task_data),
        properties=pika.BasicProperties(
            delivery_mode=2,  # Make message persistent
        )
    )
    print(f"Sent task: {task_data}")

# Consumer: Receive and process messages
def process_task(ch, method, properties, body):
    task = json.loads(body)
    print(f"Processing task: {task}")

    try:
        # Do work
        if task['type'] == 'send_email':
            send_email(task['to'], task['subject'], task['body'])

        # Acknowledge message (remove from queue)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        print("Task completed")

    except Exception as e:
        print(f"Task failed: {e}")
        # Reject and requeue message
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)

# Start consuming
channel.basic_qos(prefetch_count=1)  # Process one message at a time
channel.basic_consume(queue='tasks', on_message_callback=process_task)

print("Waiting for messages...")
channel.start_consuming()
```

**Advanced Routing**:

```python
# Topic exchange (pattern-based routing)
channel.exchange_declare(exchange='logs', exchange_type='topic')

# Producer: Send to specific topics
channel.basic_publish(
    exchange='logs',
    routing_key='user.signup',  # Topic pattern
    body=json.dumps({"user_id": 123})
)

# Consumer 1: Listen to all user events
channel.queue_bind(exchange='logs', queue='user_analytics', routing_key='user.*')

# Consumer 2: Listen to only signups
channel.queue_bind(exchange='logs', queue='welcome_emails', routing_key='user.signup')

# Consumer 3: Listen to everything
channel.queue_bind(exchange='logs', queue='audit_log', routing_key='#')
```

### Apache Kafka

**What it is**: Distributed streaming platform designed for high throughput.

**Strengths**:
- Extremely high throughput (millions of messages/second)
- Persistent log (messages kept for retention period)
- Replay messages (rewind and reprocess)
- Horizontal scaling
- Stream processing (real-time analytics)

**Use cases**:
- Event streaming
- Log aggregation
- Real-time analytics
- Change data capture (CDC)
- Activity tracking

**Basic Usage** (Python with kafka-python):

```python
from kafka import KafkaProducer, KafkaConsumer
import json

# Producer: Send messages
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def send_event(topic, event_data):
    future = producer.send(topic, event_data)
    # Block until message is sent
    result = future.get(timeout=10)
    print(f"Sent to {result.topic}, partition {result.partition}, offset {result.offset}")

# Send events
send_event('user_events', {
    "event": "user_signup",
    "user_id": 123,
    "timestamp": "2024-01-15T10:30:00Z"
})

# Consumer: Receive messages
consumer = KafkaConsumer(
    'user_events',
    bootstrap_servers=['localhost:9092'],
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    group_id='analytics_service',  # Consumer group
    auto_offset_reset='earliest'  # Start from beginning if no offset
)

for message in consumer:
    event = message.value
    print(f"Received event: {event}")

    # Process event
    if event['event'] == 'user_signup':
        track_signup(event['user_id'])

    # Kafka automatically commits offset (marks as processed)
```

**Consumer Groups** (Parallel Processing):

```python
# Multiple consumers in same group share work
# Each partition assigned to one consumer in group

# Consumer 1
consumer1 = KafkaConsumer(
    'orders',
    group_id='order_processing',
    client_id='worker-1'
)

# Consumer 2 (same group)
consumer2 = KafkaConsumer(
    'orders',
    group_id='order_processing',
    client_id='worker-2'
)

# Messages distributed between worker-1 and worker-2
# If topic has 4 partitions, each worker gets 2 partitions
```

**Replaying Messages**:

```python
# Reset consumer to beginning and reprocess all messages
consumer.seek_to_beginning()

# Or seek to specific offset
from kafka import TopicPartition

partition = TopicPartition('orders', 0)
consumer.seek(partition, 1000)  # Start from offset 1000
```

### AWS SQS (Simple Queue Service)

**What it is**: Fully managed message queue service by AWS.

**Strengths**:
- Zero operational overhead (managed service)
- Auto-scaling
- Integrated with AWS ecosystem (Lambda, SNS, etc.)
- Pay per use
- High availability

**Use cases**:
- Serverless architectures (Lambda + SQS)
- AWS-based applications
- Simple queuing needs
- Variable traffic (auto-scales)

**Basic Usage** (Python with Boto3):

```python
import boto3
import json

# Create SQS client
sqs = boto3.client('sqs', region_name='us-east-1')
queue_url = 'https://sqs.us-east-1.amazonaws.com/123456789/my-queue'

# Producer: Send message
def send_message(message_data):
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(message_data),
        MessageAttributes={
            'Priority': {
                'StringValue': 'high',
                'DataType': 'String'
            }
        }
    )
    print(f"Sent message: {response['MessageId']}")

# Send message
send_message({
    "task": "process_order",
    "order_id": 12345
})

# Consumer: Receive and process messages
def process_messages():
    while True:
        # Poll for messages
        response = sqs.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=10,  # Batch receive
            WaitTimeSeconds=20,  # Long polling
            VisibilityTimeout=30  # Hide message for 30s while processing
        )

        messages = response.get('Messages', [])

        for message in messages:
            try:
                body = json.loads(message['Body'])
                print(f"Processing: {body}")

                # Do work
                if body['task'] == 'process_order':
                    process_order(body['order_id'])

                # Delete message (acknowledge)
                sqs.delete_message(
                    QueueUrl=queue_url,
                    ReceiptHandle=message['ReceiptHandle']
                )

            except Exception as e:
                print(f"Error processing message: {e}")
                # Message will become visible again after visibility timeout
```

**FIFO Queue** (Guaranteed ordering):

```python
# Create FIFO queue (name must end with .fifo)
fifo_queue_url = 'https://sqs.us-east-1.amazonaws.com/123456789/orders.fifo'

# Send message to FIFO queue
sqs.send_message(
    QueueUrl=fifo_queue_url,
    MessageBody=json.dumps({"order_id": 123}),
    MessageGroupId='user-456',  # Messages with same group ID processed in order
    MessageDeduplicationId='order-123'  # Prevents duplicates
)
```

**Lambda Integration** (Serverless):

```python
# AWS Lambda function triggered by SQS
def lambda_handler(event, context):
    for record in event['Records']:
        body = json.loads(record['body'])
        print(f"Processing: {body}")

        # Process message
        process_order(body['order_id'])

    # Lambda automatically deletes messages after successful return
    return {"statusCode": 200}
```

## Pub/Sub Pattern

**What it is**: Publishers send messages to topics. Multiple subscribers receive copies.

**Difference from queues**:
- Queue: One consumer gets each message
- Pub/Sub: All subscribers get each message

**Use case**: Notify multiple services of same event.

### Example: Order Created Event

```python
# Without pub/sub (tight coupling)
@app.route("/api/orders", methods=["POST"])
def create_order():
    order = create_order_in_db(request.json)

    # Order service must know about all these services
    inventory_service.reserve_items(order)
    shipping_service.prepare_shipment(order)
    email_service.send_confirmation(order)
    analytics_service.track_order(order)

    return order.to_dict()

# With pub/sub (loose coupling)
@app.route("/api/orders", methods=["POST"])
def create_order():
    order = create_order_in_db(request.json)

    # Publish event - order service doesn't know who's listening
    publisher.publish('order.created', {
        "order_id": order.id,
        "user_id": order.user_id,
        "total": order.total
    })

    return order.to_dict()

# Separate services subscribe independently
# Inventory service
subscriber.subscribe('order.created', reserve_items_handler)

# Shipping service
subscriber.subscribe('order.created', prepare_shipment_handler)

# Email service
subscriber.subscribe('order.created', send_confirmation_handler)

# Analytics service
subscriber.subscribe('order.created', track_order_handler)
```

**Benefits**:
- Order service doesn't need to change when new consumers added
- Each consumer can fail independently
- Easy to add/remove features

### RabbitMQ Pub/Sub

```python
# Publisher
channel.exchange_declare(exchange='events', exchange_type='fanout')

channel.basic_publish(
    exchange='events',
    routing_key='',  # Ignored in fanout
    body=json.dumps({"event": "order_created", "order_id": 123})
)

# Subscriber 1: Email service
channel.queue_declare(queue='email_queue', exclusive=True)
channel.queue_bind(exchange='events', queue='email_queue')

# Subscriber 2: Analytics service
channel.queue_declare(queue='analytics_queue', exclusive=True)
channel.queue_bind(exchange='events', queue='analytics_queue')

# Both receive same message
```

### AWS SNS + SQS

```python
import boto3

sns = boto3.client('sns')
sqs = boto3.client('sqs')

# Create topic
topic_response = sns.create_topic(Name='order-events')
topic_arn = topic_response['TopicArn']

# Create queues for each subscriber
email_queue = sqs.create_queue(QueueName='email-queue')
analytics_queue = sqs.create_queue(QueueName='analytics-queue')

# Subscribe queues to topic
sns.subscribe(
    TopicArn=topic_arn,
    Protocol='sqs',
    Endpoint=email_queue['QueueUrl']
)

sns.subscribe(
    TopicArn=topic_arn,
    Protocol='sqs',
    Endpoint=analytics_queue['QueueUrl']
)

# Publish message (all subscribers receive it)
sns.publish(
    TopicArn=topic_arn,
    Message=json.dumps({"event": "order_created", "order_id": 123})
)
```

## Consumer Patterns

### Single Consumer (Simple)

One worker processes messages sequentially.

```python
def worker():
    while True:
        message = queue.receive()
        if message:
            process(message)
            queue.acknowledge(message)
```

**Pros**: Simple, maintains order
**Cons**: Slow, no parallelism

### Multiple Consumers (Parallel)

Multiple workers process different messages simultaneously.

```python
# Start multiple worker processes
for i in range(5):
    Process(target=worker, args=(i,)).start()

def worker(worker_id):
    print(f"Worker {worker_id} started")
    while True:
        message = queue.receive()
        if message:
            print(f"Worker {worker_id} processing {message}")
            process(message)
            queue.acknowledge(message)
```

**Pros**: Fast, high throughput
**Cons**: May process out of order

### Consumer Groups (Kafka)

Multiple consumers share work, each partition assigned to one consumer.

```python
# All consumers in same group share work
consumer = KafkaConsumer(
    'orders',
    group_id='order-processing-group',
    bootstrap_servers=['localhost:9092']
)
```

**Benefits**:
- Automatic load balancing
- Fault tolerance (if consumer dies, partition reassigned)
- Maintains order within partition

### Competing Consumers

Multiple workers compete for same messages.

```python
# RabbitMQ with prefetch
channel.basic_qos(prefetch_count=1)  # Each worker gets 1 message at a time

# Worker 1
channel.basic_consume(queue='tasks', on_message_callback=process)

# Worker 2 (same queue)
channel.basic_consume(queue='tasks', on_message_callback=process)

# Messages distributed round-robin to available workers
```

## Dead Letter Queues

**What they are**: Special queues for messages that fail repeatedly.

**Why they matter**: Prevent poison messages from blocking queue forever.

**Example** (AWS SQS):

```python
# Create dead letter queue
dlq_response = sqs.create_queue(QueueName='orders-dlq')
dlq_url = dlq_response['QueueUrl']

# Get DLQ ARN
dlq_attrs = sqs.get_queue_attributes(
    QueueUrl=dlq_url,
    AttributeNames=['QueueArn']
)
dlq_arn = dlq_attrs['Attributes']['QueueArn']

# Create main queue with DLQ
sqs.create_queue(
    QueueName='orders',
    Attributes={
        'RedrivePolicy': json.dumps({
            'deadLetterTargetArn': dlq_arn,
            'maxReceiveCount': '3'  # After 3 failures, move to DLQ
        })
    }
)

# Monitor DLQ
def check_dead_letters():
    response = sqs.receive_message(QueueUrl=dlq_url)
    messages = response.get('Messages', [])

    if messages:
        print(f"Found {len(messages)} failed messages in DLQ")

        for message in messages:
            body = json.loads(message['Body'])
            print(f"Failed message: {body}")

            # Alert operations team
            send_alert(f"Message failed 3 times: {body}")

            # Optionally reprocess manually
            # process_with_retry(body)

            # Delete from DLQ
            sqs.delete_message(
                QueueUrl=dlq_url,
                ReceiptHandle=message['ReceiptHandle']
            )
```

**Best Practices**:
- Always configure dead letter queues
- Monitor DLQ size (alerts if growing)
- Investigate messages in DLQ
- Fix bugs that cause failures
- Optionally replay messages after fix

## Best Practices

### Safety and Security

**1. Message Validation**

```python
from marshmallow import Schema, fields, ValidationError

class OrderMessageSchema(Schema):
    order_id = fields.Int(required=True)
    user_id = fields.Int(required=True)
    total = fields.Float(required=True, validate=lambda x: x > 0)

def process_message(message):
    schema = OrderMessageSchema()

    try:
        # Validate message
        data = schema.load(json.loads(message.body))
    except ValidationError as e:
        logger.error(f"Invalid message: {e.messages}")
        # Move to DLQ
        return

    # Process validated data
    process_order(data)
```

**2. Idempotency** (Handle duplicate messages)

```python
# Problem: Message processed twice due to retry
def process_payment(order_id, amount):
    charge_credit_card(order_id, amount)  # Charges twice!

# Solution: Use idempotency key
def process_payment(order_id, amount, idempotency_key):
    # Check if already processed
    if cache.exists(f"payment:{idempotency_key}"):
        logger.info(f"Payment {idempotency_key} already processed")
        return

    # Process payment
    result = charge_credit_card(order_id, amount)

    # Store idempotency key
    cache.setex(
        f"payment:{idempotency_key}",
        timedelta(days=7),
        json.dumps(result)
    )

    return result

# Consumer
def handle_message(message):
    # Use message ID as idempotency key
    process_payment(
        message['order_id'],
        message['amount'],
        idempotency_key=message['message_id']
    )
```

**3. Poison Message Handling**

```python
def process_message_safely(message):
    try:
        # Process message
        result = process(message.body)

        # Acknowledge success
        message.ack()

        return result

    except ValidationError as e:
        # Invalid message - don't retry
        logger.error(f"Invalid message: {e}")
        message.ack()  # Remove from queue
        send_to_dead_letter_queue(message)

    except ExternalServiceError as e:
        # Temporary error - retry
        logger.warning(f"Temporary error: {e}")
        message.nack(requeue=True)

    except Exception as e:
        # Unknown error - retry with limit
        logger.error(f"Unexpected error: {e}", exc_info=True)

        if message.retry_count < 3:
            message.nack(requeue=True)
        else:
            message.ack()  # Give up
            send_to_dead_letter_queue(message)
```

**4. Message Encryption**

```python
from cryptography.fernet import Fernet

# Generate key (store securely)
key = Fernet.generate_key()
cipher = Fernet(key)

# Encrypt message before sending
def send_secure_message(queue, data):
    encrypted = cipher.encrypt(json.dumps(data).encode())
    queue.send(encrypted)

# Decrypt when receiving
def receive_secure_message(queue):
    encrypted = queue.receive()
    if encrypted:
        decrypted = cipher.decrypt(encrypted)
        return json.loads(decrypted)
```

### Quality Assurance

**Testing Strategies**

```python
import pytest
from unittest.mock import Mock, patch

@pytest.fixture
def mock_queue():
    """Mock queue for testing"""
    return Mock()

def test_message_processing(mock_queue):
    """Test message processing logic"""
    message = {
        "order_id": 123,
        "user_id": 456,
        "total": 99.99
    }

    result = process_order_message(message)

    assert result['status'] == 'success'
    assert result['order_id'] == 123

def test_invalid_message_handling(mock_queue):
    """Test handling of invalid messages"""
    invalid_message = {"invalid": "data"}

    with pytest.raises(ValidationError):
        process_order_message(invalid_message)

def test_retry_on_temporary_failure(mock_queue):
    """Test retry behavior"""
    message = {"order_id": 123}

    with patch('external_service.call') as mock_service:
        # Simulate temporary failure
        mock_service.side_effect = [
            ConnectionError("Service down"),
            {"status": "success"}
        ]

        # First attempt fails
        with pytest.raises(ConnectionError):
            process_order_message(message)

        # Second attempt succeeds
        result = process_order_message(message)
        assert result['status'] == 'success'

def test_idempotency(mock_queue):
    """Test duplicate message handling"""
    message = {"order_id": 123, "idempotency_key": "abc123"}

    # Process once
    result1 = process_payment(message)

    # Process again (duplicate)
    result2 = process_payment(message)

    # Should return cached result, not charge twice
    assert result1 == result2
    assert payment_gateway.charge_count == 1  # Only charged once
```

**Integration Testing**

```python
import time

def test_end_to_end_queue_flow():
    """Test actual queue system"""
    # Send message
    producer.send('test-queue', {"order_id": 123})

    # Wait for processing
    time.sleep(2)

    # Check database for result
    order = db.query(Order).filter_by(id=123).first()
    assert order.status == 'processed'

    # Check message was removed from queue
    messages = consumer.receive('test-queue')
    assert len(messages) == 0
```

### Logging and Observability

```python
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)

def process_message_with_logging(message):
    """Process message with comprehensive logging"""
    start_time = datetime.utcnow()
    trace_id = message.get('trace_id', 'unknown')

    # Log message received
    logger.info("Message received", extra={
        "event": "message_received",
        "trace_id": trace_id,
        "message_id": message.get('id'),
        "queue": message.get('queue'),
        "retry_count": message.get('retry_count', 0)
    })

    try:
        # Process message
        result = process(message.body)

        # Log success
        duration = (datetime.utcnow() - start_time).total_seconds()
        logger.info("Message processed successfully", extra={
            "event": "message_processed",
            "trace_id": trace_id,
            "message_id": message.get('id'),
            "duration_seconds": duration,
            "result": result
        })

        return result

    except Exception as e:
        # Log failure
        duration = (datetime.utcnow() - start_time).total_seconds()
        logger.error("Message processing failed", extra={
            "event": "message_failed",
            "trace_id": trace_id,
            "message_id": message.get('id'),
            "duration_seconds": duration,
            "error_type": type(e).__name__,
            "error_message": str(e),
            "retry_count": message.get('retry_count', 0)
        }, exc_info=True)

        raise
```

**What to Log**:
- Message received (ID, queue, timestamp)
- Processing started
- Processing completed (duration, result)
- Processing failed (error, retry count)
- Message moved to DLQ
- Consumer started/stopped
- Queue depth (metrics)

**Metrics to Track**:
- Messages per second (throughput)
- Processing time (latency)
- Error rate
- Queue depth (backlog)
- Consumer lag (Kafka)
- DLQ size

```python
from prometheus_client import Counter, Histogram

# Define metrics
messages_processed = Counter('messages_processed_total', 'Total messages processed', ['queue', 'status'])
processing_duration = Histogram('message_processing_duration_seconds', 'Time to process message', ['queue'])

def process_with_metrics(message):
    with processing_duration.labels(queue=message.queue).time():
        try:
            result = process(message.body)
            messages_processed.labels(queue=message.queue, status='success').inc()
            return result
        except Exception as e:
            messages_processed.labels(queue=message.queue, status='error').inc()
            raise
```

## Common Pitfalls

### 1. Not Handling Failures

**Problem**: Worker crashes, message is lost.

**Solution**: Use acknowledgments.

```python
# Bad - message lost if crash
message = queue.receive()
process(message)  # If this crashes, message is gone

# Good - acknowledge only after success
message = queue.receive()
try:
    process(message)
    queue.acknowledge(message)  # Success
except Exception:
    queue.reject(message, requeue=True)  # Retry
```

### 2. Creating Infinite Retry Loops

**Problem**: Poison message fails forever, blocking queue.

**Solution**: Limit retries, use DLQ.

```python
# Bad - retries forever
def process_message(message):
    try:
        process(message)
    except:
        queue.requeue(message)  # Will retry forever!

# Good - limit retries
def process_message(message):
    if message.retry_count >= 3:
        send_to_dlq(message)
        return

    try:
        process(message)
    except:
        message.retry_count += 1
        queue.requeue(message)
```

### 3. Not Making Operations Idempotent

**Problem**: Message processed twice, causing duplicates.

**Solution**: Use idempotency keys.

```python
# Bad - processes duplicate messages
def process_order(order_id):
    db.insert(Order(id=order_id))  # Fails if duplicate

# Good - idempotent
def process_order(order_id, idempotency_key):
    if cache.exists(f"order:{idempotency_key}"):
        return  # Already processed

    db.insert(Order(id=order_id))
    cache.set(f"order:{idempotency_key}", True, ttl=86400)
```

### 4. Blocking Workers

**Problem**: Long-running task blocks worker from processing other messages.

**Solution**: Set visibility timeout appropriately.

```python
# Bad - visibility timeout too short
message = queue.receive(visibility_timeout=30)
process_large_video(message)  # Takes 5 minutes!
# Message becomes visible again at 30 seconds, processed by another worker (duplicate)

# Good - set appropriate timeout
message = queue.receive(visibility_timeout=600)  # 10 minutes
process_large_video(message)  # Has time to complete
queue.acknowledge(message)
```

### 5. Not Monitoring Queue Depth

**Problem**: Queue grows unbounded, indicating worker falling behind.

**Solution**: Monitor and alert.

```python
def monitor_queue_depth():
    depth = queue.get_depth()

    if depth > 10000:
        send_alert(f"Queue depth critical: {depth}")
        # Auto-scale workers or throttle producers

    logger.info(f"Queue depth: {depth}")
```

## Real-World Use Cases

### E-Commerce Order Processing

**Challenge**: Handle orders with multiple steps (payment, inventory, shipping, email).

**Solution**: Event-driven architecture with queues.

```python
# Order service publishes event
@app.route("/api/orders", methods=["POST"])
def create_order():
    order = save_order(request.json)

    # Publish event to queue
    queue.send('order.created', {
        "order_id": order.id,
        "user_id": order.user_id,
        "items": order.items
    })

    return {"order_id": order.id, "status": "processing"}

# Payment service consumes
def process_payment(message):
    order_id = message['order_id']
    charge_customer(order_id)
    queue.send('order.paid', {"order_id": order_id})

# Inventory service consumes
def reserve_inventory(message):
    order_id = message['order_id']
    reserve_items(message['items'])
    queue.send('order.reserved', {"order_id": order_id})

# Shipping service consumes
def create_shipment(message):
    order_id = message['order_id']
    create_shipping_label(order_id)
    queue.send('order.shipped', {"order_id": order_id})

# Email service consumes
def send_confirmation(message):
    order_id = message['order_id']
    send_email(message['user_id'], "Order confirmed!")
```

**Benefits**:
- Each service independent
- Can retry failed steps
- Easy to add new steps
- Services can scale independently

### Video Processing Platform

**Challenge**: Users upload videos that need transcoding (slow).

**Solution**: Queue video jobs, process with workers.

```python
# API receives upload
@app.route("/api/upload", methods=["POST"])
def upload_video():
    file = request.files['video']
    video_path = save_to_s3(file)

    # Queue processing job
    queue.send('video.uploaded', {
        "video_id": video.id,
        "path": video_path,
        "formats": ["1080p", "720p", "480p"]
    })

    return {"video_id": video.id, "status": "processing"}

# Worker processes videos
def transcode_video(message):
    video_path = message['path']

    for format in message['formats']:
        # Transcode (takes 10 minutes)
        output_path = transcode(video_path, format)
        save_to_s3(output_path)

    # Notify user via email
    queue.send('video.ready', {"video_id": message['video_id']})
```

**Benefits**:
- API responds instantly (doesn't wait 10 minutes)
- Can scale workers based on queue depth
- Failed transcodes retry automatically

### Real-Time Analytics

**Challenge**: Track millions of user events for analytics.

**Solution**: Kafka for high-throughput event streaming.

```python
# Application logs events
def track_event(event_type, user_id, properties):
    producer.send('events', {
        "event": event_type,
        "user_id": user_id,
        "properties": properties,
        "timestamp": datetime.utcnow().isoformat()
    })

# Multiple consumers process events
# Consumer 1: Real-time dashboard
def update_dashboard(event):
    redis.incr(f"events:{event['event']}:count")

# Consumer 2: Write to data warehouse
def store_for_analysis(event):
    warehouse.insert(event)

# Consumer 3: Trigger automated actions
def trigger_automation(event):
    if event['event'] == 'cart_abandoned':
        send_reminder_email(event['user_id'])
```

### Microservices Communication

**Challenge**: Services need to communicate without tight coupling.

**Solution**: Message queue for async communication.

```python
# User service publishes
def create_user(username, email):
    user = db.insert(User(username, email))

    # Notify other services
    queue.send('user.created', {
        "user_id": user.id,
        "username": user.username,
        "email": user.email
    })

    return user

# Email service subscribes
def send_welcome_email(message):
    send_email(message['email'], "Welcome!")

# Analytics service subscribes
def track_signup(message):
    analytics.track('signup', message['user_id'])

# Billing service subscribes
def create_billing_account(message):
    billing.create_account(message['user_id'])
```

## Quick Reference

| Queue Type | Best For | Throughput | Features |
|------------|----------|------------|----------|
| **RabbitMQ** | Traditional messaging, complex routing | Medium | Routing, priorities, management UI |
| **Kafka** | Event streaming, high throughput | Very High | Replay, persistence, stream processing |
| **AWS SQS** | Serverless, AWS integration | High | Managed, auto-scaling, FIFO option |
| **Redis** | Simple queues, caching | High | In-memory, pub/sub, fast |

| Pattern | Use Case |
|---------|----------|
| **Work Queue** | Distribute tasks to workers |
| **Pub/Sub** | Notify multiple services of events |
| **Fan-out** | Send same message to all consumers |
| **Topic** | Route messages based on patterns |
| **Dead Letter** | Handle failed messages |
| **Priority** | Process urgent messages first |

## Next Steps

Now that you understand message queues, explore:

- **[REST APIs](../rest-apis/README.md)**: Learn how APIs trigger background jobs via queues
- **[Databases](../databases/README.md)**: Understand how queues interact with databases
- **02-architectures/microservices**: See how queues enable service-to-service communication
- **06-infrastructure/docker**: Deploy queue systems in containers

## Related Topics

- **02-architectures/event-driven**: Event-driven architecture patterns
- **02-architectures/microservices**: Using queues between services
- **06-infrastructure**: Running RabbitMQ, Kafka in production
- **07-cloud/aws**: SQS, SNS, EventBridge
- **08-security**: Securing message queues, encryption

---

**Remember**: Message queues are about decoupling and resilience. Use them when tasks are slow, external services are unreliable, or you need to handle traffic spikes. Start simple (SQS or RabbitMQ), and add complexity (Kafka) only when you have clear needs for high throughput or event replay.
