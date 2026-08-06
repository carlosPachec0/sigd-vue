<script setup lang="ts">
import type { BaseButtonProps } from './BaseButton.types'

withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-electric-blue);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sizes */
.btn--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.btn--md {
  padding: var(--space-3) var(--space-5);
  font-size: var(--text-base);
}

.btn--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
}

/* Variants */
.btn--primary {
  background-color: var(--color-electric-blue);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-electric-blue-dark);
}

.btn--secondary {
  background-color: var(--color-white);
  color: var(--color-electric-blue);
  border-color: var(--color-electric-blue);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-electric-blue);
  color: var(--color-white);
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-slate);
}

.btn--ghost:hover:not(:disabled) {
  background-color: var(--color-warm-gray-dark);
}

.btn--danger {
  background-color: var(--color-coral-flame);
  color: var(--color-white);
}

.btn--danger:hover:not(:disabled) {
  background-color: var(--color-coral-flame-dark);
}

/* Loading spinner */
.btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

.btn--loading {
  position: relative;
}

.btn--loading > :not(.btn__spinner) {
  opacity: 0.75;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
