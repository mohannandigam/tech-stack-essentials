# Agile & Scrum

## What is it?

Agile is a flexible approach to building software that emphasizes delivering working products in small increments, adapting to change quickly, and collaborating closely with customers. Scrum is one specific framework for implementing Agile, providing a structured yet adaptable way to organize teams and work using fixed-length iterations called sprints, defined roles, and regular ceremonies that keep everyone aligned.

Instead of spending months planning every detail upfront and hoping it's right at the end (the traditional "waterfall" approach), Agile teams build in short cycles, get feedback, adjust, and continuously improve. Scrum gives you the specific playbook: how to organize work, who does what, when to meet, and how to measure progress.

## Simple Analogy

Think of building software like cooking a multi-course meal for guests whose tastes you don't fully know yet:

- **Waterfall approach**: You plan all 7 courses in advance, shop for everything, spend 6 hours cooking, then serve it all at once. If they're vegetarian and you made steak, you've wasted everything.

- **Agile/Scrum approach**: You make one course, serve it, get feedback ("I'm vegetarian!"), adjust your plan, make the next course, serve it, get more feedback ("more spicy!"), and keep adapting. After each course (sprint), you learn and improve.

The **Product Owner** is like the host who knows the guests and decides what to cook next. The **Scrum Master** is like the kitchen manager who keeps things running smoothly and removes obstacles. The **Development Team** are the chefs who actually prepare the food.

## Why does it matter?

### Real-World Impact

1. **Faster feedback loops**: Discover problems in weeks, not months or years
2. **Reduced waste**: Stop building features nobody wants
3. **Better adaptability**: Pivot when market conditions or requirements change
4. **Higher quality**: Continuous testing and integration catch bugs early
5. **Team morale**: Autonomy, collaboration, and visible progress keep people engaged
6. **Predictable delivery**: Regular sprints create rhythm and measurable velocity

**Business Value**:
- Products reach market 37% faster (VersionOne State of Agile Report)
- 65% improvement in project visibility
- 64% increase in team productivity
- 50% reduction in defects (when combined with engineering practices)

**Industries using Agile**:
- Software (startups to enterprises)
- Finance (banking, fintech)
- Healthcare (medical devices, health IT)
- Manufacturing (Toyota pioneered similar principles)
- Marketing (campaign management)
- Education (curriculum development)

## How it works

### The Agile Manifesto (2001)

Agile began with four core values:

1. **Individuals and interactions** over processes and tools
2. **Working software** over comprehensive documentation
3. **Customer collaboration** over contract negotiation
4. **Responding to change** over following a plan

This doesn't mean the items on the right have no value — just that the items on the left are more important.

### The 12 Agile Principles

1. Satisfy customers through early and continuous delivery
2. Welcome changing requirements, even late in development
3. Deliver working software frequently (weeks not months)
4. Business people and developers work together daily
5. Build projects around motivated individuals and trust them
6. Face-to-face conversation is the most efficient communication
7. Working software is the primary measure of progress
8. Sustainable development pace that can continue indefinitely
9. Continuous attention to technical excellence and good design
10. Simplicity — maximize the work not done
11. Self-organizing teams produce the best architectures and designs
12. Regular reflection and adjustment to improve effectiveness

### The Scrum Framework

Scrum operates in fixed-length iterations called **sprints** (usually 1-4 weeks, most commonly 2 weeks).

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCT BACKLOG                          │
│  (Prioritized list of all desired features)                 │
│  [Feature A] [Feature B] [Feature C] [Feature D] [...]      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SPRINT PLANNING                           │
│  Team selects top items they can complete this sprint       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SPRINT BACKLOG                           │
│  Selected items broken into tasks                           │
│  [Task 1] [Task 2] [Task 3] [Task 4] [Task 5]             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                SPRINT (1-4 weeks)                           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Daily Standup │  │ Daily Standup │  │ Daily Standup │   │
│  │   (15 min)    │  │   (15 min)    │  │   (15 min)    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│      Day 1             Day 2            Day N...           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SPRINT REVIEW                             │
│  Demonstrate completed work to stakeholders                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 SPRINT RETROSPECTIVE                        │
│  Team reflects: What went well? What to improve?           │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     INCREMENT                               │
│  Potentially shippable product increment                    │
│  (All completed features integrated and tested)             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                  (Back to Sprint Planning)
```

## Key Concepts

### Scrum Roles

#### 1. Product Owner (PO)

**What they do**:
- Define and prioritize features (manage the Product Backlog)
- Represent customer and business needs
- Accept or reject completed work
- Make tradeoff decisions (scope vs. time vs. quality)

**What they DON'T do**:
- Tell developers how to build things
- Manage the team
- Change priorities mid-sprint without team agreement

**Key responsibilities**:
- Write clear user stories with acceptance criteria
- Answer questions about requirements
- Attend Sprint Planning, Review, and Retrospective
- Be available to the team during the sprint

#### 2. Scrum Master (SM)

**What they do**:
- Facilitate Scrum ceremonies
- Remove blockers and obstacles
- Coach the team on Agile practices
- Shield the team from external interruptions
- Foster continuous improvement

**What they DON'T do**:
- Manage the team (it's self-organizing)
- Assign tasks to individuals
- Make technical decisions
- Act as a project manager in the traditional sense

**Key responsibilities**:
- Ensure Scrum practices are followed
- Mediate conflicts
- Track metrics (velocity, burndown)
- Identify and escalate impediments
- Foster psychological safety

#### 3. Development Team

**What they are**:
- Cross-functional (all skills needed to deliver)
- Self-organizing (decide how to do the work)
- Typically 3-9 people (5-7 is optimal)
- Collectively responsible for delivery

**What they do**:
- Estimate work
- Commit to sprint goals
- Build, test, and integrate features
- Collaborate on design and implementation
- Participate in all ceremonies

**Key principles**:
- No sub-teams or hierarchies
- No individual titles (everyone is a "Developer")
- Shared accountability for sprint success

### Scrum Artifacts

#### 1. Product Backlog

A prioritized list of everything that might be needed in the product.

**Characteristics**:
- Living document (constantly evolving)
- Ordered by value/priority (not alphabetically)
- Items at the top are more refined than those at the bottom
- Maintained by the Product Owner

**Example structure**:
```
Priority | Story                                    | Points | Status
---------|------------------------------------------|--------|----------
1        | User login with email                    | 5      | Ready
2        | Password reset flow                      | 3      | Ready
3        | Social media OAuth integration           | 8      | Ready
4        | Two-factor authentication                | 13     | In Progress
5        | User profile dashboard                   | 8      | Backlog
6        | Email notification preferences           | 5      | Backlog
7        | Dark mode theme                          | 3      | Backlog
8        | Export data to CSV                       | 5      | Backlog
```

#### 2. Sprint Backlog

The subset of Product Backlog items selected for the current sprint, plus a plan for delivering them.

**Characteristics**:
- Created during Sprint Planning
- Owned by the Development Team
- Updated daily as work progresses
- Includes tasks broken down from user stories

**Example**:
```
Story: User login with email (5 points)

Tasks:
□ Design login form UI mockup (2 hours)
□ Create login API endpoint (4 hours)
□ Implement password hashing (2 hours)
□ Build frontend login form (3 hours)
□ Add form validation (2 hours)
□ Write unit tests for authentication (3 hours)
□ Write integration tests (2 hours)
□ Add error handling and user feedback (2 hours)
```

#### 3. Increment

The sum of all completed Product Backlog items at the end of a sprint, plus all previous increments.

**Definition of Done (DoD)**:
- Code written and reviewed
- Unit tests passing (>80% coverage)
- Integration tests passing
- Documentation updated
- Deployed to staging environment
- Accepted by Product Owner
- No critical bugs

### Scrum Ceremonies

#### 1. Sprint Planning (Time-boxed: 2-4 hours for 1-week sprint)

**Purpose**: Select work for the upcoming sprint and create a plan.

**Two parts**:
1. **What** can we deliver? (First half)
   - Product Owner presents highest priority items
   - Team asks clarifying questions
   - Team decides how much they can commit to

2. **How** will we do it? (Second half)
   - Team breaks stories into tasks
   - Identifies dependencies and risks
   - Creates Sprint Goal

**Outputs**:
- Sprint Goal (one-sentence objective)
- Sprint Backlog
- Commitment from the team

**Example Sprint Goal**:
"Enable users to create accounts and log in securely so we can start building personalized features."

#### 2. Daily Standup / Daily Scrum (Time-boxed: 15 minutes)

**Purpose**: Synchronize the team and plan the next 24 hours.

**Three questions** (each person answers):
1. What did I complete yesterday?
2. What will I work on today?
3. What blockers do I have?

**Best Practices**:
- Same time, same place every day
- Stand up to keep it short
- Don't solve problems here — take detailed discussions offline
- Update task board during or right after
- Scrum Master tracks blockers for follow-up

**Anti-patterns to avoid**:
- Status report to the Scrum Master (team members should talk to each other)
- Problem-solving sessions (keep it to 15 minutes)
- People waiting for their turn instead of listening
- Remote team members being excluded

#### 3. Sprint Review (Time-boxed: 1-2 hours for 1-week sprint)

**Purpose**: Demonstrate completed work and gather feedback.

**Participants**:
- Scrum Team
- Stakeholders (customers, executives, other teams)

**Agenda**:
1. Product Owner reviews Sprint Goal and what was planned
2. Development Team demonstrates completed features (live demo, not slides)
3. Product Owner confirms what meets Definition of Done
4. Stakeholders provide feedback
5. Discuss what to do next based on feedback
6. Review timeline, budget, and marketplace changes

**Outcomes**:
- Shared understanding of what's done
- Feedback incorporated into Product Backlog
- Adjusted priorities based on new information

**Example demo script**:
```
"Let me show you the login feature we completed this sprint.

[Demo] First, I'll create a new account with my email...
[Demo] Now I'll try to log in with the wrong password — see the error message?
[Demo] With the correct password, I'm redirected to the dashboard.
[Demo] If I forget my password, I can click here to reset it...

We also added validation so you can't create weak passwords, and all passwords are securely hashed.

What questions do you have? What would you like to see different?"
```

#### 4. Sprint Retrospective (Time-boxed: 1-1.5 hours for 1-week sprint)

**Purpose**: Reflect on the sprint and identify improvements.

**Occurs**: After Sprint Review, before next Sprint Planning

**Participants**: Scrum Team only (sometimes stakeholders excluded to encourage honesty)

**Common formats**:

**Start/Stop/Continue**:
- What should we START doing?
- What should we STOP doing?
- What should we CONTINUE doing?

**4Ls (Liked/Learned/Lacked/Longed For)**:
- What we LIKED
- What we LEARNED
- What we LACKED
- What we LONGED FOR

**Sailboat** (visual metaphor):
- Wind (what's helping us move forward)
- Anchor (what's holding us back)
- Rocks (upcoming risks)
- Island (our goal)

**Output**:
- 1-3 concrete improvement actions
- Owner assigned to each action
- Tracked in next retrospective

**Example retrospective outcomes**:
```
Action Items from Sprint 12 Retrospective:

1. [Sarah] Set up automated deployment to staging by Sprint 13
   Why: Manual deployments take 2 hours and cause delays

2. [Team] Limit work-in-progress to 2 items per person
   Why: Context switching is reducing productivity

3. [Mark] Schedule pairing sessions for new feature areas
   Why: Knowledge is too siloed, increases bus factor risk
```

## User Stories and Acceptance Criteria

### User Story Format

The standard format connects features to user needs:

```
As a [type of user]
I want [some goal]
So that [some reason/benefit]
```

**Examples**:

**Good**:
```
As a returning customer
I want to save my payment information
So that I can check out faster on future purchases
```

**With acceptance criteria**:
```
As a mobile app user
I want to receive push notifications for order updates
So that I stay informed without constantly checking the app

Acceptance Criteria:
✓ User can enable/disable notifications in settings
✓ Notifications sent when order is: confirmed, shipped, out for delivery, delivered
✓ Tapping notification opens order details screen
✓ User can customize which events trigger notifications
✓ Works on iOS 14+ and Android 10+
✓ Notifications respect system "Do Not Disturb" settings

Definition of Done:
✓ Notifications sent within 30 seconds of status change
✓ Unit tests for notification service (>90% coverage)
✓ Integration tests with mock notification service
✓ Tested on 3 iOS devices and 3 Android devices
✓ Privacy policy updated (if needed)
✓ Analytics tracking added for notification engagement
```

### INVEST Criteria (Good User Stories Are)

- **Independent**: Can be developed in any order
- **Negotiable**: Details can be discussed and refined
- **Valuable**: Delivers value to users or business
- **Estimable**: Team can estimate size/effort
- **Small**: Fits within a sprint
- **Testable**: Clear acceptance criteria

### Story Splitting Techniques

When stories are too large, split them by:

1. **Workflow steps**: "Register" → "Enter info" + "Verify email" + "Complete profile"
2. **Business rules**: Simple case first, edge cases later
3. **User roles**: Admin view first, regular user later
4. **Data variations**: Handle text first, images later
5. **Platforms**: Web first, mobile later
6. **Operations**: Create first, then read, update, delete (CRUD)

## Estimation and Planning

### Story Points

A relative measure of effort, complexity, and uncertainty — NOT time.

**What influences points**:
- Complexity (how hard is it?)
- Amount of work (how much code/testing?)
- Uncertainty (how many unknowns?)
- Dependencies (how many other systems/teams?)

**Common scales**:
- **Fibonacci**: 1, 2, 3, 5, 8, 13, 21 (gaps reflect increasing uncertainty)
- **T-shirt sizes**: XS, S, M, L, XL, XXL (less precise, good for early estimation)
- **Powers of 2**: 1, 2, 4, 8, 16, 32

**Key principle**: Points are relative to the team's baseline

```
Reference Story (baseline = 3 points):
"Add a new field to existing form with validation"

Compared to baseline:
- 1 point: Simpler (e.g., fix typo in UI)
- 5 points: More complex (e.g., new form with multiple fields and API integration)
- 8 points: Much more complex (e.g., new feature with database changes and third-party API)
```

### Planning Poker

A consensus-based estimation technique.

**How it works**:
1. Product Owner reads user story
2. Team discusses and asks questions
3. Each person privately selects a card (with point value)
4. Everyone reveals simultaneously
5. Discuss outliers (highest and lowest explain reasoning)
6. Re-vote until consensus or close enough

**Why it works**:
- Prevents anchoring bias (everyone votes at once)
- Surfaces hidden assumptions (outliers reveal different understandings)
- Engages whole team (everyone participates)

**Example session**:
```
Story: "Add export to Excel feature"

Round 1 votes: 3, 5, 5, 8, 13

Discussion:
- "13" voter: "We need to handle large datasets without timeouts"
- "3" voter: "Oh, I thought it was just the current page, not all data"

After clarification...

Round 2 votes: 8, 8, 8, 8, 13

Decision: Estimate as 8 points, note performance concern in story
```

### Velocity

The average number of story points completed per sprint.

**How to calculate**:
```
Sprint 1: 23 points completed
Sprint 2: 18 points completed
Sprint 3: 25 points completed
Sprint 4: 21 points completed

Velocity = (23 + 18 + 25 + 21) / 4 = 21.75 points/sprint
```

**Using velocity for planning**:
- Team has velocity of ~22 points/sprint
- Product Backlog has 220 points of work
- Estimated delivery: 220 / 22 = 10 sprints

**Important notes**:
- Velocity is team-specific (Team A's 20 ≠ Team B's 20)
- Takes 3-5 sprints to stabilize
- Don't compare teams by velocity (different baselines)
- Don't use as a performance metric (encourages gaming the system)

### Burndown Charts

Visual representation of work remaining over time.

```
Points Remaining
│
50│ ●
  │  ╲
40│   ●
  │    ╲___
30│        ●___
  │            ●
20│             ╲___
  │                 ●___
10│                     ●___
  │                         ●___
 0│─────────────────────────────●──────────
   Day 1  3  5  7  9  11 13 15 17 19

   ● Actual progress
   ─── Ideal progress (straight line)
```

**What burndown reveals**:
- **Ahead of schedule**: Actual line below ideal
- **Behind schedule**: Actual line above ideal
- **Scope creep**: Line goes up mid-sprint (new work added)
- **Blocked**: Flat line (no progress)

## Kanban vs Scrum

### Core Differences

| Aspect | Scrum | Kanban |
|--------|-------|--------|
| **Cadence** | Fixed-length sprints (1-4 weeks) | Continuous flow |
| **Roles** | Product Owner, Scrum Master, Dev Team | No prescribed roles |
| **Ceremonies** | Sprint Planning, Daily Standup, Review, Retro | Optional (often daily standup + periodic review) |
| **Changes** | No changes mid-sprint | Can add work anytime |
| **Commitment** | Team commits to sprint backlog | No formal commitment |
| **Work Limits** | Sprint capacity | WIP limits per column |
| **Metrics** | Velocity, burndown | Cycle time, lead time, throughput |
| **Best for** | Feature development, planned releases | Support/maintenance, continuous delivery, ops |

### Kanban Board Structure

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   Backlog   │  To Do      │ In Progress │  Review     │    Done     │
│             │  (WIP: ∞)   │  (WIP: 3)   │  (WIP: 2)   │             │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│             │             │             │             │             │
│ [Story H]   │ [Story D]   │ [Story B]   │ [Story A]   │ [Story X]   │
│ [Story I]   │ [Story E]   │ [Story C]   │             │ [Story Y]   │
│ [Story J]   │ [Story F]   │ [Story G]   │             │ [Story Z]   │
│ [Story K]   │             │             │             │             │
│             │             │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

**WIP (Work In Progress) Limits**:
- Forces focus on finishing work before starting new work
- Reveals bottlenecks
- Improves flow efficiency

**When WIP limit is reached**:
- Can't pull new work into that column
- Team must help finish existing work or remove blockers
- Creates visibility into constraints

### ScrumBan (Hybrid Approach)

Combines Scrum's ceremonies and roles with Kanban's flow and WIP limits.

**Common in**:
- Teams transitioning from Scrum to Kanban
- Maintenance teams with unpredictable work
- Teams doing both planned features and support

## Scaling Agile

### SAFe (Scaled Agile Framework)

**Structure**: Multiple layers

1. **Team Level**: Individual Scrum teams
2. **Program Level**: Agile Release Train (5-12 teams synchronized)
3. **Large Solution Level**: Multiple trains for very large products
4. **Portfolio Level**: Strategic themes and epic funding

**Key concepts**:
- **Program Increment (PI)**: 8-12 week planning cycle
- **PI Planning**: 2-day event where all teams plan together
- **System Demo**: Integrated demo from all teams
- **Inspect & Adapt**: Large retrospective across teams

**Pros**:
- Comprehensive and well-documented
- Clear roles and ceremonies for large organizations
- Integrates portfolio and strategy

**Cons**:
- Heavy process overhead
- Can feel bureaucratic
- Expensive training and certification

### LeSS (Large-Scale Scrum)

**Principles**: Keep it simple, scale Scrum minimally

**Structure**:
- One Product Owner for all teams
- One Product Backlog for all teams
- One Definition of Done for all teams
- Multiple Scrum teams (3-9 teams for LeSS, 9+ for LeSS Huge)

**Key differences from SAFe**:
- Fewer roles and artifacts
- More decentralized decision-making
- Focuses on simplicity and systems thinking

**Best for**: Organizations wanting lightweight scaling

### Nexus

**Structure**: Integrates 3-9 Scrum teams

**Additional elements**:
- **Nexus Integration Team**: Ensures integration across teams
- **Nexus Sprint Planning**: Coordinated planning
- **Nexus Daily Scrum**: Representatives from each team
- **Nexus Sprint Review**: Integrated demo
- **Nexus Sprint Retrospective**: Cross-team improvements

**Best for**: Organizations already using Scrum wanting minimal additional complexity

### Choosing a Scaling Framework

| Teams | Recommendation |
|-------|----------------|
| 1-2 teams | Pure Scrum (no scaling framework needed) |
| 3-9 teams | Nexus or LeSS |
| 10+ teams | LeSS Huge or SAFe |
| Highly regulated | SAFe (more governance) |
| Value simplicity | LeSS |

## Agile Engineering Practices

### Integration with TDD (Test-Driven Development)

**How they complement each other**:
- Agile: What to build and when
- TDD: How to build it with quality

**Workflow**:
1. Product Owner defines acceptance criteria (Agile)
2. Developer writes failing test for criteria (TDD)
3. Developer implements minimum code to pass test (TDD)
4. Developer refactors (TDD)
5. Repeat until story is done (Agile)
6. Demonstrate in Sprint Review (Agile)

**Example**:
```
User Story:
As a user, I want to reset my password so I can regain access if I forget it.

Acceptance Criteria:
✓ User can request password reset via email
✓ Reset link expires after 24 hours
✓ User can set new password via link

TDD Approach:
1. Write test: test_user_can_request_password_reset()
2. Make it pass: Implement email sending
3. Write test: test_reset_link_expires_after_24_hours()
4. Make it pass: Add expiration logic
5. Write test: test_user_can_set_new_password()
6. Make it pass: Implement password update
7. Refactor: Clean up code, extract helpers
```

### Integration with BDD (Behavior-Driven Development)

**How they complement**:
- Agile user stories map directly to BDD scenarios
- BDD uses plain language (Given/When/Then) that Product Owners understand
- Living documentation stays in sync with code

**Example**:
```
User Story:
As a customer, I want to add items to my cart so I can purchase multiple products.

BDD Scenario (Gherkin):
Feature: Shopping Cart

  Scenario: Add item to empty cart
    Given I am on the product page for "Blue Widget"
    And my cart is empty
    When I click "Add to Cart"
    Then my cart should contain 1 item
    And the item should be "Blue Widget"
    And the cart total should be "$29.99"

  Scenario: Add item to cart with existing items
    Given I am on the product page for "Blue Widget"
    And my cart contains "Red Gadget"
    When I click "Add to Cart"
    Then my cart should contain 2 items
    And the cart total should be "$59.98"
```

These scenarios become executable tests that verify the implementation.

### Continuous Integration (CI) in Agile

**Practice**: Integrate code multiple times per day

**How it supports Agile**:
- Fast feedback on integration issues
- Reduces "integration hell" at end of sprint
- Keeps code always potentially shippable
- Enables continuous delivery

**Typical pipeline**:
```
Code Commit → Run Tests → Static Analysis → Build → Deploy to Staging → Automated Tests
     ↓             ↓            ↓             ↓            ↓                ↓
  Within 10s   Within 5min  Within 5min  Within 10min  Within 15min    Within 30min
                 ↓
           If failed → Notify team immediately
           If passed → Continue pipeline
```

## Distributed and Remote Agile

### Challenges

1. **Communication**: Harder to have informal conversations
2. **Time zones**: Synchronous ceremonies difficult
3. **Collaboration**: Pair programming and swarming more complex
4. **Team bonding**: Less social interaction
5. **Visibility**: Can't see what others are working on

### Adaptations

#### 1. Asynchronous Standups

Instead of synchronous 15-minute meeting:

**Slack/Teams format**:
```
Daily Standup Thread — February 19, 2026

@Sarah (9:00 AM EST):
✅ Yesterday: Completed API endpoint for user profile updates
📋 Today: Writing integration tests, then starting notification service
🚫 Blockers: None

@Michael (6:00 AM PST / 9:00 AM EST):
✅ Yesterday: Fixed bug in payment processing, deployed to staging
📋 Today: Code review for Sarah's PR, then working on refund flow
🚫 Blockers: Waiting on API keys from vendor (escalated to PM)

@Priya (7:00 PM IST / 8:30 AM EST):
✅ Yesterday: Designed mockups for checkout flow, incorporated feedback
📋 Today: Implementing frontend components for checkout
🚫 Blockers: None
```

**Best practices**:
- Set deadline for updates (e.g., by 10 AM team timezone)
- Follow up on blockers within 2 hours
- Optional synchronous call 2-3x per week for complex discussions

#### 2. Virtual Ceremonies

**Tools**:
- **Video**: Zoom, Google Meet, Microsoft Teams
- **Collaboration**: Miro, Mural, FigJam (virtual whiteboards)
- **Planning Poker**: Planning Poker Online, PlanITpoker
- **Retrospectives**: Retrium, Metro Retro, EasyRetro

**Sprint Planning adaptation**:
- Share agenda and materials 24 hours in advance
- Use virtual board for story breakdown
- Record session for those who can't attend live
- Follow up with written summary

**Retrospective adaptation**:
- Use template tools (Start/Stop/Continue, Sailboat, etc.)
- Anonymous input collection phase (15 minutes)
- Group similar items
- Discuss and vote synchronously
- Document and share action items immediately

#### 3. Maintain Team Culture

**Practices**:
- **Virtual coffee chats**: Random 1-on-1 pairings weekly
- **Donut Slack bot**: Automated coffee chat scheduling
- **Show & tell**: Informal demos of work-in-progress
- **Virtual team events**: Game nights, online cooking classes
- **Celebrate wins**: Public recognition in team channels
- **Regular video**: Encourage cameras on for better connection

#### 4. Over-communicate

**Documentation**:
- Write down decisions (don't rely on verbal)
- Keep team wiki updated
- Record architectural discussions
- Use RFCs (Request for Comments) for major changes

**Visibility**:
- Keep Jira/Linear updated in real-time
- Post updates in team channel
- Share work-in-progress screenshots
- Use GitHub draft PRs for early feedback

## Common Anti-Patterns

### 1. Zombie Scrum

**What it is**: Following Scrum rituals mechanically without understanding or adapting.

**Signs**:
- Standups are status reports to Scrum Master
- No real collaboration between team members
- Retrospectives don't lead to changes
- Demos don't include real stakeholders
- No one knows the Sprint Goal
- Team doesn't feel ownership

**How to fix**:
- Reconnect work to business outcomes
- Invite real users/stakeholders to reviews
- Scrum Master: Ask "Why are we doing this?" in every ceremony
- Implement at least one retrospective action per sprint
- Make Sprint Goal visible and reference it daily

### 2. Scrum Theater

**What it is**: Performing Scrum for appearances while actually working in old ways.

**Signs**:
- Sprints are just reporting periods (work continues the same)
- Plans are made outside of Sprint Planning
- Product Owner makes all decisions without team input
- "Agile" is just a label, processes haven't changed
- Teams told what to build and how to build it

**How to fix**:
- Leadership needs to genuinely empower teams
- Product Owner collaborates, doesn't dictate
- Team has autonomy on "how"
- Decisions made transparently in ceremonies
- Measure outcomes, not output

### 3. Waterfall-Scrum (Wagile)

**What it is**: Big upfront design hidden inside Agile ceremonies.

**Signs**:
- All requirements defined in detail before starting
- Design phase, then implementation phase (within sprints)
- No customer feedback until the end
- "Agile" is just shorter waterfall cycles
- Testing happens after development is "done"

**How to fix**:
- Vertical slicing (each sprint delivers end-to-end value)
- Continuous integration and testing
- Get feedback every sprint
- Start with minimum viable features
- Embrace change mid-project

### 4. Fake Product Owner

**What it is**: Product Owner is just a proxy, doesn't have real authority.

**Signs**:
- PO must get approval for all decisions
- PO doesn't know business priorities
- Requirements come from someone else
- PO can't answer team questions
- Decisions take days/weeks

**How to fix**:
- Give PO real authority and budget
- PO must have direct access to customers/stakeholders
- Train PO on business domain
- Escalate if PO role isn't empowered

### 5. Scrum Master as Project Manager

**What it is**: Scrum Master manages team like traditional PM.

**Signs**:
- Scrum Master assigns tasks
- Scrum Master tracks individual performance
- Team reports to Scrum Master instead of self-organizing
- Scrum Master makes technical decisions
- Focus on utilization over value delivery

**How to fix**:
- Scrum Master coaches, doesn't command
- Team pulls work, not assigned
- Team decides how to accomplish goals
- Scrum Master focuses on removing impediments
- Trust the team to organize themselves

### 6. Sprint Commitment Inflation

**What it is**: Team consistently over-commits and under-delivers.

**Signs**:
- Only 50-70% of stories completed each sprint
- Same stories roll over multiple sprints
- Team feels constant pressure and stress
- Velocity is unstable
- Quality suffers (cutting corners to finish)

**How to fix**:
- Commit to less (better to under-promise and over-deliver)
- Use historical velocity for planning
- Include buffer time for unknowns
- Be honest about capacity (vacations, meetings, etc.)
- Learn to say "no" or "not this sprint"

## Metrics and KPIs

### Health Metrics (How is the process?)

#### 1. Velocity
- **What**: Story points completed per sprint
- **Why**: Predictability and planning
- **Target**: Stable over time (±20%)
- **Warning signs**: Wildly fluctuating, trending down

#### 2. Sprint Goal Success Rate
- **What**: % of sprints where Sprint Goal was achieved
- **Why**: Measures focus and planning accuracy
- **Target**: >80%
- **Warning signs**: <50% indicates poor planning or too many interruptions

#### 3. Velocity Predictability
- **What**: Standard deviation of velocity
- **Why**: Stable velocity enables better forecasting
- **Target**: Low variance
- **Formula**: StdDev(velocity over last 6 sprints)

#### 4. Retrospective Action Completion
- **What**: % of retrospective actions completed by next retro
- **Why**: Measures commitment to improvement
- **Target**: >70%
- **Warning signs**: <50% indicates retrospectives aren't taken seriously

### Quality Metrics

#### 1. Defect Escape Rate
- **What**: Bugs found in production vs. caught before release
- **Why**: Measures test effectiveness
- **Target**: <5% escape to production
- **Formula**: (Bugs in Prod) / (Total Bugs) × 100

#### 2. Rework Rate
- **What**: % of sprint capacity spent fixing bugs from previous sprints
- **Why**: High rework means quality issues
- **Target**: <10% of sprint capacity
- **Warning signs**: >25% indicates technical debt or quality problems

#### 3. Code Review Time
- **What**: Time from PR creation to approval
- **Why**: Fast reviews maintain flow
- **Target**: <24 hours
- **Warning signs**: >48 hours creates bottlenecks

### Flow Metrics

#### 1. Cycle Time
- **What**: Time from starting work to completion
- **Why**: Measures efficiency
- **Target**: Shorter and consistent
- **Example**: Story moves from "In Progress" to "Done" in 3 days

#### 2. Lead Time
- **What**: Time from request to delivery
- **Why**: Customer-facing metric
- **Target**: Shorter lead time = faster value delivery
- **Example**: Story created to deployed in production: 12 days

#### 3. Work in Progress (WIP)
- **What**: Number of stories/tasks in progress simultaneously
- **Why**: Lower WIP = faster completion
- **Target**: Minimize WIP per person
- **Formula**: WIP = Active stories not yet done

### Value Metrics (Are we building the right thing?)

#### 1. Story Usage Rate
- **What**: % of delivered features actually used by customers
- **Why**: Validates we're solving real problems
- **Target**: >60% of features used within 30 days
- **How to measure**: Analytics, user tracking

#### 2. Customer Satisfaction (NPS/CSAT)
- **What**: User feedback scores after releases
- **Why**: Ultimate measure of success
- **Target**: NPS >50, CSAT >4/5
- **Collect**: Post-release surveys, user interviews

#### 3. Time to Market
- **What**: Idea to production deployment time
- **Why**: Speed of value delivery
- **Target**: Decreasing over time
- **Example**: Feature concept → live in production: 6 weeks

## Best Practices

### Safety & Security

1. **Security Stories in Backlog**
   - Treat security as features, not afterthoughts
   - Include threat modeling in Sprint Planning
   - Definition of Done includes security checks

2. **Secure Sprint Demos**
   - Don't expose real customer data
   - Use anonymized test data
   - Review what can be shown to different audiences

3. **Incident Response**
   - Have on-call rotation
   - Include "fix critical security bug" in sprint capacity
   - Run retrospectives after major incidents

### Quality Assurance

1. **Definition of Done (DoD)**
   - Agreed by whole team
   - Must be testable and objective
   - Includes non-functional requirements
   - Review and update in retrospectives

   **Example DoD**:
   ```
   ✓ Code written and peer reviewed
   ✓ Unit tests written and passing (>80% coverage)
   ✓ Integration tests passing
   ✓ Manual exploratory testing completed
   ✓ Accessibility requirements met (WCAG 2.1 AA)
   ✓ Performance within SLA (page load <2s)
   ✓ Security scan passed (no high/critical issues)
   ✓ Documentation updated
   ✓ Deployed to staging environment
   ✓ Product Owner accepted the work
   ```

2. **Test Automation**
   - Automate regression tests
   - Run tests in CI pipeline
   - Test pyramid: Many unit tests, fewer integration tests, few E2E tests

3. **Quality Gates**
   - Can't merge without: tests passing, code review approval, coverage threshold
   - Automated checks in CI/CD pipeline

### Logging & Observability

1. **Instrument Features**
   - Add logging when you add features
   - Track usage metrics
   - Set up alerts for errors

2. **Sprint Monitoring**
   - Daily: Check error rates from yesterday's deployments
   - Sprint Review: Include production metrics in demo
   - Retrospective: Review any production incidents

3. **Structured Logging**
   ```python
   # Include context in logs
   logger.info("User login attempt",
               user_id=user_id,
               trace_id=request.trace_id,
               ip_address=request.ip,
               sprint="Sprint-24")
   ```

4. **Observability Stories**
   - Include monitoring/alerting as acceptance criteria
   - "Feature is not done until we can monitor it"

## Tools

### Backlog Management

#### 1. Jira
- **Best for**: Enterprise teams, complex workflows
- **Features**: Customizable boards, advanced reporting, integrations
- **Pricing**: $7.75-$15.25/user/month
- **Pros**: Feature-rich, widely adopted
- **Cons**: Complex, can be overwhelming

#### 2. Linear
- **Best for**: Tech teams, fast-moving startups
- **Features**: Clean UI, keyboard shortcuts, Git integration
- **Pricing**: $8-$12/user/month
- **Pros**: Fast, developer-focused, beautiful
- **Cons**: Less enterprise features

#### 3. Azure Boards
- **Best for**: Microsoft ecosystem teams
- **Features**: Integrated with Azure DevOps, flexible work item types
- **Pricing**: Free for <5 users, then $6/user/month
- **Pros**: Tight Azure integration
- **Cons**: Less intuitive than competitors

#### 4. Trello
- **Best for**: Small teams, simple projects
- **Features**: Kanban boards, simple interface
- **Pricing**: Free-$17.50/user/month
- **Pros**: Easy to learn, visual
- **Cons**: Limited Agile features

### Collaboration & Ceremonies

#### 1. Miro / Mural
- **Use case**: Sprint Planning, Retrospectives, brainstorming
- **Features**: Virtual whiteboards, templates, voting
- **Pricing**: Free tier, then $8-$16/user/month

#### 2. Retrium / Metro Retro
- **Use case**: Dedicated retrospective tools
- **Features**: Built-in formats, action tracking, facilitation guides
- **Pricing**: $29-$59/month per team

#### 3. Planning Poker Online
- **Use case**: Estimation sessions
- **Features**: Real-time voting, multiple scales
- **Pricing**: Free-$9/month

### Time Tracking & Reporting

#### 1. Tempo (Jira add-on)
- **Use case**: Time tracking, capacity planning
- **Features**: Timesheets, reports, forecasting
- **Pricing**: $5-$10/user/month

#### 2. Harvest
- **Use case**: Time tracking, invoicing
- **Features**: Simple time entry, integrations
- **Pricing**: $12/user/month

## Use Cases

### Use Case 1: Early-Stage Startup (3-5 people)

**Context**: Building MVP, need speed and flexibility

**Agile Approach**:
- **Sprint length**: 1 week (fast feedback)
- **Ceremonies**: Lightweight
  - Sprint Planning: 1 hour
  - Daily Standup: 10 minutes (often informal)
  - Sprint Review: 30 minutes (demo to founders/early users)
  - Retrospective: 30 minutes
- **Roles**: Founder as Product Owner, no dedicated Scrum Master (rotating)
- **Tools**: Trello or Linear
- **Focus**: Shipping fast, learning from users

**Key practices**:
- Very short user stories
- Deploy to production multiple times per sprint
- Direct user feedback in Sprint Review
- Technical debt tracked but deferred if needed

### Use Case 2: Enterprise Product Team (8-12 people)

**Context**: Established product, regulatory requirements, multiple stakeholders

**Agile Approach**:
- **Sprint length**: 2 weeks (balance between feedback and planning overhead)
- **Ceremonies**: Full Scrum
  - Sprint Planning: 3 hours
  - Daily Standup: 15 minutes
  - Sprint Review: 1.5 hours
  - Retrospective: 1 hour
- **Roles**: Dedicated Product Owner and Scrum Master
- **Tools**: Jira, Confluence, Miro
- **Focus**: Quality, compliance, stakeholder management

**Key practices**:
- Detailed Definition of Done (includes security, compliance)
- Multiple review stages (code review, security review, PO acceptance)
- Formal documentation requirements
- Release train (multiple teams coordinated)

### Use Case 3: Support/Maintenance Team (5-7 people)

**Context**: Mostly reactive work (bugs, customer requests), some planned features

**Agile Approach**:
- **Framework**: ScrumBan (Scrum ceremonies + Kanban flow)
- **Sprint length**: 2 weeks, but with buffer capacity
- **Ceremonies**:
  - Sprint Planning: Plan 60-70% of capacity, leave 30-40% for reactive work
  - Daily Standup: 15 minutes
  - Sprint Review: Demo both planned and unplanned work
  - Retrospective: 45 minutes
- **Tools**: Jira with WIP limits
- **Focus**: Fast response time, continuous delivery

**Key practices**:
- SLA-based prioritization (P0 bugs interrupt sprint, P1 added to backlog)
- WIP limits: Max 2 items per person
- Kanban board with expedite lane for urgent work
- Measure cycle time and lead time

### Use Case 4: Distributed Team (10+ people across 3 time zones)

**Context**: Global team, 8-hour time zone spread (US, Europe, India)

**Agile Approach**:
- **Sprint length**: 2 weeks
- **Ceremonies**: Hybrid synchronous/asynchronous
  - Sprint Planning: Split into two sessions (one for each hemisphere)
  - Daily Standup: Asynchronous updates + optional sync 2x/week
  - Sprint Review: Recorded demo + async feedback + live Q&A
  - Retrospective: Async input collection + sync discussion
- **Tools**: Jira, Slack, Zoom, Miro
- **Focus**: Over-communication, documentation, inclusivity

**Key practices**:
- Core hours overlap (3 hours where all zones overlap)
- Pair programming across time zones (Europe-India morning, US-Europe afternoon)
- Written decision log (no decisions in private chats)
- Regular timezone rotation for meetings (share the pain)

### Use Case 5: Scaling with SAFe (100+ people, 15 teams)

**Context**: Large enterprise, complex product portfolio, regulatory environment

**Agile Approach**:
- **Framework**: SAFe
- **Sprint length**: 2 weeks
- **Program Increment**: 10 weeks (5 sprints + 1 innovation/planning sprint)
- **Ceremonies**: Full SAFe ceremonies
  - PI Planning: 2-day event every 10 weeks (all teams co-located or virtual)
  - Scrum of Scrums: Daily sync of Scrum Masters
  - System Demo: End of each sprint (integrated demo)
  - Inspect & Adapt: End of PI (large retrospective)
- **Roles**: Multiple Product Owners, Release Train Engineer, Solution Architect
- **Tools**: Jira Align, Confluence, Azure DevOps
- **Focus**: Coordination, dependencies, architectural runway

**Key practices**:
- Dependency mapping in PI Planning
- Architectural runway (infrastructure ready before features)
- Shared services teams
- Portfolio-level backlog management
- Compliance and security embedded in teams

## Common Pitfalls

### 1. Skipping Retrospectives
**Why it's bad**: No continuous improvement, same problems repeat
**Fix**: Protect retrospective time, make it valuable (try different formats)

### 2. Product Owner Unavailable
**Why it's bad**: Team blocked on decisions, builds wrong things
**Fix**: PO must be available during sprint, delegate if necessary

### 3. No Real Stakeholders in Sprint Review
**Why it's bad**: No real feedback, team presents to themselves
**Fix**: Actively invite users/stakeholders, make it engaging

### 4. Using Velocity to Compare Teams
**Why it's bad**: Points are team-specific, encourages gaming
**Fix**: Track velocity per team for planning, don't compare across teams

### 5. Cramming Too Much into Sprint
**Why it's bad**: Burnout, low quality, incomplete work
**Fix**: Under-commit, leave buffer, respect sustainable pace

### 6. Long-Running Branches
**Why it's bad**: Integration hell, merge conflicts, delayed feedback
**Fix**: Integrate daily, use feature flags, smaller stories

### 7. No Definition of Done
**Why it's bad**: Unclear when work is complete, quality varies
**Fix**: Create and enforce DoD, review regularly

### 8. Scrum Master Not Removing Impediments
**Why it's bad**: Team stays blocked, velocity drops
**Fix**: Actively track and escalate blockers daily

## Quick Reference

### Ceremony Timeboxes (2-week sprint)

| Ceremony | Duration | When |
|----------|----------|------|
| Sprint Planning | 4 hours | First day of sprint |
| Daily Standup | 15 minutes | Every day, same time |
| Sprint Review | 2 hours | Last day of sprint |
| Retrospective | 1.5 hours | After Sprint Review |
| Backlog Refinement | 2-4 hours/sprint | Mid-sprint (ongoing) |

### Role Responsibilities Cheat Sheet

| Role | Primary Focus | Don't Do |
|------|---------------|----------|
| Product Owner | What to build, priority, ROI | Tell team how to build, micromanage |
| Scrum Master | Process, remove blockers, coach | Assign tasks, manage team, make tech decisions |
| Development Team | How to build, estimation, delivery | Wait for assignments, work in silos |

### When to Use What

| Situation | Framework |
|-----------|-----------|
| New feature development, fixed scope | Scrum |
| Continuous support/maintenance | Kanban |
| Unpredictable work with some planning | ScrumBan |
| 3-9 teams, need coordination | Nexus or LeSS |
| 10+ teams, large enterprise | SAFe or LeSS Huge |
| High-compliance environment | SAFe |

### Estimation Scale Quick Guide

```
1 point:  < 1 day (simple bug fix, config change)
2 points: 1 day (small feature, straightforward)
3 points: 2-3 days (moderate complexity)
5 points: 3-5 days (significant work, some unknowns)
8 points: 5-8 days (complex, multiple parts)
13 points: > 8 days (too big, split into smaller stories)
```

### Red Flags Checklist

- ❌ Velocity wildly varies sprint to sprint
- ❌ Sprint Goal regularly not achieved
- ❌ Stories frequently roll over multiple sprints
- ❌ Retrospective actions never completed
- ❌ Product Owner unavailable during sprint
- ❌ No real users/stakeholders in Sprint Review
- ❌ Daily Standup is status report to Scrum Master
- ❌ Team doesn't know current Sprint Goal
- ❌ Technical debt increasing every sprint
- ❌ Team works overtime every sprint

## Related Topics

### Within This Repository

- **[Test-Driven Development (TDD)](../test-driven-development/)**: How to build quality into each story
- **[Behavior-Driven Development (BDD)](../behaviour-driven-development/)**: Connecting user stories to executable tests
- **[CI/CD Pipelines](../../06-infrastructure/ci-cd/)**: Automating the path from code to production
- **[Microservices Architecture](../../02-architectures/microservices/)**: How Agile teams organize around services
- **[DevOps Culture](../../06-infrastructure/devops/)**: Extending Agile principles to operations
- **[System Design Principles](../../02-architectures/)**: Designing systems that support Agile delivery

### External Resources

- **[Scrum Guide](https://scrumguides.org/)**: Official Scrum framework (free, 13 pages)
- **[Agile Manifesto](https://agilemanifesto.org/)**: Original principles and values
- **[SAFe Framework](https://scaledagileframework.com/)**: Comprehensive scaling guidance
- **[LeSS Framework](https://less.works/)**: Lightweight scaling approach
- **State of Agile Report**: Annual survey of Agile adoption and trends
- **[Scrum Alliance](https://www.scrumalliance.org/)**: Certification and training
- **[Agile Alliance](https://www.agilealliance.org/)**: Community and resources

---

**Last Updated**: 2026-02-19
**Maintainers**: Tech Stack Essentials Team
**License**: MIT
