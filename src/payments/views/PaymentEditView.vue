<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePaymentStore } from '@/payments/stores/payment.store'
import { HttpError } from '@/shared/api/http-error'
import PaymentForm from '@/payments/components/PaymentForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { PaymentDto } from '@/payments/types/payment.dto'
import type { PaymentFormData } from '@/payments/components/PaymentForm.types'

const router = useRouter()
const route = useRoute()
const academyId = Number(route.params.academyId)
const studentId = Number(route.params.studentId)
const paymentId = String(route.params.paymentId)
const paymentStore = usePaymentStore()
const payment = ref<PaymentDto | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

onMounted(async () => {
  isLoading.value = true
  try {
    const result = await paymentStore.getById(academyId, studentId, paymentId)
    payment.value = result
  } catch (err) {
    if (err instanceof HttpError) {
      error.value = err
    }
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit(payload: PaymentFormData) {
  if (!payment.value) return

  isSaving.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await paymentStore.update(academyId, studentId, paymentId, payload)
    router.push({ name: 'payment-list', params: { academyId, studentId } })
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
  router.push({ name: 'payment-list', params: { academyId, studentId } })
}
</script>

<template>
  <div class="payment-edit">
    <h1 class="payment-edit__title">Edit Payment</h1>

    <div v-if="isLoading" class="payment-edit__loading">Loading...</div>

    <BaseAlert v-else-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <PaymentForm
      v-else-if="payment"
      :initial-values="payment"
      :is-loading="isSaving"
      submit-label="Save Changes"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.payment-edit {
  padding: var(--space-6);
  max-width: 600px;
}

.payment-edit__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}

.payment-edit__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}
</style>
