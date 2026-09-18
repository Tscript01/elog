<template>
  <div :class="{ dark: isDarkMode }" class="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <div class="flex min-h-screen">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        @click="isMobileMenuOpen = false"
      />

      <aside
        :class="[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        ]"
      >
        <div class="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-blue-600">
              <GraduationCap class="h-5 w-5" />
            </div>
            <div>
              <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Elog</span>
              <span class="ml-1.5 rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">SIWES</span>
            </div>
          </div>
          <button
            type="button"
            class="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            @click="isMobileMenuOpen = false"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="px-4 py-3">
          <div class="rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Student Portal</div>
            <div class="mt-1 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
              {{ studentMatric ? `Matric: ${studentMatric}` : 'Matric: Pending Placement' }}
            </div>
          </div>
        </div>

        <nav class="flex-1 space-y-1.5 px-3 py-2">
          <NuxtLink
            v-for="item in navLinks"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors',
              route.path === item.path
                ? 'bg-slate-900 text-white shadow-xs dark:bg-blue-600 dark:text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <component :is="item.icon" class="h-4 w-4 shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <div class="border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
              @click="isMobileMenuOpen = true"
            >
              <Menu class="h-5 w-5" />
            </button>
            <div class="hidden sm:block">
              <h1 class="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">
                Industrial Training Logbook Record
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="toggleTheme"
            >
              <Sun v-if="isDarkMode" class="h-4 w-4" />
              <Moon v-else class="h-4 w-4" />
            </button>

            <div class="flex items-center gap-3 border-l border-slate-200 pl-3 dark:border-slate-800">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                <User class="h-4 w-4" />
              </div>
              <div class="hidden text-left md:block">
                <div class="text-xs font-semibold text-slate-900 dark:text-white">{{ studentName || 'Student Trainee' }}</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400">SIWES Participant</div>
              </div>
              <button
                type="button"
                class="hidden rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex"
                @click="handleLogout"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 p-4 sm:p-6 lg:p-8">
          <div class="mx-auto max-w-6xl">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useCookie, navigateTo } from '#app'
import { jwtDecode } from 'jwt-decode'
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  LogOut,
  Menu,
  X,
  User,
  GraduationCap,
  Sun,
  Moon
} from 'lucide-vue-next'

interface JwtPayload {
  name?: string
  matric?: string
  identifier?: string
  role?: string
  exp?: number
}

const route = useRoute()
const isMobileMenuOpen = ref(false)
const isDarkMode = ref(false)
const studentName = ref('')
const studentMatric = ref('')

const navLinks = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Daily Logs', path: '/student/logs', icon: BookOpen },
  { label: 'Placement Setup', path: '/student/placement', icon: Briefcase }
]

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDarkMode.value)

  const token = useCookie<string | null>('auth_token').value
  if (token) {
    try {
      const payload = jwtDecode<JwtPayload>(token)
      studentName.value = payload.name || payload.identifier || ''
      studentMatric.value = payload.matric || payload.identifier || ''
    } catch {
      studentName.value = ''
      studentMatric.value = ''
    }
  }
})

const handleLogout = () => {
  const authCookie = useCookie('auth_token')
  authCookie.value = null
  navigateTo('/login', { replace: true })
}
</script>