<script setup lang="ts">
import { ref } from 'vue'
import type { PaymentFormProps, PaymentFormEmits } from './PaymentForm.types'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'

const props = defineProps<PaymentFormProps>()
const emit = defineEmits<PaymentFormEmits>()

const subject = ref(props.initialValues?.subject ?? '')
const amount = ref(props.initialValues?.amount?.toString() ?? '')

function handleSubmit() {
  emit('submit', {
    subject: subject.value,
    amount: parseFloat(amount.value),
  })
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form class="payment-form" @submit.prevent="handleSubmit">
    <BaseInput
      id="subject"
      v-model="subject"
      label="Subject"
      placeholder="Enter payment subject"
      required
      :error="errors?.subject?.[0]"
    />

    <BaseInput
      id="amount"
      v-model="amount"
      label="Amount"
      type="number"
      placeholder="0.00"
      required
      :error="errors?.amount?.[0]"
    />

    <div class="payment-form__actions">
      <BaseButton type="button" variant="ghost" @click="handleCancel">Cancel</BaseButton>
      <BaseButton type="submit" :loading="isLoading">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.payment-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.payment-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
</style>
