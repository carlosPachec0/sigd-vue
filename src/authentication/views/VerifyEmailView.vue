<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import BaseSpinner from '@/shared/components/BaseSpinner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('')

onMounted(async () => {
  const id = route.params.id as string
  const hash = route.params.hash as string

  try {
    const response = await authStore.verifyEmail(id, hash)
    message.value = response
    status.value = 'success'
  } catch {
    message.value = 'This verification link is invalid or has expired.'
    status.value = 'error'
  }
})

function goToDashboard(): void {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="verify-page">
    <div class="verify-card">
      <BaseSpinner v-if="status === 'loading'" size="lg" />

      <template v-else>
        <BaseAlert v-if="status === 'success'" variant="success" title="Email verified">
          {{ message }}
        </BaseAlert>

        <BaseAlert v-else variant="error" title="Verification failed">
          {{ message }}
        </BaseAlert>

        <button class="btn-primary" @click="goToDashboard">Go to dashboard</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.verify-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--space-6);
}

.verify-card {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-lg);
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.btn-primary {
  padding: var(--space-3) var(--space-6);
  background-color: var(--color-electric-blue);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-electric-blue-dark);
}
</style>
