<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePaymentStore } from '@/payments/stores/payment.store'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentId = Number(route.params.studentId)
const paymentStore = usePaymentStore()
const { payments, isLoading, error } = storeToRefs(paymentStore)

onMounted(() => {
  paymentStore.load(academyId, studentId)
})

function navigateToCreate() {
  router.push({ name: 'payment-create', params: { academyId, studentId } })
}

function navigateToEdit(paymentId: string) {
  router.push({ name: 'payment-edit', params: { academyId, studentId, paymentId } })
}

function navigateBack() {
  router.push({ name: 'student-list', params: { academyId } })
}

async function handleDelete(paymentId: string) {
  if (window.confirm('Are you sure you want to delete this payment?')) {
    await paymentStore.remove(academyId, studentId, paymentId)
  }
}
</script>

<template>
  <div class="payment-list">
    <div class="payment-list__header">
      <div class="payment-list__header-left">
        <BaseButton variant="ghost" @click="navigateBack">&larr; Back</BaseButton>
        <h1 class="payment-list__title">Payments</h1>
      </div>
      <BaseButton @click="navigateToCreate">Add Payment</BaseButton>
    </div>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <div v-if="isLoading" class="payment-list__loading">Loading...</div>

    <div v-else-if="payments.length === 0" class="payment-list__empty">
      <p>No payments yet. Add your first payment to get started.</p>
    </div>

    <div v-else class="payment-list__table-wrapper">
      <table class="payment-list__table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td>{{ payment.subject }}</td>
            <td>${{ payment.amount }}</td>
            <td class="payment-list__actions">
              <BaseButton variant="ghost" size="sm" @click="navigateToEdit(payment.id)">
                Edit
              </BaseButton>
              <BaseButton variant="danger" size="sm" @click="handleDelete(payment.id)">
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
.payment-list {
  padding: var(--space-6);
}

.payment-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.payment-list__header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.payment-list__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0;
}

.payment-list__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.payment-list__empty {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}

.payment-list__table-wrapper {
  overflow-x: auto;
}

.payment-list__table {
  width: 100%;
  border-collapse: collapse;
}

.payment-list__table th,
.payment-list__table td {
  padding: var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--color-warm-gray-dark);
}

.payment-list__table th {
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  background-color: var(--color-warm-gray);
}

.payment-list__table tr:hover {
  background-color: var(--color-warm-gray);
}

.payment-list__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
