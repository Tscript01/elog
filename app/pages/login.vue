<template>
  <div class="relative min-h-screen w-full bg-slate-50 font-sans text-slate-900 antialiased transition-colors duration-300 selection:bg-blue-600 selection:text-white dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between overflow-x-hidden">
    <!-- Visual Backdrop: Engineering Grid + Controlled Radial Glow -->
    <div class="pointer-events-none fixed inset-0 z-0">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)]" />
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/15" />
    </div>

    <!-- Top Utility Bar -->
    <header class="relative z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/70">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-mono text-xs font-black tracking-tight text-white shadow-md shadow-blue-500/20">
          ITF
        </div>
        <div>
          <span class="block text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-slate-200">SIWES e-Logbook</span>
          <span class="block text-[10px] text-slate-500">Directorate Portal</span>
        </div>
      </div>

      <!-- Functional Theme Toggle Switch -->
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:shadow-none dark:hover:border-slate-700 dark:hover:text-white"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleTheme"
      >
        <Sun v-if="isDark" class="h-3.5 w-3.5 text-amber-400 transition-transform hover:rotate-45" />
        <Moon v-else class="h-3.5 w-3.5 text-slate-600 transition-transform hover:-rotate-12" />
        <span class="text-[11px] font-semibold">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </header>

    <!-- Main Section: Split Context Layout -->
    <main class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center p-6 lg:py-16">
      <div class="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <!-- Left Column: Context, Compliance & System Status -->
        <div class="hidden flex-col justify-center space-y-8 lg:col-span-6 lg:flex">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse dark:bg-blue-400" />
              Live Academic Session 2025/2026
            </div>
            <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Electronic Verification & Industrial Placement Desk
            </h1>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Unified authentication terminal for trainees, industrial-based supervisors, and institutional coordinators under the ITF Mandate.
            </p>
          </div>

          <!-- Compliance Badges -->
          <div class="grid grid-cols-2 gap-4 border-y border-slate-200 py-6 dark:border-slate-800/80">
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-blue-400 dark:shadow-none">
                <ShieldCheck class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">ITF Form 8 Standard</p>
                <p class="text-[11px] text-slate-500">Cryptographically signed logs</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:shadow-none">
                <Clock class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Temporal Guard</p>
                <p class="text-[11px] text-slate-500">Anti-backfilling active week rules</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 text-[11px] text-slate-500">
            <span class="font-mono">SYS.VER: v2.4.0-prod</span>
            <span>&bull;</span>
            <span>TLS 1.3 Certified</span>
          </div>
        </div>

        <!-- Right Column: Authentication Card -->
        <div class="mx-auto w-full max-w-md lg:col-span-6 lg:max-w-md">
          <div class="relative rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-2xl">
            <!-- Header Inside Card -->
            <div class="mb-6">
              <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Sign In to Account</h2>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enter your credentials to access your active training workspace.
              </p>
            </div>

            <!-- Form -->
            <form class="space-y-4" @submit.prevent="handleLogin">
              <!-- Identifier Field -->
              <div>
                <label for="identifier" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Email or Matriculation Number <span class="text-rose-500">*</span>
                </label>
                <div class="relative mt-1.5">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <UserCheck class="h-4 w-4" />
                  </div>
                  <input
                    id="identifier"
                    v-model.trim="identifier"
                    type="text"
                    required
                    autocomplete="username"
                    placeholder="e.g. 220903898 or student@institution.edu.ng"
                    class="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pr-3.5 pl-10 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
                  />
                </div>
              </div>

              <!-- Password Field -->
              <div>
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password <span class="text-rose-500">*</span>
                  </label>
                  <button 
                    type="button" 
                    class="text-[11px] font-medium text-blue-600 hover:text-blue-500 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                    @click="toast.info('Credential Recovery', 'Contact your departmental coordinator to reset your credentials.')"
                  >
                    Forgot password?
                  </button>
                </div>
                <div class="relative mt-1.5">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <Lock class="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    autocomplete="current-password"
                    placeholder="Enter security password"
                    class="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pr-10 pl-10 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
                  />
                  <button
                    type="button"
                    tabindex="-1"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 transition-colors dark:text-slate-500 dark:hover:text-slate-300"
                    @click="showPassword = !showPassword"
                  >
                    <EyeOff v-if="showPassword" class="h-4 w-4" />
                    <Eye v-else class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Keep Logged In -->
              <div class="flex items-center">
                <input
                  id="remember_me"
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-0 focus:ring-offset-0 dark:border-slate-800 dark:bg-slate-950"
                />
                <label for="remember_me" class="ml-2 text-xs text-slate-600 dark:text-slate-400">
                  Keep me authenticated on this workstation
                </label>
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
                  <span v-else>Authorize Workspace Access</span>
                  <ArrowRight v-if="!isLoading" class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>

            <!-- Bottom Link -->
            <div class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-500">
              First time onboarding to the portal?
              <NuxtLink to="/register" class="ml-1 font-semibold text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                Register as student
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Structural Bottom Bar -->
    <footer class="relative z-10 flex h-14 w-full items-center justify-between border-t border-slate-200 bg-white/80 px-6 text-[11px] text-slate-500 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/70">
      <span>Industrial Training Fund Form 8 Spec &bull; Electronic SIWES Directorate</span>
      <div class="flex items-center gap-2 font-mono text-[10px]">
        <ShieldCheck class="h-3.5 w-3.5 text-slate-400" />
        <span>End-to-End Signature Guard</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  Sun,
  Moon,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  UserCheck,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-vue-next'
import { useCookie, navigateTo, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'
import { usePlacementStore } from '~/stores/placement'

// ...
const placementStore = usePlacementStore()

// Right before navigating:


definePageMeta({ layout: false })

interface LoginResponse {
  message?: string
  access_token?: string
  accessToken?: string
  token?: string
  user?: {
    id: string
    role?: string
    name?: string
  }
}

const identifier = ref('')
const password = ref('')
const rememberMe = ref(true)
const showPassword = ref(false)
const isLoading = ref(false)
const isDark = ref(false)

const toast = useToast()
const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''

const roleDashboards: Record<string, string> = {
  STUDENT: '/student/dashboard',
  IND_SUPERVISOR: '/supervisor/dashboard',
  INST_COORDINATOR: '/coordinator/dashboard',
  ITF_OFFICIAL: '/itf/dashboard',
  ADMIN: '/admin/dashboard'
}

const applyTheme = (dark: boolean) => {
  isDark.value = dark
  if (dark) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const toggleTheme = () => {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    applyTheme(savedTheme === 'dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    applyTheme(prefersDark)
  }
})

const handleLogin = async () => {
  if (!identifier.value.trim() || !password.value) {
    toast.error(new Error('Please provide both your matric number / email and your password.'))
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post<LoginResponse>(
      `${apiBase}/api/auth/login`,
      {
        email: identifier.value.trim(),
        password: password.value
      },
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const token = response.data.access_token || response.data.accessToken || response.data.token
    const userRole = (response.data.user?.role || '').toUpperCase()

    if (token) {
      const maxAge = rememberMe.value ? 60 * 60 * 24 * 7 : undefined
      const authCookie = useCookie<string>('auth_token', {
        maxAge,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
      authCookie.value = token
      placementStore.resetState()

      toast.success('Access Authorized', 'Workspace verified. Navigating to console...', 2000)

      const targetPath = roleDashboards[userRole] || '/student/dashboard'
      setTimeout(async () => {
        await navigateTo(targetPath, { replace: true })
      }, 500)
    } else {
      toast.error(new Error('Authentication server did not return a valid session bearer token.'))
    }
  } catch (err: unknown) {
    toast.error(err, 'Sign In Failed')
  } finally {
    isLoading.value = false
  }
}
</script>