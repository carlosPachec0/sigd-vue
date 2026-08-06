<script setup lang="ts">
import { ref } from 'vue'
import type { SignupFormProps, SignupFormEmits } from './SignupForm.types'

defineProps<SignupFormProps>()

const emit = defineEmits<SignupFormEmits>()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
const passwordError = ref<string | null>(null)

function validatePassword(): boolean {
  if (!PASSWORD_REGEX.test(password.value)) {
    passwordError.value =
      'Password must be at least 8 characters with uppercase, lowercase, number, and symbol.'
    return false
  }
  if (password.value !== passwordConfirmation.value) {
    passwordError.value = 'Passwords do not match.'
    return false
  }
  passwordError.value = null
  return true
}

function handleSubmit(): void {
  if (!validatePassword()) return
  emit('submit', {
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  })
}
</script>

<template>
  <form class="signup-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="alert alert--error" role="alert">
      <p>{{ error.displayMessage }}</p>
      <ul v-if="error.errors.length">
        <li v-for="(msg, i) in error.errors" :key="i">{{ msg }}</li>
      </ul>
    </div>
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="name"
        type="text"
        required
        autocomplete="name"
        placeholder="Your full name"
      />
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
        autocomplete="new-password"
        placeholder="Min 8 chars, mixed case, number, symbol"
      />
    </div>
    <div class="form-group">
      <label for="password-confirmation">Confirm Password</label>
      <input
        id="password-confirmation"
        v-model="passwordConfirmation"
        type="password"
        required
        autocomplete="new-password"
        placeholder="Repeat your password"
      />
    </div>
    <div v-if="passwordError" class="alert alert--error" role="alert">
      {{ passwordError }}
    </div>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Creating account...' : 'Create account' }}
    </button>
  </form>
</template>

<style scoped>
.signup-form {
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
