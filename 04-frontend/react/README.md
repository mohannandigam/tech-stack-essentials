# React - Component-Based UI Library

## What is React?

React is a JavaScript library for building user interfaces through reusable components. Created by Facebook (Meta) in 2013, it revolutionized frontend development by introducing a declarative, component-based approach where UI updates automatically when data changes.

### Simple Analogy

Think of React like LEGO blocks:

- **Components** = Individual LEGO pieces (buttons, forms, cards)
- **Props** = Instructions on a LEGO set (how to configure each piece)
- **State** = The current configuration of your LEGO creation
- **React** = The instruction manual that tells you how to assemble and modify your creation

You build complex UIs by composing simple, reusable pieces. Change the configuration (state), and React automatically rebuilds the affected parts.

## Why React Matters

### Industry Adoption

- **Used by**: Facebook, Instagram, Netflix, Airbnb, Uber, Twitter, WhatsApp
- **Largest ecosystem** of libraries and tools
- **Most job opportunities** in frontend development
- **React Native** extends to mobile (iOS and Android)
- **Active community** and frequent updates

### Key Advantages

1. **Component Reusability**: Write once, use everywhere
2. **Declarative**: Describe what UI should look like, not how to build it
3. **Virtual DOM**: Fast, efficient updates
4. **Unidirectional Data Flow**: Predictable state management
5. **Rich Ecosystem**: Solution for almost every problem
6. **Developer Experience**: Great tooling and debugging

### Philosophy

React is a **library, not a framework**—it focuses on the view layer and lets you choose other tools:

- **Routing**: React Router, Tanstack Router
- **State Management**: Redux, Zustand, Jotai, Recoil
- **Styling**: CSS Modules, Styled Components, Tailwind CSS
- **Forms**: React Hook Form, Formik
- **Data Fetching**: React Query, SWR, Apollo (GraphQL)

This flexibility is both a strength (choose what fits) and a weakness (decision fatigue).

## React Fundamentals

### JSX (JavaScript XML)

JSX lets you write HTML-like syntax in JavaScript. It's syntactic sugar that compiles to `React.createElement()` calls.

```jsx
// JSX
const element = <h1>Hello, World!</h1>;

// Compiles to
const element = React.createElement('h1', null, 'Hello, World!');

// JSX with JavaScript expressions
const name = "Alice";
const element = <h1>Hello, {name}!</h1>;

// JSX attributes (use camelCase)
const element = (
  <div className="container" onClick={handleClick}>
    <img src={imageUrl} alt="Description" />
    <input type="text" value={value} onChange={handleChange} />
  </div>
);

// Conditional rendering
const greeting = (
  <div>
    {isLoggedIn ? (
      <h1>Welcome back!</h1>
    ) : (
      <h1>Please log in</h1>
    )}
  </div>
);

// Mapping arrays to elements
const items = ['Apple', 'Banana', 'Cherry'];
const listItems = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

// Fragments (group elements without adding DOM node)
const element = (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);
// Or: <React.Fragment>...</React.Fragment>
```

**JSX Rules:**
1. Must return single root element (or use Fragment)
2. Close all tags (`<img />`, not `<img>`)
3. Use `className` instead of `class`
4. Use `camelCase` for attributes (`onClick`, not `onclick`)
5. JavaScript expressions in curly braces `{}`

### Components

Components are the building blocks of React applications.

#### Function Components (Modern)

```jsx
// Simple component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Component with props
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Destructured props (preferred)
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}

// Arrow function component
const Welcome = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};

// Arrow function with implicit return
const Welcome = ({ name }) => <h1>Hello, {name}!</h1>;

// Using component
function App() {
  return (
    <div>
      <Welcome name="Alice" age={25} />
      <Welcome name="Bob" age={30} />
    </div>
  );
}
```

**Component Naming:**
- Always start with capital letter
- Use PascalCase: `UserProfile`, not `userProfile`

#### Props (Properties)

Props are how you pass data from parent to child components. They're read-only.

```jsx
// Parent component
function App() {
  const user = {
    name: "Alice",
    email: "alice@example.com",
    isAdmin: true
  };

  return (
    <UserCard
      name={user.name}
      email={user.email}
      isAdmin={user.isAdmin}
    />
  );
}

// Child component
function UserCard({ name, email, isAdmin }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{email}</p>
      {isAdmin && <span className="badge">Admin</span>}
    </div>
  );
}

// Props with default values
function Button({ text = "Click me", variant = "primary" }) {
  return <button className={`btn btn-${variant}`}>{text}</button>;
}

// Props validation with TypeScript
interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

function Button({ text, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  );
}

// Children prop (special)
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage
<Card title="Welcome">
  <p>This is the card content.</p>
  <button>Click me</button>
</Card>
```

**Props Rules:**
1. Props are immutable—never modify them
2. Pass data down (parent → child)
3. Use callbacks to pass data up (child → parent)

### Hooks

Hooks let you use state and other React features in function components.

#### useState - Local State

```jsx
import { useState } from 'react';

function Counter() {
  // Declare state variable
  const [count, setCount] = useState(0);
  //     ^state  ^setter    ^initial value

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

// State with objects
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
    </form>
  );
}

// State with arrays
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

**useState Rules:**
1. Always use functional updates when new state depends on old state
2. Don't mutate state directly—create new objects/arrays
3. State updates are asynchronous

#### useEffect - Side Effects

```jsx
import { useEffect, useState } from 'react';

// Run after every render
function Component() {
  useEffect(() => {
    console.log('Component rendered');
  });
}

// Run once on mount
function Component() {
  useEffect(() => {
    console.log('Component mounted');
  }, []); // Empty dependency array
}

// Run when dependencies change
function Component({ userId }) {
  useEffect(() => {
    console.log('userId changed:', userId);
  }, [userId]); // Runs when userId changes
}

// Cleanup function
function Component() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);

    // Cleanup: runs before next effect and on unmount
    return () => {
      clearInterval(timer);
    };
  }, []);
}

// Fetch data example
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    // Cleanup: prevent state updates if component unmounts
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>Welcome, {user.name}!</div>;
}

// Event listeners
function Component() {
  useEffect(() => {
    function handleResize() {
      console.log('Window resized');
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
```

**useEffect Rules:**
1. Always include all dependencies used inside effect
2. Return cleanup function for subscriptions and timers
3. Avoid infiniteloops (don't update state without dependencies)
4. Consider using React Query/SWR for data fetching

#### useContext - Share Data

```jsx
import { createContext, useContext, useState } from 'react';

// Create context
const UserContext = createContext();

// Provider component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for accessing context
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

// Usage in app
function App() {
  return (
    <UserProvider>
      <Header />
      <Main />
      <Footer />
    </UserProvider>
  );
}

// Access context in any nested component
function Header() {
  const { user, logout } = useUser();

  return (
    <header>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <span>Not logged in</span>
      )}
    </header>
  );
}
```

#### useRef - Reference Values

```jsx
import { useRef, useEffect } from 'react';

// Access DOM elements
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}

// Store mutable value (doesn't cause re-render)
function Component() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Rendered ${renderCount.current} times`);
  });

  return <div>Check console</div>;
}

// Previous value
function Component({ value }) {
  const prevValue = useRef();

  useEffect(() => {
    prevValue.current = value;
  }, [value]);

  return (
    <div>
      Current: {value}, Previous: {prevValue.current}
    </div>
  );
}
```

#### useMemo - Memoize Expensive Calculations

```jsx
import { useMemo, useState } from 'react';

function Component({ items }) {
  const [filter, setFilter] = useState('');

  // Only recalculates when items or filter changes
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

// Memoize expensive computation
function Component({ numbers }) {
  const sum = useMemo(() => {
    console.log('Calculating sum...');
    return numbers.reduce((acc, num) => acc + num, 0);
  }, [numbers]);

  return <div>Sum: {sum}</div>;
}
```

**When to use useMemo:**
- Expensive calculations
- Referential equality matters (passing to child components)
- Don't optimize prematurely—measure first

#### useCallback - Memoize Functions

```jsx
import { useCallback, useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Without useCallback: new function on every render
  // const increment = () => setCount(c => c + 1);

  // With useCallback: same function unless dependencies change
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []); // No dependencies

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <Child onIncrement={increment} />
      <p>Count: {count}</p>
    </div>
  );
}

// Memoized child only re-renders if props change
const Child = React.memo(({ onIncrement }) => {
  console.log('Child rendered');
  return <button onClick={onIncrement}>Increment</button>;
});
```

**When to use useCallback:**
- Passing callbacks to memoized child components
- Dependencies in useEffect
- Referential equality matters

#### Custom Hooks

Custom hooks let you extract and reuse stateful logic.

```jsx
// Custom hook: fetch data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();

        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Custom hook: local storage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function Component() {
  const [name, setName] = useLocalStorage('name', '');

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}

// Custom hook: window size
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
function Component() {
  const { width, height } = useWindowSize();
  return <div>Window size: {width} x {height}</div>;
}
```

**Custom Hook Rules:**
1. Name starts with "use" (useXyz)
2. Can call other hooks
3. Reusable across components
4. Extract common logic

## State Management

### Local State (useState)

For component-specific data.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Lifting State Up

Share state between components by moving it to common parent.

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Display count={count} />
      <Controls count={count} setCount={setCount} />
    </div>
  );
}

function Display({ count }) {
  return <h1>{count}</h1>;
}

function Controls({ count, setCount }) {
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### Context API

For app-wide state (theme, auth, language).

```jsx
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Main />
    </ThemeContext.Provider>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <header className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}
```

### Redux (External Library)

For complex, large-scale applications with lots of shared state.

```jsx
// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// App.js
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

// Counter.js
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './store';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

### Zustand (Lightweight Alternative)

Simpler than Redux, no boilerplate.

```jsx
import create from 'zustand';

// Create store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

// Use in component
function Counter() {
  const { count, increment, decrement, reset } = useStore();

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### State Management Decision Guide

| Use Case | Solution |
|----------|----------|
| Component-specific data | useState |
| Share between 2-3 components | Lift state up |
| App-wide simple state (theme, auth) | Context API |
| Complex state with many updates | Redux, Zustand |
| Server state (API data) | React Query, SWR |

## Routing

React doesn't include routing—use React Router.

```jsx
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Route with URL parameter
function UserDetail() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}

// Programmatic navigation
function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // After successful login
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Login</button>;
}

// Protected routes
function ProtectedRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
}

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Data Fetching

### With useEffect (Manual)

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### With React Query (Recommended)

React Query handles caching, refetching, and state management.

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Mutations (create, update, delete)
function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser) =>
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      }).then(res => res.json()),
    onSuccess: () => {
      // Refetch users after creating new one
      queryClient.invalidateQueries(['users']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name: 'New User' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Creating...' : 'Create User'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

## Testing

### Component Testing with Testing Library

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

// Test component rendering
test('renders counter with initial value', () => {
  render(<Counter initialValue={0} />);
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
});

// Test user interactions
test('increments counter on button click', async () => {
  render(<Counter />);

  const button = screen.getByRole('button', { name: /increment/i });
  await userEvent.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

// Test async behavior
test('loads and displays users', async () => {
  render(<UserList />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});

// Test form submission
test('submits form with user input', async () => {
  const handleSubmit = jest.fn();
  render(<LoginForm onSubmit={handleSubmit} />);

  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

## Best Practices

### Component Organization

```jsx
// ✅ Good: Small, focused components
function UserCard({ user }) {
  return (
    <div className="card">
      <UserAvatar src={user.avatar} />
      <UserInfo name={user.name} email={user.email} />
      <UserActions userId={user.id} />
    </div>
  );
}

// ❌ Bad: One huge component
function UserCard({ user }) {
  return (
    <div className="card">
      {/* 200 lines of JSX */}
    </div>
  );
}
```

### Conditional Rendering

```jsx
// ✅ Good: Clear conditions
function Component({ isLoggedIn, user }) {
  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return <Dashboard user={user} />;
}

// ✅ Good: Ternary for simple conditions
function Status({ isActive }) {
  return (
    <span className={isActive ? 'active' : 'inactive'}>
      {isActive ? 'Online' : 'Offline'}
    </span>
  );
}

// ✅ Good: && for conditional rendering
function Notification({ message }) {
  return (
    <div>
      {message && <Alert>{message}</Alert>}
    </div>
  );
}
```

### Avoid Prop Drilling

```jsx
// ❌ Bad: Passing props through many levels
<App>
  <Header user={user} />
    <Nav user={user} />
      <UserMenu user={user} />
        <Avatar user={user} />
</App>

// ✅ Good: Use Context
const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={user}>
      <Header />
    </UserContext.Provider>
  );
}

function Avatar() {
  const user = useContext(UserContext);
  return <img src={user.avatar} />;
}
```

### Performance Optimization

```jsx
// 1. Code splitting (lazy loading)
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  );
}

// 2. Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Only re-renders if data changes
  return <div>{/* Complex rendering */}</div>;
});

// 3. Use key prop correctly (stable, unique IDs)
// ✅ Good
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ Bad: index as key (problems with reordering)
{items.map((item, index) => <Item key={index} {...item} />)}

// 4. Virtualize long lists
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

## Common Pitfalls

### 1. Mutating State Directly

```jsx
// ❌ Bad
const [items, setItems] = useState([1, 2, 3]);
items.push(4); // Mutates state directly
setItems(items); // React doesn't detect change

// ✅ Good
setItems([...items, 4]); // Create new array
```

### 2. Missing Dependencies in useEffect

```jsx
// ❌ Bad: Missing dependency
function Component({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // userId missing!

  // Won't refetch when userId changes
}

// ✅ Good
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]); // Include all dependencies
```

### 3. Using Index as Key

```jsx
// ❌ Bad: Index as key
{items.map((item, index) => <Item key={index} {...item} />)}
// Problems: items can be reordered, duplicated, or filtered

// ✅ Good: Unique ID as key
{items.map(item => <Item key={item.id} {...item} />)}
```

### 4. Too Many useEffects

```jsx
// ❌ Bad: Separate effects for related logic
useEffect(() => { fetchUser(); }, [userId]);
useEffect(() => { fetchPosts(); }, [userId]);
useEffect(() => { fetchComments(); }, [userId]);

// ✅ Good: Combine related effects
useEffect(() => {
  fetchUser();
  fetchPosts();
  fetchComments();
}, [userId]);

// ✅ Better: Extract to custom hook
function useUserData(userId) {
  // Combined logic
}
```

## Next Steps

### Projects to Build

1. **Todo App** - State management, CRUD operations
2. **Weather Dashboard** - API integration, data fetching
3. **E-commerce Store** - Routing, cart management, checkout
4. **Social Media Feed** - Infinite scroll, likes, comments
5. **Real-time Chat** - WebSockets, message history

### Advanced Topics

- **Server-Side Rendering (SSR)**: Next.js
- **Static Site Generation (SSG)**: Next.js, Gatsby
- **React Native**: Mobile apps
- **Advanced Patterns**: Render props, HOCs, Compound components
- **Concurrent Features**: Suspense, Transitions
- **Server Components**: React Server Components (RSC)

### Resources

- **Official Docs**: react.dev (excellent learning resource)
- **React Query Docs**: For data fetching
- **Testing Library**: testing-library.com
- **React DevTools**: Browser extension

## Related Topics

- [Vue](../vue/README.md) - Alternative framework
- [Angular](../angular/README.md) - Full framework
- [JavaScript](../javascript/README.md) - Core language
- [Frontend Overview](../README.md) - Complete roadmap

---

**Remember:** React is all about components and data flow. Master useState, useEffect, and props before diving into advanced topics. Build projects, make mistakes, and learn from them. The React ecosystem is vast—don't feel pressured to learn everything at once. Start simple, solve real problems, and expand your knowledge gradually.
