<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAcademyStore } from '@/academies/stores/academy.store'
import { HttpError } from '@/shared/api/http-error'
import AcademyForm from '@/academies/components/AcademyForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { CreateAcademyDto } from '@/academies/types/academy.dto'

const router = useRouter()
const academyStore = useAcademyStore()
const isLoading = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

async function handleSubmit(payload: CreateAcademyDto) {
  isLoading.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await academyStore.create(payload)
    router.push({ name: 'academy-list' })
  } catch (err) {
    if (err instanceof HttpError) {
      error.value = err
      if (err.status === 422) {
        validationErrors.value = { validation: err.errors }
      }
    }
  } finally {
    isLoading.value = false
  }
}

function handleCancel() {
  router.push({ name: 'academy-list' })
}
</script>

<template>
  <div class="academy-create">
    <h1 class="academy-create__title">Create Academy</h1>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <AcademyForm
      :is-loading="isLoading"
      submit-label="Create Academy"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.academy-create {
  padding: var(--space-6);
  max-width: 600px;
}

.academy-create__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}
</style>
