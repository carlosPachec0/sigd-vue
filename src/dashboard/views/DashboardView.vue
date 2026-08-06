<script setup lang="ts">
import { useAuthStore } from '@/authentication/stores/auth.store'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isEmailVerified } = storeToRefs(authStore)

async function handleResendVerification(): Promise<void> {
  await authStore.resendVerification()
}
</script>

<template>
  <div class="dashboard">
    <h1>Welcome back, {{ user?.name ?? 'User' }}</h1>

    <BaseAlert v-if="!isEmailVerified" variant="warning" title="Verify your email">
      <p>
        Your email address is not verified. Please check your inbox for a verification link.
        <button class="link-button" @click="handleResendVerification">Resend verification email</button>
      </p>
    </BaseAlert>

    <div class="dashboard__grid">
      <BaseCard>
        <h2>Getting started</h2>
        <p>This is your SIGD dashboard. From here you can manage your sports academy, students, and more.</p>
      </BaseCard>

      <BaseCard>
        <h2>Academies</h2>
        <p>Manage your sports academies, disciplines, and fee structures.</p>
      </BaseCard>

      <BaseCard>
        <h2>Students</h2>
        <p>Track student registrations, attendance, and progress.</p>
      </BaseCard>

      <BaseCard>
        <h2>Payments</h2>
        <p>View and manage payments, fees, and financial records.</p>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: var(--content-max-width);
}

h1 {
  margin-bottom: var(--space-8);
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-6);
}

.dashboard__grid h2 {
  margin-bottom: var(--space-2);
  font-size: var(--text-xl);
}

.dashboard__grid p {
  color: var(--color-slate);
  line-height: var(--leading-relaxed);
}

.link-button {
  background: none;
  border: none;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  font-weight: var(--font-semibold);
}

.link-button:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
