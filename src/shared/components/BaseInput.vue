<script setup lang="ts">
import { computed } from 'vue'
import type { BaseInputProps, BaseInputEmits } from './BaseInput.types'

const props = withDefaults(defineProps<BaseInputProps>(), {
  modelValue: '',
  type: 'text',
  required: false,
  disabled: false,
  error: null,
})

const emit = defineEmits<BaseInputEmits>()

const inputId = computed(() => props.id ?? `input-${Math.random().toString(36).slice(2, 9)}`)

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="input-wrapper" :class="{ 'input-wrapper--error': error }">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required" aria-label="required">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      class="input"
      @input="handleInput"
    />
    <p v-if="error" class="input-error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.input-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-charcoal);
}

.input-required {
  color: var(--color-coral-flame);
  margin-left: var(--space-1);
}

.input {
  padding: var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-charcoal);
  background-color: var(--color-white);
  border: 1px solid var(--color-warm-gray-dark);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.input::placeholder {
  color: var(--color-slate);
}

.input:focus {
  outline: none;
  border-color: var(--color-electric-blue);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--color-warm-gray);
}

.input-wrapper--error .input {
  border-color: var(--color-error);
}

.input-wrapper--error .input:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
}

.input-error {
  font-size: var(--text-sm);
  color: var(--color-error);
  margin: 0;
}
</style>
