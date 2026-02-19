# Social Media Platform - Complete Implementation Guide

## What is it?

A social media platform is a digital service where users create profiles, share content (text, images, videos), follow other users, and interact through likes, comments, and messages. It aggregates content from connections into a personalized feed, delivering real-time updates at massive scale.

## Simple Analogy

Think of a social media platform like a **smart newspaper that writes itself**. Every person is both a journalist (creating content) and a reader (consuming content). The platform is like having millions of newspaper editors working simultaneously, each customizing a unique edition for every reader based on who they follow and what they like - and it updates every few seconds.

## Why Does It Matter?

Social media platforms represent one of the most challenging technical problems in modern software engineering:

- **Scale**: Handle billions of users and trillions of interactions
- **Real-time**: Deliver updates in milliseconds across the globe
- **Personalization**: Serve unique content to each user
- **Safety**: Moderate harmful content while respecting free speech
- **Business impact**: Drive user engagement and monetization

The technical patterns used here (event-driven architecture, content delivery, recommendation systems) apply to many other domains.

## How It Works

### Step-by-Step User Flow

1. **User Creates Content**: Posts text, images, or videos
2. **Content Processing**: System validates, moderates, and stores content
3. **Event Distribution**: Notifies followers about new content
4. **Feed Generation**: Aggregates and ranks content for each user
5. **Delivery**: Serves personalized feed via API or WebSocket
6. **User Interaction**: User likes, comments, or shares content
7. **Analytics**: Track engagement metrics and adjust recommendations

### High-Level Architecture

```
┌─────────────┐
│   Client    │ (Web, iOS, Android)
│ (React/Vue) │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│             API Gateway + Load Balancer              │
│         (Kong/nginx + Rate Limiting)                 │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┴───────────┬─────────────┬─────────────┐
       ▼                       ▼             ▼             ▼
┌──────────┐          ┌──────────┐    ┌──────────┐  ┌──────────┐
│   User   │          │   Post   │    │   Feed   │  │  Search  │
│ Service  │          │ Service  │    │ Service  │  │ Service  │
└────┬─────┘          └────┬─────┘    └────┬─────┘  └────┬─────┘
     │                     │               │             │
     ▼                     ▼               ▼             ▼
┌──────────┐          ┌──────────┐    ┌──────────┐  ┌──────────┐
│PostgreSQL│          │PostgreSQL│    │  Redis   │  │Elastic   │
│ (Users)  │          │ (Posts)  │    │ (Cache)  │  │ Search   │
└──────────┘          └──────────┘    └──────────┘  └──────────┘
     │                     │
     └──────────┬──────────┘
                ▼
        ┌──────────────┐
        │    Kafka     │ (Event Streaming)
        │   Message    │
        │     Bus      │
        └──────┬───────┘
               │
    ┌──────────┼──────────┬──────────────┬──────────────┐
    ▼          ▼          ▼              ▼              ▼
┌────────┐ ┌────────┐ ┌────────┐  ┌──────────┐  ┌──────────┐
│Moderation│ Notification│Analytics│  Recommendation│  Timeline │
│ Service │ │ Service │ │Service │  │  Service   │  │  Builder │
└────────┘ └────────┘ └────────┘  └──────────┘  └──────────┘
    │          │                        │              │
    ▼          ▼                        ▼              ▼
┌────────┐ ┌────────┐            ┌──────────┐  ┌──────────┐
│ML Model│ │Firebase│            │  Redis   │  │  Redis   │
│  API   │ │  FCM   │            │  Cache   │  │  Cache   │
└────────┘ └────────┘            └──────────┘  └──────────┘
```

## Key Concepts

### 1. **Feed Generation**
The process of aggregating content from multiple sources, ranking by relevance, and delivering to users. Two main approaches:
- **Pull Model**: User requests feed, system fetches and ranks content (slower, more flexible)
- **Push Model**: Pre-compute feeds when content is created (faster reads, more storage)
- **Hybrid**: Common approach - pre-compute for active users, pull for others

### 2. **Content Moderation**
AI and human review systems to detect and remove harmful content (hate speech, violence, spam, misinformation).

### 3. **Fanout**
The process of distributing a post to all followers. Two strategies:
- **Fanout on Write**: When post is created, write to all follower feeds (fast reads, slow writes)
- **Fanout on Read**: Aggregate posts when user requests feed (slow reads, fast writes)

### 4. **Engagement Ranking**
Algorithm to order feed content by predicted user interest (not just chronological). Factors include:
- Recency (time decay)
- Engagement signals (likes, comments, shares)
- User affinity (interaction history with author)
- Content type preferences

### 5. **Real-Time Streaming**
Using WebSockets or Server-Sent Events (SSE) to push updates to users without polling.

## Architecture Patterns Used

### Microservices Architecture

```python
# User Service - Profile management
class UserService:
    """
    Handles user profiles, relationships (follow/unfollow), and authentication.

    Why microservice:
    - User data changes independently of posts
    - Different scaling needs (user reads >> writes)
    - Can be owned by dedicated team
    """

    async def follow_user(self, follower_id: str, followee_id: str):
        """
        Follow another user.

        Best Practices:
        - Check for existing relationship to prevent duplicates
        - Emit event for other services (feed, notifications)
        - Use transactions to maintain consistency
        """
        # Validate users exist
        if not await self.user_exists(follower_id):
            raise UserNotFoundError(follower_id)
        if not await self.user_exists(followee_id):
            raise UserNotFoundError(followee_id)

        # Check for existing relationship
        existing = await self.db.fetchone(
            "SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2",
            follower_id, followee_id
        )

        if existing:
            logger.info(f"Follow relationship already exists: {follower_id} -> {followee_id}")
            return {"status": "already_following"}

        # Create relationship in transaction
        async with self.db.transaction():
            await self.db.execute(
                "INSERT INTO follows (follower_id, followee_id, created_at) VALUES ($1, $2, NOW())",
                follower_id, followee_id
            )

            # Update counts
            await self.db.execute(
                "UPDATE users SET following_count = following_count + 1 WHERE id = $1",
                follower_id
            )
            await self.db.execute(
                "UPDATE users SET followers_count = followers_count + 1 WHERE id = $1",
                followee_id
            )

        # Emit event for other services
        await self.event_bus.publish("user.followed", {
            "follower_id": follower_id,
            "followee_id": followee_id,
            "timestamp": datetime.utcnow().isoformat()
        })

        logger.info(f"User {follower_id} followed {followee_id}")

        return {"status": "success"}
```

### Event-Driven Architecture

```python
# Post Service - Content creation and management
class PostService:
    """
    Handles post creation, editing, deletion.
    Emits events for other services to react to.
    """

    async def create_post(self, user_id: str, content: str,
                         images: List[str] = None,
                         video: str = None):
        """
        Create a new post and trigger downstream processing.

        Best Practices:
        - Validate input immediately
        - Store post first, then trigger async processing
        - Use idempotency keys to prevent duplicate posts
        - Return quickly to user, process asynchronously
        """
        # Input validation
        if not content or len(content.strip()) == 0:
            raise ValueError("Post content cannot be empty")

        if len(content) > 5000:
            raise ValueError("Post content exceeds maximum length of 5000 characters")

        # Sanitize content to prevent XSS
        sanitized_content = self.sanitize_html(content)

        # Create post in database
        post_id = str(uuid.uuid4())
        post = await self.db.fetchone("""
            INSERT INTO posts (id, user_id, content, images, video, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id, user_id, content, images, video, created_at
        """, post_id, user_id, sanitized_content, images or [], video)

        logger.info(f"Post created: {post_id} by user {user_id}")

        # Emit event for async processing
        # Different services will react: moderation, feed fanout, analytics
        await self.event_bus.publish("post.created", {
            "post_id": post_id,
            "user_id": user_id,
            "content": sanitized_content,
            "has_images": bool(images),
            "has_video": bool(video),
            "timestamp": post['created_at'].isoformat()
        })

        return post
```

### CQRS (Command Query Responsibility Segregation)

```python
# Feed Service - Read-optimized for fast feed generation
class FeedService:
    """
    Separates read model (feed generation) from write model (post storage).

    Why CQRS:
    - Feed reads are 100x more frequent than writes
    - Can optimize data structure for reads (denormalized)
    - Can scale read and write independently
    """

    async def get_user_feed(self, user_id: str,
                           limit: int = 50,
                           offset: int = 0) -> List[Dict]:
        """
        Generate personalized feed for user.

        Strategy: Hybrid fanout
        - Pre-computed feeds for active users (in cache)
        - On-demand generation for inactive users

        Best Practices:
        - Check cache first (90%+ hit rate)
        - Paginate to reduce payload size
        - Use cursor-based pagination for consistency
        - Return quickly with cached data, refresh async
        """
        cache_key = f"feed:{user_id}:{offset}:{limit}"

        # Check cache first
        cached = await self.redis.get(cache_key)
        if cached:
            logger.info(f"Feed cache hit for user {user_id}")
            return json.loads(cached)

        logger.info(f"Feed cache miss for user {user_id}, generating...")

        # Get user's following list
        following_ids = await self.get_following_ids(user_id)

        if not following_ids:
            # No one followed yet, return empty feed
            return []

        # Aggregate posts from followed users
        # Note: This query gets posts in batches for ranking
        posts = await self.db.fetch("""
            SELECT
                p.id, p.user_id, p.content, p.images, p.video,
                p.created_at, p.likes_count, p.comments_count, p.shares_count,
                u.username, u.display_name, u.avatar_url
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ANY($1)
              AND p.created_at > NOW() - INTERVAL '7 days'
            ORDER BY p.created_at DESC
            LIMIT $2
        """, following_ids, limit * 3)  # Get 3x for ranking

        # Rank posts by engagement and personalization
        ranked_posts = await self.rank_posts(posts, user_id, limit)

        # Cache for 5 minutes
        await self.redis.setex(
            cache_key,
            300,  # 5 minutes
            json.dumps(ranked_posts, default=str)
        )

        return ranked_posts

    async def rank_posts(self, posts: List[Dict], user_id: str, limit: int) -> List[Dict]:
        """
        Rank posts by predicted user interest.

        Ranking factors:
        1. Recency (time decay)
        2. Engagement (likes, comments, shares)
        3. User affinity (past interactions with author)
        4. Content type preference (text vs images vs video)
        """
        scored_posts = []

        for post in posts:
            # 1. Time decay factor (exponential decay)
            hours_old = (datetime.utcnow() - post['created_at']).total_seconds() / 3600
            time_factor = math.exp(-hours_old / 48)  # Half-life of 48 hours

            # 2. Engagement score (weighted)
            engagement_score = (
                post['likes_count'] * 1.0 +
                post['comments_count'] * 2.0 +  # Comments worth more
                post['shares_count'] * 3.0      # Shares worth most
            )

            # 3. User affinity (how much user interacts with this author)
            affinity = await self.get_affinity_score(user_id, post['user_id'])

            # 4. Content type preference
            content_type_score = await self.get_content_type_preference(user_id, post)

            # Combined score
            final_score = (
                engagement_score * time_factor * 0.4 +
                affinity * 0.3 +
                content_type_score * 0.3
            )

            post['_score'] = final_score
            scored_posts.append(post)

        # Sort by score and return top N
        scored_posts.sort(key=lambda p: p['_score'], reverse=True)
        return scored_posts[:limit]
```

## Data Models

### User Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(50),
    bio TEXT,
    avatar_url TEXT,
    cover_photo_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP,

    -- Indexes for performance
    CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_active ON users(last_active_at DESC);

-- Follows table (relationships)
CREATE TABLE follows (
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    PRIMARY KEY (follower_id, followee_id),
    -- Prevent self-follows
    CONSTRAINT no_self_follow CHECK (follower_id != followee_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_followee ON follows(followee_id);
```

### Post Schema

```sql
-- Posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images TEXT[],  -- Array of image URLs
    video TEXT,     -- Video URL

    -- Engagement counters (denormalized for performance)
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,

    -- Moderation
    moderation_status VARCHAR(20) DEFAULT 'pending',  -- pending, approved, flagged, removed
    moderation_score DECIMAL(3, 2),

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_moderation_status ON posts(moderation_status);

-- Composite index for feed queries
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);
```

### Interaction Schema

```sql
-- Likes
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, post_id)
);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_post ON likes(post_id);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,  -- For nested comments
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT comment_not_empty CHECK (char_length(content) > 0)
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at DESC);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
```

## Real-Time Features

### WebSocket Implementation

```javascript
// Real-time feed updates using WebSocket
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true
  },
  // Performance optimizations
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware: Authenticate WebSocket connections
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const user = await verifyToken(token);
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user.id;

  console.log(`User connected: ${userId}`);

  // Join user's personal room for targeted messages
  socket.join(`user:${userId}`);

  // Mark user as online
  redisClient.sadd('online_users', userId);

  // Broadcast presence to friends
  socket.broadcast.emit('presence:online', { userId });

  // Handle new post creation
  socket.on('post:create', async (data) => {
    try {
      // Create post via service
      const post = await postService.create(userId, data);

      // Get user's followers
      const followers = await userService.getFollowers(userId);

      // Send real-time notification to all online followers
      followers.forEach(followerId => {
        io.to(`user:${followerId}`).emit('feed:new-post', {
          post,
          author: socket.user
        });
      });

      socket.emit('post:created', { success: true, post });
    } catch (error) {
      socket.emit('post:error', { error: error.message });
    }
  });

  // Handle engagement events
  socket.on('post:like', async ({ postId }) => {
    try {
      await postService.likePost(userId, postId);

      // Notify post author
      const post = await postService.getPost(postId);
      io.to(`user:${post.userId}`).emit('notification:like', {
        postId,
        userId,
        username: socket.user.username
      });

      // Broadcast updated like count to all viewers
      io.emit(`post:${postId}:likes`, {
        postId,
        likesCount: post.likesCount + 1
      });
    } catch (error) {
      socket.emit('error', { error: error.message });
    }
  });

  // Typing indicators for comments
  socket.on('comment:typing', ({ postId }) => {
    socket.to(`post:${postId}`).emit('comment:typing', {
      userId,
      username: socket.user.username
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${userId}`);

    // Mark user as offline
    redisClient.srem('online_users', userId);

    // Broadcast offline status
    socket.broadcast.emit('presence:offline', { userId });
  });
});
```

## Content Moderation

### AI-Powered Moderation Pipeline

```python
# Moderation Service - Multi-stage content filtering
class ModerationService:
    """
    Automated content moderation using ML models.

    Why needed:
    - Scale: Can't manually review millions of posts/day
    - Speed: Flag harmful content in seconds, not hours
    - Consistency: Apply same standards uniformly

    Approach: Multi-stage pipeline
    1. Automated filtering (high confidence)
    2. Human review queue (medium confidence)
    3. User reports (community moderation)
    """

    def __init__(self):
        self.text_classifier = self.load_text_model()
        self.image_classifier = self.load_image_model()
        self.video_classifier = self.load_video_model()

    async def moderate_post(self, post: Dict) -> ModerationResult:
        """
        Moderate a post using multiple signals.

        Best Practices:
        - Process text, images, video independently
        - Use ensemble of models for higher accuracy
        - Log all decisions for audit trail
        - Have human review for edge cases
        """
        scores = {}

        # 1. Text moderation
        if post.get('content'):
            text_result = await self.moderate_text(post['content'])
            scores['text'] = text_result

            logger.info(
                f"Text moderation for post {post['id']}: "
                f"hate_speech={text_result['hate_speech']:.2f}, "
                f"violence={text_result['violence']:.2f}, "
                f"spam={text_result['spam']:.2f}"
            )

        # 2. Image moderation
        if post.get('images'):
            image_results = []
            for image_url in post['images']:
                result = await self.moderate_image(image_url)
                image_results.append(result)

                logger.info(
                    f"Image moderation for {image_url}: "
                    f"nsfw={result['nsfw']:.2f}, violence={result['violence']:.2f}"
                )

            scores['images'] = image_results

        # 3. Video moderation (sample frames)
        if post.get('video'):
            video_result = await self.moderate_video(post['video'])
            scores['video'] = video_result

        # 4. User reputation score (repeat offenders weighted)
        user_reputation = await self.get_user_reputation(post['user_id'])

        # 5. Aggregate scores and make decision
        decision = self.make_moderation_decision(scores, user_reputation)

        # 6. Store result for audit
        await self.store_moderation_result(post['id'], decision, scores)

        return decision

    async def moderate_text(self, text: str) -> Dict[str, float]:
        """
        Classify text for various harmful categories.

        Categories:
        - Hate speech (racism, sexism, homophobia)
        - Violence (threats, graphic descriptions)
        - Spam (repetitive, promotional)
        - Misinformation (false health/political claims)
        - Adult content (sexual references)
        """
        # Preprocess text
        cleaned_text = self.preprocess_text(text)

        # Run through ML model (e.g., fine-tuned BERT)
        predictions = self.text_classifier.predict(cleaned_text)

        return {
            'hate_speech': predictions['hate_speech'],
            'violence': predictions['violence'],
            'spam': predictions['spam'],
            'misinformation': predictions['misinformation'],
            'adult_content': predictions['adult_content']
        }

    async def moderate_image(self, image_url: str) -> Dict[str, float]:
        """
        Classify images for harmful content.

        Uses: Computer vision models (e.g., ResNet, EfficientNet)
        """
        # Download and preprocess image
        image = await self.download_image(image_url)
        processed = self.preprocess_image(image)

        # Run through image classifier
        predictions = self.image_classifier.predict(processed)

        return {
            'nsfw': predictions['nsfw'],
            'violence': predictions['violence'],
            'gore': predictions['gore']
        }

    def make_moderation_decision(self, scores: Dict,
                                 user_reputation: float) -> ModerationResult:
        """
        Aggregate scores and decide action.

        Actions:
        - AUTO_APPROVE: Safe content, publish immediately
        - HUMAN_REVIEW: Uncertain, queue for manual review
        - AUTO_REMOVE: High confidence harmful, remove and notify user
        """
        # Find maximum score across all categories
        max_score = 0.0
        max_category = None

        for content_type, type_scores in scores.items():
            if isinstance(type_scores, list):  # Images
                for img_scores in type_scores:
                    for category, score in img_scores.items():
                        if score > max_score:
                            max_score = score
                            max_category = f"{content_type}_{category}"
            else:  # Text or video
                for category, score in type_scores.items():
                    if score > max_score:
                        max_score = score
                        max_category = f"{content_type}_{category}"

        # Adjust score based on user reputation
        adjusted_score = max_score * (2.0 - user_reputation)

        # Decision thresholds
        if adjusted_score > 0.9:
            action = "AUTO_REMOVE"
            reason = f"High confidence {max_category}: {adjusted_score:.2f}"
        elif adjusted_score > 0.6:
            action = "HUMAN_REVIEW"
            reason = f"Medium confidence {max_category}: {adjusted_score:.2f}"
        else:
            action = "AUTO_APPROVE"
            reason = f"Low risk score: {adjusted_score:.2f}"

        return ModerationResult(
            action=action,
            reason=reason,
            score=adjusted_score,
            category=max_category
        )
```

## Caching Strategies

```python
# Multi-layer caching for performance
class CacheStrategy:
    """
    Implement multi-layer caching to reduce database load.

    Layers:
    1. Client-side cache (browser/app) - seconds
    2. CDN cache (CloudFront/Cloudflare) - minutes
    3. Redis cache (application) - minutes to hours
    4. Database query cache - hours to days
    """

    async def get_user_feed_cached(self, user_id: str, limit: int = 50):
        """
        Multi-layer cache strategy for feed retrieval.
        """
        # Layer 1: Check Redis cache (hot data, 5 min TTL)
        cache_key = f"feed:{user_id}:v1"
        cached = await redis.get(cache_key)

        if cached:
            metrics.increment('cache.hit.redis')
            return json.loads(cached)

        # Cache miss - generate feed
        metrics.increment('cache.miss.redis')

        # Layer 2: Check if we have pre-computed feed in database
        precomputed = await db.fetchone(
            "SELECT feed_data FROM precomputed_feeds WHERE user_id = $1 AND created_at > NOW() - INTERVAL '15 minutes'",
            user_id
        )

        if precomputed:
            metrics.increment('cache.hit.precomputed')
            feed_data = precomputed['feed_data']
        else:
            # Fully compute feed (expensive)
            metrics.increment('cache.miss.precomputed')
            feed_data = await self.generate_feed(user_id, limit)

            # Store in precomputed table for other processes
            await db.execute(
                "INSERT INTO precomputed_feeds (user_id, feed_data, created_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id) DO UPDATE SET feed_data = $2, created_at = NOW()",
                user_id, json.dumps(feed_data)
            )

        # Store in Redis for fast access
        await redis.setex(cache_key, 300, json.dumps(feed_data))

        return feed_data

    async def invalidate_feed_cache(self, user_id: str):
        """
        Invalidate cache when user creates post or follows someone.

        Cache invalidation strategy:
        - Aggressive: Clear cache immediately (simple, may cause cache stampede)
        - Lazy: Let cache expire naturally (stale data)
        - Smart: Update cache with new data (best UX, complex)
        """
        # Invalidate Redis cache
        await redis.delete(f"feed:{user_id}:v1")

        # Also invalidate followers' caches (they should see new post)
        followers = await self.get_follower_ids(user_id)

        # Use pipeline for efficiency
        pipe = redis.pipeline()
        for follower_id in followers:
            pipe.delete(f"feed:{follower_id}:v1")
        await pipe.execute()

        logger.info(f"Invalidated feed cache for user {user_id} and {len(followers)} followers")
```

## Sharding Strategy

```python
# Database sharding for horizontal scalability
class ShardingStrategy:
    """
    Shard data across multiple databases for scale.

    Why shard:
    - Single database can't handle billions of posts
    - Distribute load across multiple servers
    - Improve query performance by reducing data per shard

    Sharding key: user_id (ensures user's data is colocated)
    """

    def get_shard_for_user(self, user_id: str) -> int:
        """
        Determine which shard (database) to use for a user.

        Strategy: Consistent hashing
        - Distributes users evenly across shards
        - Minimizes data movement when adding shards
        """
        # Hash user_id to integer
        hash_value = int(hashlib.md5(user_id.encode()).hexdigest(), 16)

        # Modulo by number of shards
        shard_id = hash_value % self.num_shards

        return shard_id

    async def query_user_posts(self, user_id: str, limit: int = 50):
        """
        Query posts from appropriate shard.
        """
        shard_id = self.get_shard_for_user(user_id)
        db_connection = self.shard_connections[shard_id]

        posts = await db_connection.fetch(
            "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2",
            user_id, limit
        )

        return posts

    async def query_feed_across_shards(self, user_id: str,
                                      following_ids: List[str],
                                      limit: int = 50):
        """
        Query posts from multiple users (may span shards).

        Challenge: Following list may span multiple shards
        Solution: Scatter-gather pattern
        """
        # Group users by shard
        shard_groups = {}
        for followed_id in following_ids:
            shard_id = self.get_shard_for_user(followed_id)
            if shard_id not in shard_groups:
                shard_groups[shard_id] = []
            shard_groups[shard_id].append(followed_id)

        # Query each shard in parallel
        tasks = []
        for shard_id, user_ids in shard_groups.items():
            task = self.query_posts_from_shard(shard_id, user_ids, limit)
            tasks.append(task)

        # Gather results
        shard_results = await asyncio.gather(*tasks)

        # Merge and sort results
        all_posts = []
        for posts in shard_results:
            all_posts.extend(posts)

        all_posts.sort(key=lambda p: p['created_at'], reverse=True)

        return all_posts[:limit]
```

## Best Practices

### Safety & Security

1. **Input Validation**
   - Sanitize all user-generated content to prevent XSS
   - Limit text length to prevent DoS attacks
   - Validate image/video formats and sizes

2. **Authentication & Authorization**
   - Use JWT tokens with short expiry
   - Implement refresh token rotation
   - Rate limit API endpoints to prevent abuse
   - Validate user permissions for all operations

3. **Content Security**
   - Scan uploads for malware
   - Use Content Security Policy (CSP) headers
   - Implement CORS properly
   - Hash and salt passwords with bcrypt/argon2

```python
# Security example: Rate limiting
from datetime import datetime, timedelta

class RateLimiter:
    """
    Prevent abuse by limiting requests per user.
    """

    async def check_rate_limit(self, user_id: str, action: str) -> bool:
        """
        Check if user has exceeded rate limit.

        Limits:
        - Post creation: 10/hour
        - Comments: 50/hour
        - Likes: 1000/hour
        """
        limits = {
            'post_create': (10, 3600),     # 10 per hour
            'comment_create': (50, 3600),
            'like': (1000, 3600)
        }

        if action not in limits:
            return True  # No limit for this action

        max_count, window = limits[action]

        # Count recent actions
        key = f"ratelimit:{user_id}:{action}"
        count = await redis.incr(key)

        if count == 1:
            # First action in window, set expiry
            await redis.expire(key, window)

        if count > max_count:
            logger.warning(f"Rate limit exceeded: user={user_id}, action={action}, count={count}")
            return False

        return True
```

### Quality Assurance

1. **Testing Strategy**
   ```python
   # Unit tests for feed ranking
   def test_feed_ranking_recency():
       """Test that recent posts rank higher"""
       old_post = create_post(created_at=datetime.now() - timedelta(days=3))
       new_post = create_post(created_at=datetime.now() - timedelta(hours=1))

       ranked = rank_posts([old_post, new_post], user_id="test")

       assert ranked[0]['id'] == new_post['id']

   def test_feed_ranking_engagement():
       """Test that high engagement posts rank higher"""
       low_engagement = create_post(likes=5, comments=1)
       high_engagement = create_post(likes=100, comments=50)

       ranked = rank_posts([low_engagement, high_engagement], user_id="test")

       assert ranked[0]['id'] == high_engagement['id']
   ```

2. **Performance Testing**
   - Load test API endpoints (target: 10k requests/sec)
   - Test database query performance (all queries < 100ms)
   - Monitor memory usage under high concurrency
   - Test cache hit rates (target: > 90%)

3. **Integration Testing**
   - Test end-to-end user flows (signup → post → like → comment)
   - Test real-time features (WebSocket connections)
   - Test event-driven flows (post creation → feed update)

### Logging & Observability

```python
# Structured logging with correlation IDs
import logging
import json
from contextvars import ContextVar

request_id_var = ContextVar('request_id', default=None)

class StructuredLogger:
    """
    Structured logging for better observability.

    Why structured:
    - Machine-readable (can query by fields)
    - Includes context (request ID, user ID, timestamp)
    - Easier to aggregate and analyze
    """

    def __init__(self, service_name: str):
        self.service_name = service_name
        self.logger = logging.getLogger(service_name)

    def info(self, message: str, **kwargs):
        """Log info with structured data"""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': 'INFO',
            'service': self.service_name,
            'request_id': request_id_var.get(),
            'message': message,
            **kwargs
        }
        self.logger.info(json.dumps(log_entry))

    def error(self, message: str, error: Exception = None, **kwargs):
        """Log error with stack trace"""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': 'ERROR',
            'service': self.service_name,
            'request_id': request_id_var.get(),
            'message': message,
            'error_type': type(error).__name__ if error else None,
            'error_message': str(error) if error else None,
            **kwargs
        }
        self.logger.error(json.dumps(log_entry))

# Usage
logger = StructuredLogger('feed-service')

@app.route('/feed')
async def get_feed(request):
    # Set request ID for tracing
    request_id = request.headers.get('X-Request-ID') or str(uuid.uuid4())
    request_id_var.set(request_id)

    user_id = request.user.id

    logger.info('Fetching user feed', user_id=user_id, limit=50)

    start_time = time.time()
    feed = await feed_service.get_user_feed(user_id, limit=50)
    latency = time.time() - start_time

    logger.info(
        'Feed fetched successfully',
        user_id=user_id,
        post_count=len(feed),
        latency_ms=latency * 1000
    )

    return jsonify(feed)
```

## Use Cases Across Industries

### 1. **Corporate Social Network (LinkedIn-style)**
- Focus: Professional networking, job postings, company updates
- Architecture adjustments:
  - Add job matching algorithm
  - Company pages with admin roles
  - Endorsements and recommendations
  - Privacy controls for recruiters

### 2. **Community Forum (Reddit-style)**
- Focus: Topic-based discussions, voting system, subreddits
- Architecture adjustments:
  - Upvote/downvote instead of likes
  - Topic hierarchy (subreddits)
  - Moderator roles and tools
  - Karma/reputation system

### 3. **Video-First Platform (TikTok-style)**
- Focus: Short-form video, recommendation algorithm
- Architecture adjustments:
  - Video transcoding pipeline
  - ML-based video recommendation
  - Enhanced CDN for video delivery
  - Creative editing tools API

### 4. **Enterprise Collaboration (Slack/Teams-style)**
- Focus: Team messaging, channels, integrations
- Architecture adjustments:
  - Workspace/tenant isolation
  - Channel-based organization
  - Bot and integration APIs
  - File sharing and search
  - Compliance and audit logs

## Common Pitfalls

1. **N+1 Query Problem**
   - Problem: Fetching posts then author for each post (1 + N queries)
   - Solution: Use JOIN or batch queries

2. **Cache Stampede**
   - Problem: Many requests hit database when cache expires
   - Solution: Use cache locking or staggered expiry

3. **Hot User Problem**
   - Problem: Celebrity posts cause traffic spike
   - Solution: Additional caching layer for popular content

4. **Feed Consistency**
   - Problem: User sees same post multiple times or misses posts
   - Solution: Cursor-based pagination, not offset

5. **Moderation Lag**
   - Problem: Harmful content visible before moderation
   - Solution: Pre-moderate new user content, real-time scanning

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Feed Load Time | < 500ms | p95 latency |
| Post Creation | < 100ms | p95 latency |
| Real-time Message Delivery | < 50ms | p99 latency |
| API Throughput | 100k requests/sec | Load test |
| Cache Hit Rate | > 90% | Redis metrics |
| Database Query Time | < 100ms | All queries |
| Uptime | 99.9% | Monthly SLA |

## Monitoring & Alerting

```python
# Key metrics to track
metrics = {
    # User engagement
    'daily_active_users': 'Count of unique users per day',
    'monthly_active_users': 'Count of unique users per month',
    'average_session_duration': 'Time users spend on platform',
    'posts_per_user_per_day': 'Content creation rate',

    # System health
    'api_latency_p95': 'API response time (95th percentile)',
    'error_rate': 'Percentage of failed requests',
    'cache_hit_rate': 'Percentage of requests served from cache',
    'database_connection_pool_usage': 'Database connection utilization',

    # Business metrics
    'feed_refresh_rate': 'How often users refresh feed',
    'post_engagement_rate': 'Percentage of posts that get interactions',
    'moderation_queue_size': 'Posts waiting for human review',
    'moderation_accuracy': 'True positive rate of auto-moderation'
}

# Alerts to configure
alerts = {
    'api_latency_high': 'Alert if p95 latency > 1 second for 5 minutes',
    'error_rate_high': 'Alert if error rate > 1% for 2 minutes',
    'database_down': 'Alert immediately if database unreachable',
    'cache_hit_rate_low': 'Alert if cache hit rate < 80% for 10 minutes',
    'moderation_queue_backlog': 'Alert if queue > 10,000 items'
}
```

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Best Architecture** | Microservices + Event-Driven |
| **Primary Database** | PostgreSQL (relational) + Redis (cache) |
| **Message Queue** | Kafka (high throughput) or RabbitMQ (simpler) |
| **CDN** | CloudFront, Cloudflare, or Fastly |
| **Search** | Elasticsearch or Algolia |
| **Real-time** | WebSocket (Socket.io) or Server-Sent Events |
| **Caching Strategy** | Multi-layer (client, CDN, Redis, database) |
| **Sharding Key** | user_id (colocate user data) |
| **Scale Target** | 100M+ users, 1B+ posts |
| **Team Size** | 20-50 engineers (for large platform) |

## Related Topics

- [Microservices Architecture](../../02-architectures/microservices/README.md) - Service decomposition
- [Event-Driven Architecture](../../02-architectures/event-driven/README.md) - Async communication
- [CQRS](../../02-architectures/cqrs/README.md) - Read/write separation
- [Caching Strategies](../../02-architectures/caching/README.md) - Performance optimization
- [Database Patterns](../../02-architectures/database-patterns/README.md) - Sharding and replication
- [Real-time Systems](../../02-architectures/event-driven/README.md#real-time-streaming) - WebSocket patterns
- [Content Delivery](../../07-cloud/aws/README.md#cloudfront) - CDN setup
- [AI/ML Guide](../../09-ai-ml/README.md) - Content moderation models
- [Dating Domain](../dating/README.md) - Similar recommendation challenges

---

**Ready to implement?** Start with the microservices architecture guide, then dive into event-driven patterns for real-time features.
