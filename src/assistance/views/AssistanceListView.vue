<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAssistanceStore } from '@/assistance/stores/assistance.store'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentId = Number(route.params.studentId)
const assistanceStore = useAssistanceStore()
const { records, isLoading, error } = storeToRefs(assistanceStore)

onMounted(() => {
  assistanceStore.load(academyId, studentId)
})

function navigateToCreate() {
  router.push({ name: 'assistance-create', params: { academyId, studentId } })
}

function navigateToEdit(assistanceId: string) {
  router.push({ name: 'assistance-edit', params: { academyId, studentId, assistanceId } })
}

function navigateBack() {
  router.push({ name: 'student-list', params: { academyId } })
}

async function handleDelete(assistanceId: string) {
  if (window.confirm('Are you sure you want to delete this assistance record?')) {
    await assistanceStore.remove(academyId, studentId, assistanceId)
  }
}
</script>

<template>
  <div class="assistance-list">
    <div class="assistance-list__header">
      <div class="assistance-list__header-left">
        <BaseButton variant="ghost" @click="navigateBack">&larr; Back</BaseButton>
        <h1 class="assistance-list__title">Attendance</h1>
      </div>
      <BaseButton @click="navigateToCreate">Mark Attendance</BaseButton>
    </div>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <div v-if="isLoading" class="assistance-list__loading">Loading...</div>

    <div v-else-if="records.length === 0" class="assistance-list__empty">
      <p>No attendance records yet. Mark your first attendance to get started.</p>
    </div>

    <div v-else class="assistance-list__table-wrapper">
      <table class="assistance-list__table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.date }}</td>
            <td class="assistance-list__actions">
              <BaseButton variant="ghost" size="sm" @click="navigateToEdit(record.id)">
                Edit
              </BaseButton>
              <BaseButton variant="danger" size="sm" @click="handleDelete(record.id)">
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
.assistance-list {
  padding: var(--space-6);
}

.assistance-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.assistance-list__header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.assistance-list__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0;
}

.assistance-list__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.assistance-list__empty {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.assistance-list__table-wrapper {
  overflow-x: auto;
}

.assistance-list__table {
  width: 100%;
  border-collapse: collapse;
}

.assistance-list__table th,
.assistance-list__table td {
  padding: var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--color-warm-gray-dark);
}

.assistance-list__table th {
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  background-color: var(--color-warm-gray);
}

.assistance-list__table tr:hover {
  background-color: var(--color-warm-gray);
}

.assistance-list__actions {
  display: flex;
  gap: var(--space-2);
}
</style>