<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAssistanceStore } from '@/assistance/stores/assistance.store'
import { HttpError } from '@/shared/api/http-error'
import AssistanceForm from '@/assistance/components/AssistanceForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { AssistanceDto } from '@/assistance/types/assistance.dto'
import type { AssistanceFormData } from '@/assistance/components/AssistanceForm.types'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentId = Number(route.params.studentId)
const assistanceId = String(route.params.assistanceId)
const assistanceStore = useAssistanceStore()
const record = ref<AssistanceDto | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

onMounted(async () => {
  isLoading.value = true
  try {
    const result = await assistanceStore.getById(academyId, studentId, assistanceId)
    record.value = result
  } catch (err) {
    if (err instanceof HttpError) {
      error.value = err
    }
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit(payload: AssistanceFormData) {
  if (!record.value) return

  isSaving.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await assistanceStore.update(academyId, studentId, assistanceId, payload)
    router.push({ name: 'assistance-list', params: { academyId, studentId } })
  } catch (err) {
    if (err instanceof HttpError) {
      error.value = err
      if (err.status === 422) {
        validationErrors.value = { validation: err.errors }
      }
    }
  } finally {
    isSaving.value = false
  }
}

function handleCancel() {
  router.push({ name: 'assistance-list', params: { academyId, studentId } })
}
</script>

<template>
  <div class="assistance-edit">
    <h1 class="assistance-edit__title">Edit Attendance</h1>

    <div v-if="isLoading" class="assistance-edit__loading">Loading...</div>

    <BaseAlert v-else-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <AssistanceForm
      v-else-if="record"
      :initial-values="record"
      :is-loading="isSaving"
      submit-label="Save Changes"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.assistance-edit {
  padding: var(--space-6);
  max-width: 600px;
}

.assistance-edit__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}

.assistance-edit__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}
</style>