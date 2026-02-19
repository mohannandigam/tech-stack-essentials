# Vue - The Progressive JavaScript Framework

## What is Vue?

Vue (pronounced "view") is a progressive JavaScript framework for building user interfaces. Created by Evan You in 2014, Vue is designed to be incrementally adoptable—you can use as little or as much of it as you need. It combines the best ideas from React and Angular while maintaining simplicity and elegance.

### Simple Analogy

Think of Vue like a well-designed kitchen:

- **Single File Components** = Complete cooking stations with everything in one place (ingredients, tools, recipe)
- **Reactivity** = Smart appliances that respond automatically when you adjust settings
- **Templates** = Recipe cards that are easy to read and follow
- **Composition API** = Flexible prep areas you can arrange however works best for you

Vue gives you professional-grade tools without the overwhelming complexity—everything is intuitive and well-organized.

## Why Vue Matters

### The Middle Ground

Vue sits perfectly between React's flexibility and Angular's structure:

- **Easier than Angular** - Gentler learning curve, less boilerplate
- **More structured than React** - Conventions out of the box, less decision fatigue
- **Powerful like both** - Full-featured ecosystem for any scale

### Industry Adoption

- **Used by**: Alibaba, Xiaomi, Nintendo, Grammarly, GitLab, Adobe, BMW
- **Strongest in Asia** - Massive adoption in China and Asian markets
- **Growing globally** - Increasing popularity in Europe and North America
- **Community-driven** - Not tied to a corporation (independent)

### Key Advantages

1. **Gentle Learning Curve**: HTML-like templates, familiar concepts
2. **Excellent Documentation**: Clear, comprehensive, well-organized
3. **Single File Components**: HTML, CSS, JavaScript in one file
4. **Reactive by Default**: Data binding just works
5. **Flexible**: Can be progressive or full-featured
6. **Great DX**: Vue DevTools, helpful error messages, fast compilation

### Philosophy

**Progressive Framework** means:

```
Level 1: Drop-in script tag (enhance existing pages)
  ↓
Level 2: Single File Components (component-based apps)
  ↓
Level 3: Full ecosystem (routing, state, build tools)
  ↓
Level 4: Advanced features (SSR, SSG with Nuxt)
```

Start simple, add complexity only when you need it.

## Vue 3 Fundamentals

### Template Syntax

Vue uses HTML-based templates with special directives.

```vue
<template>
  <!-- Text interpolation -->
  <p>{{ message }}</p>
  <p>{{ count * 2 }}</p>
  <p>{{ user.name.toUpperCase() }}</p>

  <!-- HTML (be careful with XSS) -->
  <div v-html="htmlContent"></div>

  <!-- Attributes -->
  <img :src="imageUrl" :alt="description">
  <div :class="{ active: isActive, disabled: isDisabled }">
  <div :style="{ color: textColor, fontSize: size + 'px' }">

  <!-- Shorthand for v-bind -->
  <img :src="imageUrl">
  <!-- Same as: <img v-bind:src="imageUrl"> -->

  <!-- Event listeners -->
  <button @click="handleClick">Click me</button>
  <input @input="handleInput" @keyup.enter="handleEnter">

  <!-- Shorthand for v-on -->
  <button @click="count++">
  <!-- Same as: <button v-on:click="count++"> -->

  <!-- Conditional rendering -->
  <p v-if="isVisible">Visible</p>
  <p v-else-if="isPartiallyVisible">Partially visible</p>
  <p v-else>Hidden</p>

  <!-- Show/hide (keeps in DOM) -->
  <div v-show="isVisible">Toggle visibility</div>

  <!-- List rendering -->
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>

  <!-- List with index -->
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }}: {{ item.name }}
  </li>

  <!-- Two-way binding -->
  <input v-model="text">
  <input v-model.number="age" type="number">
  <input v-model.trim="text">

  <!-- Modifiers -->
  <button @click.prevent="handleSubmit">Submit</button>
  <input @keyup.enter="handleEnter">
  <div @click.self="handleSelf">Only fires on this div, not children</div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello, Vue!');
const count = ref(0);
const user = ref({ name: 'Alice' });
const isActive = ref(true);
const isVisible = ref(true);
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' }
]);
const text = ref('');

function handleClick() {
  count.value++;
}
</script>
```

### Single File Components (SFC)

Vue's signature feature—everything for a component in one file.

```vue
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar">
    <div class="info">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <button @click="sendMessage" class="btn">
        Send Message
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['message']);

function sendMessage() {
  emit('message', props.user.id);
}
</script>

<style scoped>
/* Scoped styles only apply to this component */
.user-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #35495e;
}
</style>
```

**Benefits of SFC:**
- **Colocation**: Related code in one place
- **Scoped styles**: CSS doesn't leak to other components
- **Syntax highlighting**: Editors understand the structure
- **Better organization**: Clear component boundaries

## Composition API (Modern Vue)

Vue 3 introduced the Composition API—a better way to organize component logic.

### Reactive State

```vue
<script setup>
import { ref, reactive, computed, watch } from 'vue';

// ref - for primitives and single values
const count = ref(0);
const message = ref('Hello');
const user = ref(null);

// Access/modify with .value in script
count.value++;
console.log(count.value); // 1

// No .value needed in template
// <p>{{ count }}</p>

// reactive - for objects (more convenient)
const state = reactive({
  count: 0,
  message: 'Hello',
  user: null
});

// No .value needed
state.count++;
console.log(state.count); // 1

// computed - derived state
const doubled = computed(() => count.value * 2);
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// computed with getter and setter
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ');
  }
});

// watch - react to changes
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// watch multiple sources
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('Something changed');
});

// watchEffect - automatically tracks dependencies
watchEffect(() => {
  console.log(`Count is ${count.value}`);
  // Automatically re-runs when count changes
});

// watch with options
watch(count, (newValue) => {
  console.log(newValue);
}, {
  immediate: true, // Run immediately
  deep: true       // Watch nested properties
});
</script>
```

**ref vs reactive:**
- **ref**: For primitives, single values, entire object replacements
- **reactive**: For objects when you don't want `.value`
- Most Vue developers prefer `ref` for consistency

### Lifecycle Hooks

```vue
<script setup>
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue';

// Component mounted (DOM available)
onMounted(() => {
  console.log('Component mounted');
  // Fetch data, setup subscriptions, access DOM
});

// Before component updates
onBeforeUpdate(() => {
  console.log('Component about to update');
});

// Component updated
onUpdated(() => {
  console.log('Component updated');
});

// Component about to unmount
onBeforeUnmount(() => {
  console.log('Component about to unmount');
  // Cleanup: remove event listeners, cancel timers
});

// Component unmounted
onUnmounted(() => {
  console.log('Component unmounted');
});

// Example: Fetch data on mount
const users = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch');
    users.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

// Example: Cleanup on unmount
let intervalId;

onMounted(() => {
  intervalId = setInterval(() => {
    console.log('Tick');
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
```

### Props and Events

```vue
<!-- Child component -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <button @click="handleClick">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
// Define props with types and defaults
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  buttonText: {
    type: String,
    default: 'Click me'
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

// Define events
const emit = defineEmits(['update', 'delete']);

function handleClick() {
  // Emit event to parent
  emit('update', props.user.id);
}
</script>

<!-- Parent component -->
<template>
  <UserCard
    :user="currentUser"
    button-text="Edit User"
    :is-active="true"
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>

<script setup>
import UserCard from './UserCard.vue';
import { ref } from 'vue';

const currentUser = ref({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

function handleUpdate(userId) {
  console.log('Update user:', userId);
}

function handleDelete(userId) {
  console.log('Delete user:', userId);
}
</script>
```

### v-model (Two-Way Binding)

```vue
<!-- Built-in v-model -->
<template>
  <input v-model="text">
  <p>{{ text }}</p>

  <!-- Multiple v-models (Vue 3) -->
  <CustomInput
    v-model:title="title"
    v-model:content="content"
  />
</template>

<!-- Custom v-model component -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>

<!-- Usage -->
<template>
  <CustomInput v-model="text" />
  <!-- Same as: -->
  <CustomInput
    :model-value="text"
    @update:model-value="text = $event"
  />
</template>

<!-- Multiple v-models -->
<template>
  <div>
    <input
      :value="title"
      @input="$emit('update:title', $event.target.value)"
      placeholder="Title"
    >
    <textarea
      :value="content"
      @input="$emit('update:content', $event.target.value)"
      placeholder="Content"
    ></textarea>
  </div>
</template>

<script setup>
defineProps(['title', 'content']);
defineEmits(['update:title', 'update:content']);
</script>
```

### Composables (Reusable Logic)

Composables are Vue's version of React custom hooks.

```javascript
// composables/useFetch.js
import { ref, watchEffect } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  watchEffect(async () => {
    loading.value = true;
    data.value = null;
    error.value = null;

    try {
      const response = await fetch(url.value);
      if (!response.ok) throw new Error('Failed to fetch');
      data.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });

  return { data, error, loading };
}

// Usage in component
<script setup>
import { ref } from 'vue';
import { useFetch } from './composables/useFetch';

const userId = ref(1);
const url = computed(() => `/api/users/${userId.value}`);
const { data: user, error, loading } = useFetch(url);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>{{ user.name }}</div>
</template>

// More composables examples

// composables/useLocalStorage.js
export function useLocalStorage(key, defaultValue) {
  const stored = localStorage.getItem(key);
  const value = ref(stored ? JSON.parse(stored) : defaultValue);

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return value;
}

// composables/useWindowSize.js
export function useWindowSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  function update() {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  }

  onMounted(() => window.addEventListener('resize', update));
  onUnmounted(() => window.removeEventListener('resize', update));

  return { width, height };
}

// composables/useMouse.js
export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
```

## State Management with Pinia

Pinia is Vue's official state management library (replaces Vuex).

### Basic Store

```javascript
// stores/counter.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0);

  // Getters (computed)
  const doubled = computed(() => count.value * 2);

  // Actions
  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function incrementBy(amount) {
    count.value += amount;
  }

  return { count, doubled, increment, decrement, incrementBy };
});

// Usage in component
<script setup>
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();
</script>

<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Doubled: {{ counter.doubled }}</p>
    <button @click="counter.increment">+</button>
    <button @click="counter.decrement">-</button>
  </div>
</template>
```

### Store with Async Actions

```javascript
// stores/user.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  async function fetchUser(id) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      user.value = await response.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(updates) {
    try {
      const response = await fetch(`/api/users/${user.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update');
      user.value = await response.json();
    } catch (err) {
      error.value = err.message;
    }
  }

  function logout() {
    user.value = null;
  }

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
    logout
  };
});
```

### Setup Pinia

```javascript
// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

## Routing with Vue Router

### Basic Setup

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import UserProfile from '@/views/UserProfile.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/users/:id',
    name: 'UserProfile',
    component: UserProfile,
    props: true // Pass route params as props
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'), // Lazy loading
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;

// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

### Using Router in Components

```vue
<template>
  <nav>
    <!-- Declarative navigation -->
    <router-link to="/">Home</router-link>
    <router-link :to="{ name: 'About' }">About</router-link>
    <router-link :to="`/users/${userId}`">Profile</router-link>
  </nav>

  <!-- Display matched component -->
  <router-view />
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Access route params
const userId = computed(() => route.params.id);

// Access query params
const search = computed(() => route.query.search);

// Programmatic navigation
function goToUser(id) {
  router.push(`/users/${id}`);
  // or
  router.push({ name: 'UserProfile', params: { id } });
}

function goBack() {
  router.back();
}

function replace() {
  router.replace('/home'); // Doesn't add to history
}
</script>

<!-- Route with params -->
<script setup>
// UserProfile.vue
const props = defineProps(['id']);
const { data: user } = useFetch(`/api/users/${props.id}`);
</script>

<template>
  <div v-if="user">
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
  </div>
</template>
```

### Nested Routes

```javascript
const routes = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      {
        path: '',
        component: UsersList
      },
      {
        path: ':id',
        component: UserProfile
      },
      {
        path: ':id/posts',
        component: UserPosts
      }
    ]
  }
];

<!-- UsersLayout.vue -->
<template>
  <div>
    <nav>
      <router-link to="/users">All Users</router-link>
    </nav>
    <router-view />
  </div>
</template>
```

## Nuxt.js (Vue Meta-Framework)

Nuxt is to Vue what Next.js is to React—adds SSR, SSG, routing, and more.

### Key Features

1. **File-based routing** - Create `pages/` folder, routes are automatic
2. **Server-side rendering** - Better SEO and performance
3. **Static site generation** - Deploy to CDN
4. **Auto-imports** - No need to import components/composables
5. **API routes** - Backend endpoints in `server/` folder

### Example Nuxt Project

```
my-nuxt-app/
├── pages/
│   ├── index.vue          → /
│   ├── about.vue          → /about
│   ├── users/
│   │   ├── index.vue      → /users
│   │   └── [id].vue       → /users/:id
├── components/
│   └── UserCard.vue       (auto-imported)
├── composables/
│   └── useFetch.js        (auto-imported)
├── layouts/
│   └── default.vue
├── plugins/
├── server/
│   └── api/
│       └── users.js       → /api/users
└── nuxt.config.ts
```

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <h1>Welcome to Nuxt!</h1>
    <UserCard v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>

<script setup>
// Data fetching with Nuxt composables
const { data: users } = await useFetch('/api/users');

// Or use Nuxt's $fetch
const users = await $fetch('/api/users');
</script>

<!-- pages/users/[id].vue -->
<template>
  <div>
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
  </div>
</template>

<script setup>
const route = useRoute();
const { data: user } = await useFetch(`/api/users/${route.params.id}`);

// SEO meta tags
useHead({
  title: user.value.name,
  meta: [
    { name: 'description', content: `Profile of ${user.value.name}` }
  ]
});
</script>
```

## Best Practices

### Component Organization

```vue
<!-- ✅ Good: Small, focused components -->
<template>
  <div class="user-profile">
    <UserHeader :user="user" />
    <UserStats :stats="user.stats" />
    <UserPosts :posts="user.posts" />
  </div>
</template>

<!-- ❌ Bad: Everything in one component -->
<template>
  <div class="user-profile">
    <!-- 500 lines of template -->
  </div>
</template>
```

### Reactivity Best Practices

```javascript
// ✅ Good: Use ref for primitives
const count = ref(0);
const name = ref('Alice');

// ✅ Good: Use reactive for objects (if you prefer)
const user = reactive({ name: 'Alice', age: 25 });

// ✅ Good: Use computed for derived state
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// ❌ Bad: Don't destructure reactive objects (loses reactivity)
const { name, age } = reactive({ name: 'Alice', age: 25 });

// ✅ Good: Use toRefs to destructure
const state = reactive({ name: 'Alice', age: 25 });
const { name, age } = toRefs(state);

// ✅ Good: Use computed when possible
const filteredItems = computed(() => items.value.filter(i => i.active));

// ❌ Bad: Calculating in template
<div v-for="item in items.filter(i => i.active)" :key="item.id">
```

### Props Validation

```javascript
// ✅ Good: Detailed prop validation
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  status: {
    type: String,
    default: 'pending',
    validator: (value) => ['pending', 'approved', 'rejected'].includes(value)
  },
  user: {
    type: Object,
    required: true,
    validator: (value) => value.id && value.name
  }
});

// With TypeScript
interface Props {
  title: string;
  count?: number;
  status?: 'pending' | 'approved' | 'rejected';
  user: {
    id: number;
    name: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  status: 'pending'
});
```

### Performance Optimization

```vue
<script setup>
import { computed, shallowRef } from 'vue';

// 1. Use shallowRef for large objects you don't mutate deeply
const largeData = shallowRef({ /* huge object */ });

// 2. Use v-once for static content
</script>

<template>
  <!-- Won't re-render -->
  <div v-once>{{ staticContent }}</div>

  <!-- 3. Use v-memo for expensive lists -->
  <div
    v-for="item in list"
    :key="item.id"
    v-memo="[item.selected]"
  >
    <!-- Only updates when item.selected changes -->
    {{ item.name }}
  </div>

  <!-- 4. Lazy load components -->
  <Suspense>
    <template #default>
      <HeavyComponent />
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<script setup>
// Lazy import
const HeavyComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
);
</script>
```

## Testing

### Component Testing with Vitest

```javascript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.vue';

describe('Counter', () => {
  it('renders initial count', () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 5 }
    });
    expect(wrapper.text()).toContain('5');
  });

  it('increments count on button click', async () => {
    const wrapper = mount(Counter);
    await wrapper.find('button').trigger('click');
    expect(wrapper.text()).toContain('1');
  });

  it('emits event on increment', async () => {
    const wrapper = mount(Counter);
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('increment')).toBeTruthy();
  });
});

// Testing with Pinia
import { setActivePinia, createPinia } from 'pinia';
import { useCounterStore } from '@/stores/counter';

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('increments count', () => {
    const store = useCounterStore();
    store.increment();
    expect(store.count).toBe(1);
  });
});
```

## Common Pitfalls

### 1. Forgetting .value with ref

```javascript
// ❌ Bad: Forgot .value
const count = ref(0);
count++; // Doesn't work!

// ✅ Good
count.value++;
```

### 2. Destructuring reactive objects

```javascript
// ❌ Bad: Loses reactivity
const { name, age } = reactive({ name: 'Alice', age: 25 });

// ✅ Good: Use toRefs
const state = reactive({ name: 'Alice', age: 25 });
const { name, age } = toRefs(state);
```

### 3. Not using key in v-for

```vue
<!-- ❌ Bad: No key -->
<div v-for="item in items">{{ item.name }}</div>

<!-- ✅ Good: With unique key -->
<div v-for="item in items" :key="item.id">{{ item.name }}</div>
```

### 4. Mutating props

```javascript
// ❌ Bad: Mutating props
const props = defineProps(['count']);
props.count++; // Don't modify props!

// ✅ Good: Emit event or use local state
const props = defineProps(['count']);
const localCount = ref(props.count);
localCount.value++;

// Or emit to parent
const emit = defineEmits(['update:count']);
emit('update:count', props.count + 1);
```

## Quick Reference

### Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `v-if` | Conditional rendering | `<div v-if="isVisible">` |
| `v-show` | Toggle visibility | `<div v-show="isVisible">` |
| `v-for` | List rendering | `<li v-for="item in items" :key="item.id">` |
| `v-model` | Two-way binding | `<input v-model="text">` |
| `v-bind` / `:` | Bind attribute | `:src="imageUrl"` |
| `v-on` / `@` | Event listener | `@click="handleClick"` |
| `v-html` | Render HTML | `<div v-html="htmlContent">` |
| `v-once` | Render once | `<div v-once>{{ static }}` |

### Lifecycle Hooks

| Hook | When it runs |
|------|--------------|
| `onBeforeMount` | Before DOM insertion |
| `onMounted` | After DOM insertion |
| `onBeforeUpdate` | Before re-render |
| `onUpdated` | After re-render |
| `onBeforeUnmount` | Before component removal |
| `onUnmounted` | After component removal |

## Next Steps

### Projects to Build

1. **Todo App** - State management, v-model, v-for
2. **Blog** - Routing, fetch data, forms
3. **E-commerce** - Cart, checkout, product catalog
4. **Dashboard** - Charts, real-time data, complex state

### Advanced Topics

- **Teleport**: Render components outside current DOM hierarchy
- **Suspense**: Handle async components
- **Custom Directives**: Create your own v-directives
- **Transitions**: Animate component changes
- **TypeScript**: Full type safety

### Resources

- **Official Docs**: vuejs.org (excellent)
- **Vue School**: Video courses
- **Pinia Docs**: pinia.vuejs.org
- **Nuxt Docs**: nuxt.com

## Related Topics

- [React](../react/README.md) - Alternative library
- [Angular](../angular/README.md) - Full framework
- [JavaScript](../javascript/README.md) - Core language
- [Frontend Overview](../README.md) - Complete roadmap

---

**Remember:** Vue's strength is its simplicity and elegance. The learning curve is gentle, but the framework is powerful enough for any scale. Start with Single File Components, master the Composition API, and gradually explore the ecosystem. Vue's philosophy is progressive—use what you need, when you need it.
