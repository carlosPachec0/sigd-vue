<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/authentication/stores/auth.store'
import { useAcademyStore } from '@/academies/stores/academy.store'
import { useStudentStore } from '@/students/stores/student.store'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseSpinner from '@/shared/components/BaseSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const academyStore = useAcademyStore()
const studentStore = useStudentStore()
const { user, isEmailVerified } = storeToRefs(authStore)
const { academies } = storeToRefs(academyStore)

const isLoadingAll = ref(true)

onMounted(async () => {
  try {
    await academyStore.load()
  } catch {
    // Handled by store-level error state
  } finally {
    isLoadingAll.value = false
  }
})

async function handleResendVerification(): Promise<void> {
  await authStore.resendVerification()
}

function navigateTo(
  routeName: string,
  params?: Record<string, string | number>,
): void {
  router.push({ name: routeName, params })
}

const totalAcademies = computed(() => academies.value.length)

const singleAcademy = computed(() => (academies.value.length === 1 ? academies.value[0] : null))

async function goToStudents(): Promise<void> {
  if (totalAcademies.value === 0) return
  if (singleAcademy.value) {
    try {
      await studentStore.load(singleAcademy.value.id)
    } catch {
      // Handled by store-level error state
    }
    navigateTo('student-list', { academyId: singleAcademy.value.id })
    return
  }
  navigateTo('academy-list')
}

function goToPayments(): void {
  if (totalAcademies.value === 0) return
  navigateTo('academy-list')
}

const studentsCtaLabel = computed(() => {
  if (totalAcademies.value === 0) return 'Create an academy first'
  if (singleAcademy.value) return `View students of ${singleAcademy.value.name}`
  return 'Choose an academy'
})

const paymentsCtaLabel = computed(() => {
  if (totalAcademies.value === 0) return 'Create an academy first'
  return 'Choose an academy'
})

async function viewAcademyStudents(academyId: number): Promise<void> {
  try {
    await studentStore.load(academyId)
  } catch {
    // Handled by store-level error state
  }
  navigateTo('student-list', { academyId })
}

function editAcademy(academyId: number): void {
  navigateTo('academy-edit', { id: academyId })
}
</script>

<template>
  <div class="dashboard">
    <h1 class="dashboard__title">Welcome back, {{ user?.name ?? 'User' }}</h1>

    <BaseAlert v-if="!isEmailVerified" variant="warning" title="Verify your email">
      <p>
        Your email address is not verified. Please check your inbox for a verification link.
        <button class="dashboard__link" @click="handleResendVerification">
          Resend verification email
        </button>
      </p>
    </BaseAlert>

    <section class="dashboard__section">
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Quick actions</h2>
      </div>

      <div class="dashboard__grid">
        <BaseCard>
          <div class="dashboard__card">
            <div class="dashboard__card-content">
              <h3>Getting started</h3>
              <p>
                Create your first academy to start managing students, payments, and
                attendance.
              </p>
            </div>
            <BaseButton @click="navigateTo('academy-create')">
              Create academy
            </BaseButton>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="dashboard__card">
            <div class="dashboard__card-content">
              <h3>Academies</h3>
              <p>Manage your sports academies, disciplines, and fee structures.</p>
            </div>
            <BaseButton variant="secondary" @click="navigateTo('academy-list')">
              View all
            </BaseButton>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="dashboard__card">
            <div class="dashboard__card-content">
              <h3>Students</h3>
              <p>Track student registrations, attendance, and progress.</p>
            </div>
            <BaseButton
              variant="secondary"
              :disabled="totalAcademies === 0"
              @click="goToStudents"
            >
              {{ studentsCtaLabel }}
            </BaseButton>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="dashboard__card">
            <div class="dashboard__card-content">
              <h3>Payments</h3>
              <p>View and manage payments, fees, and financial records.</p>
            </div>
            <BaseButton
              variant="secondary"
              :disabled="totalAcademies === 0"
              @click="goToPayments"
            >
              {{ paymentsCtaLabel }}
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </section>

    <section class="dashboard__section">
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Your academies</h2>
        <BaseButton variant="ghost" size="sm" @click="navigateTo('academy-list')">
          View all
        </BaseButton>
      </div>

      <div v-if="isLoadingAll" class="dashboard__loading">
        <BaseSpinner />
      </div>

      <div v-else-if="academies.length === 0" class="dashboard__empty">
        <p>No academies yet.</p>
        <BaseButton @click="navigateTo('academy-create')">Create your first academy</BaseButton>
      </div>

      <div v-else class="dashboard__grid">
        <BaseCard v-for="academy in academies" :key="academy.id">
          <div class="dashboard__card">
            <div class="dashboard__card-content">
              <h3>{{ academy.name }}</h3>
              <p>{{ academy.discipline }}</p>
              <p class="dashboard__card-meta">
                Registration: ${{ academy.registration_fee }} · Monthly: ${{ academy.monthly_fee }} · Class: ${{ academy.class_fee }}
              </p>
            </div>
            <div class="dashboard__card-actions">
              <BaseButton variant="secondary" size="sm" @click="viewAcademyStudents(academy.id)">
                Students
              </BaseButton>
              <BaseButton variant="ghost" size="sm" @click="editAcademy(academy.id)">
                Edit
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: var(--content-max-width);
}

.dashboard__title {
  margin-bottom: var(--space-6);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
}

.dashboard__section {
  margin-bottom: var(--space-10);
}

.dashboard__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.dashboard__section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.dashboard__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
}

.dashboard__card-content {
  flex: 1;
}

.dashboard__card-content h3 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-2) 0;
}

.dashboard__card-content p {
  color: var(--color-slate);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.dashboard__card-meta {
  margin-top: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-slate);
}

.dashboard__card-actions {
  display: flex;
  gap: var(--space-2);
}

.dashboard__loading {
  display: flex;
  justify-content: center;
  padding: var(--space-8);
}

.dashboard__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  background-color: var(--color-warm-gray);
  border-radius: var(--radius-lg);
  text-align: center;
}

.dashboard__empty p {
  color: var(--color-slate);
  margin: 0;
}

.dashboard__link {
  background: none;
  border: none;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  font-weight: var(--font-semibold);
}

.dashboard__link:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }

  .dashboard__section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}
</style>
