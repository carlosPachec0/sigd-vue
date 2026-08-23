<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAcademyStore } from '@/academies/stores/academy.store'
import { HttpError } from '@/shared/api/http-error'
import AcademyForm from '@/academies/components/AcademyForm.vue'
import BaseAlert from '@/shared/components/BaseAlert.vue'
import type { AcademyDto, UpdateAcademyDto } from '@/academies/types/academy.dto'

const router = useRouter()
const route = useRoute()
const academyStore = useAcademyStore()
const academy = ref<AcademyDto | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<HttpError | null>(null)
const validationErrors = ref<Record<string, string[]>>({})

onMounted(async () => {
  const id = Number(route.params.id)
  isLoading.value = true
  try {
    const result = await academyStore.getById(id)
    academy.value = result
  } catch (err) {
    if (err instanceof HttpError) {
      error.value = err
    }
  } finally {
    isLoading.value = false
  }
})

async function handleSubmit(payload: UpdateAcademyDto) {
  if (!academy.value) return

  isSaving.value = true
  error.value = null
  validationErrors.value = {}

  try {
    await academyStore.update(academy.value.id, payload)
    router.push({ name: 'academy-list' })
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
  router.push({ name: 'academy-list' })
}
</script>

<template>
  <div class="academy-edit">
    <h1 class="academy-edit__title">Edit Academy</h1>

    <div v-if="isLoading" class="academy-edit__loading">Loading...</div>

    <BaseAlert v-else-if="error" variant="error" dismissible @dismiss="error = null">
      {{ error.displayMessage }}
    </BaseAlert>

    <AcademyForm
      v-else-if="academy"
      :initial-values="academy"
      :is-loading="isSaving"
      submit-label="Save Changes"
      :errors="validationErrors"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.academy-edit {
  padding: var(--space-6);
  max-width: 600px;
}

.academy-edit__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-charcoal);
  margin: 0 0 var(--space-6) 0;
}

.academy-edit__loading {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-slate);
}
</style>
