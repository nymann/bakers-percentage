# Composables | Vue.js Documentation

Source: https://vuejs.org/guide/reusability/composables.html

## What is a "Composable"?

In Vue applications, a **composable** is a function that leverages Vue's Composition API to encapsulate and reuse **stateful logic**.

While stateless logic (like formatting functions in lodash or date-fns) takes input and returns output immediately, stateful logic involves managing state that changes over time — such as tracking mouse position or managing database connection status.

## Mouse Tracker Example

### Basic Implementation in Component

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

### Extracted Composable

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

### Using the Composable

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

## Composing Composables

You can nest composables to build complex logic. For example, extract event listener logic:

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

Then simplify `useMouse()`:

```js
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

## Async State Example

### Handling Async Data

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

### Accepting Reactive State

For re-fetching when URL changes, use `watchEffect()` and `toValue()`:

```js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

This works with static strings, refs, and getter functions:

```js
const url = ref('/initial-url')
const { data, error } = useFetch(url)

// Triggers re-fetch
url.value = '/new-url'

// Or with getter
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

## Conventions and Best Practices

### Naming
Composable function names should start with "use" in camelCase: `useMouse`, `useFetch`, etc.

### Input Arguments
Handle refs, getters, and plain values using `toValue()`:

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  const value = toValue(maybeRefOrGetter)
}
```

### Return Values
Return a plain, non-reactive object containing refs to preserve reactivity during destructuring:

```js
// Recommended
const { x, y } = useMouse()

// If you need object properties:
const mouse = reactive(useMouse())
console.log(mouse.x) // linked to original ref
```

### Side Effects
- Perform DOM-specific side effects in `onMounted()` for SSR compatibility
- Clean up side effects in `onUnmounted()`
- Use helper composables that handle cleanup automatically

### Usage Restrictions
- Call composables only in `<script setup>` or `setup()` hook
- Call them **synchronously** (can also be called in lifecycle hooks like `onMounted()`)
- In `<script setup>`, you can call composables **after** `await` (compiler handles instance context restoration)

## Extracting Composables for Code Organization

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

## Comparisons with Other Techniques

### vs. Mixins
- **Unclear source**: properties from multiple mixins are hard to trace
- **Namespace collisions**: multiple mixins can register the same property keys
- **Implicit coupling**: mixins must rely on shared property keys to communicate

Composables solve all these issues through explicit destructuring and function composition.

### vs. Renderless Components
Composables have lower performance overhead — no extra component instances created.

### vs. React Hooks
Vue composables are similar to React hooks but based on Vue's fine-grained reactivity system, making them more efficient.
