# Technical Interview Preparation

## Interview Types

### 1. Coding Interviews (45-60 min)
Solve algorithmic problems on a whiteboard or in an editor.

### 2. System Design Interviews (45-60 min)
Design a large-scale system (e.g., "Design Twitter").

### 3. Behavioral Interviews (30-45 min)
STAR method stories about past experiences.

### 4. Domain-Specific (varies)
Frontend, backend, ML, or DevOps specific questions.

## System Design Framework

### Step 1: Clarify Requirements (5 min)
**Functional**:
- What features? (e.g., post, like, comment)
- Who are the users?
- What scale? (DAU, requests/sec)

**Non-Functional**:
- Availability vs consistency?
- Latency requirements?
- Read-heavy or write-heavy?

### Step 2: High-Level Design (10 min)
Draw boxes:
- Client → API Gateway → Services → Databases
- Identify major components
- Show data flow

### Step 3: Deep Dive (20-25 min)
Interviewer will probe:
- Database choice and schema
- Caching strategy
- How to handle scale
- Failure scenarios

### Step 4: Discuss Trade-offs (5-10 min)
- Why you made choices
- Alternatives considered
- What would break first at scale
- How to evolve the system

## Common System Design Questions

1. **Design URL Shortener**: Hashing, database, caching
2. **Design Twitter**: Feed generation, fanout, real-time
3. **Design Uber**: Geospatial, matching, ETA calculation
4. **Design Instagram**: Image storage, CDN, feed ranking
5. **Design WhatsApp**: Real-time messaging, presence, encryption

## Coding Interview Patterns

### Arrays & Strings
- Two pointers, sliding window
- Practice: LeetCode #1, #15, #3

### Trees & Graphs
- DFS, BFS, tree traversals
- Practice: LeetCode #104, #200, #207

### Dynamic Programming
- Memoization, tabulation
- Practice: LeetCode #70, #198, #322

### Sorting & Searching
- Binary search, merge sort
- Practice: LeetCode #33, #34, #88

## Behavioral Interview (STAR Method)

**Situation**: Set the context
**Task**: What needed to be done?
**Action**: What YOU did
**Result**: Outcome and learnings

### Common Questions
1. "Tell me about a time you faced a conflict"
2. "Describe a technical challenge you solved"
3. "How do you handle tight deadlines?"
4. "Tell me about a time you failed"
5. "How do you learn new technologies?"

### Preparation
- Prepare 8-10 stories covering different scenarios
- Quantify results (reduced latency by 50%, saved $X)
- Focus on your actions, not the team
- Show growth/learning from failures

## Company-Specific Guidance

### FAANG (Meta, Apple, Amazon, Netflix, Google)
- 2-3 coding rounds (LC Medium/Hard)
- 1-2 system design (for mid+)
- Behavioral (leadership principles at Amazon)
- Bar raiser round (Amazon, Google)

### Startups
- Take-home project common
- Less algorithmic, more practical
- Culture fit important
- Equity negotiation matters

### Unicorns (Stripe, Airbnb, Uber)
- Mix of coding + system design
- Domain-specific questions
- High bar for senior roles
- Compensation competitive with FAANG

## What Interviewers Look For (by Level)

### Junior (0-2 years)
- Can you code?
- Problem-solving approach
- Communication
- Coachability

### Mid-Level (2-5 years)
- Solve problems independently
- Consider trade-offs
- Design small systems
- Write clean code

### Senior (5-8 years)
- Design complex systems
- Lead technical discussions
- Mentor others
- Make architectural decisions

### Staff+ (8+ years)
- Strategic thinking
- Cross-team influence
- Technical vision
- Drive major initiatives

## Resources

**System Design**:
- Grokking the System Design Interview (Educative)
- System Design Interview by Alex Xu
- ByteByteGo YouTube channel

**Coding**:
- LeetCode (focus on patterns, not quantity)
- NeetCode roadmap
- AlgoExpert

**Behavioral**:
- Grokking the Behavioral Interview
- Amazon Leadership Principles guide

## Interview Day Tips

1. **Before**: Get good sleep, eat well, arrive early
2. **During**: Think aloud, ask clarifying questions, communicate
3. **After**: Send thank-you email, reflect on performance
4. **If stuck**: Ask for hints, don't give up, show problem-solving
5. **Time management**: Leave time for testing, edge cases

---

**Practice, practice, practice**. Interviews are a skill that improves with repetition.
