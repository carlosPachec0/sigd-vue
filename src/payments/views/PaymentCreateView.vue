<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePaymentStore } from '@/payments/stores/payment.store'
import { HttpError } from '@/shared/api/http-error'
import PaymentForm from '@/payments/components/PaymentForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { PaymentFormData } from '@/payments/components/PaymentForm.types'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentId = Number(route.params.studentId)
const paymentStore = usePaymentStore()
const isLoading = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

async function handleSubmit(payload: PaymentFormData) {
  isLoading.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await paymentStore.create(academyId, studentId, payload)
    router.push({ name: 'payment-list', params: { academyId, studentId } })
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
  router.push({ name: 'payment-list', params: { academyId, studentId } })
}
</script>

<template>
  <div class="payment-create">
    <h1 class="payment-create__title">Add Payment</h1>

    <BaseAlert v-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <PaymentForm
      :is-loading="isLoading"
      submit-label="Add Payment"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.payment-create {
  padding: var(--space-6);
  max-width: 600px;
}

.payment-create__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}
</style>
