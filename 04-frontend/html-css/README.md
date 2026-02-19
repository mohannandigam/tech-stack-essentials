# HTML & CSS Fundamentals

## What is HTML and CSS?

**HTML (HyperText Markup Language)** is the structural foundation of every web page. It defines the content and its meaning—headings, paragraphs, links, images, forms. HTML tells the browser what each piece of content is.

**CSS (Cascading Style Sheets)** is the presentation layer. It controls how HTML content looks—colors, layouts, spacing, fonts, animations. CSS tells the browser how content should appear.

### Simple Analogy

Building a web page is like building a house:

- **HTML** = The structure (walls, rooms, doors, windows)
- **CSS** = The interior design (paint, furniture, decorations)
- **JavaScript** = The utilities (electricity, plumbing, smart home features)

You can't decorate a house without walls, and walls without decoration look unfinished. HTML and CSS work together to create complete web experiences.

## Why HTML and CSS Matter

### They're Universal

- **Every website** uses HTML and CSS—no exceptions
- **Every framework** (React, Vue, Angular) ultimately generates HTML and CSS
- **Browser compatibility** is built into the standards
- **Search engines** read HTML to understand content
- **Screen readers** use HTML structure to help users navigate

### They're the Foundation

```
HTML & CSS (Core Web Technologies)
  ↓
JavaScript (Interactivity)
  ↓
Frameworks (Structure and Patterns)
  ↓
Your Application
```

Master HTML and CSS first, and everything else becomes easier.

### They're Powerful

Modern CSS can do things that once required JavaScript:
- Animations and transitions
- Grid and flexbox layouts
- Variables and calculations
- Responsive designs
- Dark mode with media queries

## HTML Fundamentals

### The Basic Structure

Every HTML document has the same basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Main Heading</h1>
  <p>Content goes here.</p>

  <script src="script.js"></script>
</body>
</html>
```

**What each part does:**

1. `<!DOCTYPE html>` - Tells the browser this is HTML5
2. `<html>` - Root element, wraps everything
3. `<head>` - Metadata, links to CSS, page title (not visible on page)
4. `<body>` - Visible content of the page
5. Scripts at end of body - Loads after content

### Semantic HTML

**What it means:**
Use HTML elements that describe their meaning, not just their appearance.

**Why it matters:**
- **Accessibility**: Screen readers use semantics to navigate
- **SEO**: Search engines understand content better
- **Maintainability**: Code is easier to understand
- **Styling**: Semantic elements are easier to style consistently

#### Common Semantic Elements

```html
<!-- Document Structure -->
<header>Site header with logo and navigation</header>
<nav>Navigation links</nav>
<main>Main content of the page</main>
<article>Self-contained content (blog post, product)</article>
<section>Thematic grouping of content</section>
<aside>Sidebar or tangential content</aside>
<footer>Site footer with links and copyright</footer>

<!-- Text Content -->
<h1> to <h6>Headings (h1 is most important)</h1>
<p>Paragraph of text</p>
<blockquote>Quoted text from another source</blockquote>
<code>Inline code reference</code>
<pre>Preformatted text (preserves whitespace)</pre>

<!-- Lists -->
<ul>Unordered list (bullets)</ul>
<ol>Ordered list (numbers)</ol>
<dl>Definition list (term and definition pairs)</dl>

<!-- Forms and Interactive -->
<form>Form container</form>
<button>Clickable button</button>
<input>Input field</input>
<label>Label for form element</label>

<!-- Media -->
<img>Image</img>
<video>Video player</video>
<audio>Audio player</audio>
<figure>Image with caption</figure>
<figcaption>Caption for figure</figcaption>
```

#### Semantic vs Non-Semantic

```html
<!-- ❌ Bad: Non-semantic -->
<div class="header">
  <div class="nav">
    <div class="nav-link">Home</div>
    <div class="nav-link">About</div>
  </div>
</div>
<div class="main-content">
  <div class="post">
    <div class="title">Article Title</div>
    <div class="text">Article content...</div>
  </div>
</div>
<div class="footer">
  Copyright 2026
</div>

<!-- ✅ Good: Semantic -->
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>
<footer>
  <p>Copyright 2026</p>
</footer>
```

### Forms and Input

Forms are how users interact with your application.

```html
<form action="/submit" method="POST">
  <!-- Text Input -->
  <label for="email">Email:</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    placeholder="you@example.com"
  >

  <!-- Password Input -->
  <label for="password">Password:</label>
  <input
    type="password"
    id="password"
    name="password"
    required
    minlength="8"
  >

  <!-- Select Dropdown -->
  <label for="country">Country:</label>
  <select id="country" name="country">
    <option value="">Select...</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
  </select>

  <!-- Radio Buttons -->
  <fieldset>
    <legend>Subscription Plan:</legend>
    <label>
      <input type="radio" name="plan" value="free" checked>
      Free
    </label>
    <label>
      <input type="radio" name="plan" value="pro">
      Pro
    </label>
  </fieldset>

  <!-- Checkbox -->
  <label>
    <input type="checkbox" name="newsletter" value="yes">
    Subscribe to newsletter
  </label>

  <!-- Textarea -->
  <label for="message">Message:</label>
  <textarea
    id="message"
    name="message"
    rows="4"
    placeholder="Your message here..."
  ></textarea>

  <!-- Submit Button -->
  <button type="submit">Submit Form</button>
</form>
```

**Best Practices:**

1. **Always use labels** - Connects text to input for accessibility
2. **Use appropriate input types** - Triggers correct mobile keyboards
3. **Include validation** - HTML5 built-in validation (required, pattern, etc.)
4. **Provide helpful placeholders** - But don't rely on them as labels
5. **Group related fields** - Use `<fieldset>` and `<legend>`

### Accessible HTML

#### Alt Text for Images

```html
<!-- ❌ Bad: No alt text -->
<img src="logo.png">

<!-- ❌ Bad: Redundant alt text -->
<img src="logo.png" alt="logo.png image">

<!-- ✅ Good: Descriptive alt text -->
<img src="logo.png" alt="Company Name Logo">

<!-- ✅ Good: Decorative images -->
<img src="decorative-line.png" alt="">
<!-- Empty alt tells screen readers to skip it -->
```

#### ARIA Labels

ARIA (Accessible Rich Internet Applications) adds semantic information when HTML isn't enough.

```html
<!-- Icon button without text -->
<button aria-label="Close menu">
  <svg><!-- X icon --></svg>
</button>

<!-- Loading state -->
<div aria-live="polite" aria-busy="true">
  Loading data...
</div>

<!-- Navigation landmarks -->
<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>

<nav aria-label="Footer navigation">
  <ul>...</ul>
</nav>
```

**ARIA Guidelines:**
1. Use semantic HTML first (prefer `<button>` over `<div role="button">`)
2. Don't override native semantics
3. All interactive elements must be keyboard accessible
4. Use ARIA landmarks to define page regions

#### Heading Hierarchy

```html
<!-- ✅ Good: Logical hierarchy -->
<h1>Main Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection</h3>
    <h3>Another Subsection</h3>
  <h2>Another Section</h2>
    <h3>Subsection</h3>

<!-- ❌ Bad: Skipping levels -->
<h1>Main Page Title</h1>
  <h4>Section Title</h4>  <!-- Skipped h2 and h3 -->
```

**Rules:**
- One `<h1>` per page
- Don't skip heading levels
- Don't use headings for styling (use CSS instead)

## CSS Fundamentals

### How CSS Works

CSS consists of **selectors** (what to style) and **declarations** (how to style it).

```css
/* Selector */
h1 {
  /* Declarations */
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}
```

### CSS Selectors

```css
/* Element selector - targets all <p> elements */
p {
  line-height: 1.6;
}

/* Class selector - targets elements with class="highlight" */
.highlight {
  background-color: yellow;
}

/* ID selector - targets element with id="header" */
#header {
  height: 80px;
}

/* Descendant selector - <p> inside .container */
.container p {
  margin: 1rem 0;
}

/* Direct child selector - direct children only */
.nav > li {
  display: inline-block;
}

/* Multiple selectors */
h1, h2, h3 {
  font-family: 'Arial', sans-serif;
}

/* Pseudo-classes - states */
a:hover {
  color: blue;
}

button:disabled {
  opacity: 0.5;
}

input:focus {
  border-color: blue;
}

/* Pseudo-elements - parts of elements */
p::first-line {
  font-weight: bold;
}

.quote::before {
  content: '"';
}
```

### The Box Model

Every element is a rectangular box with four areas:

```
┌─────────────────────────────────────┐
│           Margin (transparent)      │
│  ┌──────────────────────────────┐  │
│  │     Border                   │  │
│  │  ┌────────────────────────┐  │  │
│  │  │   Padding              │  │  │
│  │  │  ┌──────────────────┐  │  │  │
│  │  │  │    Content       │  │  │  │
│  │  │  │   (width/height) │  │  │  │
│  │  │  └──────────────────┘  │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

```css
.box {
  /* Content dimensions */
  width: 200px;
  height: 100px;

  /* Padding - space inside border */
  padding: 20px;
  /* padding-top, padding-right, padding-bottom, padding-left */
  padding: 10px 20px; /* vertical | horizontal */
  padding: 10px 20px 30px 40px; /* top | right | bottom | left (clockwise) */

  /* Border */
  border: 2px solid #333;
  border-radius: 8px; /* rounded corners */

  /* Margin - space outside border */
  margin: 20px;
  margin: 0 auto; /* centers block elements horizontally */
}

/* Box-sizing: include padding and border in width/height */
* {
  box-sizing: border-box; /* Almost always want this */
}
```

### CSS Units

```css
/* Absolute Units */
px     /* Pixels - fixed size */
cm, mm, in  /* Physical units - rarely used */

/* Relative Units (prefer these) */
%      /* Percentage of parent */
em     /* Relative to parent font-size */
rem    /* Relative to root font-size */
vw, vh /* Viewport width/height (1vw = 1% of viewport width) */
ch     /* Width of the "0" character */
```

**Best Practices:**
- Use `rem` for font sizes (scales with user preferences)
- Use `px` for borders and small, fixed sizes
- Use `%` or `vw/vh` for responsive layouts
- Use `em` for spacing relative to font size

```css
:root {
  font-size: 16px; /* Base font size */
}

h1 {
  font-size: 2rem;   /* 32px */
  margin-bottom: 1rem; /* 16px */
}

p {
  font-size: 1rem;   /* 16px */
  line-height: 1.5;  /* 24px (1.5 * 16px) */
}
```

### Colors

```css
/* Named colors */
color: red;
color: rebeccapurple;

/* Hexadecimal */
color: #ff0000;     /* Red */
color: #f00;        /* Shorthand */
color: #ff000080;   /* With alpha (opacity) */

/* RGB / RGBA */
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5); /* 50% opacity */

/* HSL / HSLA (Hue, Saturation, Lightness) */
color: hsl(0, 100%, 50%);      /* Red */
color: hsla(0, 100%, 50%, 0.5); /* 50% opacity */

/* CSS Variables */
:root {
  --primary-color: #007bff;
  --text-color: #333;
}

.button {
  background-color: var(--primary-color);
  color: white;
}
```

### Flexbox Layout

Flexbox is a one-dimensional layout system for arranging items in rows or columns.

**When to use:** Aligning items, distributing space, creating navigation bars, card layouts.

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```

```css
/* Parent (Flex Container) */
.container {
  display: flex;

  /* Direction */
  flex-direction: row;        /* default: left to right */
  flex-direction: column;     /* top to bottom */
  flex-direction: row-reverse; /* right to left */

  /* Horizontal alignment (main axis) */
  justify-content: flex-start;    /* default: start */
  justify-content: center;        /* center */
  justify-content: space-between; /* equal space between items */
  justify-content: space-around;  /* equal space around items */
  justify-content: space-evenly;  /* equal space including edges */

  /* Vertical alignment (cross axis) */
  align-items: stretch;    /* default: fill container */
  align-items: flex-start; /* align to top */
  align-items: center;     /* vertically center */
  align-items: flex-end;   /* align to bottom */

  /* Wrapping */
  flex-wrap: nowrap; /* default: all items on one line */
  flex-wrap: wrap;   /* wrap to multiple lines */

  /* Gap between items */
  gap: 1rem;         /* space between items */
  gap: 1rem 2rem;    /* row-gap column-gap */
}

/* Children (Flex Items) */
.item {
  /* Grow to fill available space */
  flex-grow: 1;

  /* Shrink when space is limited */
  flex-shrink: 1;

  /* Base size before growing/shrinking */
  flex-basis: 200px;

  /* Shorthand: flex-grow flex-shrink flex-basis */
  flex: 1 1 200px;
  flex: 1; /* Common: grow equally, shrink equally */

  /* Individual alignment */
  align-self: center; /* override container's align-items */
}
```

**Common Flexbox Patterns:**

```css
/* Centered content */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Navigation bar */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Equal-width columns */
.columns {
  display: flex;
  gap: 1rem;
}

.columns > * {
  flex: 1; /* All children grow equally */
}

/* Sticky footer */
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1; /* Grows to fill available space */
}
```

### Grid Layout

CSS Grid is a two-dimensional layout system for creating complex layouts with rows and columns.

**When to use:** Page layouts, dashboards, photo galleries, complex multi-column designs.

```html
<div class="grid">
  <header>Header</header>
  <aside>Sidebar</aside>
  <main>Main Content</main>
  <footer>Footer</footer>
</div>
```

```css
/* Grid Container */
.grid {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 1fr; /* 200px sidebar, flexible main */
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive */

  /* Define rows */
  grid-template-rows: auto 1fr auto; /* header, flexible main, footer */

  /* Gap between grid items */
  gap: 1rem;
  gap: 1rem 2rem; /* row-gap column-gap */

  /* Named grid areas (powerful pattern) */
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}

/* Grid Items */
header {
  grid-area: header;
}

aside {
  grid-area: sidebar;
}

main {
  grid-area: main;
}

footer {
  grid-area: footer;
}

/* Alternative: Position by line numbers */
.item {
  grid-column: 1 / 3;  /* Start at line 1, end at line 3 (spans 2 columns) */
  grid-row: 2 / 4;     /* Start at line 2, end at line 4 (spans 2 rows) */

  /* Shorthand */
  grid-column: span 2; /* Spans 2 columns */
  grid-row: span 3;    /* Spans 3 rows */
}
```

**Common Grid Patterns:**

```css
/* Responsive card grid */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* 12-column layout (like Bootstrap) */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.span-6 {
  grid-column: span 6; /* Half width */
}

.span-4 {
  grid-column: span 4; /* Third width */
}

/* Holy Grail Layout */
.holy-grail {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  min-height: 100vh;
}

header {
  grid-column: 1 / -1; /* Span all columns */
}

footer {
  grid-column: 1 / -1;
}
```

### Responsive Design

**What it is:**
Designing websites that work well on all screen sizes—from phones to large desktop monitors.

**Core Principles:**

1. **Mobile-First**: Start with mobile styles, add complexity for larger screens
2. **Fluid Layouts**: Use relative units (%, rem, fr) instead of fixed pixels
3. **Flexible Media**: Images and videos scale with their containers
4. **Media Queries**: Apply different styles at different screen sizes

#### Media Queries

```css
/* Mobile-first approach (recommended) */

/* Base styles (mobile) */
.container {
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column on mobile */
  gap: 1rem;
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on tablet */
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns on desktop */
  }
}

/* Large desktop (1440px and up) */
@media (min-width: 1440px) {
  .grid {
    grid-template-columns: repeat(4, 1fr); /* 4 columns on large screens */
  }
}
```

**Common Breakpoints:**

```css
/* Mobile: 320px - 767px (base styles) */
/* Tablet: 768px - 1023px */
/* Desktop: 1024px - 1439px */
/* Large Desktop: 1440px+ */
```

#### Responsive Images

```html
<!-- Fluid images -->
<style>
  img {
    max-width: 100%;
    height: auto;
  }
</style>

<!-- Different images for different screen sizes -->
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Description">
</picture>

<!-- Responsive images with srcset -->
<img
  src="image-800w.jpg"
  srcset="image-400w.jpg 400w,
          image-800w.jpg 800w,
          image-1200w.jpg 1200w"
  sizes="(min-width: 1024px) 800px,
         (min-width: 768px) 600px,
         100vw"
  alt="Description"
>
```

#### Mobile-First Meta Tag

```html
<!-- Always include in <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Without this, mobile browsers render at desktop width and zoom out.

### CSS Variables (Custom Properties)

```css
/* Define variables */
:root {
  /* Colors */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;

  /* Typography */
  --font-family: 'Helvetica Neue', Arial, sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-sm: 0.875rem;

  /* Borders */
  --border-radius: 0.25rem;
  --border-color: #dee2e6;
}

/* Use variables */
.button {
  background-color: var(--primary-color);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-family: var(--font-family);
}

/* Variables with fallback */
.element {
  color: var(--text-color, #333); /* Uses #333 if --text-color not defined */
}

/* Override variables in specific contexts */
.dark-theme {
  --primary-color: #0d6efd;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}
```

**Benefits:**
- DRY (Don't Repeat Yourself)
- Easy theming
- Can be changed with JavaScript
- Cascade like normal CSS

### Animations and Transitions

#### Transitions (smooth changes)

```css
/* Syntax: property duration timing-function delay */
.button {
  background-color: blue;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: darkblue;
  /* Smoothly transitions over 0.3s */
}

/* Multiple properties */
.card {
  transform: scale(1);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* Shorthand: all properties */
.element {
  transition: all 0.3s ease;
}
```

#### Animations (keyframes)

```css
/* Define animation */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Multiple steps */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Apply animation */
.element {
  animation: slideIn 0.5s ease-out;
}

.pulsing {
  animation: pulse 1s ease-in-out infinite;
  /* name | duration | timing | iteration */
}

/* Full animation properties */
.animated {
  animation-name: slideIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-delay: 0.2s;
  animation-iteration-count: 1; /* or infinite */
  animation-direction: normal; /* or reverse, alternate */
  animation-fill-mode: forwards; /* keeps final state */
}
```

**Common Timing Functions:**
- `ease` - Start slow, fast middle, slow end (default)
- `linear` - Constant speed
- `ease-in` - Start slow
- `ease-out` - End slow
- `ease-in-out` - Both slow
- `cubic-bezier(n,n,n,n)` - Custom curve

## Best Practices

### Performance

1. **Minimize Reflows and Repaints**

```css
/* ❌ Bad: Triggers layout recalculation */
.element:hover {
  width: 200px; /* Changes layout */
}

/* ✅ Good: GPU-accelerated, no layout change */
.element:hover {
  transform: scale(1.1);
}
```

**Performant properties:** `transform`, `opacity`
**Expensive properties:** `width`, `height`, `top`, `left`, `margin`

2. **Use Efficient Selectors**

```css
/* ❌ Slow: Browser checks every element */
* {
  box-sizing: border-box;
}
/* Note: This specific rule is commonly used and acceptable */

/* ❌ Slow: Too specific */
div.container > ul > li > a.link {
  color: blue;
}

/* ✅ Fast: Class selector */
.nav-link {
  color: blue;
}
```

3. **Minimize CSS File Size**

- Remove unused CSS (use PurgeCSS or similar)
- Minify CSS in production
- Use efficient shorthand properties
- Avoid over-specific selectors

### Maintainability

1. **Use Consistent Naming**

```css
/* BEM (Block Element Modifier) - Popular convention */
.card { }                  /* Block */
.card__title { }          /* Element */
.card__button { }         /* Element */
.card--featured { }       /* Modifier */
.card__button--disabled { } /* Element Modifier */

/* Alternative: Use semantic class names */
.product-card { }
.product-card-title { }
.product-card-price { }
```

2. **Organize CSS**

```css
/* Recommended order */
.element {
  /* Positioning */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;

  /* Display & Box Model */
  display: flex;
  width: 100px;
  height: 100px;
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ccc;

  /* Visual */
  background-color: white;
  color: #333;
  font-size: 1rem;
  line-height: 1.5;

  /* Misc */
  cursor: pointer;
  transition: all 0.3s;
}
```

3. **Comment Complex Code**

```css
/* Multi-line centering technique for unknown dimensions */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Z-index scale (documented for entire project) */
/* 1-9: Normal content */
/* 10-19: Dropdowns and popovers */
/* 20-29: Modals */
/* 30+: Tooltips and highest priority */
```

### Accessibility

1. **Focus Styles**

```css
/* ❌ Never do this */
*:focus {
  outline: none;
}

/* ✅ Always provide visible focus */
button:focus {
  outline: 2px solid blue;
  outline-offset: 2px;
}

/* ✅ Or custom focus style */
.button:focus {
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  outline: none; /* OK if you provide alternative */
}

/* ✅ Modern approach: focus-visible */
button:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

2. **Color Contrast**

```css
/* Check contrast ratios */
/* WCAG AA: 4.5:1 for normal text, 3:1 for large text */
/* WCAG AAA: 7:1 for normal text, 4.5:1 for large text */

/* ✅ Good contrast */
.text {
  color: #333;           /* Dark gray */
  background-color: #fff; /* White - ratio ~12:1 */
}

/* ❌ Poor contrast */
.text-bad {
  color: #ccc;           /* Light gray */
  background-color: #fff; /* White - ratio ~1.6:1 - FAILS */
}
```

Tools: Check contrast with Chrome DevTools or online calculators.

3. **Don't Hide Content from Screen Readers**

```css
/* ❌ Bad: Hides from screen readers */
.visually-hidden-bad {
  display: none;
  visibility: hidden;
}

/* ✅ Good: Visually hidden but available to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

4. **Respect User Preferences**

```css
/* Reduced motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #1a1a1a;
    --text-color: #ffffff;
  }
}
```

### Cross-Browser Compatibility

```css
/* Vendor prefixes (autoprefixer handles this automatically) */
.element {
  -webkit-transform: rotate(45deg); /* Safari, Chrome */
  -moz-transform: rotate(45deg);    /* Firefox */
  -ms-transform: rotate(45deg);     /* IE */
  transform: rotate(45deg);         /* Standard */
}

/* Feature queries */
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex; /* Fallback */
  }
}
```

**Tools:**
- Autoprefixer (automatically adds vendor prefixes)
- Can I Use (check browser support)
- Modernizr (feature detection)

## Common Patterns

### Card Component

```html
<article class="card">
  <img src="image.jpg" alt="Card image" class="card__image">
  <div class="card__content">
    <h2 class="card__title">Card Title</h2>
    <p class="card__description">Brief description of the card content.</p>
    <a href="#" class="card__link">Read More</a>
  </div>
</article>
```

```css
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card__content {
  padding: 1.5rem;
}

.card__title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.card__description {
  color: #666;
  margin: 0 0 1rem 0;
}

.card__link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.card__link:hover {
  text-decoration: underline;
}
```

### Navigation Bar

```html
<nav class="navbar">
  <a href="/" class="navbar__logo">Logo</a>
  <ul class="navbar__menu">
    <li><a href="/" class="navbar__link">Home</a></li>
    <li><a href="/about" class="navbar__link">About</a></li>
    <li><a href="/services" class="navbar__link">Services</a></li>
    <li><a href="/contact" class="navbar__link">Contact</a></li>
  </ul>
  <button class="navbar__toggle" aria-label="Toggle menu">☰</button>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar__logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}

.navbar__menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.navbar__link {
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.navbar__link:hover {
  color: #007bff;
}

.navbar__toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Mobile */
@media (max-width: 768px) {
  .navbar__menu {
    display: none;
    /* Add mobile menu styles with JavaScript */
  }

  .navbar__toggle {
    display: block;
  }
}
```

### Button Styles

```css
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn--primary {
  background-color: #007bff;
  color: white;
}

.btn--primary:hover {
  background-color: #0056b3;
}

.btn--secondary {
  background-color: #6c757d;
  color: white;
}

.btn--outline {
  background-color: transparent;
  border: 2px solid #007bff;
  color: #007bff;
}

.btn--outline:hover {
  background-color: #007bff;
  color: white;
}

.btn--disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Form Styling

```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input--error {
  border-color: #dc3545;
}

.form-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-help {
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

## Common Pitfalls

### 1. Not Understanding Specificity

```css
/* Specificity: 0-0-1 */
p {
  color: blue;
}

/* Specificity: 0-1-0 (wins) */
.text {
  color: red;
}

/* Specificity: 1-0-0 (wins over everything) */
#title {
  color: green;
}

/* Don't fight specificity with !important */
/* ❌ Bad */
p {
  color: blue !important; /* Hard to override */
}

/* ✅ Good: Use appropriate specificity */
.article p {
  color: blue;
}
```

**Specificity Hierarchy:**
1. `!important` (avoid)
2. Inline styles: `<div style="...">` (avoid)
3. IDs: `#id`
4. Classes, attributes, pseudo-classes: `.class`, `[attr]`, `:hover`
5. Elements and pseudo-elements: `div`, `::before`

### 2. Overusing Position Absolute

```css
/* ❌ Bad: Hard to maintain */
.element {
  position: absolute;
  top: 100px;
  left: 50px;
}

/* ✅ Good: Use flexbox or grid */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

Use `position: absolute` sparingly—for overlays, tooltips, or precise positioning needs.

### 3. Not Making Layouts Responsive

```css
/* ❌ Bad: Fixed widths */
.container {
  width: 1000px;
}

/* ✅ Good: Flexible widths */
.container {
  max-width: 1000px;
  width: 100%;
  padding: 0 1rem;
}
```

### 4. Forgetting Box-Sizing

```css
/* Without box-sizing: border-box */
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* Actual width: 244px (200 + 20 + 20 + 2 + 2) */
}

/* With box-sizing: border-box */
* {
  box-sizing: border-box;
}

.box {
  width: 200px;
  padding: 20px;
  border: 2px solid;
  /* Actual width: 200px (padding and border included) */
}
```

Always set `box-sizing: border-box` globally.

### 5. Not Testing in Multiple Browsers

Different browsers render CSS slightly differently. Test in:
- Chrome/Edge (Blink engine)
- Firefox (Gecko engine)
- Safari (WebKit engine)

## Quick Reference

### Flexbox Cheat Sheet

```css
/* Container */
display: flex;
flex-direction: row | column;
justify-content: flex-start | center | space-between | space-around;
align-items: flex-start | center | flex-end | stretch;
flex-wrap: nowrap | wrap;
gap: 1rem;

/* Items */
flex: 1; /* grow equally */
flex-basis: 200px; /* base size */
align-self: auto | flex-start | center | flex-end;
```

### Grid Cheat Sheet

```css
/* Container */
display: grid;
grid-template-columns: 1fr 2fr | repeat(3, 1fr) | repeat(auto-fit, minmax(200px, 1fr));
grid-template-rows: auto 1fr auto;
gap: 1rem;
grid-template-areas: "header header" "sidebar main" "footer footer";

/* Items */
grid-column: 1 / 3 | span 2;
grid-row: 1 / 3 | span 2;
grid-area: header;
```

### Common CSS Patterns

```css
/* Center anything */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Truncate text with ellipsis */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Aspect ratio box */
.aspect-ratio-16-9 {
  aspect-ratio: 16 / 9;
}

/* Sticky header */
.header {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Full-height section */
.full-height {
  min-height: 100vh;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
```

## Next Steps

### Build Real Projects

1. **Personal Portfolio**
   - Practice layouts with Grid and Flexbox
   - Implement responsive design
   - Focus on accessibility

2. **Landing Page**
   - Hero section with call-to-action
   - Feature cards
   - Testimonials section
   - Contact form

3. **Dashboard Layout**
   - Complex multi-column layout
   - Sidebar navigation
   - Data tables
   - Charts and graphs

### Continue Learning

- **CSS Frameworks**: Tailwind CSS, Bootstrap (after mastering vanilla CSS)
- **CSS Preprocessors**: Sass, Less (optional)
- **CSS-in-JS**: Styled Components, Emotion (for React)
- **Modern CSS**: Container queries, :has() selector, CSS layers

### Resources

- MDN Web Docs (best reference)
- CSS-Tricks (practical guides)
- A Complete Guide to Flexbox (CSS-Tricks)
- A Complete Guide to Grid (CSS-Tricks)
- Can I Use (browser support)

## Related Topics

- [JavaScript Fundamentals](../javascript/README.md) - Add interactivity
- [React](../react/README.md) - Component-based UI library
- [Vue](../vue/README.md) - Progressive framework
- [Frontend Overview](../README.md) - Full frontend roadmap

---

**Remember:** HTML and CSS are the foundation of all web development. Master these fundamentals, and you'll understand how every framework and library works under the hood. Focus on semantic HTML, accessible design, and responsive layouts—these skills never go out of style.
