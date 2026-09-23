<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased transition-colors duration-200 dark:bg-slate-950 dark:text-slate-50">
    <!-- Unassigned Placement Enforcement Modal -->
    <div
      v-if="showPlacementModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div class="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-7 max-h-[92vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-start gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Building2 class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">
              SIWES Placement Registration
            </h2>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Industrial Training Fund policy requires all trainees to document their primary organization and supervisor before log entries can be recorded.
            </p>
          </div>
        </div>

        <!-- Form -->
        <form class="mt-5 space-y-4" @submit.prevent="submitModalPlacement">
          <!-- Company Name -->
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Host Organization / Company <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.trim="modalForm.company_name"
              type="text"
              required
              placeholder="e.g. Chevron Nigeria Limited"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
            />
          </div>

          <!-- Physical Address -->
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Company Physical Location Address
            </label>
            <textarea
              v-model.trim="modalForm.company_address"
              rows="2"
              placeholder="Plot / Street address, City, State..."
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Company Email -->
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Company Official Email
              </label>
              <input
                v-model.trim="modalForm.company_email"
                type="email"
                placeholder="contact@company.com"
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
              />
            </div>

            <!-- Contact Phone -->
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Company Phone Number
              </label>
              <input
                v-model.trim="modalForm.company_contact"
                type="tel"
                placeholder="+234..."
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
              />
            </div>
          </div>

          <!-- Supervisor Email -->
          <div>
            <div class="flex items-center justify-between">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Industry-Based Supervisor Email <span class="text-rose-500">*</span>
              </label>
              <span class="text-[10px] text-slate-400">Used for weekly sign-offs</span>
            </div>
            <input
              v-model.trim="modalForm.supervisor_email"
              type="email"
              required
              placeholder="supervisor@company.com"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
            />
          </div>

          <!-- Start and End Date -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Training Commencement Date <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="modalForm.start_date"
                type="date"
                required
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:bg-slate-950"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Training Expected Conclusion <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="modalForm.end_date"
                type="date"
                required
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:bg-slate-950"
              />
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              class="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400"
              @click="handleLogout"
            >
              Sign out instead
            </button>
            <button
              type="submit"
              :disabled="isSubmittingModal"
              class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Loader2 v-if="isSubmittingModal" class="h-3.5 w-3.5 animate-spin" />
              <span>{{ isSubmittingModal ? 'Registering Placement...' : 'Confirm Placement' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

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
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-mono text-xs font-black tracking-tight text-white shadow-md shadow-blue-500/20">
            ITF
          </div>
          <div>
            <span class="block text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">Elog SIWES</span>
            <span class="block text-[10px] font-semibold text-slate-400 dark:text-slate-500">Student Portal</span>
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
                active-class="bg-blue-600 text-white hover:bg-blue-600 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-600"
                @click="isMobileMenuOpen = false"
              >
                <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span class="flex-1">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-blue-500"
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
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-mono text-xs font-black tracking-tight text-white shadow-md shadow-blue-500/20">
          ITF
        </div>
        <div>
          <span class="block text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">Elog SIWES</span>
          <span class="block text-[10px] font-semibold text-slate-400 dark:text-slate-500">Student Portal</span>
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
                active-class="bg-blue-600 text-white hover:bg-blue-600 hover:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-600"
              >
                <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                <span class="flex-1">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-blue-500"
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
              Student Workspace
            </h1>
            <p class="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">
              Industrial Training Scheme (ITF Form 8 Record)
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
                  {{ userProfile.name || 'SIWES Trainee' }}
                </p>
                <p class="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {{ userProfile.matric_no || 'Undergraduate' }}
                </p>
              </div>
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-xs">
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
                  {{ userProfile.name || 'SIWES Trainee' }}
                </p>
                <p class="truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {{ userProfile.email || 'student@university.edu' }}
                </p>
              </div>

              <div class="py-1">
                <NuxtLink
                  to="/student/profile"
                  class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  @click="isProfileDropdownOpen = false"
                >
                  <UserCog class="h-4 w-4 text-slate-400" />
                  <span>Profile Settings</span>
                </NuxtLink>

                <NuxtLink
                  to="/student/notifications"
                  class="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  @click="isProfileDropdownOpen = false"
                >
                  <span class="flex items-center gap-2.5">
                    <Bell class="h-4 w-4 text-slate-400" />
                    <span>Notifications</span>
                  </span>
                  <span
                    v-if="unreadNotificationsCount > 0"
                    class="rounded-full bg-blue-600 px-1.5 py-0.2 text-[10px] font-bold text-white dark:bg-blue-500"
                  >
                    {{ unreadNotificationsCount }}
                  </span>
                </NuxtLink>

                <NuxtLink
                  to="/student/placement"
                  class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  @click="isProfileDropdownOpen = false"
                >
                  <Building2 class="h-4 w-4 text-slate-400" />
                  <span>Placement Details</span>
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
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useCookie, useRuntimeConfig, navigateTo, useRoute } from '#app'
import {
  LayoutDashboard,
  NotebookPen,
  CalendarDays,
  MessageSquareQuote,
  Building2,
  FileText,
  UserCog,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Loader2
} from 'lucide-vue-next'
import { usePlacementStore } from '~/stores/placement'
import { useToast } from '~/composables/useToast'

interface DecodedUserToken {
  id?: string
  sub?: string
  userId?: string
  name?: string
  email?: string
  matric_no?: string
  role?: string
  [key: string]: unknown
}

const route = useRoute()
const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const placementStore = usePlacementStore()
const toast = useToast()

const isMobileMenuOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const profileDropdownRef = ref<HTMLElement | null>(null)
const isDark = ref(false)
const unreadNotificationsCount = ref(0)

const showPlacementModal = ref(false)
const isSubmittingModal = ref(false)

const modalForm = reactive({
  company_name: '',
  company_address: '',
  company_email: '',
  company_contact: '',
  supervisor_email: '',
  start_date: '',
  end_date: ''
})

const userProfile = reactive({
  name: '',
  email: '',
  matric_no: ''
})

const logbook = ref({
  pendingEntries: 0
})

const sections = computed(() => [
  {
    title: 'Training',
    items: [
      { label: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard, badge: null },
      {
        label: 'Weekly logbook',
        to: '/student/logs',
        icon: NotebookPen,
        badge: logbook.value.pendingEntries > 0 ? logbook.value.pendingEntries : null
      },
      { label: 'Submissions', to: '/student/submissions', icon: CalendarDays, badge: null },
      { label: 'Feedback', to: '/student/feedback', icon: MessageSquareQuote, badge: null }
    ]
  },
  {
    title: 'Placement',
    items: [
      { label: 'Placement details', to: '/student/placement', icon: Building2, badge: null },
      { label: 'Clearance', to: '/student/clearance', icon: FileText, badge: null }
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile settings', to: '/student/profile', icon: UserCog, badge: null }
    ]
  }
])

const userInitials = computed(() => {
  const cleanName = (userProfile.name || '').trim()
  if (!cleanName) return 'ST'

  const parts = cleanName.split(/\s+/).filter(Boolean)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return cleanName.slice(0, 2).toUpperCase()
})

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

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
    userProfile.name = decoded.name || 'Student Trainee'
    userProfile.email = decoded.email || ''
    userProfile.matric_no = decoded.matric_no || ''
  } catch {
    userProfile.name = 'Student Trainee'
  }
}

const verifyPlacementInBackground = async () => {
  // Always force-fetch from API to guarantee we check the currently authenticated token
  await placementStore.fetchPlacement()

  // If the user has no placement and is NOT already on the dedicated placement page, display modal
  if (!placementStore.hasPlacement && route.path !== '/student/placement') {
    showPlacementModal.value = true
  } else {
    showPlacementModal.value = false
  }
}

// Watch route changes: re-check if user navigates away from /student/placement without saving
watch(
  () => route.path,
  (newPath) => {
    if (!placementStore.hasPlacement && newPath !== '/student/placement') {
      showPlacementModal.value = true
    } else if (newPath === '/student/placement') {
      showPlacementModal.value = false
    }
  }
)
const submitModalPlacement = async () => {
  if (!modalForm.company_name || !modalForm.supervisor_email || !modalForm.start_date || !modalForm.end_date) {
    toast.error(new Error('Please fill in all mandatory fields indicated with an asterisk.'), 'Validation Incomplete')
    return
  }

  const startDateObj = new Date(modalForm.start_date)
  const endDateObj = new Date(modalForm.end_date)

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    toast.error(new Error('Please provide valid commencement and conclusion dates.'), 'Invalid Date')
    return
  }

  if (endDateObj <= startDateObj) {
    toast.error(new Error('The expected conclusion date must come after the training commencement date.'), 'Date Chronology Error')
    return
  }

  isSubmittingModal.value = true
  try {
    // Convert YYYY-MM-DD to ISO 8601 strings to satisfy backend DateTime schemas
    const payload = {
      company_name: modalForm.company_name.trim(),
      company_address: modalForm.company_address.trim() || null,
      company_email: modalForm.company_email.trim() || null,
      company_contact: modalForm.company_contact.trim() || null,
      supervisor_email: modalForm.supervisor_email.trim().toLowerCase(),
      start_date: startDateObj.toISOString(),
      end_date: endDateObj.toISOString()
    }

    await placementStore.savePlacement(payload)

    toast.success('Placement Registered', 'Your training host organization has been verified and saved.', 3500)
    showPlacementModal.value = false

    await fetchPendingEntriesCount()
    await fetchNotificationsCount()
  } catch (err: unknown) {
    toast.error(err, 'Placement Registration Failed')
  } finally {
    isSubmittingModal.value = false
  }
}

const fetchPendingEntriesCount = async () => {
  const token = useCookie<string | null>('auth_token').value
  if (!token || !placementStore.hasPlacement) return

  try {
    const res = await axios.get<{ count: number }>(`${apiBase}/api/logs/pending-count`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    if (typeof res.data?.count === 'number') {
      logbook.value.pendingEntries = res.data.count
    }
  } catch {
    logbook.value.pendingEntries = 0
  }
}

const fetchNotificationsCount = async () => {
  const token = useCookie<string | null>('auth_token').value
  if (!token || !placementStore.hasPlacement) return

  try {
    const res = await axios.get<{ unreadCount: number }>(`${apiBase}/api/notifications/unread-count`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    if (typeof res.data?.unreadCount === 'number') {
      unreadNotificationsCount.value = res.data.unreadCount
    }
  } catch {
    unreadNotificationsCount.value = 0
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

const handleLogout = async () => {
  isProfileDropdownOpen.value = false
  
  // 1. Purge cookies
  const tokenCookie = useCookie<string | null>('auth_token')
  tokenCookie.value = null

  // 2. Clear stale memory in Pinia
  placementStore.resetState()

  // 3. Clear local modal state
  showPlacementModal.value = false

  await navigateTo('/login')
}

onMounted(async () => {
  initTheme()
  extractUserFromToken()
  
  // Force a fresh verification against the database
  await verifyPlacementInBackground()
  
  fetchPendingEntriesCount()
  fetchNotificationsCount()

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