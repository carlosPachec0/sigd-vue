<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const successMessage = ref<string | null>(null)

const token = computed(() => (route.query.token as string) ?? '')
const email = computed(() => (route.query.email as string) ?? '')

async function handleSubmit(payload: {
  email: string
  token: string
  password: string
  password_confirmation: string
}): Promise<void> {
  try {
    const message = await authStore.resetPassword(
      payload.email,
      payload.token,
      payload.password,
      payload.password_confirmation,
    )
    successMessage.value = message
    setTimeout(() => router.push({ name: 'login' }), 2000)
  } catch {
    // Error is already set on authStore.error
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Set new password</h1>
    <div v-if="!token || !email" class="alert alert--error" role="alert">
      Invalid or missing reset link. Please request a new password reset.
    </div>
    <div v-else-if="successMessage" class="alert alert--success" role="status">
      {{ successMessage }} Redirecting to sign in...
    </div>
    <ResetPasswordForm
      v-else
      :token="token"
      :email="email"
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

.alert--error {
  background: var(--color-error-bg);
  color: var(--color-error);
  border: 1px solid var(--color-error-border);
}

.alert--success {
  background: var(--color-success-bg);
  color: var(--color-success);
  border: 1px solid var(--color-success-border);
}
</style>
