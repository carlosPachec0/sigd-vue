<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStudentStore } from '@/students/stores/student.store'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentStore = useStudentStore()
const { students, isLoading, error } = storeToRefs(studentStore)

onMounted(() => {
  studentStore.load(academyId)
})

function navigateToCreate() {
  router.push({ name: 'student-create', params: { academyId } })
}

function navigateToEdit(studentId: number) {
  router.push({ name: 'student-edit', params: { academyId, studentId } })
}

function navigateToPayments(studentId: number) {
  router.push({ name: 'payment-list', params: { academyId, studentId } })
}

function navigateToAssistance(studentId: number) {
  router.push({ name: 'assistance-list', params: { academyId, studentId } })
}

function navigateBack() {
  router.push({ name: 'academy-list' })
}

async function handleDelete(studentId: number) {
  if (window.confirm('Are you sure you want to delete this student?')) {
    await studentStore.remove(academyId, studentId)
  }
}
</script>

<template>
  <div class="student-list">
    <div class="student-list__header">
      <div class="student-list__header-left">
        <BaseButton variant="ghost" @click="navigateBack">← Back</BaseButton>
        <h1 class="student-list__title">Students</h1>
      </div>
      <BaseButton @click="navigateToCreate">Add Student</BaseButton>
    </div>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <div v-if="isLoading" class="student-list__loading">Loading...</div>

    <div v-else-if="students.length === 0" class="student-list__empty">
      <p>No students yet. Add your first student to get started.</p>
    </div>

    <div v-else class="student-list__table-wrapper">
      <table class="student-list__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.name }}</td>
            <td>{{ student.gender }}</td>
            <td>{{ student.birth_date }}</td>
            <td>{{ student.height ?? '-' }}</td>
            <td>{{ student.weight ?? '-' }}</td>
            <td class="student-list__actions">
              <BaseButton variant="secondary" size="sm" @click="navigateToPayments(student.id)">
                Payments
              </BaseButton>
              <BaseButton variant="secondary" size="sm" @click="navigateToAssistance(student.id)">
                Attendance
              </BaseButton>
              <BaseButton variant="ghost" size="sm" @click="navigateToEdit(student.id)">
                Edit
              </BaseButton>
              <BaseButton variant="danger" size="sm" @click="handleDelete(student.id)">
                Delete
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.student-list {
  padding: var(--space-6);
}

.student-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.student-list__header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.student-list__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0;
}

.student-list__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.student-list__empty {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.student-list__table-wrapper {
  overflow-x: auto;
}

.student-list__table {
  width: 100%;
  border-collapse: collapse;
}

.student-list__table th,
.student-list__table td {
  padding: var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--color-warm-gray-dark);
}

.student-list__table th {
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  background-color: var(--color-warm-gray);
}

.student-list__table tr:hover {
  background-color: var(--color-warm-gray);
}

.student-list__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
