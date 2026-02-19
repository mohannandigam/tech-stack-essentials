# Test-Driven Development (TDD)

## 📋 What is Test-Driven Development?

**Test-Driven Development (TDD)** is a software development approach where you write tests before writing the actual code. You write a failing test first, then write just enough code to make it pass, and finally refactor the code while keeping all tests passing.

## 🎯 Key Concepts

### Simple Analogy
Think of building with LEGO following instructions:
1. **Read the instruction** (write test) - Know what piece you need next
2. **Find and place the piece** (write code) - Add just that piece
3. **Check it matches** (test passes) - Verify it looks right
4. **Adjust if needed** (refactor) - Make it cleaner while staying correct

### The TDD Cycle: Red-Green-Refactor

```
🔴 RED: Write a failing test
    ↓
🟢 GREEN: Write minimal code to pass
    ↓
🔵 REFACTOR: Improve code quality
    ↓
(Repeat)
```

### Core Principles
- **Test First** - Always write test before code
- **Minimal Code** - Write only enough to pass the test
- **Incremental** - Build functionality piece by piece
- **Refactor Safely** - Tests ensure nothing breaks
- **Fast Feedback** - Know immediately if something breaks

## ✅ Advantages

1. **Better Design**
   - Forces you to think about API before implementation
   - Leads to more modular, testable code
   - Naturally creates loosely coupled components

2. **Fewer Bugs**
   - Catch bugs early in development
   - Tests act as safety net
   - Regression bugs caught immediately

3. **Confidence in Changes**
   - Refactor without fear
   - Add features knowing you didn't break existing ones
   - Safe to clean up code

4. **Living Documentation**
   - Tests show how code should be used
   - Examples of expected behavior
   - Always up to date

5. **Faster Development (Long-term)**
   - Slower initially
   - Less debugging time
   - Fewer production issues
   - Easier to add features later

## ❌ Challenges

1. **Learning Curve**
   - Feels unnatural at first
   - Takes time to master
   - Need to learn testing frameworks

2. **Initial Time Investment**
   - Slower development initially
   - More code to write (tests + production)
   - Can feel tedious

3. **Test Maintenance**
   - Tests need to be maintained
   - Can become outdated
   - Bad tests can slow you down

4. **Not Everything is Easy to Test**
   - UI testing can be complex
   - Legacy code hard to retrofit
   - External dependencies need mocking

5. **False Sense of Security**
   - Tests passing doesn't mean no bugs
   - Only test what you think of
   - Can miss edge cases

## 🔄 The TDD Process in Detail

### Step 1: 🔴 Write a Failing Test (Red)

**Before writing any code:**
```javascript
// Example: Testing a calculator add function
test('should add two numbers', () => {
  const calculator = new Calculator();
  const result = calculator.add(2, 3);
  expect(result).toBe(5);
});
```

**This test will FAIL** because `Calculator` doesn't exist yet!

### Step 2: 🟢 Write Minimal Code (Green)

**Write just enough to make test pass:**
```javascript
class Calculator {
  add(a, b) {
    return a + b;
  }
}
```

**Test now PASSES!** ✅

### Step 3: 🔵 Refactor

**Improve code without changing behavior:**
```javascript
class Calculator {
  add(a, b) {
    // Add validation if needed
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Arguments must be numbers');
    }
    return a + b;
  }
}
```

**Tests still PASS!** ✅

### Step 4: Repeat

Write next test, implement, refactor, repeat...

## 🧪 Types of Tests in TDD

### 1. Unit Tests (Primary Focus)
- Test individual functions/methods
- Fast and isolated
- Most common in TDD
- Mock external dependencies

```javascript
test('user validation rejects invalid email', () => {
  const user = new User('invalid-email');
  expect(user.isValid()).toBe(false);
});
```

### 2. Integration Tests
- Test components working together
- Test with real dependencies
- Fewer but important
- Catch integration issues

```javascript
test('user service saves to database', async () => {
  const userService = new UserService(database);
  await userService.createUser('john@example.com');
  const user = await database.findUser('john@example.com');
  expect(user).toBeDefined();
});
```

### 3. Acceptance Tests (Outside TDD)
- Test complete user scenarios
- Written from user perspective
- Usually complement TDD
- Often in BDD style

## 🎯 TDD Best Practices

### 1. Keep Tests Simple
```javascript
// Good: Clear and focused
test('returns empty array for no users', () => {
  expect(getUsers([])).toEqual([]);
});

// Bad: Too complex
test('complex scenario', () => {
  // 50 lines of setup and assertions
});
```

### 2. Test One Thing at a Time
```javascript
// Good: One assertion
test('calculates total price', () => {
  expect(calculateTotal([10, 20])).toBe(30);
});

// Less ideal: Multiple unrelated assertions
test('calculator works', () => {
  expect(calc.add(1, 2)).toBe(3);
  expect(calc.subtract(5, 2)).toBe(3);
  expect(calc.multiply(2, 3)).toBe(6);
});
```

### 3. Use Descriptive Test Names
```javascript
// Good: Describes behavior
test('returns error when email is invalid')
test('allows admin to delete posts')

// Bad: Vague
test('test1')
test('it works')
```

### 4. Follow AAA Pattern
```javascript
test('user can be created', () => {
  // Arrange: Setup
  const userData = { name: 'John', email: 'john@example.com' };
  
  // Act: Perform action
  const user = new User(userData);
  
  // Assert: Verify result
  expect(user.name).toBe('John');
});
```

### 5. Keep Tests Independent
- Each test should run independently
- No shared state between tests
- Can run in any order
- Use setup/teardown properly

## 🧪 Testing Considerations for QA

### As a Tester in a TDD Environment

**Your Role Changes:**
- Less focus on finding unit-level bugs (developers already tested)
- More focus on integration and system testing
- Verify acceptance criteria
- Find edge cases developers missed
- Test non-functional requirements

**What to Focus On:**

1. **Exploratory Testing**
   - Try unusual combinations
   - Test real user workflows
   - Think of edge cases

2. **Integration Testing**
   - Test components together
   - Verify system integration
   - Test with real data

3. **Non-Functional Testing**
   - Performance
   - Security
   - Usability
   - Accessibility

4. **Acceptance Testing**
   - Verify business requirements
   - Test from user perspective
   - Validate complete features

**Questions to Ask:**

- Are all acceptance criteria covered by tests?
- Are there missing edge cases?
- How does the system behave under load?
- What happens when dependencies fail?
- Are error messages user-friendly?

## 🛠️ TDD Tools & Frameworks

### JavaScript/TypeScript
- **Jest** - Popular all-in-one framework
- **Mocha + Chai** - Flexible combination
- **Vitest** - Fast, Vite-powered
- **Jasmine** - Behavior-driven

### Python
- **pytest** - Most popular
- **unittest** - Built-in
- **nose2** - Extended unittest

### Java
- **JUnit 5** - Standard framework
- **TestNG** - Advanced features
- **Mockito** - Mocking framework

### C#/.NET
- **NUnit** - Popular choice
- **xUnit** - Modern framework
- **MSTest** - Microsoft's framework

### Ruby
- **RSpec** - BDD-style testing
- **Minitest** - Lightweight

### Go
- **testing** - Built-in package
- **testify** - Assertion toolkit

## 🏢 Real-World Examples

**Companies Using TDD:**
- **Spotify** - Extensive TDD practice
- **Google** - Strong testing culture
- **Microsoft** - Adopted TDD widely
- **ThoughtWorks** - TDD advocates
- **Pivotal Labs** - TDD experts

**Success Stories:**
- Reduced bug density by 40-90%
- Fewer production defects
- Faster development over time
- More maintainable codebases

## 📊 TDD vs Traditional Testing

| Aspect | TDD | Traditional |
|--------|-----|-------------|
| **When** | Before code | After code |
| **Focus** | Design + Testing | Finding bugs |
| **Bugs Found** | During development | After development |
| **Code Coverage** | Usually high | Varies |
| **Refactoring** | Safe and easy | Risky |
| **Design** | Test-driven | Code-driven |
| **Documentation** | Tests = docs | Separate docs |

## 🎓 Learning Resources

### Getting Started with TDD

1. **Start Small**
   - Begin with simple functions
   - Practice the Red-Green-Refactor cycle
   - Don't worry about perfection

2. **Use Katas**
   - Coding exercises for practice
   - Examples: FizzBuzz, Bowling Game, Roman Numerals
   - Repeat to build muscle memory

3. **Pair Programming**
   - Learn from others
   - Get feedback on your approach
   - See different testing strategies

4. **Read Test Code**
   - Study open source test suites
   - Learn naming conventions
   - See patterns and practices

### Recommended Katas
- **FizzBuzz** - Classic beginner kata
- **Roman Numerals** - Practice incremental development
- **Bowling Game** - Complex rules, good for TDD
- **String Calculator** - Practice with requirements changes
- **Bank Account** - State management practice

### Books & Resources
- "Test Driven Development: By Example" - Kent Beck
- "Growing Object-Oriented Software, Guided by Tests" - Freeman & Pryce
- "The Art of Unit Testing" - Roy Osherove

## 🔗 Related Topics
- [Behaviour-Driven Development](../behaviour-driven-development/README.md)
- [Unit Testing Best Practices]
- [Continuous Integration/Deployment]
- [Code Coverage Tools]

## 💡 Common Misconceptions

❌ **"TDD means 100% code coverage"**
→ Coverage is a side effect, not the goal

❌ **"TDD is only for unit tests"**
→ Can be applied at different levels

❌ **"TDD makes development slower"**
→ Slower initially, faster in the long run

❌ **"You must write tests for everything"**
→ Use judgment; some code doesn't need tests

❌ **"TDD replaces QA"**
→ Complements QA; doesn't replace it

---

**Next Steps**: Explore [Behaviour-Driven Development (BDD)](../behaviour-driven-development/README.md) to see how tests can match business requirements!
