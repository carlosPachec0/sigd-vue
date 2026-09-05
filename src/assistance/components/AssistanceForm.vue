<script setup lang="ts">
import { ref } from 'vue'
import type { AssistanceFormProps, AssistanceFormEmits } from './AssistanceForm.types'
import BaseInput from '@/shared/components/BaseInput.vue'
import BaseButton from '@/shared/components/BaseButton.vue'

const props = defineProps<AssistanceFormProps>()
const emit = defineEmits<AssistanceFormEmits>()

const date = ref(props.initialValues?.date ?? '')

function handleSubmit() {
  emit('submit', {
    date: date.value,
  })
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form class="assistance-form" @submit.prevent="handleSubmit">
    <BaseInput
      id="date"
      v-model="date"
      label="Date"
      type="date"
      placeholder="YYYY-MM-DD"
      required
      :error="errors?.date?.[0]"
    />

    <div class="assistance-form__actions">
      <BaseButton type="button" variant="ghost" @click="handleCancel">Cancel</BaseButton>
      <BaseButton type="submit" :loading="isLoading">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.assistance-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.assistance-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-4);
}
</style>