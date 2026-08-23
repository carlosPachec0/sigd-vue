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
    {
      path: '/academies',
      name: 'academy-list',
      component: () => import('@/academies/views/AcademyListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/create',
      name: 'academy-create',
      component: () => import('@/academies/views/AcademyCreateView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/:id/edit',
      name: 'academy-edit',
      component: () => import('@/academies/views/AcademyEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/:academyId/students',
      name: 'student-list',
      component: () => import('@/students/views/StudentListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/:academyId/students/create',
      name: 'student-create',
      component: () => import('@/students/views/StudentCreateView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/:academyId/students/:studentId/edit',
      name: 'student-edit',
      component: () => import('@/students/views/StudentEditView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/:academyId/students/:studentId/payments',
      name: 'payment-list',
      component: () => import('@/payments/views/PaymentListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/:academyId/students/:studentId/payments/create',
      name: 'payment-create',
      component: () => import('@/payments/views/PaymentCreateView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/academies/:academyId/students/:studentId/payments/:paymentId/edit',
      name: 'payment-edit',
      component: () => import('@/payments/views/PaymentEditView.vue'),
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
