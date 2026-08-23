<script setup lang="ts">
import { ref } from 'vue'
import type { StudentFormProps, StudentFormEmits } from './StudentForm.types'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'

const props = defineProps<StudentFormProps>()
const emit = defineEmits<StudentFormEmits>()

const name = ref(props.initialValues?.name ?? '')
const gender = ref(props.initialValues?.gender ?? 'Male')
const birthDate = ref(props.initialValues?.birth_date ?? '')
const height = ref(props.initialValues?.height?.toString() ?? '')
const weight = ref(props.initialValues?.weight?.toString() ?? '')

function handleSubmit() {
  emit('submit', {
    name: name.value,
    gender: gender.value,
    birth_date: birthDate.value,
    height: height.value ? parseFloat(height.value) : undefined,
    weight: weight.value ? parseFloat(weight.value) : undefined,
  })
}
</script>

<template>
  <form class="student-form" @submit.prevent="handleSubmit">
    <BaseInput
      id="name"
      v-model="name"
      label="Name"
      placeholder="Enter student name"
      required
      :error="errors?.name?.[0]"
    />

    <div class="student-form__field">
      <label for="gender" class="student-form__label">
        Gender
        <span class="student-form__required" aria-label="required">*</span>
      </label>
      <select id="gender" v-model="gender" class="student-form__select">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <p v-if="errors?.gender?.[0]" class="student-form__error" role="alert">
        {{ errors.gender[0] }}
      </p>
    </div>

    <BaseInput
      id="birth-date"
      v-model="birthDate"
      label="Birth Date"
      type="date"
      required
      :error="errors?.birth_date?.[0]"
    />

    <BaseInput
      id="height"
      v-model="height"
      label="Height (m)"
      type="number"
      placeholder="Optional"
      :error="errors?.height?.[0]"
    />

    <BaseInput
      id="weight"
      v-model="weight"
      label="Weight (kg)"
      type="number"
      placeholder="Optional"
      :error="errors?.weight?.[0]"
    />

    <div class="student-form__actions">
      <BaseButton type="button" variant="ghost" @click="$emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" :loading="isLoading">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.student-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.student-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.student-form__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-charcoal);
}

.student-form__required {
  color: var(--color-coral-flame);
  margin-left: var(--space-1);
}

.student-form__select {
  padding: var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-charcoal);
  background-color: var(--color-white);
  border: 1px solid var(--color-warm-gray-dark);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.student-form__select:focus {
  outline: none;
  border-color: var(--color-electric-blue);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.student-form__error {
  font-size: var(--text-sm);
  color: var(--color-error);
  margin: 0;
}

.student-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
</style>
