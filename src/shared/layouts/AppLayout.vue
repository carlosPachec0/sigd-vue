<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/authentication/stores/auth.store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

const navItems = [
  { name: 'dashboard', label: 'Dashboard' },
  { name: 'profile', label: 'Profile' },
]

async function handleLogout(): Promise<void> {
  await authStore.logout()
  router.push({ name: 'login' })
}

function toggleMobileMenu(): void {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu(): void {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="header__inner">
        <RouterLink :to="{ name: 'dashboard' }" class="header__brand" @click="closeMobileMenu">
          <span class="header__logo">SIGD</span>
        </RouterLink>

        <nav class="header__nav" :class="{ 'header__nav--open': isMobileMenuOpen }">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="header__nav-link"
            :class="{ 'header__nav-link--active': route.name === item.name }"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </RouterLink>
          <button class="header__logout" @click="handleLogout">Sign out</button>
        </nav>

        <button class="header__menu-toggle" aria-label="Toggle menu" @click="toggleMobileMenu">
          <span class="header__menu-icon" :class="{ 'header__menu-icon--open': isMobileMenuOpen }"></span>
        </button>
      </div>
    </header>

    <main class="main">
      <div class="main__inner">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background-color: var(--color-charcoal);
  color: var(--color-white);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
}

.header__inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--color-white);
}

.header__logo {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, var(--color-electric-blue), var(--color-mint));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header__nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.header__nav-link:hover {
  color: var(--color-white);
  background-color: rgba(255, 255, 255, 0.1);
}

.header__nav-link--active {
  color: var(--color-white);
  background-color: rgba(67, 97, 238, 0.3);
}

.header__logout {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.header__logout:hover {
  background-color: rgba(255, 107, 107, 0.2);
  border-color: var(--color-coral-flame);
  color: var(--color-coral-flame);
}

/* Mobile menu toggle */
.header__menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  padding: var(--space-2);
}

.header__menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: currentColor;
  position: relative;
  transition: background-color var(--transition-fast);
}

.header__menu-icon::before,
.header__menu-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  transition: transform var(--transition-fast);
}

.header__menu-icon::before {
  top: -7px;
}

.header__menu-icon::after {
  top: 7px;
}

.header__menu-icon--open {
  background-color: transparent;
}

.header__menu-icon--open::before {
  transform: rotate(45deg);
  top: 0;
}

.header__menu-icon--open::after {
  transform: rotate(-45deg);
  top: 0;
}

/* Main content */
.main {
  flex: 1;
  padding: var(--space-8) var(--space-6);
}

.main__inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .header__menu-toggle {
    display: block;
  }

  .header__nav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background-color: var(--color-charcoal);
    flex-direction: column;
    padding: var(--space-4);
    gap: var(--space-2);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-lg);
  }

  .header__nav--open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .header__nav-link,
  .header__logout {
    width: 100%;
    text-align: center;
    padding: var(--space-3);
  }

  .main {
    padding: var(--space-6) var(--space-4);
  }
}
</style>
