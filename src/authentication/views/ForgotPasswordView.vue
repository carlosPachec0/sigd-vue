<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import ForgotPasswordForm from '../components/ForgotPasswordForm.vue'

const authStore = useAuthStore()
const successMessage = ref<string | null>(null)

async function handleSubmit(email: string): Promise<void> {
  try {
    const message = await authStore.forgotPassword(email)
    successMessage.value = message
  } catch {
    // Error is already set on authStore.error
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Reset your password</h1>
    <p>Enter your email and we'll send you a link to reset your password.</p>
    <div v-if="successMessage" class="alert alert--success" role="status">
      {{ successMessage }}
    </div>
    <ForgotPasswordForm
      v-else
      :is-loading="authStore.isLoading"
      :error="authStore.error"
      @submit="handleSubmit"
    />
    <p class="auth-link">
      <RouterLink :to="{ name: 'login' }">Back to sign in</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-8);
  background: var(--color-white);
  min-height: 100vh;
}

h1 {
  margin-bottom: var(--space-4);
  color: var(--color-charcoal);
}

p {
  margin-bottom: var(--space-4);
  color: var(--color-slate);
}

.auth-link {
  margin-top: var(--space-4);
  text-align: center;
  color: var(--color-slate);
}

.alert {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.alert--success {
  background: var(--color-success-bg);
  color: var(--color-success);
  border: 1px solid var(--color-success-border);
}
</style>
