<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/authentication/stores/auth.store'
import AppLayout from '@/shared/layouts/AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showLayout = computed(() => route.meta.requiresAuth === true)

onMounted(() => {
  authStore.restoreSession()
})
</script>

<template>
  <AppLayout v-if="showLayout && isAuthenticated">
    <RouterView />
  </AppLayout>
  <RouterView v-else />
</template>
