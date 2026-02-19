# Claude Code Repository Guidelines

## 📋 Repository Philosophy

This repository follows a **"Simple Code, Detailed Explanation"** approach with domain expert knowledge across multiple fields.

## 🎯 Core Principles

### 1. Code Simplicity
- Keep code examples **concise and focused**
- Use **reference implementations** rather than production-ready code
- Prioritize **clarity over complexity**
- Include **minimal, working examples** that demonstrate concepts

### 2. Detailed Explanations
- Every concept must have **comprehensive explanations**
- Use **diagrams, analogies, and real-world examples**
- Explain **why** decisions are made, not just **what** they are
- Provide **context and use cases** for each pattern or technique

### 3. Domain Expert Knowledge
- Cover topics from **multiple domain perspectives**:
  - Software Architecture
  - Data Engineering
  - Machine Learning / AI
  - DevOps / MLOps
  - Cloud Infrastructure
  - Security and Compliance
  - Business Context

## 🛡️ Best Practices Focus

### Safety & Security
- **Input validation** in all examples
- **Error handling** patterns
- **Security considerations** highlighted
- **PII and data protection** guidelines
- **Authentication and authorization** patterns

### Quality Assurance
- **Testing strategies** for each approach
- **Code review checklists**
- **Performance considerations**
- **Monitoring and observability** patterns
- **Data quality** validation techniques

### Logging & Observability
- **Structured logging** examples
- **Trace IDs** and correlation
- **Metrics collection** patterns
- **Alert thresholds** and SLOs
- **Debugging strategies**

## 📐 Structure Guidelines

### For AI/ML Content
- **Use case driven** - Start with business problem
- **Simple code references** - Minimal working examples
- **List all patterns** - Statistical, ML, Deep Learning approaches
- **Safety first** - Data validation, drift detection, model monitoring
- **Quality focus** - Metrics, evaluation, testing strategies

### For Architecture Content
- **Concept over code** - Focus on architectural patterns
- **Simple diagrams** - Visual representations of structures
- **Multiple examples** - Different industry applications
- **Pros and cons** - Balanced view of trade-offs
- **Decision guides** - When to use each pattern

### For MLOps Content
- **Pipeline focus** - End-to-end workflows
- **Best practices** - CI/CD, versioning, monitoring
- **Reference implementations** - Configuration examples
- **Safety gates** - Validation, testing, rollback strategies
- **Quality metrics** - Performance, accuracy, reliability

## ✅ Documentation Standards

### Required Sections
1. **Overview** - What and why
2. **Key Concepts** - Core ideas explained
3. **Best Practices** - Safety, quality, logging
4. **Use Cases** - Multiple domain examples
5. **Common Pitfalls** - What to avoid
6. **References** - Links to related content

### Code Examples
```python
# ✅ Good: Simple, focused example with clear intent
def validate_input(data):
    """
    Validate input data with proper error handling.

    Best Practices:
    - Check for None/null values
    - Validate data types
    - Log validation failures
    - Return clear error messages
    """
    if data is None:
        logger.error("Input data is None")
        raise ValueError("Data cannot be None")

    # Validation logic...
    return validated_data

# ❌ Bad: Complex, production-level code with too many concerns
# (Avoid overly detailed implementations)
```

### Explanation Style
```markdown
## Concept Name

### What is it?
Brief definition in simple terms.

### Why use it?
Business and technical reasons.

### How it works?
Step-by-step explanation with diagrams.

### Use Cases
- **Domain 1**: Specific application
- **Domain 2**: Specific application
- **Domain 3**: Specific application

### Best Practices
- **Safety**: Security considerations
- **Quality**: Testing approach
- **Logging**: What to log and monitor

### Common Pitfalls
- What to avoid and why
- How to prevent issues

### Example
Simple code reference showing key concept.
```

## 🚫 What to Avoid

### Don't:
- Create **changelogs** or **implementation summaries**
- Include **overly complex** production code
- Focus on **single domain** without broader context
- Skip **safety and quality** considerations
- Ignore **logging and monitoring** patterns
- Write code without **detailed explanations**
- Provide examples without **use cases**

### Do:
- Update **existing README files** directly
- Keep code **simple and focused**
- Provide **multiple domain examples**
- Include **best practices** for safety, quality, logging
- Explain **trade-offs and decisions**
- Link **related concepts** together
- Use **visual aids** (diagrams, tables, flowcharts)

## 📚 Content Organization

### File Structure
```
topic/
├── README.md              # Main guide with overview
├── CONCEPT_1.md          # Detailed concept guide
├── CONCEPT_2.md          # Detailed concept guide
└── examples/             # Optional: Simple examples if needed
    ├── use_case_1/
    └── use_case_2/
```

### Cross-Referencing
- Link related concepts **within and across** topics
- Create **navigation guides** for learning paths
- Maintain **consistent terminology** throughout
- Use **breadcrumbs** for context

## 🎓 Learning Approach

### Progressive Complexity
1. **Beginner**: Core concepts with simple examples
2. **Intermediate**: Patterns and best practices
3. **Advanced**: Complex use cases and optimization
4. **Expert**: Production considerations and trade-offs

### Multi-Domain Coverage
- Show how concepts apply across **different industries**
- Provide **context-specific** examples
- Explain **domain-specific** challenges
- Include **real-world** scenarios

## 🔄 Maintenance

### Updating Content
- Update **existing README** files, don't create new summaries
- Keep **version history** in git, not in documentation
- Focus on **evergreen content** that remains relevant
- **Deprecate** outdated approaches clearly

### Quality Checks
- ✅ Simple, focused code examples
- ✅ Detailed explanations with diagrams
- ✅ Best practices for safety, quality, logging
- ✅ Multiple domain use cases
- ✅ Clear navigation and links
- ✅ No unnecessary files (changelogs, summaries)

## 📊 Success Metrics

### Good Documentation Has:
- **High clarity**: Concepts explained in multiple ways
- **Good coverage**: Multiple use cases and domains
- **Practical focus**: Real-world applicability
- **Best practices**: Safety, quality, and logging integrated
- **Easy navigation**: Clear structure and cross-links
- **Simple examples**: Code that clarifies, not obscures

---

**Remember**: The goal is to teach concepts through **simple examples** and **detailed explanations**, not to provide production-ready code libraries. Focus on understanding over implementation complexity.

*Last Updated: 2026-02-19*
