# Dating Platform - Complete Implementation Guide

## What is it?

A dating platform is a digital matchmaking service where users create profiles, discover potential romantic partners based on preferences and compatibility, communicate through chat, and build connections. The system uses algorithms to match users based on location, interests, demographics, and behavior patterns.

## Simple Analogy

Think of a dating app like a **smart introduction service at a massive party**. Instead of randomly walking around hoping to meet someone compatible, you have a personal assistant who knows everyone at the party, understands what you're looking for, and only introduces you to people who might be a good match. The assistant considers location (who's nearby), shared interests (common ground), and mutual attraction (both people interested) before making introductions.

## Why Does It Matter?

Dating platforms solve complex technical and social challenges:

- **Matching Algorithm**: Finding compatible partners from millions of users
- **Geospatial Search**: Efficiently querying nearby users
- **Real-time Chat**: Low-latency messaging between matched users
- **Privacy & Safety**: Protecting user data, preventing harassment
- **Engagement**: Keeping users active with notifications and recommendations
- **Monetization**: Freemium model with premium features

The patterns used here (recommendation systems, geospatial indexing, real-time messaging) apply to many location-based and matching platforms.

## How It Works

### Step-by-Step User Flow

1. **Profile Creation**: User signs up, adds photos, fills profile (interests, bio, preferences)
2. **Preference Setting**: User specifies who they want to meet (age range, distance, gender)
3. **Discovery**: System shows potential matches based on preferences and location
4. **Swiping/Liking**: User likes or passes on profiles
5. **Matching**: When both users like each other, it's a match
6. **Chat**: Matched users can message each other
7. **Ongoing Engagement**: System sends notifications about new matches, messages, profile views

### High-Level Architecture

```
┌──────────────┐
│   Clients    │ (iOS, Android, Web)
│(React Native)│
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│          API Gateway + Load Balancer                 │
│     (Kong/nginx + Rate Limiting + Auth)              │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┴───────────┬────────────┬──────────────┐
       ▼                       ▼            ▼              ▼
┌──────────┐          ┌──────────┐   ┌──────────┐  ┌──────────┐
│  Profile │          │ Matching │   │   Chat   │  │  Photo   │
│ Service  │          │ Service  │   │ Service  │  │ Service  │
└────┬─────┘          └────┬─────┘   └────┬─────┘  └────┬─────┘
     │                     │              │             │
     ▼                     ▼              ▼             ▼
┌──────────┐          ┌──────────┐   ┌──────────┐  ┌──────────┐
│PostgreSQL│          │PostgreSQL│   │ MongoDB  │  │   S3     │
│(Profiles)│          │+ PostGIS │   │(Messages)│  │ (Images) │
└──────────┘          │(Geo Data)│   └──────────┘  └──────────┘
                      └──────────┘
       │                     │              │
       └──────────┬──────────┴──────────────┘
                  ▼
          ┌──────────────┐
          │    Redis     │ (Caching + Sessions + Queues)
          └──────┬───────┘
                 │
                 ▼
          ┌──────────────┐
          │   Kafka      │ (Event Streaming)
          └──────┬───────┘
                 │
    ┌────────────┼─────────────┬─────────────┬──────────────┐
    ▼            ▼             ▼             ▼              ▼
┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐  ┌──────────┐
│Analytics│ │  Email  │ │   Push   │ │   ML     │  │Moderation│
│ Service │ │ Service │ │  Notif   │ │  Model   │  │ Service  │
└─────────┘ └─────────┘ └──────────┘ └──────────┘  └──────────┘
                                           │
                                           ▼
                                     ┌──────────┐
                                     │TensorFlow│
                                     │ Serving  │
                                     └──────────┘
```

## Key Concepts

### 1. **Matching Algorithm**
The core logic that determines which users to show each other. Approaches include:
- **Collaborative Filtering**: "Users similar to you liked these profiles"
- **Content-Based**: Match based on profile attributes (interests, education, etc.)
- **Hybrid**: Combine both approaches for better results
- **Machine Learning**: Learn from user behavior (swipes, messages) to improve matches

### 2. **Geospatial Indexing**
Efficiently finding nearby users using:
- **PostGIS**: PostgreSQL extension for geographic queries
- **Geohashing**: Encode lat/lon into string for efficient range queries
- **R-tree**: Spatial data structure for fast nearest-neighbor search

### 3. **ELO Rating System**
Ranking users by desirability (adapted from chess ratings):
- High-rated users shown more frequently
- Matches between similar ratings preferred
- Rating changes based on mutual interest

### 4. **Privacy Controls**
- **Location Fuzzing**: Show approximate location, not exact
- **Photo Verification**: Confirm users are who they say they are
- **Block/Report**: Users can hide or report others
- **Disappearing Messages**: Optional auto-delete after read

### 5. **Engagement Loops**
Keep users coming back:
- Push notifications for new matches and messages
- "You have X likes" without showing who (paid feature)
- Profile boosts (pay to appear first)
- Daily active users bonus (extra swipes)

## Architecture Patterns Used

### Microservices - Profile Service

```python
# Profile Service - User profile management
class ProfileService:
    """
    Handles user profiles, photos, preferences, and verification.

    Why microservice:
    - Profile data changes independently of matching
    - Photo uploads require different infrastructure
    - Can scale photo storage separately
    - Verification workflow is isolated
    """

    async def create_profile(self, user_id: str, profile_data: Dict) -> Profile:
        """
        Create a new user profile.

        Best Practices:
        - Validate all input fields
        - Require minimum profile completeness for discovery
        - Set default preferences based on demographics
        - Generate profile_id separate from user_id for privacy
        """
        # Validate required fields
        required_fields = ['name', 'date_of_birth', 'gender', 'bio']
        for field in required_fields:
            if field not in profile_data or not profile_data[field]:
                raise ValueError(f"Missing required field: {field}")

        # Calculate age from date of birth
        dob = datetime.strptime(profile_data['date_of_birth'], '%Y-%m-%d')
        age = (datetime.now() - dob).days // 365

        if age < 18:
            raise ValueError("User must be 18 or older")

        # Sanitize bio to prevent XSS
        sanitized_bio = self.sanitize_text(profile_data['bio'])

        # Create profile
        profile_id = str(uuid.uuid4())
        profile = await self.db.fetchone("""
            INSERT INTO profiles (
                id, user_id, name, age, gender, bio,
                interests, education, occupation,
                location, latitude, longitude,
                created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, NOW(), NOW()
            )
            RETURNING *
        """, profile_id, user_id, profile_data['name'], age,
            profile_data['gender'], sanitized_bio,
            profile_data.get('interests', []),
            profile_data.get('education'),
            profile_data.get('occupation'),
            profile_data.get('location'),
            profile_data.get('latitude'),
            profile_data.get('longitude')
        )

        # Create default preferences
        await self.create_default_preferences(profile_id, age, profile_data['gender'])

        logger.info(f"Profile created: {profile_id} for user {user_id}")

        return profile

    async def upload_photo(self, profile_id: str, image_data: bytes,
                          is_primary: bool = False) -> str:
        """
        Upload and process profile photo.

        Best Practices:
        - Validate image format and size
        - Scan for inappropriate content
        - Generate multiple sizes (thumbnail, medium, full)
        - Store in CDN for fast delivery
        - Verify photo matches profile (ML face detection)
        """
        # Validate image
        if len(image_data) > 10 * 1024 * 1024:  # 10MB limit
            raise ValueError("Image size exceeds 10MB limit")

        # Detect image format
        image = Image.open(io.BytesIO(image_data))
        if image.format not in ['JPEG', 'PNG', 'WEBP']:
            raise ValueError(f"Unsupported image format: {image.format}")

        # Moderate image content
        moderation_result = await self.moderation_service.moderate_image(image_data)
        if moderation_result['nsfw_score'] > 0.8:
            raise ValueError("Image contains inappropriate content")

        # Generate multiple sizes
        sizes = {
            'thumbnail': (150, 150),
            'medium': (500, 500),
            'full': (1200, 1200)
        }

        photo_id = str(uuid.uuid4())
        urls = {}

        for size_name, dimensions in sizes.items():
            resized = image.copy()
            resized.thumbnail(dimensions, Image.Resampling.LANCZOS)

            # Upload to S3
            buffer = io.BytesIO()
            resized.save(buffer, format='JPEG', quality=85)
            buffer.seek(0)

            s3_key = f"profiles/{profile_id}/photos/{photo_id}_{size_name}.jpg"
            await self.s3_client.upload_fileobj(
                buffer,
                self.bucket_name,
                s3_key,
                ExtraArgs={'ContentType': 'image/jpeg'}
            )

            urls[size_name] = f"{self.cdn_url}/{s3_key}"

        # Store photo metadata in database
        await self.db.execute("""
            INSERT INTO photos (
                id, profile_id, urls, is_primary,
                moderation_score, created_at
            ) VALUES ($1, $2, $3, $4, $5, NOW())
        """, photo_id, profile_id, json.dumps(urls),
            is_primary, moderation_result['nsfw_score'])

        # If primary photo, update profile
        if is_primary:
            await self.db.execute(
                "UPDATE profiles SET primary_photo_url = $1, updated_at = NOW() WHERE id = $2",
                urls['medium'], profile_id
            )

        logger.info(f"Photo uploaded: {photo_id} for profile {profile_id}")

        return urls['medium']
```

### Matching Service with Geospatial Queries

```python
# Matching Service - Core matching algorithm
class MatchingService:
    """
    Find compatible users based on preferences, location, and ML scoring.

    Why separate service:
    - Complex geospatial queries
    - ML model integration
    - High read volume (can scale independently)
    - Different database optimization needs
    """

    async def find_potential_matches(self, profile_id: str,
                                     limit: int = 20) -> List[Profile]:
        """
        Find potential matches for a user.

        Algorithm:
        1. Get user profile and preferences
        2. Query nearby users matching basic criteria (geo + demographics)
        3. Filter out already seen/liked/matched/blocked users
        4. Score remaining candidates using ML model
        5. Return top N matches

        Best Practices:
        - Use geospatial index for fast proximity search
        - Limit initial query to reasonable pool (e.g., 100 candidates)
        - Cache results to avoid repeated computation
        - Randomize results slightly to avoid filter bubble
        """
        # Get user profile and preferences
        profile = await self.get_profile(profile_id)
        prefs = await self.get_preferences(profile_id)

        cache_key = f"matches:{profile_id}:v1"

        # Check cache first
        cached = await self.redis.get(cache_key)
        if cached:
            logger.info(f"Match cache hit for profile {profile_id}")
            return json.loads(cached)

        # Geospatial query using PostGIS
        # Find users within max distance who match basic criteria
        candidates = await self.db.fetch("""
            SELECT
                p.id, p.name, p.age, p.bio, p.primary_photo_url,
                p.interests, p.education, p.occupation,
                ST_Distance(
                    p.location::geography,
                    ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography
                ) / 1000 AS distance_km
            FROM profiles p
            WHERE p.id != $1
              -- Gender preference match
              AND p.gender = ANY($2)
              -- Age range
              AND p.age BETWEEN $5 AND $6
              -- Within max distance (using spatial index)
              AND ST_DWithin(
                  p.location::geography,
                  ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography,
                  $7 * 1000  -- Convert km to meters
              )
              -- Profile complete enough to show
              AND p.primary_photo_url IS NOT NULL
              AND p.bio IS NOT NULL
              -- Active recently
              AND p.last_active_at > NOW() - INTERVAL '30 days'
              -- Not already interacted with
              AND p.id NOT IN (
                  SELECT target_profile_id FROM swipes
                  WHERE source_profile_id = $1
                  UNION
                  SELECT blocker_id FROM blocks WHERE blocked_id = $1
                  UNION
                  SELECT blocked_id FROM blocks WHERE blocker_id = $1
              )
            ORDER BY
              -- Prioritize nearby users
              distance_km ASC,
              -- Break ties with recent activity
              p.last_active_at DESC
            LIMIT 100  -- Initial pool for scoring
        """, profile_id, prefs['preferred_genders'],
            profile['longitude'], profile['latitude'],
            prefs['age_min'], prefs['age_max'],
            prefs['max_distance_km'])

        if not candidates:
            logger.info(f"No candidates found for profile {profile_id}")
            return []

        # Score candidates using compatibility algorithm
        scored_candidates = []
        for candidate in candidates:
            score = await self.calculate_compatibility_score(profile, candidate)
            candidate['_compatibility_score'] = score
            scored_candidates.append(candidate)

        # Sort by compatibility score
        scored_candidates.sort(key=lambda c: c['_compatibility_score'], reverse=True)

        # Take top matches
        top_matches = scored_candidates[:limit]

        # Add small randomization to top 50% to avoid stagnation
        top_50_pct = len(top_matches) // 2
        if top_50_pct > 1:
            random.shuffle(top_matches[:top_50_pct])

        # Cache for 1 hour
        await self.redis.setex(cache_key, 3600, json.dumps(top_matches, default=str))

        logger.info(
            f"Found {len(top_matches)} matches for profile {profile_id} "
            f"from {len(candidates)} candidates"
        )

        return top_matches

    async def calculate_compatibility_score(self, user: Dict,
                                           candidate: Dict) -> float:
        """
        Calculate compatibility score between two profiles.

        Factors (0-100 scale):
        - Interest overlap (0-30 points)
        - Age compatibility (0-20 points)
        - Education level match (0-15 points)
        - Distance (0-15 points)
        - Activity level (0-10 points)
        - Profile quality (0-10 points)

        Best Practices:
        - Normalize all factors to same scale
        - Weight factors based on data science insights
        - Use ML model for advanced scoring (optional)
        - Log scores for continuous improvement
        """
        score = 0.0

        # 1. Interest overlap (Jaccard similarity)
        user_interests = set(user.get('interests', []))
        candidate_interests = set(candidate.get('interests', []))

        if user_interests and candidate_interests:
            intersection = len(user_interests & candidate_interests)
            union = len(user_interests | candidate_interests)
            interest_score = (intersection / union) * 30
            score += interest_score
        else:
            score += 5  # Small default if interests missing

        # 2. Age compatibility (prefer similar ages)
        age_diff = abs(user['age'] - candidate['age'])
        if age_diff <= 3:
            score += 20
        elif age_diff <= 5:
            score += 15
        elif age_diff <= 10:
            score += 10
        else:
            score += max(0, 10 - age_diff * 0.5)

        # 3. Education level match
        education_levels = {
            'high_school': 1,
            'some_college': 2,
            'bachelors': 3,
            'masters': 4,
            'doctorate': 5
        }

        user_edu = education_levels.get(user.get('education'), 2)
        candidate_edu = education_levels.get(candidate.get('education'), 2)

        edu_diff = abs(user_edu - candidate_edu)
        score += max(0, 15 - edu_diff * 5)

        # 4. Distance (closer is better)
        distance_km = candidate.get('distance_km', 50)
        if distance_km <= 5:
            score += 15
        elif distance_km <= 15:
            score += 12
        elif distance_km <= 30:
            score += 8
        else:
            score += max(0, 8 - (distance_km - 30) * 0.2)

        # 5. Activity level (prefer active users)
        last_active = candidate.get('last_active_at', datetime.now() - timedelta(days=30))
        days_inactive = (datetime.now() - last_active).days

        if days_inactive <= 1:
            score += 10
        elif days_inactive <= 7:
            score += 7
        elif days_inactive <= 14:
            score += 4
        else:
            score += 2

        # 6. Profile quality (completeness)
        quality_score = 0
        if candidate.get('bio') and len(candidate['bio']) > 50:
            quality_score += 3
        if candidate.get('occupation'):
            quality_score += 2
        if candidate.get('education'):
            quality_score += 2
        if len(candidate.get('interests', [])) >= 3:
            quality_score += 3

        score += quality_score

        # Cap at 100
        return min(score, 100.0)
```

### Real-Time Chat Service

```python
# Chat Service - Real-time messaging
class ChatService:
    """
    Handle real-time messaging between matched users.

    Why separate service:
    - Different data store (MongoDB for chat history)
    - WebSocket connections require different scaling
    - Chat has different availability requirements
    - Message storage grows faster than other data
    """

    async def send_message(self, match_id: str, sender_id: str,
                          message: str) -> Message:
        """
        Send a message in a match conversation.

        Best Practices:
        - Validate sender is part of match
        - Sanitize message content
        - Rate limit per user (prevent spam)
        - Store in NoSQL for fast append
        - Push notification to recipient if offline
        - Encrypt messages at rest and in transit
        """
        # Rate limiting check
        rate_limit_ok = await self.check_rate_limit(sender_id, 'send_message')
        if not rate_limit_ok:
            raise RateLimitError("Too many messages sent. Please slow down.")

        # Verify sender is part of this match
        match = await self.get_match(match_id)
        if sender_id not in [match['profile1_id'], match['profile2_id']]:
            raise PermissionError("User not part of this match")

        # Determine recipient
        recipient_id = (
            match['profile1_id'] if sender_id == match['profile2_id']
            else match['profile2_id']
        )

        # Sanitize message
        if len(message.strip()) == 0:
            raise ValueError("Message cannot be empty")

        if len(message) > 1000:
            raise ValueError("Message too long (max 1000 characters)")

        sanitized = self.sanitize_text(message)

        # Create message
        message_id = str(uuid.uuid4())
        message_doc = {
            '_id': message_id,
            'match_id': match_id,
            'sender_id': sender_id,
            'recipient_id': recipient_id,
            'content': sanitized,
            'created_at': datetime.utcnow(),
            'read_at': None,
            'deleted': False
        }

        # Store in MongoDB
        await self.mongo_collection.insert_one(message_doc)

        # Update match last message timestamp
        await self.db.execute(
            "UPDATE matches SET last_message_at = NOW() WHERE id = $1",
            match_id
        )

        # Publish to WebSocket if recipient online
        await self.publish_to_websocket(recipient_id, {
            'type': 'new_message',
            'message': message_doc
        })

        # Send push notification if recipient offline
        is_online = await self.redis.sismember('online_users', recipient_id)
        if not is_online:
            await self.send_push_notification(
                recipient_id,
                title=f"New message from {match['sender_name']}",
                body=sanitized[:50] + ('...' if len(sanitized) > 50 else ''),
                data={'match_id': match_id}
            )

        logger.info(
            f"Message sent: {message_id} in match {match_id}",
            sender_id=sender_id,
            recipient_id=recipient_id,
            length=len(sanitized)
        )

        return message_doc

    async def mark_messages_as_read(self, match_id: str,
                                    reader_id: str) -> int:
        """
        Mark all unread messages in a match as read.

        Best Practices:
        - Only update messages sent to this user
        - Return count of messages marked
        - Emit read receipt event
        - Update match unread count
        """
        result = await self.mongo_collection.update_many(
            {
                'match_id': match_id,
                'recipient_id': reader_id,
                'read_at': None,
                'deleted': False
            },
            {
                '$set': {'read_at': datetime.utcnow()}
            }
        )

        count = result.modified_count

        if count > 0:
            # Emit read receipt to sender
            # (Get last message sender)
            last_message = await self.mongo_collection.find_one(
                {
                    'match_id': match_id,
                    'recipient_id': reader_id,
                    'deleted': False
                },
                sort=[('created_at', -1)]
            )

            if last_message:
                await self.publish_to_websocket(last_message['sender_id'], {
                    'type': 'messages_read',
                    'match_id': match_id,
                    'count': count
                })

        logger.info(
            f"Marked {count} messages as read in match {match_id}",
            reader_id=reader_id
        )

        return count
```

## Data Models

### Profile Schema

```sql
-- Profiles table
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    -- Basic info
    name VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    bio TEXT,

    -- Photos
    primary_photo_url TEXT,
    photo_count INTEGER DEFAULT 0,

    -- Details
    interests TEXT[],
    education VARCHAR(50),
    occupation VARCHAR(100),
    height_cm INTEGER,
    religion VARCHAR(50),
    political_views VARCHAR(50),

    -- Location (PostGIS)
    location GEOGRAPHY(POINT, 4326),  -- Lat/lon
    city VARCHAR(100),
    country VARCHAR(2),  -- ISO code

    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verification_photo_url TEXT,

    -- Stats
    elo_rating INTEGER DEFAULT 1000,
    profile_views INTEGER DEFAULT 0,
    likes_received INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP,

    CONSTRAINT age_valid CHECK (age >= 18 AND age <= 100)
);

-- Spatial index for location queries (critical for performance)
CREATE INDEX idx_profiles_location ON profiles USING GIST(location);

-- Other indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_last_active ON profiles(last_active_at DESC);
CREATE INDEX idx_profiles_elo ON profiles(elo_rating DESC);
```

### Preferences Schema

```sql
-- User preferences for matching
CREATE TABLE preferences (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,

    -- Who they want to see
    preferred_genders TEXT[] NOT NULL,
    age_min INTEGER NOT NULL,
    age_max INTEGER NOT NULL,
    max_distance_km INTEGER DEFAULT 50,

    -- Optional filters
    min_height_cm INTEGER,
    max_height_cm INTEGER,
    required_education VARCHAR(50)[],
    deal_breakers TEXT[],

    -- Display settings
    show_me BOOLEAN DEFAULT TRUE,  -- Appear in discovery
    show_distance BOOLEAN DEFAULT TRUE,
    show_age BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT age_range_valid CHECK (age_min >= 18 AND age_max <= 100 AND age_min <= age_max),
    CONSTRAINT distance_valid CHECK (max_distance_km > 0 AND max_distance_km <= 500)
);
```

### Swipes and Matches Schema

```sql
-- Swipe actions
CREATE TABLE swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action VARCHAR(10) NOT NULL,  -- 'like' or 'pass'
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    UNIQUE(source_profile_id, target_profile_id)
);

CREATE INDEX idx_swipes_source ON swipes(source_profile_id);
CREATE INDEX idx_swipes_target ON swipes(target_profile_id);
CREATE INDEX idx_swipes_action ON swipes(action);

-- Matches (mutual likes)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    profile2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Match metadata
    matched_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMP,
    unmatched_at TIMESTAMP,
    unmatched_by UUID REFERENCES profiles(id),

    -- Chat stats
    message_count INTEGER DEFAULT 0,

    UNIQUE(profile1_id, profile2_id),
    CONSTRAINT different_profiles CHECK (profile1_id != profile2_id)
);

CREATE INDEX idx_matches_profile1 ON matches(profile1_id);
CREATE INDEX idx_matches_profile2 ON matches(profile2_id);
CREATE INDEX idx_matches_matched_at ON matches(matched_at DESC);
```

### MongoDB Chat Messages Schema

```javascript
// MongoDB collection for chat messages
{
  _id: "uuid",
  match_id: "uuid",
  sender_id: "uuid",
  recipient_id: "uuid",
  content: "text message",
  message_type: "text",  // text, image, gif
  created_at: ISODate("2024-01-01T00:00:00Z"),
  read_at: ISODate("2024-01-01T00:05:00Z"),  // null if unread
  deleted: false,

  // For media messages
  media_url: "https://cdn.example.com/...",
  media_thumbnail_url: "https://cdn.example.com/..."
}

// Indexes
db.messages.createIndex({ match_id: 1, created_at: -1 });
db.messages.createIndex({ recipient_id: 1, read_at: 1 });
db.messages.createIndex({ created_at: 1 }, { expireAfterSeconds: 7776000 });  // 90 days TTL
```

## Geospatial Search Optimization

### PostGIS Geospatial Queries

```sql
-- Find users within radius using spatial index
SELECT
    p.id,
    p.name,
    p.age,
    ST_Distance(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)::geography  -- San Francisco
    ) / 1000 AS distance_km
FROM profiles p
WHERE ST_DWithin(
    p.location::geography,
    ST_SetSRID(ST_MakePoint(-122.4194, 37.7749), 4326)::geography,
    50000  -- 50km in meters
)
ORDER BY distance_km
LIMIT 20;

-- Find users within bounding box (faster for rectangular areas)
SELECT *
FROM profiles
WHERE location && ST_MakeEnvelope(-122.5, 37.7, -122.3, 37.9, 4326);
```

### Geohashing Alternative

```python
# Geohashing for approximate location matching
import geohash

class GeohashSearch:
    """
    Use geohashing for fast approximate location search.

    Advantages:
    - Faster than PostGIS for large datasets
    - Can use regular B-tree index
    - Works well with Redis for caching

    Disadvantages:
    - Less accurate at geohash boundaries
    - Requires multiple geohash searches for radius
    """

    def encode_location(self, latitude: float, longitude: float,
                       precision: int = 7) -> str:
        """
        Encode lat/lon to geohash string.

        Precision levels:
        - 5: ~5km
        - 6: ~1.2km
        - 7: ~150m
        - 8: ~40m
        """
        return geohash.encode(latitude, longitude, precision)

    def find_nearby_users(self, latitude: float, longitude: float,
                          radius_km: int = 50) -> List[str]:
        """
        Find users near location using geohash.

        Strategy:
        1. Get geohash of center point
        2. Get neighboring geohashes
        3. Query all geohashes
        4. Filter by exact distance
        """
        # Get center geohash
        center_hash = self.encode_location(latitude, longitude, precision=6)

        # Get neighboring geohashes (9 total including center)
        neighbors = geohash.neighbors(center_hash)
        all_hashes = [center_hash] + list(neighbors.values())

        # Query users in these geohashes
        candidates = await self.db.fetch("""
            SELECT id, latitude, longitude
            FROM profiles
            WHERE geohash_6 = ANY($1)
        """, all_hashes)

        # Filter by exact distance
        nearby = []
        for candidate in candidates:
            dist_km = self.calculate_distance(
                latitude, longitude,
                candidate['latitude'], candidate['longitude']
            )

            if dist_km <= radius_km:
                nearby.append(candidate)

        return nearby
```

## ML-Based Matching

```python
# Machine Learning for match prediction
class MLMatchingModel:
    """
    Use ML to predict match likelihood.

    Approach:
    - Train on historical swipe data
    - Features: profile attributes + behavior patterns
    - Target: Whether swipe resulted in match

    Why ML:
    - Captures complex non-linear patterns
    - Learns from user behavior (not just rules)
    - Improves over time with more data
    - Personalizes for each user
    """

    def prepare_features(self, user: Dict, candidate: Dict,
                        user_history: Dict) -> np.array:
        """
        Extract features for ML model.

        Feature categories:
        1. Demographic similarity
        2. Interest overlap
        3. User behavior patterns
        4. Candidate popularity
        5. Temporal features
        """
        features = []

        # 1. Demographics
        features.extend([
            abs(user['age'] - candidate['age']),
            candidate['distance_km'],
            1 if user['education'] == candidate['education'] else 0,
            1 if user['religion'] == candidate['religion'] else 0
        ])

        # 2. Interests (Jaccard similarity)
        interest_overlap = len(
            set(user['interests']) & set(candidate['interests'])
        ) / len(set(user['interests']) | set(candidate['interests']))
        features.append(interest_overlap)

        # 3. User behavior
        features.extend([
            user_history['like_rate'],  # % of profiles liked
            user_history['match_rate'],  # % of likes that matched
            user_history['message_rate'],  # % of matches messaged
            user_history['avg_swipes_per_day']
        ])

        # 4. Candidate popularity
        features.extend([
            candidate['likes_received'] / max(candidate['profile_views'], 1),
            candidate['elo_rating'] / 2000.0,  # Normalize
            candidate['match_rate']
        ])

        # 5. Temporal
        hour_of_day = datetime.now().hour
        day_of_week = datetime.now().weekday()
        features.extend([
            math.sin(2 * math.pi * hour_of_day / 24),  # Cyclical encoding
            math.cos(2 * math.pi * hour_of_day / 24),
            math.sin(2 * math.pi * day_of_week / 7),
            math.cos(2 * math.pi * day_of_week / 7)
        ])

        return np.array(features)

    def predict_match_probability(self, user: Dict,
                                  candidate: Dict) -> float:
        """
        Predict likelihood of mutual match.

        Returns: Probability 0-1
        """
        # Get user history
        user_history = await self.get_user_behavior(user['id'])

        # Prepare features
        features = self.prepare_features(user, candidate, user_history)

        # Predict using trained model
        probability = self.model.predict_proba([features])[0][1]

        return probability
```

## Best Practices

### Safety & Security

1. **User Verification**
   ```python
   # Photo verification using face recognition
   async def verify_user_photo(self, profile_id: str,
                                verification_photo: bytes) -> bool:
       """
       Verify user photo matches profile photos.

       Process:
       1. Detect face in verification photo
       2. Compare with face in profile photos
       3. Check for liveness (not a photo of photo)
       4. Approve if similarity > threshold
       """
       # Get profile photos
       profile_photos = await self.get_profile_photos(profile_id)

       # Detect faces
       verification_face = await self.detect_face(verification_photo)
       if not verification_face:
           return False

       # Compare with each profile photo
       for profile_photo_url in profile_photos:
           profile_photo = await self.download_image(profile_photo_url)
           profile_face = await self.detect_face(profile_photo)

           if profile_face:
               similarity = self.compare_faces(verification_face, profile_face)

               if similarity > 0.85:  # 85% threshold
                   # Mark as verified
                   await self.db.execute(
                       "UPDATE profiles SET verified = TRUE WHERE id = $1",
                       profile_id
                   )
                   return True

       return False
   ```

2. **Privacy Controls**
   - Location fuzzing (show approximate, not exact)
   - Optional incognito mode (only show to people you like)
   - Block and report functionality
   - Photo privacy controls

3. **Content Moderation**
   - AI screening of profile photos
   - Text moderation for bios and messages
   - User reporting system
   - Human review queue for flagged content

### Quality Assurance

1. **Testing Strategy**
   ```python
   # Unit tests for matching algorithm
   def test_matching_respects_distance_preference():
       """Test that matches respect user distance preference"""
       user = create_test_profile(lat=37.7749, lon=-122.4194, max_distance=25)
       far_candidate = create_test_profile(lat=37.3382, lon=-121.8863)  # San Jose, 70km away

       matches = find_matches(user['id'])

       assert far_candidate['id'] not in [m['id'] for m in matches]

   def test_matching_respects_age_preference():
       """Test that matches respect age preferences"""
       user = create_test_profile(age=30, age_min=25, age_max=35)
       too_young = create_test_profile(age=22)
       too_old = create_test_profile(age=40)

       matches = find_matches(user['id'])

       match_ids = [m['id'] for m in matches]
       assert too_young['id'] not in match_ids
       assert too_old['id'] not in match_ids
   ```

2. **A/B Testing**
   - Test matching algorithm variations
   - Test UI/UX changes
   - Track conversion metrics (swipe → match → message)

### Logging & Observability

```python
# Structured logging for matching events
logger.info(
    "Match generated",
    user_id=user_id,
    match_count=len(matches),
    query_time_ms=query_time * 1000,
    cache_hit=cache_hit,
    filters={
        'age_range': f"{prefs['age_min']}-{prefs['age_max']}",
        'max_distance_km': prefs['max_distance_km'],
        'genders': prefs['preferred_genders']
    }
)

# Track key metrics
metrics.increment('matches.generated', tags=['user_id', 'platform'])
metrics.histogram('matches.query_time', query_time, tags=['cache_hit'])
metrics.gauge('matches.pool_size', len(candidates))
```

## Common Pitfalls

1. **Geospatial Query Performance**
   - Problem: Slow queries without spatial index
   - Solution: Create GIST index on location column

2. **Match Staleness**
   - Problem: Showing same profiles repeatedly
   - Solution: Track shown profiles, add randomization, refresh pool

3. **Ghost Users**
   - Problem: Inactive users clog discovery
   - Solution: Filter by last_active_at, lower inactive user priority

4. **Location Privacy**
   - Problem: Exact location reveals home/work
   - Solution: Fuzzing, only show approximate distance

5. **Message Spam**
   - Problem: Users spam messages
   - Solution: Rate limiting, require mutual match before messaging

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Match Query Time | < 500ms | p95 latency |
| Message Delivery | < 100ms | p99 latency |
| Profile Load Time | < 300ms | p95 latency |
| Photo Upload Time | < 2s | p95 latency |
| WebSocket Latency | < 50ms | Round-trip time |
| Geospatial Query | < 200ms | With spatial index |
| Cache Hit Rate | > 85% | Redis metrics |

## Use Cases Across Industries

### 1. **Professional Networking (LinkedIn-style)**
- Adapt matching for career connections
- Focus on industry, skills, mutual connections
- Remove romantic context

### 2. **Roommate Matching**
- Match based on lifestyle, cleanliness, budget
- Add housing preferences (location, type, move-in date)
- Verification and background checks

### 3. **Friendship Platform (Bumble BFF-style)**
- Platonic connections only
- Match based on shared interests, activities
- Group matching (find activity partners)

### 4. **Pet Adoption**
- Match pets with adopters
- Preferences: species, breed, age, energy level
- Location-based (shelter proximity)

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Best Architecture** | Microservices + Geospatial DB |
| **Primary Database** | PostgreSQL with PostGIS |
| **Cache** | Redis (matches, sessions) |
| **Chat Storage** | MongoDB (flexible schema) |
| **Image Storage** | S3 + CloudFront CDN |
| **Real-time** | WebSocket (Socket.io) |
| **ML Platform** | TensorFlow/PyTorch for matching |
| **Geospatial Index** | PostGIS GIST index |
| **Scale Target** | 10M+ users, 1B+ matches |
| **Team Size** | 15-30 engineers |

## 🎓 Expert Knowledge

### How Tinder's ELO / Gale-Shapley Algorithm Works

**The ELO System (Tinder's original approach)**:

Borrowed from chess, where every player has a numeric rating. In dating:

1. Every user starts with a base score (say 1000)
2. When a high-rated user swipes right on you, your score increases more than if a low-rated user does
3. When a high-rated user swipes left on you, your score decreases more
4. The system shows you profiles with similar ELO scores — the idea being that mutual interest is more likely between people of similar "desirability"

**Why Tinder moved away from pure ELO**: It created a rigid hierarchy. Users who got cold-started with low scores were trapped. Tinder now uses a more complex ML-based system they do not fully disclose, but the principle remains — behavioral signals (who swipes on you, who you match with) feed the ranking.

**The Gale-Shapley Algorithm (Stable Matching)**:

Originally designed to match medical residents to hospitals. The algorithm guarantees a "stable" matching — no two people would prefer to switch to each other over their current matches.

Think of it like a school dance:
1. In round 1, every person "proposes" to their top choice
2. Each person receiving proposals keeps their favorite and rejects the rest
3. Rejected people propose to their next choice
4. Repeat until everyone is matched

Hinge uses a variant of this — their "Most Compatible" feature runs a modified Gale-Shapley to find pairs most likely to mutually match, then surfaces them once per day.

### Two-Sided Marketplace Dynamics

**Simple analogy**: A dating app is like a farmer's market. Farmers (supply) want customers (demand), and customers want farmers. The market operator (the app) must:

- **Attract both sides**: If there are no farmers, customers leave. If there are no customers, farmers leave. This is the "chicken-and-egg" problem every marketplace faces.
- **Balance the ratio**: Too many of one gender on a heterosexual app means the minority group gets overwhelmed with attention while the majority gets ignored. This drives churn on both sides for different reasons.
- **Manage quality**: If the market fills with low-quality produce (fake profiles, inactive users), buyers stop coming. Trust is the marketplace's most valuable asset.

**Key metrics for marketplace health**:
- **Liquidity**: The probability that a user finds a match. If liquidity is low, users leave.
- **Supply/demand ratio**: Ideally 1:1 for heterosexual apps. Deviations create experience problems.
- **Time to first match**: How quickly a new user gets their first match. This is the most critical onboarding metric.
- **Match-to-conversation rate**: Are matches leading to conversations? If not, the matching algorithm is not finding truly compatible pairs.

### Psychology of Swiping

**Paradox of Choice**: Research by psychologist Barry Schwartz shows that more options lead to less satisfaction. On a dating app with millions of users, this manifests as:
- Users swipe through hundreds of profiles without committing to conversations
- The "grass is always greener" effect — why settle when there might be someone better one swipe away?
- Decision fatigue — after too many swipes, users default to snap judgments based on photos alone

**Decision Fatigue**: Studies show swiping behavior changes throughout a session:
- Early swipes: More selective, more time spent per profile
- Late swipes: Less selective (swipe right on everyone) or completely disengaged (swipe left on everyone)
- Design response: Apps limit daily swipes (both to combat fatigue and drive monetization)

**The Dopamine Loop**: The variable reward of "will this be a match?" triggers the same dopamine response as slot machines. This is what makes the swiping gesture so addictive — and why app designers must balance engagement with user wellbeing.

### How Hinge's "Most Compatible" Uses ML

Hinge's system works in three stages:

1. **Preference Learning**: The model learns your preferences not just from stated filters (age, distance) but from behavioral signals — who you like, who you skip, how long you spend on a profile, what prompt answers you engage with.

2. **Collaborative Filtering**: "Users with similar taste to you also liked these profiles." This surfaces profiles you would not have found through basic filters alone.

3. **Stable Matching (Gale-Shapley variant)**: Once the model knows who you would like, it also knows who would like you. The "Most Compatible" feature pairs two users where both sides have a high predicted likelihood of mutual interest. This is shown as a single daily recommendation — scarcity makes users take it seriously.

### Photo Scoring and Attractiveness Prediction — Ethics

Some platforms use ML to score profile photos for attractiveness or quality. This raises serious ethical questions:

- **Bias**: Models trained on historical data inherit societal biases about attractiveness (racial bias, body type bias, age bias). A model that learns "users swipe right more on [group X]" will surface [group X] more, creating a feedback loop.
- **Transparency**: Users are rarely told their photos are being scored. They experience the effects (more or fewer matches) without understanding why.
- **Alternative approach**: Instead of scoring attractiveness, some platforms score photo quality (lighting, resolution, face visible) — which improves the experience without making subjective judgments about people.
- **Best practice**: If using photo scoring, audit the model for demographic bias, disclose the practice in terms of service, and allow users to opt out.

### Fake Profile Detection

Fake profiles (bots, catfish, scammers) are the biggest threat to trust. Detection uses multiple signals:

1. **Photo Analysis**: Reverse image search against known stock photos, GAN-generated face detection (AI-generated faces have subtle artifacts), metadata analysis (was the photo taken recently or is it years old?)

2. **Behavioral Analysis**: Real users browse and swipe at human speeds. Bots exhibit patterns:
   - Unnaturally fast swiping (100+ right-swipes per minute)
   - Identical message templates sent to every match
   - Immediate request to move conversation to external platform
   - Login from data center IP addresses instead of residential/mobile

3. **Network Analysis**: Fake accounts often share creation patterns — registered at similar times, from similar IP ranges, with similar profile structures. Graph analysis can identify clusters.

4. **Verification**: Phone number verification (each number can only create one account), photo verification (take a selfie matching a pose), ID verification (for premium features)

### Trust & Safety at Scale

How major platforms handle reports and safety:

- **Report Pipeline**: User reports flow through automated triage (ML classifies severity) → urgent cases (threats, minors) escalated to humans immediately → non-urgent cases queued for review → action taken (warning, suspension, ban)
- **Volume**: Tinder processes ~100,000 reports per day. At that scale, ML-assisted moderation is not optional — it is essential.
- **False Positive Problem**: Aggressive moderation catches bad actors but also bans legitimate users. Most platforms err slightly toward caution (let some bad actors through rather than ban good users).
- **Appeals Process**: Every platform needs an appeals process. ML makes mistakes. Humans make mistakes. The system must be correctable.
- **Proactive Detection**: The best safety systems do not wait for reports. They proactively scan for dangerous behavior patterns (underage users lying about age, known sex offender profiles, sextortion patterns).

## 💰 Monetization Deep Dive

### Freemium Conversion Funnel

Dating apps follow a specific monetization pattern — give enough value for free to build the habit, then charge for features that accelerate the experience:

```
Free Users (100%)
    │
    ├── Engaged Free Users (40%)    ← Use daily, see value
    │       │
    │       ├── Hit a Friction Point (25%)   ← "I'm out of likes" / "Who liked me?"
    │       │       │
    │       │       └── Convert to Paid (5-10%)   ← Purchase subscription
    │       │
    │       └── Continue Free (15%)   ← Satisfied with free tier
    │
    └── Churned Free Users (60%)    ← Never engaged enough
```

**The key insight**: The free tier must be good enough to demonstrate value but limited enough to create desire for more. If the free tier is too good, nobody pays. If it is too restrictive, users leave.

### Feature Gating Strategies

| Feature | Free | Plus ($) | Gold ($$) | Platinum ($$$) |
|---------|------|----------|-----------|----------------|
| Daily Swipes | Limited (100) | Unlimited | Unlimited | Unlimited |
| See Who Likes You | Hidden (blur) | Hidden | Full access | Full access |
| Super Like | 1/week | 5/week | 5/week | 5/week + priority |
| Boost (top of deck) | None | 1/month | 1/week | 1/week |
| Passport (change location) | No | Yes | Yes | Yes |
| Rewind (undo swipe) | No | Yes | Yes | Yes |
| Message Before Match | No | No | No | Yes |
| Priority Likes | No | No | No | Yes |

### Subscription Tiers and Pricing Psychology

- **Anchoring**: Show the most expensive tier first. When users see Platinum at $40/month, Gold at $25/month looks like a deal.
- **Monthly vs. Annual**: Offer 6-month and 12-month plans at steep discounts (50-60% off monthly price). Users perceive savings even though they are committing to a longer period.
- **Age-based pricing**: Tinder famously charges users over 30 more than users under 30. The reasoning: younger users have less disposable income, and price sensitivity varies by age.
- **Regional pricing**: A subscription in India costs 1/5th what it costs in the US. Purchasing power parity.
- **Free trials**: 7-day free trial of Gold converts at ~15%. Users experience premium features and develop attachment (loss aversion drives conversion).

### Revenue Metrics

| Metric | Definition | Healthy Target |
|--------|-----------|----------------|
| **ARPU** (Average Revenue Per User) | Total revenue / Total users | $0.50-2.00/month |
| **ARPPU** (Average Revenue Per Paying User) | Revenue / Paying users | $15-25/month |
| **LTV** (Lifetime Value) | Average revenue per user over their entire time on platform | $50-200 |
| **CAC** (Customer Acquisition Cost) | Marketing spend / New users acquired | $2-10 |
| **LTV:CAC Ratio** | LTV / CAC | > 3:1 for viability |
| **Churn Rate** | % of paying users who cancel per month | 5-10% (monthly) |
| **Conversion Rate** | % of free users who become paid | 5-15% |
| **Paywall Interaction Rate** | % of users who see a paywall prompt | 30-50% |

## 🏗️ Scale Challenges

### Handling 2B+ Swipes Per Day (Tinder Scale)

Tinder processes over 2 billion swipes per day. Here is how this works at scale:

1. **Swipe Storage**: Each swipe is a small write (user_id, target_id, action, timestamp). At 2B/day, that is ~23,000 writes/second sustained, with peaks 3-5x higher during evening hours. Solution: Write-optimized stores (Cassandra, DynamoDB) with time-series partitioning.

2. **Match Detection**: Every right-swipe triggers a check: "Did this person already swipe right on me?" This requires a fast lookup. Solution: Store recent right-swipes in Redis as a set per user. Check is O(1). Match detection runs in < 1ms.

3. **Discovery Feed Generation**: Pre-compute discovery feeds in batches during off-peak hours. When a user opens the app, they get a pre-computed feed from cache. New swipes invalidate portions of the feed. This avoids running expensive geospatial + ML queries on every app open.

4. **Event Pipeline**: Every swipe, match, message, and profile view flows through Kafka to analytics, ML training pipelines, and notification services. The event pipeline handles 50,000+ events/second.

### The Hot-Spot Problem in Dense Cities

In Manhattan, 500,000+ active users may be within a 5km radius. This creates:

- **Query overload**: A single user's discovery query returns too many candidates. Fetching 100 candidates from 500K is fine — but the WHERE clause filters (age, gender, not-already-seen) must evaluate against all 500K rows.
- **Solution 1: Shard by geohash**: Split the database into geographic partitions. Manhattan gets its own shard (or multiple shards). This localizes queries.
- **Solution 2: Pre-filtered candidate pools**: Batch job creates pre-filtered pools (e.g., "women aged 25-30 in Manhattan") in Redis. Discovery queries read from pools instead of the main database.
- **Solution 3: Progressive loading**: Show the nearest 20 profiles first, then progressively load more as the user swipes. Do not pre-compute the full candidate list.

### Cross-Region Matching for Travel Mode

"Passport" or "Travel Mode" lets users match in a different city before they arrive. Engineering challenges:

- **Multi-region data**: User profiles live in the region where they signed up. Travel mode queries must reach across regions. Solution: Read replicas in each region, or a global profile index with minimal data (just enough for discovery).
- **Latency**: A user in New York swiping in Tokyo adds 200ms of network latency per query. Solution: Replicate the Tokyo candidate pool to a CDN or cache layer accessible from New York.
- **Consistency**: When a Tokyo user swipes right on a New York traveler, the match must be detected. Solution: A global match-detection service (or cross-region event propagation via Kafka MirrorMaker) that ensures swipe data is eventually consistent across regions.
- **Fraud prevention**: Travel mode is sometimes abused for spam (bots "travel" to every city). Solution: Rate-limit location changes, require account age > 7 days for Travel Mode, flag accounts that change location more than 3x/day.

## 🚀 Building a Dating App — What You Must Know

This section is written for someone founding a dating app or joining one as an engineer. It covers the decisions, trade-offs, and operational knowledge that documentation and tutorials skip.

### Tech Stack Decision Guide

Choosing the right stack for a dating app is heavily influenced by two unique requirements: **geospatial queries** (every user has a location, every query is location-bounded) and **real-time communication** (chat, notifications, presence). Here's what works and why:

| Layer | Recommended | Alternative | Why |
|-------|------------|-------------|-----|
| **Backend API** | FastAPI (Python) | Django REST Framework | FastAPI: async-native, handles WebSocket + HTTP in one process. Django: better if you need admin panel, ORM batteries |
| **Real-time** | WebSocket via FastAPI or Node.js | Firebase Realtime DB | WebSocket gives full control over presence, typing indicators, read receipts. Firebase is faster to prototype but expensive at scale |
| **Mobile** | React Native | Flutter | React Native: larger talent pool, share logic with web app. Flutter: better performance, single codebase compiles to truly native |
| **Primary DB** | PostgreSQL + PostGIS | — | **Non-negotiable** for geospatial. PostGIS adds `ST_DWithin`, spatial indexes, and distance calculations. No other relational DB matches it |
| **Chat DB** | MongoDB or ScyllaDB | Cassandra | Chat is append-heavy, schema-flexible. MongoDB is simpler. ScyllaDB for >10M MAU chat volume |
| **Cache/Queue** | Redis | Memcached | Redis: sessions, match cache, rate limiting, pub/sub for presence, sorted sets for leaderboards. It does everything |
| **Event Streaming** | Kafka | RabbitMQ | Kafka: durable log for event pipeline (swipes, matches, analytics). RabbitMQ: simpler, fine under 10K events/sec |
| **ML Serving** | TensorFlow Serving or BentoML | Custom Flask API | Dedicated serving infra handles batching, versioning, A/B models. Custom API works for v1 |
| **Feature Store** | Feast | Tecton | Feast: open-source, good enough for most. Tecton: managed, better for real-time features at scale |
| **Monitoring** | Datadog or Prometheus+Grafana | New Relic | Datadog: all-in-one SaaS, fast setup. Prometheus+Grafana: free, self-hosted, more customizable |
| **CDN (photos)** | CloudFront + S3 | Cloudflare R2 | Photos are 80%+ of bandwidth. CDN is non-negotiable. Cloudflare R2 has zero egress fees |

### Authentication & Onboarding Flow

Onboarding is where you win or lose 40-60% of signups. Every extra step costs you users. Every skipped safety step costs you trust.

**Authentication options**:
- **Apple Sign-In**: Required by Apple if you offer any social login on iOS. Fast, privacy-friendly (users can hide email).
- **Google Sign-In**: Highest conversion on Android. Use Google Identity Services SDK.
- **Phone number (SMS)**: Use Twilio Verify or Firebase Auth. Reduces fake accounts. Required as a second factor for safety.
- **Facebook Login**: Declining in popularity with younger demographics but still valuable for importing photos and mutual friends.

**Progressive profile completion**:

Don't require a complete profile before showing the app. Let users in fast, then nudge them to complete their profile over the first few sessions.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Sign Up │───▶│  Phone   │───▶│  Name +  │───▶│ 1 Photo  │───▶│ Discovery│
│  (OAuth) │    │  Verify  │    │  Birthday │    │ (min)    │    │   Feed   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │                                                               │
     │              ◀──── Nudges over next 3 sessions ────▶          │
     │                                                               │
     │          "Profiles with 3+ photos get 70% more matches"       │
     │          "Add your job title — it's the #2 thing people look at"│
     │          "Write a bio — profiles with bios get 3x more likes"  │
     │                                                               │
     └───────── Completion reward: free "Boost" at 100% profile ─────┘
```

**Photo guidance prompts**: Don't just say "upload a photo." Guide users:
- "Show your face clearly — no sunglasses, no group shots for photo 1"
- "Add a full-body photo — it increases matches by 40%"
- "Show a hobby or interest — give people something to talk about"
- AI photo quality scoring: reject blurry, too-dark, or duplicate photos automatically

### The Cold Start Problem

A dating app with no users is useless. Unlike most apps, dating apps have a **chicken-and-egg problem**: people won't join unless there are already people to match with.

**How Tinder actually launched** (2012):
1. Co-founder Whitney Wolfe went to sorority chapters at USC and got sisters to install the app
2. Then went to the brother fraternities: "All the girls at [sorority] are already on it"
3. Threw parties that required showing the app at the door
4. Result: dense, young, socially connected user base in a tight geography
5. Repeated this campus by campus before going national

**Seeding strategies that work**:
- **Invite social graph**: Import contacts (with permission) and show "X friends are already here"
- **Ambassador profiles**: Recruit popular, attractive early users. Offer free premium. Their presence draws others
- **Geo-targeted paid ads**: Concentrate spend in one city/neighborhood until critical mass is achieved, then expand
- **City-by-city launch**: Achieve minimum viable liquidity in one city before expanding. Minimum viable liquidity = enough users that a new signup gets at least one match within their first session
- **Do not launch everywhere at once**: A thin spread of users across 50 cities is worse than a dense cluster in one city

### User Acquisition & Growth

| Channel | CAC Range | Pros | Cons |
|---------|-----------|------|------|
| **App Store Organic** | $0 | Free, high intent | Slow, depends on ASO and ratings |
| **Google/Apple Search Ads** | $2–8 | High intent, measurable | Expensive at scale, competitive keywords |
| **Social Media Ads (Instagram, TikTok)** | $3–15 | Great targeting, visual format | Creative fatigue, need constant new ads |
| **Influencer Partnerships** | $5–25 | Authentic, builds brand | Hard to measure, variable quality |
| **Campus Ambassadors** | $1–5 | Hyper-local density, word-of-mouth | Doesn't scale, seasonal |
| **Referral Program** | $2–6 | Viral, pre-qualified users | Fraud risk (fake referrals) |
| **PR / Press Coverage** | $0 | Massive reach, credibility | Unpredictable, one-time spike |

**App Store Optimization (ASO)**:
- Keywords: Target long-tail ("dating app for professionals" not just "dating")
- Screenshots: Show the UI, highlight unique features, A/B test variants
- Ratings: Prompt for ratings after positive moments (match, good conversation), never after negative ones
- Target: 4.5+ stars. Below 4.0, downloads drop significantly

**Healthy growth indicators**:
- Organic acquisition > 60% of total (relying on paid = unsustainable)
- K-factor > 0.5 (each user brings 0.5 new users through referrals/word-of-mouth)
- Day-1 retention > 40%, Day-7 > 20%, Day-30 > 10%

### Retention & Re-engagement

Acquiring a user costs $3–15. Losing them and re-acquiring costs 5x more. Retention is the single most important metric after product-market fit.

**Streak mechanics**: "You've matched 3 days in a row! Keep your streak alive." Streaks create a lightweight habit loop. Don't make them punishing (losing a streak shouldn't feel like losing progress).

**Milestone notifications**: "You've been liked 100 times!" "Someone with 95% compatibility just joined near you." These create moments of delight and reasons to re-engage.

**Win-back campaigns** (push notifications to inactive users):

| Days Inactive | Hook | Example |
|--------------|------|---------|
| 3 days | Social proof | "12 people liked your profile while you were away" |
| 7 days | New feature | "We just launched voice notes — try it with your matches" |
| 14 days | Scarcity | "Your profile is about to be hidden. Open the app to stay visible" |
| 30 days | Fresh start | "We've refreshed your recommendations. See who's new near you" |

**Seasonal campaigns**: Dating app activity spikes predictably:
- **January 1–14**: New Year's resolution dating (biggest spike of the year, +25-40%)
- **February 1–13**: Pre-Valentine's rush
- **September**: Back-to-school/back-to-city after summer
- **Sunday evenings**: Highest weekly activity (7–10pm local time)

**Churn prediction signals** (flag users at risk before they leave):
- Session length declining over 2 weeks
- Swipe volume dropping >50% week-over-week
- No messages sent in 7+ days despite having matches
- Subscription cancel or auto-renewal turned off
- Uninstalled push notifications (detected by delivery failure)

### Notification Strategy

Notifications are your most powerful re-engagement tool and your fastest path to uninstalls. Get the balance wrong and users leave.

| Type | Trigger | Timing | Priority |
|------|---------|--------|----------|
| **New match** | Mutual right-swipe | Immediate | High — this is the core dopamine hit |
| **New message** | Match sends message | Immediate | High — conversation is the goal |
| **New like** | Someone right-swiped you | Batched (every 2-4 hours) | Medium — "You have 5 new likes" drives opens |
| **Boost reminder** | Free weekly boost unused | Sunday 6pm local | Low — feature awareness |
| **Streak warning** | No swipe in 22 hours | 22 hours after last swipe | Low — opt-in only |
| **Weekly summary** | Every Monday | Monday 10am local | Low — "You were liked 23 times this week" |

**What drives opens**: New match (68% open rate), new message (55%), "someone liked you" (40%).

**What drives uninstalls**: More than 3 notifications/day, notifications after 10pm, generic "Come back!" messages, notifications about features they didn't ask for.

**Suppression rules**:
- Max 3 push notifications per day per user
- Quiet hours: 10pm–8am local time (no notifications except direct messages from matches)
- If user hasn't opened last 3 notifications, reduce frequency by 50%
- If user dismissed 5+ notifications in a row, pause for 48 hours
- Never send push for the same event type twice within 1 hour

---

## 🚫 Anti-Patterns — What NOT To Do

These are mistakes that have killed dating apps or severely damaged user trust. Learn from the failures of others.

### 1. Aggressive Monetization That Kills the Free Experience

**The mistake**: Making the free tier so frustrating that it feels like a paywall rather than a product. Limiting swipes to 5/day, hiding who liked you behind a blur, requiring payment to send messages.

**Why it fails**: Users who can't experience the core value (matching, chatting) on the free tier leave before ever considering paying. Free users are also the content that paying users are paying to access.

**What to do instead**: The free experience should be complete enough that someone can find a date. Paid features should enhance (unlimited swipes, seeing who liked you, profile boosts) without gating the core experience.

### 2. Ignoring Gender Ratio Imbalance

**The mistake**: Not actively managing the ratio of men to women (or supply/demand in any marketplace). Most dating apps skew 60-80% male, meaning women are overwhelmed with options and men get few matches.

**Why it fails**: Women get flooded with low-effort messages and leave. Men get frustrated by low match rates and leave. Both sides churn for opposite reasons.

**What to do instead**: Limit male swipe volume (Hinge's 8 free likes/day), make female experience higher-signal (Bumble's women-message-first), invest in features that attract and retain the scarce side.

### 3. Showing Inactive or Ghost Profiles

**The mistake**: Displaying profiles of users who haven't opened the app in weeks or months to inflate the apparent pool size.

**Why it fails**: Users swipe right on ghost profiles, never get matches, conclude the app is dead, and leave. Even worse: matches that never respond destroy confidence in the platform.

**What to do instead**: Deprioritize profiles inactive > 7 days. Hide profiles inactive > 30 days. Show a "last active" indicator. Be honest about pool size — a smaller active pool is better than a large dead one.

### 4. No Content Moderation From Day One

**The mistake**: Launching without automated or human content moderation, planning to "add it later."

**Why it fails**: Without moderation, the app fills with spam, explicit content, scammers, and harassment within days. The first users — your most valuable early adopters — encounter this and leave permanently. You never get them back.

**What to do instead**: Ship with basic ML moderation (nudity detection, spam detection) and manual review queues from day one. It doesn't need to be perfect — it needs to exist.

### 5. Ignoring Privacy and Safety

**The mistake**: Exposing precise user locations, not having block/report features, or storing sensitive data (sexual orientation, HIV status) without encryption.

**Why it fails**: Location leaks have literally endangered lives (Grindr's distance-based triangulation vulnerability was used to locate users in countries where homosexuality is criminalized). Privacy failures become front-page news and regulatory action.

**What to do instead**: Snap locations to a grid (never expose exact coordinates). Encrypt sensitive profile fields. Ship block and report in v1. Conduct a privacy threat model before launch. Follow OWASP guidelines for PII handling.

### 6. Over-Optimizing for Engagement Over Genuine Connections

**The mistake**: Optimizing for swipes, time-in-app, and session count at the expense of actual dates and relationships. Withholding good matches to keep users swiping longer.

**Why it fails**: Users eventually realize they're spending hours swiping but not meeting people. They switch to a competitor that delivers results faster. Short-term engagement metrics go up, but long-term retention collapses.

**What to do instead**: Optimize for **match-to-date conversion**. Celebrate when users leave because they found someone ("We love losing users to love"). Success stories are your best marketing.

### 7. Not Having an Appeals Process for Bans

**The mistake**: Auto-banning users based solely on report count or ML flags with no way to appeal.

**Why it fails**: False positives are inevitable. Coordinated reporting (ex targeting an ex-partner's profile) exists. Banning paying users with no recourse leads to chargebacks, app store complaints, and social media outrage.

**What to do instead**: Implement a tiered system: warning → temporary restriction → suspension → ban. Always allow appeals. Have a human review bans within 48 hours. Store the evidence (screenshots, messages) that triggered the action.

### 8. Launching Everywhere at Once

**The mistake**: Making the app available globally on day one to "maximize reach."

**Why it fails**: 100 users spread across 50 cities means 2 users per city. Nobody matches. Nobody returns. You've burned your launch press coverage on an app that doesn't work.

**What to do instead**: Launch in one city. Achieve critical mass (enough users that a new signup matches within their first session). Prove retention. Then expand city by city. Tinder, Bumble, and Hinge all launched this way.

---

## 📱 Modern Features You Must Ship

These are the features users expect in 2024+ dating apps. Missing them puts you at a competitive disadvantage.

| Feature | What It Does | Why It Matters | Complexity |
|---------|-------------|----------------|------------|
| **Video Verification** | User records a selfie video matching a pose prompt | Proves the person is real, reduces catfishing by 60%+ | Medium — needs ML pose matching |
| **Voice/Video Calling** | In-app calls without sharing phone numbers | Safety (no number exchange), convenience, COVID accelerated adoption | High — WebRTC, TURN servers, moderation |
| **Icebreaker Prompts** | "Two truths and a lie", "Best travel story" on profiles | Gives conversation starters, reduces "hey" openers | Low — just profile fields |
| **Safety Badges** | Verified photo, verified phone, verified ID | Builds trust, verified profiles get 3x more matches | Medium — third-party ID verification |
| **Incognito Mode** | Profile only visible to people you've liked | Privacy for public figures, people in small towns | Low — query filter |
| **Super Like** | Signals strong interest, shown prominently to recipient | Monetization lever, 3x higher match rate than normal like | Low — event + UI treatment |
| **Undo/Rewind** | Take back an accidental left swipe | Monetization lever, reduces regret frustration | Low — cache recent swipes |
| **Passport/Travel Mode** | Match in a different city before arriving | Revenue driver, appeals to frequent travelers | Medium — cross-region queries |
| **Group Activities** | Events, meetups, group date matching | Reduces pressure of 1-on-1, appeals to younger users | High — event system, group matching |
| **AI Photo Suggestions** | ML picks your best photos and suggests ordering | Users are bad at choosing their own best photos, +15% match rate | Medium — photo quality + attractiveness models |

---

## 🏢 Operational Playbook

Building the app is half the challenge. Operating it — keeping users safe, handling crises, managing moderators, complying with regulations — is the other half.

### Trust & Safety Team Structure

**Rule of thumb**: ~1 moderator per 50,000–100,000 MAU (monthly active users). This varies by user demographics and regional risk profiles.

| Role | Responsibility | Ratio |
|------|---------------|-------|
| **Content Moderator** | Review flagged profiles, photos, messages | 1 per 50–100K MAU |
| **T&S Lead** | Policy creation, escalation handling, training | 1 per 5–10 moderators |
| **T&S Engineer** | Build/maintain moderation ML, tooling, dashboards | 1 per 500K MAU |
| **Legal/Policy** | Regulatory compliance, law enforcement requests | 1 per 2–5M MAU |

**Coverage requirements**:
- 24/7 coverage for critical reports (threats, self-harm, CSAM)
- SLA: threats reviewed < 1 hour, standard reports < 24 hours
- Moderator well-being: rotate off disturbing content queues, provide access to counseling, limit exposure to 4 hours/day for graphic content queues

### Content Moderation Pipeline

```
User Report / ML Flag
        │
        ▼
┌───────────────┐
│  ML Triage    │──── Auto-resolve (obvious spam, duplicate reports)
│  (< 1 sec)   │
└───────┬───────┘
        │
        ▼ Needs human review
┌───────────────┐
│  Queue        │──── Priority: Critical (threats, CSAM) > High (harassment)
│  Assignment   │     > Medium (inappropriate content) > Low (profile disputes)
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Human Review │──── Moderator sees: reported content, reporter's note,
│               │     reported user's history, ML confidence score
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Action       │──── Warning / Content removal / Temporary ban / Permanent ban
│               │     + Notification to reporter ("We took action")
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Appeal       │──── User can appeal within 14 days
│  (if banned)  │     Different moderator reviews (never same person)
└───────────────┘
```

**Key SLAs**:
- CSAM (child exploitation): Remove < 15 minutes, report to NCMEC immediately
- Threats of violence / self-harm: Review < 1 hour, escalate to law enforcement if imminent
- Harassment: Review < 8 hours
- Standard reports: Review < 24 hours

### Crisis Response

**Media safety story** (e.g., assault reported by a user who met someone on your app):
1. Acknowledge immediately: "We are aware of the report and take user safety extremely seriously"
2. Cooperate fully with law enforcement
3. Review the specific account — what signals were missed?
4. Do NOT share user data publicly, even to "prove" you acted
5. Post-incident: implement improvements and communicate them

**Data breach response**:
1. Contain the breach (revoke compromised credentials, patch the vulnerability)
2. Notify affected users within 72 hours (GDPR requirement)
3. Notify regulators (ICO, FTC, etc.) per jurisdiction requirements
4. Offer credit monitoring if PII was exposed
5. Post-mortem: root cause, timeline, remediation, prevention

### Regulatory Landscape

| Regulation | Jurisdiction | Key Requirement | Impact on Dating Apps |
|------------|-------------|-----------------|----------------------|
| **GDPR** | EU/UK | Right to deletion, data portability, consent | Must delete all user data on request within 30 days, including backups |
| **CCPA/CPRA** | California | Do not sell personal info, opt-out of tracking | "Do not sell my data" toggle, detailed privacy policy |
| **KOSA** | US (proposed) | Protect minors, duty of care | Robust age verification, parental controls for under-18 features |
| **UK Online Safety Act** | UK | Prevent harmful content, age verification | CSAM scanning, age assurance, risk assessments |
| **Age Verification Laws** | Various US states | Verify user age for adult content | Government ID verification or age estimation for 18+ apps |
| **Digital Services Act** | EU | Transparency on algorithms, content moderation | Explain how the matching algorithm works, publish moderation reports |

### Team Structure for Scale

| Team | Size (for ~1M MAU) | Key Responsibilities |
|------|-------------------|---------------------|
| **Product** | 6–8 | Features, A/B testing, user research |
| **Engineering** | 15–25 | Backend, mobile, ML, infrastructure |
| **Trust & Safety** | 10–15 | Moderation, policy, tooling |
| **Data/Analytics** | 4–6 | Metrics, dashboards, experimentation platform |
| **Design** | 3–5 | UX/UI, brand, marketing creative |
| **Marketing/Growth** | 5–8 | Acquisition, ASO, partnerships, social |
| **Customer Support** | 5–10 | Billing issues, account recovery, bug reports |
| **Legal** | 1–2 | Privacy, compliance, law enforcement requests |

---

## 📊 Metrics Dashboard — What to Track

If you can't measure it, you can't improve it. These are the metrics that matter for a dating app, organized by what they tell you.

### Funnel Metrics

Track conversion at every step. A leak at any stage means wasted acquisition spend.

| Step | Metric | Healthy Benchmark | Warning Sign |
|------|--------|-------------------|-------------|
| Visit → Download | Store conversion rate | 25–35% | < 15% (bad screenshots/reviews) |
| Download → Signup | Signup completion rate | 60–75% | < 40% (onboarding too long) |
| Signup → Profile complete | Profile completion rate | 40–60% | < 30% (not enough nudges) |
| Profile → First swipe | Activation rate | 70–85% | < 50% (discovery feed empty/slow) |
| First swipe → First match | Match rate | 30–50% | < 20% (algorithm or pool issue) |
| First match → First message | Message rate | 40–60% | < 25% (no conversation starters) |
| First message → Response | Response rate | 30–50% | < 20% (message quality or mismatch) |

### Cohort Analysis

Don't look at aggregate metrics — they hide problems. Always segment by:

- **Signup week**: Is each new cohort retaining better than the last? If D7 retention for week 12 cohort is worse than week 8 cohort, something broke.
- **Geography**: Retention in city A vs city B reveals where you have critical mass and where you don't
- **Age/Gender**: Men and women have very different engagement patterns. 18–24 vs 25–34 vs 35+ have different expectations
- **Acquisition channel**: Organic users retain 2–3x better than paid users. If paid acquisition dominates, overall metrics look worse than they are

**Retention targets** (for a healthy dating app):

| Timeframe | Target | Excellent | Needs Work |
|-----------|--------|-----------|------------|
| D1 (next day) | > 40% | > 55% | < 30% |
| D7 (one week) | > 20% | > 30% | < 15% |
| D30 (one month) | > 10% | > 18% | < 7% |
| D90 (three months) | > 5% | > 10% | < 3% |

### Matching Quality Metrics

These tell you if your algorithm is working — not just engaging users, but creating real connections.

| Metric | What It Measures | Healthy Range | What It Tells You |
|--------|-----------------|---------------|-------------------|
| **Like-back rate** | % of right-swipes that are reciprocated | 10–30% | Algorithm relevance — are you showing people who'd like each other? |
| **Match-to-conversation rate** | % of matches where at least 1 message is sent | 40–60% | Match quality — are matched users genuinely interested? |
| **Conversation depth** | Average messages per conversation | 8–15 | Engagement quality — are people connecting? |
| **Mutual unmatch rate** | % of matches unmatched by either party | < 20% | Low = good matches. High = algorithm showing poor fits |
| **Report rate per match** | Reports / total matches | < 0.5% | Safety and match quality |
| **Success stories** | Self-reported dates or relationships | Track trend | The ultimate metric — are people meeting? |

### Churn Predictors

Build an ML model on these signals to identify at-risk users before they leave:

| Signal | Weight | Threshold | Action |
|--------|--------|-----------|--------|
| Session length declining | High | 2-week downward trend | Show higher-quality profiles, trigger "new matches near you" |
| No messages sent in 7+ days | High | 7 days with matches | "Your match [name] is waiting — say hi!" |
| Swipe volume dropped >50% | Medium | Week-over-week comparison | Profile boost, "We've added new features" |
| Subscription auto-renew off | Medium | Toggle changed | Offer discount, ask for feedback |
| Push notifications dismissed 5x | Medium | Rolling 7-day count | Reduce notification frequency |
| Profile photos removed | Low | Any photo deletion | "Profiles with photos get 10x more matches" |

---

---

## 🎨 Product Design Deep Dive: Tinder, Bumble, Hinge, OKCupid

Understanding how the top apps made their product decisions is essential before you build your own. Each made different bets on the same fundamental problem — getting two people together — and those bets drove completely different architectures.

### The Four Design Philosophies

```
┌─────────────────────────────────────────────────────────────────────┐
│                  DATING APP DESIGN PHILOSOPHIES                     │
├───────────────┬───────────────┬───────────────┬─────────────────────┤
│   TINDER      │    BUMBLE     │    HINGE      │    OKCUPID          │
├───────────────┼───────────────┼───────────────┼─────────────────────┤
│ "Volume"      │ "Women first" │ "Designed to  │ "Compatibility      │
│               │               │ be deleted"   │ first"              │
├───────────────┼───────────────┼───────────────┼─────────────────────┤
│ Gamification  │ Safety and    │ Relationships │ Data-driven         │
│ above all     │ control       │ not hookups   │ matching            │
├───────────────┼───────────────┼───────────────┼─────────────────────┤
│ Swipe UI      │ Swipe UI with │ Scroll cards  │ Detailed profiles   │
│               │ 24h first msg │ + prompts     │ + questionnaires    │
├───────────────┼───────────────┼───────────────┼─────────────────────┤
│ Casual to     │ Broad (women  │ Serious       │ 35+ age group,      │
│ serious, 18-35│ in control)   │ relationships │ personality-driven  │
├───────────────┼───────────────┼───────────────┼─────────────────────┤
│ 50M+ users    │ 50M+ users    │ 23M+ users    │ 50M+ users          │
└───────────────┴───────────────┴───────────────┴─────────────────────┘
```

### Tinder — The Volume Model

**Core Bet**: Dating is fundamentally about discovery. Make discovery as fast and frictionless as possible — the swipe card UI is the product.

**Key Product Decisions**:

```
1. SWIPE CARD UI (2012 innovation)
   Why: Mobile-native gesture. One finger, one decision. Zero friction.
   Tradeoff: Optimizes for volume of decisions, not quality.
   Result: Gamification. Users swipe 1.6 billion times per day.

2. MUTUAL MATCH REQUIRED BEFORE MESSAGING
   Why: Reduces harassment (nobody gets a message from someone they rejected).
   Tradeoff: Creates "match anxiety" — many matches never convert to messages.
   Result: High match count → low conversation rate (industry avg: 10-20%)

3. ELO-STYLE DESIRABILITY SCORE (originally)
   Why: Match desirable users with desirable users. Lower-rated users matched
        with lower-rated users. Called the "Elo score" internally.
   Tradeoff: Created stratified experience. Some users almost never matched.
   Result: Evolved to a more complex ML system (not pure Elo) after backlash.

4. FREE WITH PREMIUM UNLOCK
   Why: Lower barrier to entry maximizes top-of-funnel.
   Tradeoff: Free users see limited swipes, ads.
   Revenue drivers:
   - Tinder Gold ($15-29/mo): See who liked you before matching
   - Boosts ($1-4 each): 30 minutes of boosted visibility
   - Super Likes (limited free): Signal strong interest
```

**Technical Implications of Tinder's Model**:
- Needs to serve thousands of card swipes per second per user
- Discovery feed must refresh quickly (few hundred ms)
- Infinite scroll = cold-start problem × geographic density problem
- Elo-style scoring = needs writes on every like (expensive at 1.6B swipes/day)

### Bumble — The Control Model

**Core Bet**: Safety is the #1 reason women leave dating apps. Give women control, and you win the market.

**Key Product Decisions**:

```
1. WOMEN INITIATE ONLY (heterosexual matches)
   Why: Removes the harassment problem at the product level.
   Tradeoff: Higher friction for matches (24h expiry pressure for women).
   Implementation: After a het match, only the woman can send first message.
                   If no message in 24h, match expires.
                   Man can "extend" once (signals he's genuinely interested).

2. 24-HOUR EXPIRY CREATES URGENCY
   Why: Prevents "match collecting" without intent.
   Tradeoff: Anxiety-inducing for users. Creates pressure.
   Result: Higher conversation rates than Tinder (because there's a deadline).

3. COMPLIMENTS (send before matching)
   Why: Lets users signal interest on specific profile elements.
   Tradeoff: Requires curation — system shows compliments to recipient.
   Result: Conversion tool (users who receive compliments match more often).

4. BUMBLE BFF + BUMBLE BIZZ
   Why: Expands TAM beyond romantic connections.
   Tradeoff: Product complexity, different moderation needs.
   Result: Diversified revenue, lower CAC through existing user base.
```

**Technical Implications of Bumble's Model**:
- Time-based expiry on matches requires a job queue (e.g., Redis TTL + Celery)
- The "who can message" permission system is a state machine
- Bumble's filters are more granular than Tinder's (height, education, etc.)

```python
# Match state machine — Bumble's core permission logic
from enum import Enum
from datetime import datetime, timedelta

class MatchState(Enum):
    MATCHED = "matched"           # Just matched, waiting for first message
    WOMAN_MESSAGED = "active"     # Woman sent first message, normal convo
    EXPIRED = "expired"           # 24h passed, no message sent
    EXTENDED = "extended"         # Man extended 24h window (1x allowed)

class BumbleMatch:
    """
    Bumble's core matching constraint:
    - In het matches: only woman can send first message
    - Match expires after 24h if no message sent
    - Man can extend once (adds another 24h)
    """
    EXPIRY_HOURS = 24

    def __init__(self, user_a, user_b, matched_at):
        # Determine who has first-message permission
        # For het matches: the woman has permission
        # For same-sex: either person can message first
        self.user_a = user_a
        self.user_b = user_b
        self.matched_at = matched_at
        self.expires_at = matched_at + timedelta(hours=self.EXPIRY_HOURS)
        self.state = MatchState.MATCHED
        self.extension_used = False

    def who_can_message_first(self) -> str:
        """
        Returns user_id of who can send the opening message.
        Returns None if match is expired.
        """
        if self.state == MatchState.EXPIRED:
            return None
        if self.state == MatchState.ACTIVE:
            return "both"  # After first message, anyone can reply

        # First-message logic: woman goes first in het matches
        if self.user_a.gender == "woman" and self.user_b.gender == "man":
            return self.user_a.user_id
        elif self.user_b.gender == "woman" and self.user_a.gender == "man":
            return self.user_b.user_id
        else:
            return "both"  # Same-sex matches: either person

    def check_expiry(self):
        if self.state == MatchState.MATCHED and datetime.utcnow() > self.expires_at:
            self.state = MatchState.EXPIRED
            return True
        return False

    def extend_match(self, requesting_user_id: str) -> bool:
        """Man can extend the 24h window once."""
        if self.extension_used:
            return False
        if requesting_user_id not in [self.user_a.user_id, self.user_b.user_id]:
            return False
        self.expires_at = datetime.utcnow() + timedelta(hours=self.EXPIRY_HOURS)
        self.extension_used = True
        return True
```

### Hinge — The Relationship Model

**Core Bet**: The swipe model creates bad habits. Replace quantity with quality — design for real relationships, not endless scrolling.

**Key Product Decisions**:

```
1. "DESIGNED TO BE DELETED" — THE ANTI-TINDER
   Why: Brand positioning. Users who succeed become ambassadors.
   Tradeoff: You're explicitly trying to churn your users (into relationships).
   Result: Hinge became the fastest-growing dating app 2019-2023.

2. PROMPTS INSTEAD OF (JUST) PHOTOS
   Why: Give conversation starters. Reduce the "hey" dead end.
   How: Users answer 3 prompts from 80+ options:
        "The one thing I'd like to know about you is..."
        "My simple pleasures..."
        "I'll know it's time to delete Hinge when..."
   Technical: Each prompt answer is a separate "card" — users can like
              individual photos OR specific prompt answers, with a comment.

3. LIKE + COMMENT REQUIRED TO MATCH
   Why: Forces intentionality. "I liked your photo" with no context → spam.
   How: You can't just "like" — you must like a specific photo or prompt
        AND leave a comment. Recipient sees: what you liked + your comment.
   Result: Much higher conversation conversion rate than Tinder.

4. DAILY LIKES LIMIT
   Why: Prevents "mass swiping" behavior. Forces deliberate choices.
   How: Free users get 8 likes/day. Premium (Hinge+) gets unlimited.
   Result: Higher signal-to-noise, better UX for recipients.

5. "YOUR TURN" PROMPTS
   Why: Conversations stall because one person is waiting for the other.
   How: App nudges the person who hasn't responded in X hours.

6. "MOST COMPATIBLE" FEATURE (Gale-Shapley algorithm)
   Why: One daily AI recommendation — the person Hinge thinks is your best match.
   How: Uses machine learning on behavioral data to surface high-quality picks.
   Technical: Implemented as a deferred batch job, runs nightly.
```

**Hinge's Data Model Difference**: Because you can like individual photos or prompt answers (not just the whole profile), their like/interaction schema is more granular than Tinder's:

```python
# Hinge-style interaction model
# More granular than Tinder's simple "like/pass on a profile"

class InteractionTarget:
    """What specifically was liked within a profile."""
    TYPES = ["profile_photo", "prompt_answer", "profile_video"]

class HingeInteraction:
    """
    A like on Hinge targets a specific card (photo or prompt).
    The comment is mandatory — can't like without context.
    """
    def __init__(
        self,
        from_user_id: str,
        to_user_id: str,
        target_type: str,          # "profile_photo" or "prompt_answer"
        target_id: str,            # ID of the specific photo or prompt
        comment: str               # Mandatory comment (min 1 char, max 300)
    ):
        if not comment or not comment.strip():
            raise ValueError("Comment is required on Hinge")
        if len(comment) > 300:
            raise ValueError("Comment max 300 characters")

        self.from_user_id = from_user_id
        self.to_user_id = to_user_id
        self.target_type = target_type
        self.target_id = target_id
        self.comment = comment.strip()
        self.created_at = datetime.utcnow()
```

### OKCupid — The Compatibility Model

**Core Bet**: Chemistry is predictable from self-reported data. Deep questionnaires beat shallow profile browsing.

**Key Product Decisions**:

```
1. THOUSANDS OF QUESTIONS
   Why: More data = better matching = more successful relationships.
   How: Users answer questions like "Is jealousy healthy in relationships?"
        "Do you smoke?" "Would you date someone who has depression?"
        Each answer has: Your answer, Acceptable answers, Importance level.
   Technical: Match percentage = weighted agreement across shared questions.

2. MATCH PERCENTAGE
   Why: Give users a number to anchor on. "92% match" triggers curiosity.
   Formula (simplified):
     For each shared question:
       score = (importance_weight * (your_answer IN partner_acceptable_answers))
     match_pct = sqrt(avg_score_you_for_them * avg_score_them_for_you)
   Note: Uses geometric mean (not arithmetic) to prevent one-sided high scores.

3. SEARCH AND BROWSE (not just algorithmic feed)
   Why: Some users know what they want. Let them search.
   How: Users can filter by all profile fields + match percentage.
   Tradeoff: Creates "shopping" behavior, can be overwhelming.

4. ESSAYS (long-form profile sections)
   Why: Self-expression. Signals intelligence and thoughtfulness.
   How: 8+ open-ended sections: "My self-summary", "What I'm doing with my life", etc.
   Tradeoff: High barrier to profile completion. Attracts thoughtful users,
             repels casual ones.

5. DOUBLЕТAKE (swipe mode for existing users)
   Why: Added swipe as secondary mode when Tinder exploded.
   Tradeoff: Diluted the brand. Shows the tension between acquisition and retention.
```

### Building Your Own: Design Decisions to Make First

Before writing a line of code, answer these questions. Your answers determine your entire architecture:

```
┌─────────────────────────────────────────────────────────────────────┐
│              PRODUCT DESIGN DECISIONS — DECIDE FIRST                │
├────────────────────────────┬────────────────────────────────────────┤
│ Decision                   │ Options and Implications               │
├────────────────────────────┼────────────────────────────────────────┤
│ Who goes first in matches? │ Anyone (Tinder model) → simpler       │
│                            │ Women only (Bumble model) → state      │
│                            │ machine, expiry logic                  │
├────────────────────────────┼────────────────────────────────────────┤
│ How do users express       │ Swipe (volume) → simple, gamified      │
│ interest?                  │ Like + comment (Hinge) → more tables,  │
│                            │ higher intent signal                   │
│                            │ Compatibility score (OKCupid) →        │
│                            │ complex questionnaire system           │
├────────────────────────────┼────────────────────────────────────────┤
│ What's your matching       │ Location only (Grindr model)           │
│ algorithm?                 │ Elo-style desirability (Tinder)        │
│                            │ Behavioral ML (Hinge)                  │
│                            │ Questionnaire compatibility (OKCupid)  │
├────────────────────────────┼────────────────────────────────────────┤
│ What's the conversation    │ Free to open → spam risk               │
│ model?                     │ Match required → mutual consent        │
│                            │ Prompts/icebreakers → higher reply     │
├────────────────────────────┼────────────────────────────────────────┤
│ Audience                   │ Casual (Tinder) → simpler profiles     │
│                            │ Serious (Hinge, Bumble) → more fields  │
│                            │ Niche (JDate, Grindr) → tighter schema │
├────────────────────────────┼────────────────────────────────────────┤
│ Gender dynamics            │ No rules → simpler                     │
│                            │ Women-first → state machine            │
│                            │ Inclusive → non-binary gender options  │
│                            │ (27+ options, like Tinder/OKCupid)     │
└────────────────────────────┴────────────────────────────────────────┘
```

---

## 🚢 Deployment: From Local to Production

### Phase 1: Local Development (Week 1–4)

Start with Docker Compose — everything on your laptop, no cloud costs.

```yaml
# docker-compose.yml — Full local stack
version: "3.9"

services:
  # ── Databases ───────────────────────────────────────────
  postgres:
    image: postgis/postgis:15-3.3  # PostgreSQL + PostGIS for geospatial
    environment:
      POSTGRES_DB: dating_db
      POSTGRES_USER: dating_user
      POSTGRES_PASSWORD: local_dev_password  # Never use in production
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql

  mongodb:
    image: mongo:7.0
    environment:
      MONGO_INITDB_DATABASE: chat_db
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes  # Persistence

  # ── Application Services ─────────────────────────────────
  profile_service:
    build: ./services/profile
    ports:
      - "8001:8001"
    environment:
      DATABASE_URL: postgresql://dating_user:local_dev_password@postgres:5432/dating_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./services/profile:/app  # Hot reload during development
    command: uvicorn main:app --reload --host 0.0.0.0 --port 8001

  matching_service:
    build: ./services/matching
    ports:
      - "8002:8002"
    environment:
      DATABASE_URL: postgresql://dating_user:local_dev_password@postgres:5432/dating_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  chat_service:
    build: ./services/chat
    ports:
      - "8003:8003"
    environment:
      MONGO_URL: mongodb://mongodb:27017/chat_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - mongodb
      - redis

  # ── API Gateway ─────────────────────────────────────────
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/local.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - profile_service
      - matching_service
      - chat_service

  # ── Development tools ───────────────────────────────────
  adminer:       # Web UI for PostgreSQL
    image: adminer
    ports:
      - "8080:8080"

  mongo-express:  # Web UI for MongoDB
    image: mongo-express
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_URL: mongodb://mongodb:27017/

volumes:
  postgres_data:
  mongo_data:
```

```
# Start everything locally:
docker compose up -d

# Run database migrations:
docker compose exec profile_service alembic upgrade head

# Check logs:
docker compose logs -f matching_service

# Stop:
docker compose down
```

### Phase 2: Cloud Setup — First Deployment (Month 1–2)

Start with a single server, managed databases. This handles your first 0–10,000 users cheaply.

```
Architecture for Phase 2 (< 10K users):
─────────────────────────────────────────
  Users → CloudFront (CDN for photos) → EC2/GCE t3.medium ($30/mo)
                                      ├── Nginx (reverse proxy)
                                      ├── Profile service (uvicorn)
                                      ├── Matching service (uvicorn)
                                      └── Chat service (uvicorn + WebSocket)

  Data:
  ├── RDS PostgreSQL + PostGIS ($50-100/mo)
  ├── MongoDB Atlas M10 cluster ($60/mo)
  ├── Redis ElastiCache t3.micro ($15/mo)
  └── S3 + CloudFront for photos ($10-30/mo)

  Total: ~$200-300/month
  Capacity: ~10,000 active users, ~100 concurrent WebSocket connections

AWS Quickstart:
  1. Create RDS PostgreSQL instance (enable PostGIS extension)
  2. Create ElastiCache Redis (cluster mode off for simplicity)
  3. Create S3 bucket for photos (block all public access, use pre-signed URLs)
  4. Create CloudFront distribution pointing to S3
  5. Create EC2 t3.medium (Ubuntu 22.04)
  6. Install Docker + Docker Compose on EC2
  7. Copy your docker-compose.yml (without the dev databases — use managed ones)
  8. Set environment variables via AWS Parameter Store
```

```bash
# EC2 setup script (run once)
#!/bin/bash
set -e

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L \
  "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip && sudo ./aws/install

# SSL certificate (free with Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdatingapp.com -d www.yourdatingapp.com
# Auto-renewal is configured automatically
```

### Phase 3: Kubernetes — Production Scale (Month 3–6, >10K users)

Once you have product-market fit and >10K MAU, move to Kubernetes for auto-scaling, rolling deployments, and resilience.

```yaml
# kubernetes/profile-service.yaml
# This is the production deployment for the profile service

apiVersion: apps/v1
kind: Deployment
metadata:
  name: profile-service
  namespace: dating-prod
spec:
  replicas: 3                    # 3 instances minimum
  selector:
    matchLabels:
      app: profile-service
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1                # Add 1 new pod before removing old ones
      maxUnavailable: 0          # Never take pods offline during deploy
  template:
    metadata:
      labels:
        app: profile-service
    spec:
      containers:
      - name: profile-service
        image: your-registry/profile-service:v1.2.3   # Pin versions, never use :latest
        ports:
        - containerPort: 8001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:              # Pull from Kubernetes Secret (never hardcode)
              name: db-credentials
              key: postgres-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-credentials
              key: redis-url
        resources:
          requests:
            cpu: "250m"                # 0.25 CPU cores guaranteed
            memory: "256Mi"            # 256MB RAM guaranteed
          limits:
            cpu: "500m"                # Never use more than 0.5 CPU
            memory: "512Mi"            # Never use more than 512MB RAM
        readinessProbe:                # Don't send traffic until healthy
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:                 # Restart if unhealthy
          httpGet:
            path: /health
            port: 8001
          initialDelaySeconds: 30
          periodSeconds: 10
          failureThreshold: 3         # Restart after 3 consecutive failures

---
# Auto-scaling based on CPU load
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: profile-service-hpa
  namespace: dating-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: profile-service
  minReplicas: 3
  maxReplicas: 20                    # Scale up to 20 instances under load
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70       # Scale up when CPU > 70%
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

```yaml
# CI/CD Pipeline — GitHub Actions
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]    # Deploy on every merge to main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run tests
      run: |
        docker compose -f docker-compose.test.yml up --abort-on-container-exit
        docker compose -f docker-compose.test.yml down

  build-and-push:
    needs: test          # Only build if tests pass
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Build and push Docker image
      run: |
        docker build -t ${{ secrets.REGISTRY }}/profile-service:${{ github.sha }} \
          ./services/profile
        docker push ${{ secrets.REGISTRY }}/profile-service:${{ github.sha }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to Kubernetes
      run: |
        # Update the image tag in the deployment
        kubectl set image deployment/profile-service \
          profile-service=${{ secrets.REGISTRY }}/profile-service:${{ github.sha }} \
          --namespace=dating-prod

        # Wait for rollout to complete (or rollback if it fails)
        kubectl rollout status deployment/profile-service \
          --namespace=dating-prod \
          --timeout=5m

    - name: Run smoke tests
      run: |
        # Hit a few critical endpoints after deployment
        curl -f https://api.yourdatingapp.com/health
        curl -f https://api.yourdatingapp.com/v1/status
```

### Scale Thresholds: When to Upgrade

```
0 → 1,000 MAU:     Single EC2 + managed DBs. Keep it simple. Focus on product.
1,000 → 10,000:    Add Redis caching, CDN for photos, basic monitoring.
10,000 → 100,000:  Move to Kubernetes. Add read replicas for PostgreSQL.
                   Separate services into distinct containers.
100,000 → 1M:      Database sharding or move to Vitess (MySQL sharding proxy).
                   Add Elasticsearch for profile search.
                   Dedicated Kafka for event streaming.
1M+:               Multi-region deployment. Edge caching.
                   Specialized hardware for ML serving.
                   Dedicated SRE team.
```

---

## 🔐 Security: Complete Implementation Guide

Dating apps are high-value security targets. They hold sensitive personal data, location information, private photos, and intimate conversations. A breach is catastrophic for user trust.

### Authentication Security

```python
# Secure authentication implementation
import secrets
import hashlib
import hmac
from datetime import datetime, timedelta
import jwt  # PyJWT library
from argon2 import PasswordHasher  # Use Argon2, not bcrypt (Argon2 is stronger)

# ── Password Hashing ─────────────────────────────────────────────────
# Argon2 is the winner of the Password Hashing Competition (2015)
# It's the current best practice — stronger than bcrypt and scrypt
ph = PasswordHasher(
    time_cost=2,       # Number of iterations (higher = slower = more secure)
    memory_cost=65536, # Memory usage in KB (64MB makes GPU cracking expensive)
    parallelism=1,     # Number of parallel threads
    hash_len=32,       # Output length in bytes
    salt_len=16        # Salt length in bytes
)

def hash_password(raw_password: str) -> str:
    """
    Always hash passwords before storing.
    Never store plain text passwords.
    """
    return ph.hash(raw_password)

def verify_password(stored_hash: str, raw_password: str) -> bool:
    """
    Constant-time comparison prevents timing attacks.
    Timing attack: attacker measures response time to infer if hash matches.
    """
    try:
        return ph.verify(stored_hash, raw_password)
    except Exception:
        return False

# ── JWT Token Management ─────────────────────────────────────────────
SECRET_KEY = secrets.token_hex(32)  # 256-bit random key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30    # Short-lived access tokens
REFRESH_TOKEN_EXPIRE_DAYS = 30      # Long-lived refresh tokens

def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "access",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: str, device_id: str) -> str:
    """
    Refresh tokens are bound to a device.
    If a device is compromised, only that device's token is revoked.
    Stored in database for revocation capability.
    """
    token_id = secrets.token_hex(16)  # Unique ID for this token
    payload = {
        "sub": user_id,
        "jti": token_id,              # JWT ID — used for revocation
        "device_id": device_id,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }
    # Store token_id in DB so we can revoke it
    # db.refresh_tokens.insert(token_id=token_id, user_id=user_id, device_id=device_id)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthError("Token expired")
    except jwt.JWTError:
        raise AuthError("Invalid token")

# ── Rate Limiting ────────────────────────────────────────────────────
# Prevents brute force, credential stuffing, and API abuse
import redis
from functools import wraps

redis_client = redis.Redis.from_url(settings.REDIS_URL)

def rate_limit(max_requests: int, window_seconds: int, key_prefix: str = "rl"):
    """
    Sliding window rate limiter using Redis.
    More accurate than fixed window (prevents burst at window boundary).
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Use IP + endpoint as the rate limit key
            request = kwargs.get("request") or args[0]
            client_ip = request.client.host
            key = f"{key_prefix}:{client_ip}:{func.__name__}"

            now = datetime.utcnow().timestamp()
            window_start = now - window_seconds

            # Remove old requests outside the window
            redis_client.zremrangebyscore(key, 0, window_start)

            # Count requests in the current window
            current_count = redis_client.zcard(key)

            if current_count >= max_requests:
                raise HTTPException(
                    status_code=429,
                    detail={
                        "error": "rate_limit_exceeded",
                        "retry_after": window_seconds,
                        "limit": max_requests,
                        "window_seconds": window_seconds
                    }
                )

            # Record this request
            redis_client.zadd(key, {str(now): now})
            redis_client.expire(key, window_seconds)

            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Apply rate limiting to sensitive endpoints
@rate_limit(max_requests=5, window_seconds=300, key_prefix="login")  # 5 login attempts per 5 min
async def login(credentials: LoginCredentials):
    ...

@rate_limit(max_requests=10, window_seconds=60, key_prefix="verify")  # 10 OTPs per minute
async def verify_phone(otp_request: OTPRequest):
    ...
```

### Location Data Security

Location is the most sensitive data in a dating app. Mishandled, it enables stalking.

```python
# Location security implementation

import math
from dataclasses import dataclass

@dataclass
class FuzzyLocation:
    """
    Never expose exact user coordinates.
    Fuzz location to nearest 0.5-1km for display purposes.
    """
    FUZZ_METERS = 500  # Fuzz to nearest 500m

    lat: float
    lon: float

    def to_display(self) -> dict:
        """Return fuzzed coordinates for public display."""
        # Add random noise within FUZZ_METERS radius
        noise_meters = self.FUZZ_METERS
        earth_radius = 6_371_000  # meters

        # Convert fuzz to degrees
        lat_noise = (noise_meters / earth_radius) * (180 / math.pi) * (2 * random() - 1)
        lon_noise = (noise_meters / (earth_radius * math.cos(math.radians(self.lat)))) \
                    * (180 / math.pi) * (2 * random() - 1)

        return {
            "lat": round(self.lat + lat_noise, 4),  # Round to 4 decimal places (~11m precision)
            "lon": round(self.lon + lon_noise, 4)
        }

    def distance_display(self, other_lat: float, other_lon: float) -> str:
        """
        Return approximate distance as text, not exact.
        "2 miles away" not "1.87 miles away"
        """
        exact_distance_km = self._haversine(other_lat, other_lon)

        # Round to nearest meaningful increment
        if exact_distance_km < 1:
            return "Less than 1 km away"
        elif exact_distance_km < 10:
            return f"{round(exact_distance_km)} km away"
        elif exact_distance_km < 50:
            return f"{round(exact_distance_km / 5) * 5} km away"  # Round to 5km
        else:
            return f"{round(exact_distance_km / 10) * 10} km away"  # Round to 10km

    def _haversine(self, lat2: float, lon2: float) -> float:
        R = 6371
        phi1, phi2 = math.radians(self.lat), math.radians(lat2)
        d_phi = math.radians(lat2 - self.lat)
        d_lambda = math.radians(lon2 - self.lon)
        a = math.sin(d_phi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(d_lambda/2)**2
        return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))


# Location storage rules:
# 1. Store exact lat/lon in the database (needed for distance queries)
# 2. NEVER return exact lat/lon in any API response
# 3. Only return fuzzed display location or distance text
# 4. Delete location history after 30 days (don't keep a movement log)
# 5. Require explicit permission before accessing location (mobile OS-level)
# 6. Offer "Last seen near X" instead of live location tracking
```

### Photo Security

```python
# Photo handling security
import boto3
import magic  # python-magic library for MIME type detection
import hashlib
from PIL import Image
import io

s3_client = boto3.client("s3", region_name="us-east-1")
BUCKET = "dating-app-photos-prod"

class PhotoUploader:
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB max
    ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
    MAX_DIMENSION = 4096  # Max width or height in pixels

    def validate_and_process(self, file_bytes: bytes, user_id: str) -> str:
        """
        Security validation before accepting any uploaded photo.

        Attacks prevented:
        1. File type spoofing: Check actual MIME type, not just extension
        2. Image bombs: Check dimensions before loading fully
        3. Malicious metadata: Strip EXIF data (removes GPS coordinates)
        4. Content injection: Verify it's actually an image, not a PHP file
        """
        # Check 1: File size
        if len(file_bytes) > self.MAX_FILE_SIZE:
            raise ValueError(f"File too large. Max {self.MAX_FILE_SIZE // 1024 // 1024}MB")

        # Check 2: Actual MIME type (not trusting the extension or Content-Type header)
        actual_mime = magic.from_buffer(file_bytes, mime=True)
        if actual_mime not in self.ALLOWED_MIME_TYPES:
            raise ValueError(f"Invalid file type: {actual_mime}")

        # Check 3: Open image, verify it's valid, check dimensions
        try:
            image = Image.open(io.BytesIO(file_bytes))
            width, height = image.size
        except Exception:
            raise ValueError("Cannot parse as image")

        if width > self.MAX_DIMENSION or height > self.MAX_DIMENSION:
            raise ValueError(f"Image too large. Max {self.MAX_DIMENSION}px")

        # Check 4: Strip EXIF metadata (CRITICAL — EXIF contains GPS coordinates!)
        # This prevents leaking where the photo was taken
        stripped_image = Image.new(image.mode, image.size)
        stripped_image.putdata(list(image.getdata()))  # Copy pixel data, no metadata

        # Normalize: convert to JPEG, resize if needed
        output = io.BytesIO()
        max_size = (1080, 1080)  # Cap at 1080x1080 for storage efficiency
        stripped_image.thumbnail(max_size, Image.Resampling.LANCZOS)
        stripped_image.save(output, format="JPEG", quality=85, optimize=True)

        # Generate a deterministic but unpredictable S3 key
        # Use a UUID prefix so URLs are not guessable
        content_hash = hashlib.sha256(file_bytes).hexdigest()[:16]
        import uuid
        s3_key = f"photos/{user_id}/{uuid.uuid4()}-{content_hash}.jpg"

        # Upload to S3 (private bucket — no public access)
        s3_client.put_object(
            Bucket=BUCKET,
            Key=s3_key,
            Body=output.getvalue(),
            ContentType="image/jpeg",
            # Server-side encryption
            ServerSideEncryption="aws:kms",
            SSEKMSKeyId="alias/dating-photos-key"
        )

        return s3_key

    def get_presigned_url(self, s3_key: str, user_id: str, expires_in: int = 3600) -> str:
        """
        Generate a temporary, signed URL for accessing a photo.
        Photos are NEVER publicly accessible — always through signed URLs.
        This lets us revoke access when accounts are banned.
        """
        return s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET, "Key": s3_key},
            ExpiresIn=expires_in  # URL expires in 1 hour by default
        )
```

### GDPR and Privacy Compliance

```python
# GDPR compliance implementation
# Key requirements: right to access, right to delete, data portability

class GDPRComplianceService:
    """
    Implements GDPR rights:
    - Article 15: Right of access (download your data)
    - Article 17: Right to erasure ("right to be forgotten")
    - Article 20: Data portability (export your data)
    """

    def export_user_data(self, user_id: str) -> dict:
        """
        Produces a complete export of all data we hold about this user.
        Must be provided within 30 days of request.
        """
        return {
            "personal_info": self._get_profile_data(user_id),
            "location_history": self._get_location_data(user_id),
            "matches": self._get_matches(user_id),
            "messages": self._get_messages(user_id),
            "likes_sent": self._get_likes_sent(user_id),
            "likes_received": self._get_likes_received(user_id),
            "photos": self._get_photo_metadata(user_id),
            "subscription_history": self._get_payments(user_id),
            "report_history": self._get_reports_filed(user_id),
            "exported_at": datetime.utcnow().isoformat()
        }

    def delete_user_data(self, user_id: str, reason: str = "user_request"):
        """
        Hard delete all user data.
        Must complete within 30 days (GDPR requirement).

        Exceptions to full deletion:
        - Financial records: Keep for 7 years (tax law)
        - Reports filed by/against this user: Keep anonymized (safety)
        - Conversations: Delete user's messages, but leave the other person's
        """
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"GDPR deletion initiated for user {user_id}", extra={
            "user_id": user_id,
            "reason": reason,
            "requested_at": datetime.utcnow().isoformat()
        })

        # Delete in dependency order (foreign keys)
        self._delete_messages(user_id)          # Delete message content
        self._delete_matches(user_id)           # Delete match records
        self._delete_likes(user_id)             # Delete swipe history
        self._delete_photos(user_id)            # Delete photos from S3 + DB
        self._anonymize_reports(user_id)        # Anonymize, don't delete (safety)
        self._delete_location_history(user_id)  # Delete location history
        self._delete_profile(user_id)           # Delete profile last

        # Mark account as deleted (for audit trail)
        self._mark_deleted(user_id, reason)

        logger.info(f"GDPR deletion complete for user {user_id}")

    def _anonymize_reports(self, user_id: str):
        """
        Don't delete safety reports — we need them to identify bad actors
        who create new accounts. But anonymize the reporter's identity.
        """
        # Replace user_id with a consistent pseudonym
        # So we can still track patterns without knowing who reported
        pseudonym = hashlib.sha256(f"anon_{user_id}".encode()).hexdigest()[:16]
        db.reports.update_many(
            {"reporter_user_id": user_id},
            {"$set": {"reporter_user_id": f"anonymized_{pseudonym}"}}
        )
```

### Security Checklist

```
AUTHENTICATION & ACCESS CONTROL
  ✅ Passwords hashed with Argon2id (not MD5, SHA1, or even bcrypt)
  ✅ JWT access tokens expire in 30 minutes
  ✅ Refresh tokens stored in DB for revocation
  ✅ Rate limiting on all auth endpoints (5 attempts / 5 min)
  ✅ Phone number OTP as second factor
  ✅ Account lockout after 10 failed attempts (15-min lockout)
  ✅ Secure cookie flags: HttpOnly, Secure, SameSite=Strict

DATA PROTECTION
  ✅ All data encrypted in transit (TLS 1.2+ only, no TLS 1.0/1.1)
  ✅ All data encrypted at rest (AES-256 via AWS KMS)
  ✅ EXIF metadata stripped from all uploaded photos
  ✅ Location fuzzed before returning to clients
  ✅ Photos stored in private S3 bucket, accessed via presigned URLs
  ✅ PII encrypted in database (email, phone number fields)
  ✅ Logs scrubbed of PII before storing

API SECURITY
  ✅ Rate limiting per IP and per user on all endpoints
  ✅ Input validation and sanitization on all inputs
  ✅ SQL injection prevented via parameterized queries (never string concatenation)
  ✅ Output encoding to prevent XSS in any web components
  ✅ CORS configured to allow only your app domains
  ✅ API versioning (allows deprecating insecure endpoints)
  ✅ No sensitive data in URLs (tokens, IDs in query params)
  ✅ Request size limits (prevent request smuggling / DoS)

CONTENT & PHOTO SECURITY
  ✅ MIME type validation (check actual file type, not just extension)
  ✅ Image dimensions validated before processing
  ✅ Photos scanned with PhotoDNA (Microsoft) or CSAI Match (Meta) for CSAM
  ✅ Nudity detection via ML before photos go live
  ✅ Photo IDs are UUIDs (not sequential integers — prevents enumeration)

INFRASTRUCTURE SECURITY
  ✅ Databases in private VPC subnet (not internet-accessible)
  ✅ Secrets in AWS Secrets Manager / Parameter Store (not env files)
  ✅ Principle of least privilege for all IAM roles
  ✅ VPC flow logs and CloudTrail enabled
  ✅ WAF (Web Application Firewall) in front of API
  ✅ DDoS protection (AWS Shield Standard at minimum)
  ✅ Security groups: databases accept connections only from app tier
  ✅ Regular security patches on all dependencies (automated via Dependabot)

COMPLIANCE
  ✅ GDPR: Right to access, delete, portability implemented
  ✅ CCPA: California users can request deletion
  ✅ COPPA: Age verification (no users under 18)
  ✅ NCMEC: CSAM reporting pipeline in place
  ✅ Privacy policy clearly explains data collection and use
```

---

## 🤖 Advanced AI Features

Modern dating apps in 2025 use AI far beyond basic profile sorting. Here are the advanced features that differentiate the best apps:

### AI-Powered Photo Selection

```python
# AI picks your best photos
# This runs when a user uploads photos and suggests which to use / which order

import tensorflow as tf
from PIL import Image
import numpy as np

class PhotoQualityScorer:
    """
    Scores photos on multiple dimensions:
    1. Technical quality: blur, brightness, composition
    2. Social signals: face visibility, smile, eye contact
    3. Attraction proxy: likes received / profile views ratio (A/B data)
    """

    def score_photo(self, image_path: str) -> dict:
        image = Image.open(image_path).convert("RGB")
        img_array = np.array(image.resize((224, 224))) / 255.0

        return {
            "blur_score": self._compute_blur_score(img_array),
            "brightness_score": self._compute_brightness(img_array),
            "face_score": self._detect_face_quality(img_array),
            "composition_score": self._rule_of_thirds_score(img_array),
            "overall_score": None  # Computed below
        }

    def _compute_blur_score(self, img_array) -> float:
        """Laplacian variance — low variance = blurry"""
        grayscale = np.mean(img_array, axis=2)
        laplacian = self._laplacian_filter(grayscale)
        variance = np.var(laplacian)
        return min(1.0, variance / 500)  # Normalize to 0-1

    def rank_photos(self, photos: list) -> list:
        """Return photos in recommended order (best photo first)."""
        scored = [(photo, self.score_photo(photo)) for photo in photos]
        return sorted(scored, key=lambda x: x[1]["overall_score"], reverse=True)
```

### Conversation AI — Icebreaker Generator

```python
# Generate personalized conversation starters based on profile content
# This increases first-message reply rates significantly

import anthropic

client = anthropic.Anthropic()

def generate_icebreaker(user_profile: dict, match_profile: dict) -> str:
    """
    Generate a personalized icebreaker message based on:
    - Match's prompt answers
    - Shared interests between the two users
    - Match's photos (hobbies, activities visible)

    Why this works: Messages that reference specific profile content
    get 3x higher reply rates than generic "hey" messages.
    """
    shared_interests = set(user_profile.get("interests", [])) & \
                       set(match_profile.get("interests", []))

    prompt_answers = match_profile.get("prompt_answers", [])
    top_prompt = prompt_answers[0] if prompt_answers else None

    system_prompt = """You are a dating app assistant helping users start conversations.
Generate 3 short, personalized, genuine icebreaker messages (1-2 sentences each).
Rules:
- Reference something SPECIFIC from their profile (not generic compliments)
- Be warm and curious, not pick-up-line-y
- End with a question to invite response
- Keep it casual and authentic
- Never be sexual or inappropriate"""

    user_message = f"""
Match's name: {match_profile['first_name']}
Match's prompt: "{top_prompt['question']}" → "{top_prompt['answer']}"
Shared interests: {', '.join(shared_interests) if shared_interests else 'none explicitly shared'}
Match's bio: {match_profile.get('bio', 'No bio')}

Generate 3 icebreaker options."""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",  # Fast and cheap for this use case
        max_tokens=300,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}]
    )

    return response.content[0].text
```

### Compatibility Scoring with ML

```python
# Advanced compatibility scoring beyond simple attribute matching
# Learns from behavioral signals: who replies, who goes on dates, who deletes together

import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingClassifier
import pandas as pd

class CompatibilityModel:
    """
    Predicts likelihood of a meaningful connection (not just a match, but a conversation
    or date) based on:
    - Profile similarity features
    - Behavioral compatibility (communication style, activity patterns)
    - Historical success patterns (similar pairings that led to conversations/dates)
    """

    def build_feature_vector(self, user_a: dict, user_b: dict) -> dict:
        """
        Build features that predict connection quality.
        These go far beyond simple attribute matching.
        """
        return {
            # Age compatibility
            "age_gap": abs(user_a["age"] - user_b["age"]),
            "age_gap_within_prefs": int(
                user_b["age"] >= user_a["pref_age_min"] and
                user_b["age"] <= user_a["pref_age_max"]
            ),

            # Interest overlap
            "jaccard_interests": self._jaccard(
                set(user_a["interests"]), set(user_b["interests"])
            ),
            "shared_interest_count": len(
                set(user_a["interests"]) & set(user_b["interests"])
            ),

            # Communication style match (from past conversation data)
            "avg_message_length_a": user_a.get("avg_message_length", 50),
            "avg_message_length_b": user_b.get("avg_message_length", 50),
            "message_length_ratio": user_a.get("avg_message_length", 50) /
                                    max(user_b.get("avg_message_length", 50), 1),

            # Activity pattern overlap (when they're online)
            "peak_hour_overlap": self._hour_overlap(
                user_a.get("peak_active_hours", []),
                user_b.get("peak_active_hours", [])
            ),

            # Response rate signals
            "user_a_reply_rate": user_a.get("message_reply_rate", 0.5),
            "user_b_reply_rate": user_b.get("message_reply_rate", 0.5),

            # Distance
            "distance_km": self._haversine(
                user_a["lat"], user_a["lon"],
                user_b["lat"], user_b["lon"]
            ),
            "within_user_a_pref": int(
                self._haversine(user_a["lat"], user_a["lon"],
                                user_b["lat"], user_b["lon"]) <= user_a["pref_distance_km"]
            ),
        }

    def _jaccard(self, set_a: set, set_b: set) -> float:
        if not set_a and not set_b:
            return 0.0
        return len(set_a & set_b) / len(set_a | set_b)

    def predict_match_quality(self, user_a: dict, user_b: dict) -> float:
        """Returns probability (0-1) that this pairing leads to a conversation."""
        features = self.build_feature_vector(user_a, user_b)
        feature_df = pd.DataFrame([features])
        return float(self.model.predict_proba(feature_df)[0][1])
```

### Safety AI — Real-Time Message Scanning

```python
# Real-time message safety system
# Runs on every message before delivery

class MessageSafetyScanner:
    """
    Scans messages for:
    1. Personal information (phone numbers, emails, addresses)
    2. Threats and harassment
    3. Explicit/inappropriate content
    4. Known scam patterns (money requests, crypto, gift cards)
    """

    # Patterns that indicate information sharing (protective intervention)
    PHONE_PATTERN = r'\b(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b'
    EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    SOCIAL_PATTERN = r'\b(instagram|snapchat|telegram|whatsapp|kik|line)\b'

    # High-risk scam keywords
    SCAM_PATTERNS = [
        r'\bgift\s*card\b',
        r'\bitunes\s*card\b',
        r'\bcrypto\b.*\binvest\b',
        r'\bsend\s*money\b',
        r'\bwire\s*transfer\b',
        r'\bwestern\s*union\b',
    ]

    def scan(self, message_text: str, sender_id: str, recipient_id: str) -> dict:
        """
        Returns:
        - allow: bool — should this message be delivered?
        - flags: list of issues detected
        - interventions: what to show the user
        """
        flags = []
        interventions = []

        import re

        # Check for phone numbers
        if re.search(self.PHONE_PATTERN, message_text):
            flags.append("contains_phone_number")
            interventions.append({
                "type": "safety_tip",
                "message": "Heads up: We noticed you shared a phone number. Stay safe — we recommend keeping conversations in the app until you're comfortable."
            })

        # Check for social media handles
        if re.search(self.SOCIAL_PATTERN, message_text, re.IGNORECASE):
            flags.append("contains_social_handle")
            interventions.append({
                "type": "safety_tip",
                "message": "Moving to social media? Make sure you know this person well first."
            })

        # Check for scam patterns
        for pattern in self.SCAM_PATTERNS:
            if re.search(pattern, message_text, re.IGNORECASE):
                flags.append("potential_scam")
                interventions.append({
                    "type": "scam_warning",
                    "message": "⚠️ This message has patterns we associate with scams. Never send money to someone you haven't met in person."
                })
                break  # One scam warning is enough

        # Run ML classifier for threats/harassment
        toxicity_score = self.toxicity_classifier.predict(message_text)
        if toxicity_score > 0.9:
            flags.append("high_toxicity")
            # Block delivery, flag for review
            return {
                "allow": False,
                "flags": flags,
                "interventions": [],
                "reason": "Message blocked: violates community guidelines"
            }

        # Allow with any applicable interventions
        return {
            "allow": True,
            "flags": flags,
            "interventions": interventions
        }
```

---

## Related Topics

### Prerequisites
- [Foundations](../../00-foundations/README.md) - Networking, HTTP, and data fundamentals
- [Programming](../../01-programming/README.md) - Python, SQL, and OOP concepts used in the code examples

### Core Architecture
- [Microservices Architecture](../../02-architectures/microservices/README.md) - How and why to decompose into services
- [Event-Driven Architecture](../../02-architectures/event-driven/README.md) - Real-time messaging and event streaming
- [Database Patterns](../../02-architectures/database-patterns/README.md) - Geospatial queries, indexing, and schema design
- [API Design](../../02-architectures/api-design/README.md) - RESTful and WebSocket API patterns
- [System Design Patterns](../../02-architectures/README.md) - Broader architecture decisions

### Related Domains
- [Social Media Platform](../social-media/README.md) - Similar real-time engagement, feeds, and notification patterns
- [Retail / E-commerce](../retail/README.md) - Recommendation systems and marketplace dynamics
- [Healthcare](../healthcare/README.md) - Privacy and data protection parallels

### Supporting Topics
- [Frontend Development](../../04-frontend/README.md) - React Native mobile development
- [Backend Development](../../05-backend/README.md) - Server-side API development, caching, and databases
- [Infrastructure & DevOps](../../06-infrastructure/README.md) - Scaling with Kubernetes and container orchestration
- [Security & Compliance](../../08-security/README.md) - Privacy, content moderation, and user safety
- [AI/ML](../../09-ai-ml/README.md) - Recommendation systems, ML-based matching, content moderation
- [Case Studies](../../11-case-studies/README.md) - Real-world platform scaling decisions
- [Development Methodologies](../../03-methodologies/README.md) - A/B testing frameworks and CI/CD for rapid iteration

### Learning Resources
- [YouTube, Books & Courses for Dating Platforms](./RESOURCES.md)
- [Domain Examples Resources](../RESOURCES.md)

---

**Ready to build?** Start with the microservices guide, then explore geospatial database patterns for efficient location-based queries.
