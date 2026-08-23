<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '@/students/stores/student.store'
import { HttpError } from '@/shared/api/http-error'
import StudentForm from '@/students/components/StudentForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { StudentFormData } from '@/students/components/StudentForm.types'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentStore = useStudentStore()
const isLoading = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

async function handleSubmit(payload: StudentFormData) {
  isLoading.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await studentStore.create(academyId, payload)
    router.push({ name: 'student-list', params: { academyId } })
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
  router.push({ name: 'student-list', params: { academyId } })
}
</script>

<template>
  <div class="student-create">
    <h1 class="student-create__title">Add Student</h1>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <StudentForm
      :academy-id="academyId"
      :is-loading="isLoading"
      submit-label="Add Student"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.student-create {
  padding: var(--space-6);
  max-width: 600px;
}

.student-create__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}
</style>
