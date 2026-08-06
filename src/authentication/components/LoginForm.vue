<script setup lang="ts">
import { ref } from 'vue'
import type { LoginFormProps, LoginFormEmits } from './LoginForm.types'

defineProps<LoginFormProps>()

const emit = defineEmits<LoginFormEmits>()

const email = ref('')
const password = ref('')

function handleSubmit(): void {
  emit('submit', { email: email.value, password: password.value })
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="alert alert--error" role="alert">
      <p>{{ error.displayMessage }}</p>
      <ul v-if="error.errors.length">
        <li v-for="(msg, i) in error.errors" :key="i">{{ msg }}</li>
      </ul>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        placeholder="you@example.com"
      />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        placeholder="Your password"
      />
    </div>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Signing in...' : 'Sign in' }}
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

label {
  font-weight: var(--font-medium);
  color: var(--color-charcoal);
}

input {
  padding: var(--space-3);
  border: 1px solid var(--color-warm-gray-dark);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--color-white);
  color: var(--color-charcoal);
  transition: border-color var(--transition-fast);
}

input:focus {
  outline: none;
  border-color: var(--color-electric-blue);
  box-shadow: 0 0 0 3px var(--color-electric-blue-light);
}

button {
  padding: var(--space-3) var(--space-4);
  background: var(--color-electric-blue);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

button:hover:not(:disabled) {
  background: var(--color-electric-blue-dark);
}

button:active:not(:disabled) {
  background: var(--color-charcoal-light);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.alert--error {
  background: var(--color-error-bg);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
}
</style>
