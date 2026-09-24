<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50">
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity lg:hidden"
      @click="isMobileMenuOpen = false"
    />

    <!-- Mobile Slide-over Drawer -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:hidden',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 font-mono text-xs font-black tracking-tight text-white shadow-md shadow-emerald-500/20">
            ITF
          </div>
          <div>
            <span class="block text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">SIWES Supervisor</span>
            <span class="block text-[10px] font-semibold text-slate-400 dark:text-slate-500">Industry Portal</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close navigation"
          class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          @click="isMobileMenuOpen = false"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
        <div v-for="section in sections" :key="section.title" class="mb-6">
          <p class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {{ section.title }}
          </p>
          <ul class="space-y-1">
            <li v-for="item in section.items" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                active-class="bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-600"
                @click="isMobileMenuOpen = false"
              >
                <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span class="flex-1">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-emerald-500"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="space-y-2 border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="toggleTheme"
        >
          <span class="flex items-center gap-3">
            <Sun v-if="isDark" class="h-[18px] w-[18px] text-amber-400" />
            <Moon v-else class="h-[18px] w-[18px] text-slate-600" />
            <span>{{ isDark ? 'Light Theme' : 'Dark Theme' }}</span>
          </span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ isDark ? 'Dark' : 'Light' }}</span>
        </button>

        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          @click="handleLogout"
        >
          <LogOut class="h-[18px] w-[18px] shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Desktop Sidebar -->
    <aside class="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">
      <div class="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-200 px-6 dark:border-slate-800">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 font-mono text-xs font-black tracking-tight text-white shadow-md shadow-emerald-500/20">
          ITF
        </div>
        <div>
          <span class="block text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">SIWES Supervisor</span>
          <span class="block text-[10px] font-semibold text-slate-400 dark:text-slate-500">Industry Portal</span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <div v-for="section in sections" :key="section.title" class="mb-6">
          <p class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {{ section.title }}
          </p>
          <ul class="space-y-1">
            <li v-for="item in section.items" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                active-class="bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-600"
              >
                <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span class="flex-1">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-emerald-500"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="space-y-1.5 border-t border-slate-200 p-4 dark:border-slate-800">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="toggleTheme"
        >
          <span class="flex items-center gap-3">
            <Sun v-if="isDark" class="h-[18px] w-[18px] text-amber-400" />
            <Moon v-else class="h-[18px] w-[18px] text-slate-600" />
            <span>{{ isDark ? 'Light Theme' : 'Dark Theme' }}</span>
          </span>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ isDark ? 'Dark' : 'Light' }}</span>
        </button>

        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
          @click="handleLogout"
        >
          <LogOut class="h-[18px] w-[18px] shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85 sm:px-6">
        <div class="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open mobile navigation"
            class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            @click="isMobileMenuOpen = true"
          >
            <Menu class="h-5 w-5" />
          </button>
          <div>
            <h1 class="text-sm font-bold text-slate-900 dark:text-white">
              Industry Supervisor Console
            </h1>
            <p class="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">
              ITF Form 8 Reviewer & Trainee Oversight Desk
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle dark mode"
            class="hidden rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="h-4 w-4 text-amber-400" />
            <Moon v-else class="h-4 w-4" />
          </button>

          <div class="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

          <!-- Profile Dropdown -->
          <div ref="profileDropdownRef" class="relative">
            <button
              type="button"
              class="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-100 focus:outline-hidden dark:hover:bg-slate-800"
              :aria-expanded="isProfileDropdownOpen"
              aria-haspopup="true"
              @click="isProfileDropdownOpen = !isProfileDropdownOpen"
            >
              <div class="hidden text-right sm:block">
                <p class="text-xs font-semibold text-slate-900 dark:text-white">
                  {{ userProfile.name || 'Industry Mentor' }}
                </p>
                <p class="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  Supervisor Desk
                </p>
              </div>
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-xs">
                {{ userInitials }}
              </div>
              <ChevronDown class="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isProfileDropdownOpen"
              class="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900"
            >
              <div class="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                <p class="text-xs font-semibold text-slate-900 dark:text-white">
                  {{ userProfile.name || 'Industry Mentor' }}
                </p>
                <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {{ userProfile.email || 'supervisor@organization.com' }}
                </p>
              </div>

              <div class="py-1">
                <NuxtLink
                  to="/supervisor/profile"
                  class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  @click="isProfileDropdownOpen = false"
                >
                  <UserCog class="h-4 w-4 text-slate-400" />
                  <span>Account Settings</span>
                </NuxtLink>
              </div>

              <div class="border-t border-slate-100 pt-1 dark:border-slate-800">
                <button
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  @click="handleLogout"
                >
                  <LogOut class="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useCookie, navigateTo } from '#app'
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  UserCog,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-vue-next'

interface DecodedUserToken {
  id?: string
  sub?: string
  userId?: string
  name?: string
  email?: string
  role?: string
  [key: string]: unknown
}

const isMobileMenuOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref<HTMLElement | null>(null)
const isDark = ref(false)

const userProfile = reactive({
  name: '',
  email: ''
})

const sections = computed(() => [
  {
    title: 'Management',
    items: [
      { label: 'Dashboard', to: '/supervisor/dashboard', icon: LayoutDashboard, badge: null },
      { label: 'Assigned Trainees', to: '/supervisor/trainees', icon: Users, badge: null },
      { label: 'Logbook Reviews', to: '/supervisor/reviews', icon: ClipboardCheck, badge: null }
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile settings', to: '/supervisor/profile', icon: UserCog, badge: null }
    ]
  }
])

const userInitials = computed(() => {
  const cleanName = (userProfile.name || '').trim()
  if (!cleanName) return 'SV'

  const parts = cleanName.split(/\s+/).filter(Boolean)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return cleanName.slice(0, 2).toUpperCase()
})

const initTheme = () => {
  if (import.meta.client) {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    } else {
      isDark.value = false
      document.documentElement.classList.remove('dark')
    }
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (import.meta.client) {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }
}

const extractUserFromToken = () => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) return

  try {
    const decoded = jwtDecode<DecodedUserToken>(token)
    userProfile.name = decoded.name || 'Industry Supervisor'
    userProfile.email = decoded.email || ''
  } catch {
    userProfile.name = 'Industry Supervisor'
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (
    isProfileDropdownOpen.value &&
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(event.target as Node)
  ) {
    isProfileDropdownOpen.value = false
  }
}

const handleLogout = () => {
  isProfileDropdownOpen.value = false
  const tokenCookie = useCookie<string | null>('auth_token')
  tokenCookie.value = null
  return navigateTo('/login')
}

onMounted(() => {
  initTheme()
  extractUserFromToken()

  if (import.meta.client) {
    window.addEventListener('click', handleClickOutside)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('click', handleClickOutside)
  }
})
</script>