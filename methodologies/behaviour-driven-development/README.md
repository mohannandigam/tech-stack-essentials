# Behaviour-Driven Development (BDD)

## 📋 What is Behaviour-Driven Development?

**Behaviour-Driven Development (BDD)** is an extension of Test-Driven Development (TDD) that focuses on the behavior of an application from the end user's perspective. BDD uses natural language to describe how software should behave, making it understandable by both technical and non-technical team members.

## 🎯 Key Concepts

### Simple Analogy
Think of BDD like writing a movie script:
- **Feature** - The scene you're filming
- **Scenario** - What happens in the scene
- **Given-When-Then** - Setup → Action → Expected outcome

Everyone (director, actors, crew) can read and understand the script, just as everyone (developers, testers, business) can understand BDD scenarios.

### Core Principles
- **Collaboration** - Business, developers, and testers work together
- **Shared Understanding** - Everyone speaks the same language
- **Living Documentation** - Tests document expected behavior
- **Outside-In** - Start from user behavior, not technical implementation
- **Examples** - Use concrete examples to illustrate requirements

## ✅ Advantages

1. **Better Communication**
   - Bridge between technical and non-technical
   - Everyone understands requirements
   - Reduces misunderstandings

2. **Focus on User Value**
   - Tests describe what users want
   - Links features to business goals
   - Prevents building wrong thing

3. **Living Documentation**
   - Tests document system behavior
   - Always up to date
   - Can be read by anyone

4. **Early Problem Detection**
   - Clarify requirements before coding
   - Find gaps in understanding
   - Prevent rework

5. **Better Test Coverage**
   - Focus on important scenarios
   - Cover edge cases explicitly
   - Test what matters to users

## ❌ Challenges

1. **Initial Time Investment**
   - Writing scenarios takes time
   - Need collaboration sessions
   - Requires culture change

2. **Maintenance Overhead**
   - Scenarios need updating
   - Can become outdated
   - Requires discipline

3. **Tooling Learning Curve**
   - Need to learn BDD frameworks
   - Setup can be complex
   - Integration with CI/CD

4. **Can Be Overused**
   - Not everything needs BDD scenarios
   - Unit tests still needed
   - Balance is important

5. **Requires Buy-in**
   - Need whole team participation
   - Business must be involved
   - Cultural shift required

## 📝 The Gherkin Language

BDD scenarios are typically written in **Gherkin**, a simple, readable language.

### Basic Structure

```gherkin
Feature: User Login
  As a registered user
  I want to log into my account
  So that I can access my dashboard

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    And I click the login button
    Then I should see my dashboard
    And I should see a welcome message
```

### Gherkin Keywords

**Feature**: High-level description of functionality
```gherkin
Feature: Shopping Cart
  Description of the feature
```

**Scenario**: Specific example of behavior
```gherkin
Scenario: Add item to empty cart
```

**Given**: Initial context/setup
```gherkin
Given I have an empty shopping cart
Given I am logged in as "john@example.com"
```

**When**: Action/event
```gherkin
When I add a product to the cart
When I click the "Checkout" button
```

**Then**: Expected outcome
```gherkin
Then I should see 1 item in my cart
Then the total should be $29.99
```

**And/But**: Connect multiple steps
```gherkin
Given I am on the homepage
And I am logged in
When I search for "laptop"
But I don't see any results
Then I should see "No items found"
```

**Background**: Common setup for all scenarios
```gherkin
Background:
  Given I am logged in
  And I have items in my cart
```

**Scenario Outline**: Data-driven tests
```gherkin
Scenario Outline: Login with various credentials
  Given I am on the login page
  When I enter "<username>" and "<password>"
  Then I should see "<message>"

  Examples:
    | username | password | message |
    | valid@example.com | correct123 | Welcome! |
    | invalid@example.com | wrong | Invalid credentials |
    | blank@example.com | | Password required |
```

## 🔄 BDD Process (Three Amigos)

### 1. Discovery Phase
**Who**: Business Analyst/Product Owner + Developer + Tester

**Activities**:
- Discuss user stories
- Identify scenarios
- Ask questions
- Clarify requirements
- Find edge cases

**Output**: Concrete examples of behavior

### 2. Formulation Phase
**Who**: Whole team

**Activities**:
- Write scenarios in Gherkin
- Review and refine
- Ensure clarity
- Add examples

**Output**: BDD scenarios everyone agrees on

### 3. Automation Phase
**Who**: Developers + Testers

**Activities**:
- Implement step definitions
- Write glue code
- Execute scenarios
- Fix failures

**Output**: Automated, executable specifications

## 🧪 BDD Testing Levels

### 1. Feature-Level BDD (Most Common)
```gherkin
Feature: User Registration
  Scenario: Register with valid data
    Given I am on the registration page
    When I fill in valid registration details
    Then I should receive a confirmation email
```
- Tests complete features
- End-to-end perspective
- Slower but comprehensive

### 2. Unit-Level BDD (Spec-style)
```javascript
describe('User', () => {
  describe('validation', () => {
    it('should reject invalid email addresses', () => {
      const user = new User('invalid-email');
      expect(user.isValid()).toBe(false);
    });
  });
});
```
- BDD style for unit tests
- Fast and focused
- Developer-centric

### 3. Component-Level BDD
```gherkin
Feature: Shopping Cart Component
  Scenario: Calculate total price
    Given cart has items worth $10 and $20
    When I request the total
    Then the total should be $30
```
- Test components in isolation
- Faster than feature tests
- Good for complex components

## 🛠️ BDD Tools & Frameworks

### JavaScript/TypeScript
- **Cucumber.js** - Official Cucumber implementation
- **Jest-Cucumber** - BDD with Jest
- **CodeceptJS** - End-to-end testing with Gherkin
- **Cypress-Cucumber** - Cypress with Gherkin

### Python
- **Behave** - Popular BDD framework
- **pytest-bdd** - BDD for pytest
- **Lettuce** - Cucumber-inspired

### Java
- **Cucumber-JVM** - Cucumber for Java
- **JBehave** - Story-based BDD
- **Serenity BDD** - Advanced reporting

### Ruby
- **Cucumber** - Original BDD framework
- **RSpec** - BDD-style testing
- **Turnip** - Gherkin for RSpec

### C#/.NET
- **SpecFlow** - Popular .NET BDD
- **BDDfy** - Simple BDD framework
- **NBehave** - .NET BDD tool

### PHP
- **Behat** - BDD for PHP
- **Codeception** - Full-stack testing

## 📋 Example: Complete BDD Feature

```gherkin
Feature: Online Shopping Cart
  As an online shopper
  I want to manage items in my cart
  So that I can purchase products I want

  Background:
    Given I am logged in as "customer@example.com"
    And the following products exist:
      | name       | price | stock |
      | Laptop     | 999   | 10    |
      | Mouse      | 29    | 50    |
      | Keyboard   | 79    | 30    |

  Scenario: Add single item to empty cart
    Given my cart is empty
    When I add "Laptop" to my cart
    Then my cart should contain 1 item
    And the cart total should be $999

  Scenario: Add multiple items
    Given my cart is empty
    When I add "Laptop" to my cart
    And I add "Mouse" to my cart
    And I add "Keyboard" to my cart
    Then my cart should contain 3 items
    And the cart total should be $1107

  Scenario: Remove item from cart
    Given my cart contains:
      | product  | quantity |
      | Laptop   | 1        |
      | Mouse    | 2        |
    When I remove "Mouse" from my cart
    Then my cart should contain 1 item
    And the cart total should be $999

  Scenario: Update item quantity
    Given my cart contains 1 "Mouse"
    When I update "Mouse" quantity to 3
    Then the cart total should be $87

  Scenario: Cannot add out-of-stock item
    Given "Laptop" is out of stock
    When I try to add "Laptop" to my cart
    Then I should see an error "Product is out of stock"
    And my cart should be empty

  Scenario Outline: Apply discount codes
    Given my cart contains items worth $1000
    When I apply discount code "<code>"
    Then the cart total should be "<total>"

    Examples:
      | code      | total |
      | SAVE10    | $900  |
      | SAVE20    | $800  |
      | INVALID   | $1000 |
```

## 🧪 Testing Considerations for QA

### As a Tester in BDD

**Your Critical Role:**
- **Scenario Design** - You're the expert on edge cases
- **Collaboration** - Bridge business and technical
- **Quality Champion** - Ensure scenarios cover important cases
- **Documentation** - Keep scenarios clear and updated

### Writing Good Scenarios

**DO:**
✅ Write from user perspective
✅ Use concrete examples
✅ Keep scenarios focused
✅ Make scenarios independent
✅ Use business language
✅ Include edge cases

**DON'T:**
❌ Include technical implementation details
❌ Make scenarios too long
❌ Depend on execution order
❌ Use technical jargon
❌ Test everything with BDD

### Example: Good vs Bad Scenarios

**❌ Bad: Too technical**
```gherkin
Given the database table "users" is empty
When I execute a POST request to "/api/users"
Then the HTTP status should be 201
```

**✅ Good: User-focused**
```gherkin
Given no users exist
When I register a new account
Then I should receive a welcome email
```

**❌ Bad: Too vague**
```gherkin
When I do things
Then it works
```

**✅ Good: Specific**
```gherkin
When I add a product to my cart
Then the cart icon should show "1"
```

## 🎯 BDD Best Practices

### 1. Involve Everyone Early
- Three Amigos sessions
- Discuss scenarios before coding
- Get agreement from all

### 2. Focus on Behavior, Not Implementation
```gherkin
# Good - What the user does
When I log in with valid credentials

# Bad - How it's implemented
When I send a POST to /auth/login with username and password
```

### 3. Keep Scenarios Declarative
```gherkin
# Good - Declarative (what)
Given I have added items to my cart
When I proceed to checkout

# Less ideal - Imperative (how)
Given I am on the products page
And I click the "Laptop" button
And I click "Add to cart"
And I click the cart icon
And I click "Checkout"
```

### 4. Use Background Wisely
- Only for steps common to ALL scenarios
- Keep background short
- Don't overuse

### 5. One Scenario = One Behavior
- Test one thing per scenario
- Makes failures easier to diagnose
- Scenarios stay focused

## 🔗 BDD vs TDD

| Aspect | BDD | TDD |
|--------|-----|-----|
| **Focus** | Behavior & business value | Code correctness |
| **Language** | Natural language (Gherkin) | Programming language |
| **Audience** | Everyone | Developers |
| **Level** | Often higher level | Usually unit level |
| **When** | Before development | During development |
| **Purpose** | Define requirements | Drive design |

**Relationship**: BDD and TDD complement each other!
- Use BDD for acceptance criteria
- Use TDD for implementation

## 🎓 Learning Resources

### Getting Started

1. **Start with Examples**
   - Take a user story
   - Write 2-3 scenarios
   - Discuss with team
   - Refine and clarify

2. **Practice Writing Scenarios**
   - Use Given-When-Then format
   - Focus on clarity
   - Get feedback

3. **Tool Setup**
   - Choose a BDD framework
   - Set up basic project
   - Write simple scenarios
   - Automate step definitions

### Practice Ideas
1. Write scenarios for a login feature
2. Model a shopping cart
3. Describe a payment process
4. Write scenarios for form validation
5. Model a booking system

### Books & Resources
- "Specification by Example" - Gojko Adzic
- "The Cucumber Book" - Matt Wynne & Aslak Hellesøy
- "BDD in Action" - John Ferguson Smart

## 🔗 Related Topics
- [Test-Driven Development](../test-driven-development/README.md)
- [Agile Testing]
- [Acceptance Test-Driven Development]
- [Specification by Example]

---

**Next Steps**: Explore [Test-Driven Development (TDD)](../test-driven-development/README.md) to understand how to implement code that satisfies BDD scenarios!
