import { ref, computed, onScopeDispose } from 'vue'

export function useExample(initial = 0) {
  const value = ref(initial)
  const doubled = computed(() => value.value * 2)

  function increment() {
    value.value++
  }

  // register cleanup here if this composable sets up listeners/timers
  onScopeDispose(() => {
    // teardown
  })

  return { value, doubled, increment }
}