<script setup lang="ts">
import type { BaseSpinnerProps } from './BaseSpinner.types'

withDefaults(defineProps<BaseSpinnerProps>(), {
  size: 'md',
  color: 'var(--color-electric-blue)',
})
</script>

<template>
  <div
    :class="['spinner', `spinner--${size}`]"
    :style="{ borderTopColor: color }"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>

<style scoped>
.spinner {
  border: 3px solid var(--color-warm-gray-dark);
  border-top-color: var(--color-electric-blue);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

.spinner--sm {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

.spinner--md {
  width: 1.5rem;
  height: 1.5rem;
}

.spinner--lg {
  width: 2.5rem;
  height: 2.5rem;
  border-width: 4px;
}

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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
