<script setup lang="ts">
import { computed } from 'vue'
import type { Props } from './Component.template.types'

const { title, count = 0 } = defineProps<Props>()

const emit = defineEmits<{
  update: [value: number]
  close: []
}>()

const doubled = computed(() => count * 2)
</script>

<template>
  <button @click="emit('update', doubled)">{{ title }}: {{ doubled }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>