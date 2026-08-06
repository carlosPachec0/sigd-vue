<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ProfileFormProps, ProfileFormEmits } from './ProfileForm.types'

const props = defineProps<ProfileFormProps>()

const emit = defineEmits<ProfileFormEmits>()

const name = ref('')
const email = ref('')

watch(
  () => props.profile,
  (newProfile) => {
    if (newProfile) {
      name.value = newProfile.name
      email.value = newProfile.email
    }
  },
  { immediate: true },
)

function handleSubmit(): void {
  emit('submit', { name: name.value, email: email.value })
}
</script>

<template>
  <form class="profile-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="alert alert--error" role="alert">
      {{ error.displayMessage }}
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
    <div v-if="profile?.email_verified_at === null" class="alert alert--warning" role="status">
      Your email is not verified. Check your inbox for a verification link.
    </div>
    <button type="submit" :disabled="isLoading">
      {{ isLoading ? 'Saving...' : 'Save changes' }}
    </button>
  </form>
</template>

<style scoped>
.profile-form {
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

.alert--warning {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}
</style>
