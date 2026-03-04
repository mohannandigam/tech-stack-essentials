# Technical Interview Preparation

## What Is This?

Technical interviews are the evaluation process companies use to assess whether a candidate can solve problems, design systems, communicate effectively, and fit into the team. This guide covers every type of technical interview, with strategies, examples, and practice frameworks.

### Simple Analogy

A technical interview is like a driving test. You're not just tested on whether you can drive from A to B — you're tested on whether you check your mirrors, signal properly, handle unexpected situations, and can explain your decisions. Knowing how to drive isn't enough; you need to demonstrate it under observation.

### Why This Matters

- The interview process determines your career trajectory — salary, company, role
- Interview skills are **learnable** — they're not innate talent
- Preparation follows the 80/20 rule — 20% of patterns cover 80% of questions
- The same preparation strategies work across companies and levels

## Interview Types

### 1. Coding Interviews (45-60 min)

You solve algorithmic problems on a whiteboard, in a shared editor, or on a take-home assignment. The interviewer evaluates your problem-solving approach, code quality, and communication.

**What interviewers actually evaluate:**

| Criteria | Weight | What They Look For |
|----------|--------|--------------------|
| Problem solving | 35% | Can you break down a problem systematically? |
| Code quality | 25% | Is your code clean, correct, and handles edge cases? |
| Communication | 25% | Do you think aloud and explain your approach? |
| Speed | 15% | Can you reach a working solution in time? |

**The approach that works:**

```
Step 1: UNDERSTAND (2-3 min)
├── Restate the problem in your own words
├── Ask clarifying questions
├── Identify inputs, outputs, and constraints
└── Walk through an example by hand

Step 2: PLAN (3-5 min)
├── Consider brute force first (always mention it)
├── Identify patterns (see patterns section below)
├── Choose an approach and explain WHY
└── State time/space complexity before coding

Step 3: CODE (15-25 min)
├── Write clean code with meaningful variable names
├── Talk through your logic as you write
├── Handle edge cases (empty input, single element, etc.)
└── Don't optimize prematurely — get it working first

Step 4: TEST (5 min)
├── Trace through your code with the example
├── Test edge cases: empty, one element, duplicates
├── Fix bugs calmly (everyone makes mistakes)
└── Discuss optimization opportunities
```

### 2. System Design Interviews (45-60 min)

You design a large-scale system (like Twitter, Uber, or a URL shortener). No single correct answer — interviewers evaluate your thinking process.

**The framework:**

```
Step 1: CLARIFY REQUIREMENTS (5 min)
├── Functional: What features? (post, like, follow, search)
├── Non-functional: Latency? Availability? Consistency?
├── Scale: How many users? Requests per second?
├── Constraints: Budget? Team size? Timeline?
└── Ask: "What should I focus on?" (saves time)

Step 2: ESTIMATE SCALE (5 min)
├── Users: DAU, MAU, peak concurrent
├── Storage: How much data per user/day/year?
├── Bandwidth: Read-heavy or write-heavy?
├── Example: 100M DAU × 10 reads/day = 1B reads/day
│           = ~12K reads/sec average
│           = ~36K reads/sec peak (3x average)
└── This guides your architectural choices

Step 3: HIGH-LEVEL DESIGN (10 min)
├── Draw the major components as boxes
├── Show data flow with arrows
├── Identify APIs (what endpoints exist?)
├── Choose database type with reasoning
└── Keep it simple — 5-7 components max

Step 4: DEEP DIVE (20 min)
├── Interviewer will pick 1-2 areas to explore
├── Database schema and indexing strategy
├── Caching: What to cache? Invalidation strategy?
├── Scaling: How to handle 10x growth?
└── Failure: What happens when X goes down?

Step 5: TRADE-OFFS (5 min)
├── Why you chose A over B
├── What would break first at 100x scale
├── What you'd do differently with more time
└── How to evolve the system over time
```

### 3. Behavioral Interviews (30-45 min)

You share stories about past experiences. These assess teamwork, leadership, conflict resolution, and cultural fit.

**The STAR Method:**

```
S - SITUATION: Set the context (1-2 sentences)
    "Our team was responsible for a payment service
     handling $10M/day in transactions."

T - TASK: What was YOUR responsibility? (1 sentence)
    "I was tasked with reducing the error rate from 2% to
     under 0.1% within one quarter."

A - ACTION: What did YOU specifically do? (3-5 sentences)
    "I analyzed the error logs and found that 80% of failures
     came from timeout issues with a third-party API. I
     implemented a circuit breaker pattern, added retry logic
     with exponential backoff, and created a fallback cache
     for frequently accessed data."

R - RESULT: Quantified outcome (1-2 sentences)
    "Error rate dropped from 2% to 0.05%. This prevented an
     estimated $50K/month in failed transactions and our team
     received the quarterly reliability award."
```

**Prepare 8-10 stories covering these themes:**
1. Technical challenge you overcame
2. Time you disagreed with a teammate/manager
3. Project that failed and what you learned
4. Time you led a project or initiative
5. Tight deadline situation
6. Conflict resolution
7. Mentoring or helping a colleague
8. Time you received difficult feedback
9. Situation where you had to learn something new quickly
10. Example of going above and beyond

### 4. Domain-Specific Interviews (varies)

Targeted questions for specific roles:

**Frontend:**
- Explain the event loop and rendering pipeline
- Debug a CSS layout issue live
- Build a component with state management
- Discuss accessibility and performance optimization

**Backend:**
- Design a database schema for a given scenario
- Implement a rate limiter or cache
- Discuss concurrency and thread safety
- Explain your approach to API versioning

**DevOps/SRE:**
- Design a CI/CD pipeline
- Troubleshoot a production outage scenario
- Discuss monitoring and alerting strategies
- Explain container orchestration trade-offs

**Data/ML:**
- Explain model selection for a given problem
- Discuss bias, fairness, and evaluation metrics
- Design a data pipeline
- Walk through feature engineering for a use case

## Coding Interview Patterns

Most coding problems fall into a small number of patterns. Learning patterns is more effective than grinding hundreds of random problems.

### Pattern 1: Two Pointers

**When to use**: Sorted arrays, finding pairs, partitioning
**Key insight**: Use two pointers moving toward each other or in the same direction

```python
def two_sum_sorted(nums, target):
    """
    Find two numbers in a sorted array that add to target.

    Why two pointers? A brute-force approach checks every pair (O(n²)).
    Since the array is sorted, we can start from both ends and
    move inward — if the sum is too big, move the right pointer left;
    if too small, move the left pointer right. This gives O(n).

    Example: nums = [1, 3, 5, 7, 9], target = 12
    Left=1, Right=9 → sum=10 → too small, move left
    Left=3, Right=9 → sum=12 → found it!
    """
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1    # Need bigger sum → move left pointer right
        else:
            right -= 1   # Need smaller sum → move right pointer left

    return []  # No pair found

# Practice: LeetCode #1 (Two Sum), #15 (3Sum), #11 (Container With Water)
```

### Pattern 2: Sliding Window

**When to use**: Subarray/substring problems, "maximum/minimum of k consecutive elements"
**Key insight**: Maintain a window that slides across the input

```python
def longest_unique_substring(s):
    """
    Find the length of the longest substring without repeating characters.

    Why sliding window? Checking every possible substring is O(n³).
    A sliding window maintains a "current valid window" and expands/shrinks
    it as needed — O(n).

    Example: s = "abcabcbb"
    Window: [a] → [a,b] → [a,b,c] → [b,c,a] → [c,a,b] → ...
    Longest: "abc" = length 3
    """
    char_index = {}   # Maps character → its most recent index
    max_length = 0
    window_start = 0

    for window_end, char in enumerate(s):
        # If char is already in our window, shrink from the left
        if char in char_index and char_index[char] >= window_start:
            window_start = char_index[char] + 1

        char_index[char] = window_end
        max_length = max(max_length, window_end - window_start + 1)

    return max_length

# Practice: LeetCode #3, #76 (Min Window Substring), #438 (Find Anagrams)
```

### Pattern 3: BFS/DFS (Graph/Tree Traversal)

**When to use**: Trees, graphs, mazes, connected components, shortest path
**Key insight**: BFS for shortest path (level-by-level); DFS for exhaustive exploration

```python
from collections import deque

def num_islands(grid):
    """
    Count the number of islands in a 2D grid.
    '1' = land, '0' = water. Connected land forms an island.

    Why BFS? We need to find connected components. Starting from each
    unvisited '1', BFS explores all connected land cells, marking them
    as visited. Each BFS start = one new island.

    Example:
    1 1 0 0 0
    1 1 0 0 0    → 3 islands
    0 0 1 0 0
    0 0 0 1 1
    """
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                # BFS to mark all connected land
                queue = deque([(r, c)])
                grid[r][c] = '0'  # Mark visited

                while queue:
                    row, col = queue.popleft()
                    for dr, dc in [(0,1), (0,-1), (1,0), (-1,0)]:
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            queue.append((nr, nc))

    return count

# Practice: LeetCode #200, #104 (Max Depth), #207 (Course Schedule)
```

### Pattern 4: Dynamic Programming

**When to use**: Optimization problems with overlapping subproblems
**Key insight**: If you can define the answer in terms of smaller subproblems, use DP

```python
def coin_change(coins, amount):
    """
    Find the minimum number of coins to make up the given amount.

    Why DP? The brute-force approach tries every combination (exponential).
    DP recognizes that the solution for amount=11 depends on solutions for
    amounts like 11-1=10, 11-5=6, 11-10=1 — subproblems we can cache.

    Example: coins = [1, 5, 10], amount = 11
    dp[0] = 0  (0 coins for amount 0)
    dp[1] = 1  (one 1-coin)
    dp[5] = 1  (one 5-coin)
    dp[10] = 1 (one 10-coin)
    dp[11] = 2 (one 10 + one 1)
    """
    # dp[i] = minimum coins needed for amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:
                dp[i] = dp[i - coin] + 1

    return dp[amount] if dp[amount] != float('inf') else -1

# Practice: LeetCode #322, #70 (Climbing Stairs), #198 (House Robber)
```

### Pattern 5: Binary Search

**When to use**: Sorted data, finding boundaries, optimization problems
**Key insight**: Eliminate half the search space each step

```python
def search_rotated(nums, target):
    """
    Find target in a rotated sorted array.

    Why binary search? Even though the array is rotated, ONE half is
    always sorted. We determine which half is sorted and whether
    our target falls in that half — eliminating the other half.

    Example: [4, 5, 6, 7, 0, 1, 2], target = 0
    Mid = 7, left half [4,5,6,7] is sorted, target 0 is NOT here
    → search right half [0, 1, 2]
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid

        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1  # Target is in sorted left half
            else:
                left = mid + 1   # Target is in right half
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1   # Target is in sorted right half
            else:
                right = mid - 1  # Target is in left half

    return -1  # Not found

# Practice: LeetCode #33, #34 (Find First and Last Position), #153 (Find Min)
```

### Pattern Summary

| Pattern | Recognize When | Time Complexity |
|---------|---------------|-----------------|
| Two Pointers | Sorted array, pair finding | O(n) |
| Sliding Window | Subarray/substring, consecutive elements | O(n) |
| BFS/DFS | Trees, graphs, connected components | O(V + E) |
| Dynamic Programming | Optimization with overlapping subproblems | O(n × m) typical |
| Binary Search | Sorted data, find boundary | O(log n) |
| Hash Map | Frequency counting, lookups | O(n) |
| Stack/Queue | Parentheses, monotonic patterns | O(n) |
| Backtracking | Generate permutations/combinations | O(2^n) or O(n!) |

## Common System Design Questions

### 1. Design a URL Shortener (e.g., bit.ly)

```
Key Decisions:
├── Hashing: Base62 encoding of auto-increment ID
├── Database: Key-value store (fast reads)
├── Caching: Redis for hot URLs (80/20 rule — 20% of URLs get 80% of traffic)
├── Scale: Read-heavy (100:1 read-to-write ratio)
└── Analytics: Async click tracking via message queue

Architecture:
Client → API Gateway → App Server → Cache (Redis) → Database
                                         ↓
                                    Analytics Queue → Analytics DB
```

### 2. Design Twitter/X Feed

```
Key Decisions:
├── Fan-out: On-write for normal users, on-read for celebrities
├── Timeline: Pre-computed, stored in Redis
├── Storage: Tweets in SQL, timeline in Redis, media in S3 + CDN
├── Scale: 500M tweets/day, mostly reads
└── Ranking: ML-based relevance scoring

Architecture:
Post Tweet → Write DB → Fan-out Service → Write to follower timelines
Read Feed  → Timeline Service → Redis (pre-built timeline) → Client
```

### 3. Design a Chat System (e.g., WhatsApp)

```
Key Decisions:
├── Protocol: WebSocket for real-time bidirectional
├── Message ordering: Timestamp + sequence number
├── Presence: Heartbeat-based (ping every 30s)
├── Storage: Messages in Cassandra (write-heavy)
├── Encryption: End-to-end (client-side keys)
└── Delivery: At-least-once with deduplication

Architecture:
Client ↔ WebSocket Gateway ↔ Message Service → Cassandra
                                    ↓
                              Notification Service (push for offline users)
```

### 4. Design a Rate Limiter

```
Key Decisions:
├── Algorithm: Token bucket (flexible) or sliding window (precise)
├── Storage: Redis (distributed, fast)
├── Granularity: Per-user, per-IP, per-endpoint
├── Response: 429 Too Many Requests + Retry-After header
└── Scale: Must be low-latency (adds to every request)

Token Bucket:
- Bucket holds N tokens (e.g., 100)
- Each request consumes 1 token
- Tokens refill at rate R per second (e.g., 10/s)
- If bucket empty → reject request
```

### 5. Design a Web Crawler

```
Key Decisions:
├── Frontier: Priority queue of URLs to visit
├── Politeness: Respect robots.txt, rate-limit per domain
├── Deduplication: URL fingerprinting (avoid re-crawling)
├── Storage: S3 for raw pages, Elasticsearch for indexing
├── Scale: Distributed workers pulling from shared queue
└── Freshness: Re-crawl frequency based on change rate

Architecture:
URL Frontier (queue) → Worker Pool → Fetch → Parse → Extract URLs
                                      ↓              ↓
                                Store Content    Add to Frontier
```

## Behavioral Interview Deep Dive

### Common Questions with Strong Answer Frameworks

**"Tell me about a time you disagreed with a teammate"**

```
What they're testing:
├── Can you disagree professionally?
├── Do you seek to understand before arguing?
├── Can you compromise or escalate appropriately?
└── Do you maintain relationships after disagreement?

Strong answer structure:
1. Acknowledge the other person's valid perspective
2. Explain your concern with data/evidence
3. Describe how you reached resolution
4. Share what you learned from their perspective
```

**"Describe a project that failed"**

```
What they're testing:
├── Can you take ownership of failures?
├── Do you learn from mistakes?
├── Are you self-aware about what went wrong?
└── Have you changed your approach since then?

Strong answer structure:
1. Briefly describe what you were building
2. Be honest about what went wrong (don't blame others)
3. Focus on what YOU would do differently
4. Show concrete changes you've made since
```

**"How do you handle tight deadlines?"**

```
What they're testing:
├── Can you prioritize under pressure?
├── Do you communicate proactively?
├── Can you scope/cut features when needed?
└── Do you maintain quality under pressure?

Strong answer structure:
1. Describe a specific deadline situation
2. Show how you prioritized (what you cut, what you kept)
3. Explain how you communicated with stakeholders
4. Share the outcome AND the quality of the result
```

## Company-Specific Guidance

### FAANG (Meta, Apple, Amazon, Netflix, Google)

| Aspect | Details |
|--------|---------|
| Coding rounds | 2-3 (LeetCode Medium/Hard) |
| System design | 1-2 (for mid-level and above) |
| Behavioral | 1-2 (leadership principles at Amazon) |
| Special rounds | Bar raiser (Amazon), Googleyness (Google) |
| Timeline | 4-8 weeks from application to offer |
| Compensation | $150K-$500K+ total comp (level-dependent) |

**Amazon-specific**: Prepare answers mapped to their 16 Leadership Principles. Every behavioral question maps to 1-2 principles.

**Google-specific**: The "Googleyness" round assesses intellectual humility, collaboration, and how you handle ambiguity.

### Startups (Seed to Series B)

| Aspect | Details |
|--------|---------|
| Process | Often a take-home + on-site |
| Focus | Practical skills over algorithms |
| Culture | Culture fit heavily weighted |
| Timeline | 1-3 weeks (faster than FAANG) |
| Compensation | Lower base, meaningful equity |
| Key differentiator | Show initiative and breadth |

### Growth-Stage Companies (Stripe, Airbnb, Uber, etc.)

| Aspect | Details |
|--------|---------|
| Process | Mix of coding + system design + behavioral |
| Focus | Domain expertise valued |
| Bar | Very high for senior roles |
| Timeline | 3-6 weeks |
| Compensation | Competitive with FAANG |
| Key differentiator | Show depth in their domain |

## What Interviewers Look For (by Level)

### Junior (0-2 years)
- **Can you code?** Solve a medium problem with hints
- **Can you learn?** Show curiosity and coachability
- **Can you communicate?** Think aloud, ask questions
- **Red flags**: Giving up quickly, not asking questions, poor code hygiene

### Mid-Level (2-5 years)
- **Can you solve independently?** Medium/hard problems without major hints
- **Can you design?** Small-to-medium systems with trade-off awareness
- **Can you lead small efforts?** Take a feature from idea to production
- **Red flags**: Over-engineering, not considering edge cases, no ownership stories

### Senior (5-8 years)
- **Can you design complex systems?** End-to-end, production-grade
- **Can you lead technical discussions?** Facilitate, not dominate
- **Can you mentor?** Show examples of growing others
- **Can you make architectural decisions?** With clear reasoning and trade-offs
- **Red flags**: No systems thinking, can't explain "why", no mentoring examples

### Staff+ (8+ years)
- **Can you set technical direction?** Multi-quarter/year vision
- **Can you influence across teams?** Without direct authority
- **Can you identify and solve ambiguous problems?** Not just assigned tasks
- **Can you drive major initiatives?** From proposal to execution
- **Red flags**: Only individual contributions, no strategic thinking, can't articulate impact

## Negotiation

### Salary Negotiation Framework

```
1. RESEARCH: Know the market rate
   ├── Levels.fyi for tech compensation data
   ├── Glassdoor for company-specific ranges
   └── Talk to people at the company (ask recruiters directly)

2. TIMING: Negotiate AFTER you have the offer
   ├── Never give a number first
   ├── If asked for expectations: "I'd like to understand the full
   │   opportunity before discussing compensation"
   └── Have competing offers if possible (strongest leverage)

3. STRATEGY:
   ├── Express enthusiasm for the role first
   ├── Then: "I was hoping we could get closer to $X"
   ├── Justify with market data or competing offers
   ├── Negotiate the full package: base, equity, sign-on, level
   └── Be willing to walk away (have a BATNA)

4. WHAT TO NEGOTIATE:
   ├── Base salary (raises compound over time)
   ├── Equity/RSUs (significant at FAANG)
   ├── Sign-on bonus (often flexible)
   ├── Level/title (affects future compensation)
   ├── Start date (sometimes a sign-on bonus trigger)
   └── Remote work flexibility
```

## Study Plan

### 8-Week Preparation Plan

```
Weeks 1-2: FOUNDATIONS
├── Review data structures (arrays, linked lists, trees, graphs, hash maps)
├── Review algorithms (sorting, searching, recursion)
├── Solve 3-5 easy problems per day
└── Practice explaining solutions aloud

Weeks 3-4: PATTERNS
├── Learn the 8 patterns above
├── Solve 2-3 medium problems per day using patterns
├── Start system design reading (Alex Xu's book)
└── Prepare 5 behavioral stories

Weeks 5-6: DEEP PRACTICE
├── Solve 1-2 medium/hard problems per day
├── Time yourself (45 min per problem)
├── Practice system design (1 per day)
├── Prepare remaining behavioral stories
└── Do mock interviews with friends

Weeks 7-8: REFINEMENT
├── Focus on weak areas
├── Full mock interviews (coding + system design + behavioral)
├── Review company-specific preparation
├── Rest well before interview day
└── Prepare questions to ask interviewers
```

## Interview Day Tips

### Before
- Get 8 hours of sleep (seriously — it matters more than one more practice problem)
- Eat a good breakfast
- Review your behavioral stories, not new problems
- Arrive 15 minutes early (or test your video/audio for virtual)

### During
- **Think aloud**: Silence is the enemy — narrate your thought process
- **Ask clarifying questions**: Shows you think before coding
- **Start with brute force**: Mention it, state its complexity, then optimize
- **Communicate trade-offs**: "I chose X because Y, but Z would be better if..."
- **Test your code**: Walk through an example, check edge cases
- **If stuck**: Ask for a hint (it's better than silence), try a simpler version first

### After
- Send a thank-you email within 24 hours
- Reflect on what went well and what to improve
- Don't obsess — move on to preparing for the next interview
- If rejected, ask for feedback (not all companies provide it)

## Resources

### System Design
- *System Design Interview* by Alex Xu (volumes 1 and 2)
- *Designing Data-Intensive Applications* by Martin Kleppmann
- ByteByteGo YouTube channel
- Grokking the System Design Interview (Educative)

### Coding
- LeetCode (focus on patterns, not quantity)
- NeetCode roadmap (curated 150 problems by pattern)
- *Cracking the Coding Interview* by Gayle Laakmann McDowell
- AlgoExpert (video explanations)

### Behavioral
- Amazon Leadership Principles guide
- *The STAR Interview* by Misha Yurchenko
- Grokking the Behavioral Interview (Educative)

### Mock Interviews
- Pramp (free peer mock interviews)
- Interviewing.io (anonymous mock interviews)
- Practice with friends or colleagues

---

**Remember**: Interviews are a skill that improves with practice. The best engineers fail interviews when unprepared, and average engineers pass when well-prepared. Put in the work, and the results will follow.

## Related Topics

- [Soft Skills](./soft-skills.md) — Communication and leadership skills
- [Learning Roadmaps](./learning-roadmaps.md) — Career path planning
- [System Design Concepts](../02-architectures/system-design-concepts/README.md) — Architecture patterns
- [Data Structures & Algorithms](../00-foundations/data-structures-algorithms/README.md) — CS fundamentals
