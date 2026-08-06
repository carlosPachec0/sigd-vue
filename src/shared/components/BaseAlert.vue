<script setup lang="ts">
import type { BaseAlertProps, BaseAlertEmits } from './BaseAlert.types'

withDefaults(defineProps<BaseAlertProps>(), {
  variant: 'info',
  title: undefined,
  dismissible: false,
})

const emit = defineEmits<BaseAlertEmits>()
</script>

<template>
  <div :class="['alert', `alert--${variant}`]" role="alert">
    <div class="alert__content">
      <p v-if="title" class="alert__title">{{ title }}</p>
      <div class="alert__message">
        <slot />
      </div>
    </div>
    <button
      v-if="dismissible"
      class="alert__dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      &times;
    </button>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

.alert__content {
  flex: 1;
}

.alert__title {
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-1);
}

.alert__message {
  opacity: 0.9;
}

.alert__dismiss {
  background: none;
  border: none;
  font-size: var(--text-xl);
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
  line-height: 1;
}

.alert__dismiss:hover {
  opacity: 1;
}

/* Variants */
.alert--info {
  background-color: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.alert--success {
  background-color: var(--color-success-bg);
  color: var(--color-success);
  border: 1px solid var(--color-success-border);
}

.alert--warning {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
  border: 1px solid var(--color-warning-border);
}

.alert--error {
  background-color: var(--color-error-bg);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
}
</style>
