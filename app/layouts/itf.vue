<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50">
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-xs transition-opacity lg:hidden"
      @click="isMobileMenuOpen = false"
    />

    <!-- Mobile Navigation Drawer -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:hidden',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 font-mono text-xs font-black tracking-tight text-white shadow-md shadow-emerald-500/20">
            ITF
          </div>
          <div>
            <span class="block text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">SIWES Portal</span>
            <span class="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Directorate Desk</span>
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
        <div v-for="section in navSections" :key="section.title" class="mb-6">
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
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 font-mono text-xs font-black tracking-tight text-white shadow-md shadow-emerald-500/20">
          ITF
        </div>
        <div>
          <span class="block text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">SIWES Portal</span>
          <span class="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Directorate Desk</span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <div v-for="section in navSections" :key="section.title" class="mb-6">
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
      <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/85 sm:px-6">
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
              ITF Directorate Console
            </h1>
            <p class="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">
              Industrial Training Scheme (ITF Form 8 Oversight & Stamp Authority)
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <p class="text-xs font-semibold text-slate-900 dark:text-white">
              {{ officialProfile.name || 'Zonal Officer' }}
            </p>
            <p class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              OFFICIAL VERIFIER
            </p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-xs">
            ITF
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
import { ref, reactive, onMounted } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useCookie, navigateTo } from '#app'
import {
  LayoutDashboard,
  Users,
  Stamp,
  FileSpreadsheet,
  Menu,
  X,
  LogOut,
  Sun,
  Moon
} from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)
const isDark = ref(false)

const officialProfile = reactive({
  name: '',
  email: ''
})

const navSections = [
  {
    title: 'Operations',
    items: [
      { label: 'Clearance Overview', to: '/itf/dashboard', icon: LayoutDashboard },
      { label: 'Trainees Directory', to: '/itf/trainees', icon: Users },
      { label: 'Form 8 Endorsements', to: '/itf/endorsements', icon: Stamp }
    ]
  },
  {
    title: 'Reporting',
    items: [
      { label: 'Zonal Audit Export', to: '/itf/exports', icon: FileSpreadsheet }
    ]
  }
]

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

const extractOfficerFromToken = () => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) return
  try {
    const decoded = jwtDecode<{ name?: string; email?: string }>(token)
    officialProfile.name = decoded.name || 'Zonal Officer'
    officialProfile.email = decoded.email || ''
  } catch {
    officialProfile.name = 'Zonal Officer'
  }
}

const handleLogout = async () => {
  const tokenCookie = useCookie<string | null>('auth_token')
  tokenCookie.value = null
  await navigateTo('/login')
}

onMounted(() => {
  initTheme()
  extractOfficerFromToken()
})
</script>