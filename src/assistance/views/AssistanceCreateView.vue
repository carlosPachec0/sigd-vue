<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAssistanceStore } from '@/assistance/stores/assistance.store'
import { HttpError } from '@/shared/api/http-error'
import AssistanceForm from '@/assistance/components/AssistanceForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { AssistanceFormData } from '@/assistance/components/AssistanceForm.types'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentId = Number(route.params.studentId)
const assistanceStore = useAssistanceStore()
const isLoading = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

async function handleSubmit(payload: AssistanceFormData) {
  isLoading.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await assistanceStore.create(academyId, studentId, payload)
    router.push({ name: 'assistance-list', params: { academyId, studentId } })
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
  router.push({ name: 'assistance-list', params: { academyId, studentId } })
}
</script>

<template>
  <div class="assistance-create">
    <h1 class="assistance-create__title">Mark Attendance</h1>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <AssistanceForm
      :is-loading="isLoading"
      submit-label="Mark Attendance"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.assistance-create {
  padding: var(--space-6);
  max-width: 600px;
}

.assistance-create__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}
</style>