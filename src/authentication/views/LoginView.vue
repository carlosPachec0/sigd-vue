<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import LoginForm from '../components/LoginForm.vue'
import type { LoginDto } from '../types/auth.dto'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogin(payload: LoginDto): Promise<void> {
  try {
    await authStore.login(payload)
    router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('Login failed:', error)
    // Error is already set on authStore.error — the form will display it
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Sign in to SIGD</h1>
    <LoginForm :is-loading="authStore.isLoading" :error="authStore.error" @submit="handleLogin" />
    <p class="auth-link">
      Don't have an account?
      <RouterLink :to="{ name: 'signup' }">Sign up</RouterLink>
    </p>
    <p class="auth-link">
      <RouterLink :to="{ name: 'forgot-password' }">Forgot your password?</RouterLink>
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
  margin-bottom: var(--space-6);
  color: var(--color-charcoal);
}

.auth-link {
  margin-top: var(--space-4);
  text-align: center;
  color: var(--color-slate);
}
</style>
