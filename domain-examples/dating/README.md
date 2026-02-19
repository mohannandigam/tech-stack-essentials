# Dating - Matching Platform

## Overview

Dating app demonstrating user matching algorithms, real-time messaging, and profile management with privacy controls.

## 🎯 Key Use Cases

- **User Profiles**: Create and manage dating profiles
- **Matching Algorithm**: Find compatible users based on preferences
- **Real-time Chat**: Instant messaging between matched users
- **Swipe Interface**: Like/pass on potential matches
- **Safety Features**: Block, report, and verification

## 🏗️ Architecture Pattern

**Primary**: Microservices + Recommendation System  
**Secondary**: Real-time Messaging, Geospatial

## 💻 Quick Example

```python
# Matching algorithm
class MatchingService:
    async def find_matches(self, user_id: str, limit: int = 20):
        user = await self.get_user_profile(user_id)

        # Get user preferences
        prefs = user.preferences

        # Query potential matches with filters
        candidates = await self.db.query('''
            SELECT * FROM users
            WHERE id != $1
              AND gender IN ($2)
              AND age BETWEEN $3 AND $4
              AND ST_DWithin(
                  location::geography,
                  $5::geography,
                  $6  -- max_distance in meters
              )
              AND id NOT IN (
                  SELECT target_id FROM user_interactions
                  WHERE user_id = $1
              )
            LIMIT 100
        ''', user_id, prefs.genders, prefs.age_min, prefs.age_max,
             user.location, prefs.max_distance * 1000)

        # Calculate compatibility scores
        scored = []
        for candidate in candidates:
            score = self.calculate_compatibility(user, candidate)
            scored.append((candidate, score))

        # Sort by score and return top matches
        scored.sort(key=lambda x: x[1], reverse=True)
        return [c for c, s in scored[:limit]]

    def calculate_compatibility(self, user1, user2):
        score = 0.0

        # Interest overlap (0-40 points)
        common_interests = set(user1.interests) & set(user2.interests)
        score += len(common_interests) * 4

        # Age compatibility (0-20 points)
        age_diff = abs(user1.age - user2.age)
        score += max(0, 20 - age_diff)

        # Education level match (0-15 points)
        if user1.education_level == user2.education_level:
            score += 15

        # Activity level match (0-15 points)
        activity_diff = abs(user1.activity_score - user2.activity_score)
        score += max(0, 15 - activity_diff)

        # Profile completeness bonus (0-10 points)
        score += user2.profile_completeness * 10

        return min(score, 100)  # Cap at 100
```

## 💬 Real-Time Chat

```typescript
// WebSocket chat implementation
class ChatService {
  handleConnection(socket: Socket) {
    const userId = socket.user.id;

    // Join user's chat rooms
    socket.on("chat:join", async (matchId) => {
      // Verify match exists
      const match = await this.verifyMatch(userId, matchId);
      if (match) {
        socket.join(`match:${matchId}`);
      }
    });

    // Handle messages
    socket.on("chat:message", async (data) => {
      const { matchId, message } = data;

      // Validate and sanitize
      const sanitized = this.sanitize(message);

      // Store message
      const msg = await this.storeMessage({
        matchId,
        senderId: userId,
        content: sanitized,
        timestamp: new Date(),
      });

      // Send to recipient
      io.to(`match:${matchId}`).emit("chat:message", msg);

      // Send push notification if recipient offline
      await this.sendPushNotification(matchId, userId, sanitized);
    });
  }
}
```

## 🔒 Privacy & Safety

- Profile visibility controls
- Block and report users
- Photo verification
- Message filtering
- Location fuzzing (show approximate, not exact)
- Data deletion (right to be forgotten)

## 📊 Performance Targets

- Match generation: < 1 second
- Message delivery: < 100ms
- Profile load: < 200ms
- Image upload: < 2 seconds

## 🔗 Related Examples

- [Social Media Domain](../social-media/README.md)
- [Real-time Architecture](../../architectures/event-driven/README.md)

---

**Status**: Template ready - Full implementation coming soon
