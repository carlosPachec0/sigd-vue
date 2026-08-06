import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'dashboard' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/authentication/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/authentication/views/SignupView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/authentication/views/ForgotPasswordView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/authentication/views/ResetPasswordView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/email/verify/:id/:hash',
      name: 'email-verify',
      component: () => import('@/authentication/views/VerifyEmailView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/dashboard/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/profile/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('sigd_token')

  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && token) {
    return { name: 'dashboard' }
  }
})

export default router
