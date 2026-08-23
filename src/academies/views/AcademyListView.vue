<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAcademyStore } from '@/academies/stores/academy.store'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'

const router = useRouter()
const academyStore = useAcademyStore()
const { academies, isLoading, error } = storeToRefs(academyStore)

onMounted(() => {
  academyStore.load()
})

function navigateToCreate() {
  router.push({ name: 'academy-create' })
}

function navigateToStudents(academyId: number) {
  router.push({ name: 'student-list', params: { academyId } })
}

function navigateToEdit(academyId: number) {
  router.push({ name: 'academy-edit', params: { id: academyId } })
}

async function handleDelete(academyId: number) {
  if (window.confirm('Are you sure you want to delete this academy?')) {
    await academyStore.remove(academyId)
  }
}
</script>

<template>
  <div class="academy-list">
    <div class="academy-list__header">
      <h1 class="academy-list__title">My Academies</h1>
      <BaseButton @click="navigateToCreate">Add Academy</BaseButton>
    </div>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <div v-if="isLoading" class="academy-list__loading">Loading...</div>

    <div v-else-if="academies.length === 0" class="academy-list__empty">
      <p>No academies yet. Create your first academy to get started.</p>
    </div>

    <div v-else class="academy-list__grid">
      <BaseCard v-for="academy in academies" :key="academy.id">
        <div class="academy-card">
          <div class="academy-card__info">
            <h3 class="academy-card__name">{{ academy.name }}</h3>
            <p class="academy-card__discipline">{{ academy.discipline }}</p>
            <div class="academy-card__fees">
              <span>Registration: ${{ academy.registration_fee }}</span>
              <span>Monthly: ${{ academy.monthly_fee }}</span>
              <span>Class: ${{ academy.class_fee }}</span>
            </div>
          </div>
          <div class="academy-card__actions">
            <BaseButton variant="secondary" size="sm" @click="navigateToStudents(academy.id)">
              Students
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="navigateToEdit(academy.id)">
              Edit
            </BaseButton>
            <BaseButton variant="danger" size="sm" @click="handleDelete(academy.id)">
              Delete
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.academy-list {
  padding: var(--space-6);
}

.academy-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.academy-list__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0;
}

.academy-list__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.academy-list__empty {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.academy-list__grid {
  display: grid;
  gap: var(--space-4);
}

.academy-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.academy-card__info {
  flex: 1;
}

.academy-card__name {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-2) 0;
}

.academy-card__discipline {
  color: var(--color-slate);
  margin: 0 0 var(--space-3) 0;
}

.academy-card__fees {
  display: flex;
  gap: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-slate);
}

.academy-card__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
