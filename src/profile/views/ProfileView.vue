<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProfileStore } from '../stores/profile.store'
import { useAuthStore } from '@/authentication/stores/auth.store'
import ProfileForm from '../components/ProfileForm.vue'
import ChangePasswordForm from '../components/ChangePasswordForm.vue'
import type { UpdateProfileDto, ChangePasswordDto } from '../types/profile.dto'

const profileStore = useProfileStore()
const authStore = useAuthStore()

const profileSuccess = ref<string | null>(null)
const passwordSuccess = ref<string | null>(null)

onMounted(async () => {
  await profileStore.fetchProfile()
})

async function handleUpdateProfile(payload: UpdateProfileDto): Promise<void> {
  await profileStore.updateProfile(payload)
  profileSuccess.value = 'Profile updated successfully.'
  setTimeout(() => (profileSuccess.value = null), 3000)
}

async function handleChangePassword(payload: ChangePasswordDto): Promise<void> {
  const message = await profileStore.changePassword(payload)
  passwordSuccess.value = message
  setTimeout(() => (passwordSuccess.value = null), 3000)
}

async function handleResendVerification(): Promise<void> {
  await authStore.resendVerification()
}
</script>

<template>
  <div class="profile-page">
    <h1>Your Profile</h1>

    <section class="profile-section">
      <h2>Profile Information</h2>
      <div v-if="profileSuccess" class="alert alert--success" role="status">
        {{ profileSuccess }}
      </div>
      <ProfileForm
        :profile="profileStore.profile"
        :is-loading="profileStore.isLoading"
        :error="profileStore.error"
        @submit="handleUpdateProfile"
      />
    </section>

    <section class="profile-section">
      <h2>Change Password</h2>
      <div v-if="passwordSuccess" class="alert alert--success" role="status">
        {{ passwordSuccess }}
      </div>
      <ChangePasswordForm
        :is-loading="profileStore.isLoading"
        :error="profileStore.error"
        @submit="handleChangePassword"
      />
    </section>

    <section v-if="profileStore.profile?.email_verified_at === null" class="profile-section">
      <h2>Email Verification</h2>
      <p>Your email address is not verified.</p>
      <button class="btn-secondary" @click="handleResendVerification">
        Resend verification email
      </button>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
}

.profile-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.profile-section:last-child {
  border-bottom: none;
}

h2 {
  margin-bottom: 1rem;
}

.alert {
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.alert--success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--accent-bg);
}
</style>
