<script setup lang="ts">
import type { BaseCardProps } from './BaseCard.types'

withDefaults(defineProps<BaseCardProps>(), {
  padding: 'md',
  shadow: 'md',
})
</script>

<template>
  <div :class="['card', `card--padding-${padding}`, `card--shadow-${shadow}`]">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-warm-gray-dark);
}

/* Padding */
.card--padding-none {
  padding: 0;
}

.card--padding-sm {
  padding: var(--space-4);
}

.card--padding-md {
  padding: var(--space-6);
}

.card--padding-lg {
  padding: var(--space-8);
}

/* Shadow */
.card--shadow-none {
  box-shadow: none;
}

.card--shadow-sm {
  box-shadow: var(--shadow-sm);
}

.card--shadow-md {
  box-shadow: var(--shadow-md);
}

.card--shadow-lg {
  box-shadow: var(--shadow-lg);
}
</style>
