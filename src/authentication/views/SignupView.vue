<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import SignupForm from '../components/SignupForm.vue'
import type { SignupDto } from '../types/auth.dto'

const router = useRouter()
const authStore = useAuthStore()

async function handleSignup(payload: SignupDto): Promise<void> {
  try {
    await authStore.signup(payload)
    router.push({ name: 'dashboard' })
  } catch {
    // Error is already set on authStore.error
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Create your account</h1>
    <SignupForm :is-loading="authStore.isLoading" :error="authStore.error" @submit="handleSignup" />
    <p class="auth-link">
      Already have an account?
      <RouterLink :to="{ name: 'login' }">Sign in</RouterLink>
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
