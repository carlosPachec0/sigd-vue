<script setup lang="ts">
import { ref } from 'vue'
import type { AcademyFormProps, AcademyFormEmits } from './AcademyForm.types'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'

const props = defineProps<AcademyFormProps>()
const emit = defineEmits<AcademyFormEmits>()

const name = ref(props.initialValues?.name ?? '')
const discipline = ref(props.initialValues?.discipline ?? '')
const registrationFee = ref(props.initialValues?.registration_fee?.toString() ?? '')
const monthlyFee = ref(props.initialValues?.monthly_fee?.toString() ?? '')
const classFee = ref(props.initialValues?.class_fee?.toString() ?? '')

function handleSubmit() {
  emit('submit', {
    name: name.value,
    discipline: discipline.value,
    registration_fee: registrationFee.value ? parseFloat(registrationFee.value) : undefined,
    monthly_fee: monthlyFee.value ? parseFloat(monthlyFee.value) : undefined,
    class_fee: classFee.value ? parseFloat(classFee.value) : undefined,
  })
}
</script>

<template>
  <form class="academy-form" @submit.prevent="handleSubmit">
    <BaseInput
      id="name"
      v-model="name"
      label="Name"
      placeholder="Enter academy name"
      required
      :error="errors?.name?.[0]"
    />

    <BaseInput
      id="discipline"
      v-model="discipline"
      label="Discipline"
      placeholder="Enter discipline"
      required
      :error="errors?.discipline?.[0]"
    />

    <BaseInput
      id="registration-fee"
      v-model="registrationFee"
      label="Registration Fee"
      type="number"
      placeholder="0.00"
      required
      :error="errors?.registration_fee?.[0]"
    />

    <BaseInput
      id="monthly-fee"
      v-model="monthlyFee"
      label="Monthly Fee"
      type="number"
      placeholder="0.00"
      required
      :error="errors?.monthly_fee?.[0]"
    />

    <BaseInput
      id="class-fee"
      v-model="classFee"
      label="Class Fee"
      type="number"
      placeholder="0.00"
      required
      :error="errors?.class_fee?.[0]"
    />

    <div class="academy-form__actions">
      <BaseButton type="button" variant="ghost" @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" :loading="isLoading">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.academy-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.academy-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
</style>
