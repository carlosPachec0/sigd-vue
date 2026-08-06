<script setup lang="ts">
import { ref } from 'vue'
import type { ChangePasswordFormProps, ChangePasswordFormEmits } from './ChangePasswordForm.types'

defineProps<ChangePasswordFormProps>()

const emit = defineEmits<ChangePasswordFormEmits>()

const currentPassword = ref('')
const newPassword = ref('')
const newPasswordConfirmation = ref('')

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
const passwordError = ref<string | null>(null)

function validatePassword(): boolean {
  if (!PASSWORD_REGEX.test(newPassword.value)) {
    passwordError.value =
      'Password must be at least 8 characters with uppercase, lowercase, number, and symbol.'
    return false
  }
  if (newPassword.value !== newPasswordConfirmation.value) {
    passwordError.value = 'Passwords do not match.'
    return false
  }
  if (currentPassword.value === newPassword.value) {
    passwordError.value = 'New password must be different from current password.'
    return false
  }
  passwordError.value = null
  return true
}

function handleSubmit(): void {
  if (!validatePassword()) return
  emit('submit', {
    current_password: currentPassword.value,
    new_password: newPassword.value,
    new_password_confirmation: newPasswordConfirmation.value,
  })
}
</script>

<template>
  <form class="change-password-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="alert alert--error" role="alert">
      {{ error.displayMessage }}
    </div>
    <div class="form-group">
      <label for="current-password">Current Password</label>
      <input
        id="current-password"
        v-model="currentPassword"
        type="password"
        required
        autocomplete="current-password"
        placeholder="Your current password"
      />
    </div>
    <div class="form-group">
      <label for="new-password">New Password</label>
      <input
        id="new-password"
        v-model="newPassword"
        type="password"
        required
        autocomplete="new-password"
        placeholder="Min 8 chars, mixed case, number, symbol"
      />
    </div>
    <div class="form-group">
      <label for="new-password-confirmation">Confirm New Password</label>
      <input
        id="new-password-confirmation"
        v-model="newPasswordConfirmation"
        type="password"
        required
        autocomplete="new-password"
        placeholder="Repeat your new password"
      />
    </div>
    <div v-if="passwordError" class="alert alert--error" role="alert">
      {{ passwordError }}
    </div>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Changing...' : 'Change password' }}
    </button>
  </form>
</template>

<style scoped>
.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-weight: 500;
}

input {
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.75rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.alert--error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>
