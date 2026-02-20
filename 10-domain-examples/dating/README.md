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
