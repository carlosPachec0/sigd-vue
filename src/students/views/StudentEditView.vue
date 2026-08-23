<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '@/students/stores/student.store'
import { HttpError } from '@/shared/api/http-error'
import StudentForm from '@/students/components/StudentForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { StudentDto } from '@/students/types/student.dto'
import type { StudentFormData } from '@/students/components/StudentForm.types'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentId = Number(route.params.studentId)
const studentStore = useStudentStore()
const student = ref<StudentDto | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

onMounted(async () => {
  isLoading.value = true
  try {
    const result = await studentStore.getById(academyId, studentId)
    student.value = result
  } catch (err) {
    if (err instanceof HttpError) {
      error.value = err
    }
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit(payload: StudentFormData) {
  if (!student.value) return

  isSaving.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await studentStore.update(academyId, studentId, payload)
    router.push({ name: 'student-list', params: { academyId } })
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
  router.push({ name: 'student-list', params: { academyId } })
}
</script>

<template>
  <div class="student-edit">
    <h1 class="student-edit__title">Edit Student</h1>

    <div v-if="isLoading" class="student-edit__loading">Loading...</div>

    <BaseAlert v-else-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <StudentForm
      v-else-if="student"
      :academy-id="academyId"
      :initial-values="student"
      :is-loading="isSaving"
      submit-label="Save Changes"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.student-edit {
  padding: var(--space-6);
  max-width: 600px;
}

.student-edit__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}

.student-edit__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}
</style>
