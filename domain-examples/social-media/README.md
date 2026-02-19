# Social Media - Feed Aggregation Platform

## Overview

A scalable social media platform demonstrating user feeds, content moderation, real-time messaging, and recommendation algorithms.

## 🎯 Key Use Cases

- **User Feeds**: Personalized content aggregation from followers
- **Content Moderation**: AI-powered detection of inappropriate content
- **Real-time Messaging**: Chat between users with presence indicators
- **Notifications**: Push notifications for mentions, likes, comments
- **Recommendation Engine**: Suggest users and content to follow

## 🏗️ Architecture Pattern

**Primary**: Microservices + Event-Driven  
**Secondary**: CQRS, Caching

### Services
- User Service (profiles, followers)
- Post Service (create, edit, delete posts)
- Feed Service (aggregate and rank content)
- Moderation Service (content filtering)
- Notification Service (real-time alerts)
- Search Service (users and content)

## 💡 Key Challenges

- **Scale**: Millions of users, billions of posts
- **Real-time**: Low-latency feed updates
- **Personalization**: Algorithmic feed ranking
- **Content Moderation**: Auto-detect harmful content
- **High Throughput**: Handle traffic spikes

## 💻 Quick Example

```python
# Feed generation with caching
class FeedService:
    async def get_user_feed(self, user_id: str, limit: int = 50):
        # Check cache first
        cached = await self.redis.get(f"feed:{user_id}")
        if cached:
            return json.loads(cached)
        
        # Get user's following list
        following = await self.user_service.get_following(user_id)
        
        # Aggregate posts from followed users
        posts = await self.post_service.get_posts_by_users(
            following,
            limit=limit * 2  # Get more for ranking
        )
        
        # Rank posts by engagement and recency
        ranked = self.rank_posts(posts, user_id)[:limit]
        
        # Cache for 5 minutes
        await self.redis.setex(
            f"feed:{user_id}",
            300,
            json.dumps(ranked)
        )
        
        return ranked
    
    def rank_posts(self, posts, user_id):
        """Rank posts by engagement score"""
        for post in posts:
            # Time decay factor
            hours_old = (datetime.now() - post.created_at).total_seconds() / 3600
            time_factor = 1 / (1 + hours_old)
            
            # Engagement score
            engagement = (
                post.likes * 1.0 +
                post.comments * 2.0 +
                post.shares * 3.0
            )
            
            # Personalization bonus
            personalization = self.get_affinity_score(user_id, post.author_id)
            
            post.score = (engagement * time_factor) + personalization
        
        return sorted(posts, key=lambda p: p.score, reverse=True)
```

## 🚀 Getting Started

```bash
cd domain-examples/social-media
docker-compose up -d

# Create user
curl -X POST http://localhost:3000/api/users \
  -d '{"username": "john_doe", "email": "john@example.com"}'

# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content": "Hello, world!", "images": []}'

# Get feed
curl http://localhost:3000/api/feed \
  -H "Authorization: Bearer $TOKEN"
```

## ⚡ Real-Time Features

```javascript
// WebSocket for real-time updates
io.on('connection', (socket) => {
  const userId = socket.user.id;
  
  // Join user's room
  socket.join(`user:${userId}`);
  
  // Listen for new posts from following
  socket.on('post:created', async (post) => {
    const followers = await getFollowers(post.authorId);
    
    // Notify all followers
    followers.forEach(followerId => {
      io.to(`user:${followerId}`).emit('feed:new-post', post);
    });
  });
  
  // Presence tracking
  socket.on('presence:online', () => {
    redis.sadd('online_users', userId);
    io.emit('presence:update', { userId, status: 'online' });
  });
});
```

## 🤖 Content Moderation

```python
# AI-powered content moderation
class ModerationService:
    async def moderate_content(self, post: Post):
        # Text analysis
        text_score = await self.text_classifier.predict(post.content)
        
        # Image analysis (if images present)
        image_scores = []
        for image_url in post.images:
            score = await self.image_classifier.predict(image_url)
            image_scores.append(score)
        
        # Determine action
        max_score = max([text_score] + image_scores)
        
        if max_score > 0.9:  # High confidence inappropriate
            await self.post_service.delete_post(post.id)
            await self.notify_user(post.author_id, "content_removed")
            return "REMOVED"
        elif max_score > 0.7:  # Medium confidence
            await self.post_service.flag_for_review(post.id)
            return "FLAGGED"
        else:
            return "APPROVED"
```

## 📊 Performance Targets

- Feed load time: < 500ms
- Post creation: < 100ms
- Real-time message delivery: < 50ms
- Throughput: 100,000 requests/second
- Cache hit rate: > 90%

## 🔒 Privacy & Security

- End-to-end encryption for direct messages
- Content privacy settings (public, friends, private)
- Two-factor authentication
- Rate limiting to prevent spam
- GDPR compliance (data export, right to be forgotten)

## 📈 Key Metrics

- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Average session duration
- Post engagement rate
- Feed refresh frequency

## 🔗 Related Examples

- [Dating Domain](../dating/README.md) - Matching algorithms
- [Event-Driven Architecture](../../architectures/event-driven/README.md)
- [Microservices](../../architectures/microservices/README.md)

---

**Status**: Template ready - Full implementation coming soon
