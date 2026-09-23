<template>
  <div class="relative min-h-screen w-full bg-slate-50 font-sans text-slate-900 antialiased transition-colors duration-300 selection:bg-blue-600 selection:text-white dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between overflow-x-hidden">
    <!-- Visual Backdrop: Engineering Grid + Radial Vignette -->
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

      <!-- Theme Switcher -->
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

    <!-- Main Content: Split Context Layout -->
    <main class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center p-6 lg:py-14">
      <div class="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <!-- Left Column: Context, Compliance & Policy Checks -->
        <div class="hidden flex-col justify-center space-y-8 lg:col-span-5 lg:flex">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse dark:bg-emerald-400" />
              Roster Pre-Verification Active
            </div>
            <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Student Trainee Induction & Account Setup
            </h1>
            <p class="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Link your pre-approved institutional matriculation number to activate your electronic logbook and placement profile.
            </p>
          </div>

          <!-- Compliance Badges -->
          <div class="space-y-4 border-y border-slate-200 py-6 dark:border-slate-800/80">
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-blue-400 dark:shadow-none">
                <CheckCircle2 class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Department Whitelist Check</p>
                <p class="text-[11px] text-slate-500">Only enrolled 9-digit matric numbers are permitted</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-indigo-400 dark:shadow-none">
                <Building2 class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Automated Placement Linking</p>
                <p class="text-[11px] text-slate-500">Seamless attachment to institutional supervisors</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 text-[11px] text-slate-500">
            <span class="font-mono">ITF-REG-PROTO v2.4</span>
            <span>&bull;</span>
            <span>256-Bit Password Encryption</span>
          </div>
        </div>

        <!-- Right Column: Registration Card -->
        <div class="mx-auto w-full max-w-lg lg:col-span-7">
          <div class="relative rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xl backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-2xl sm:p-8">
            <div class="mb-6">
              <h2 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Create Trainee Account</h2>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Complete your details. Your matric number will be validated against the uploaded session roster.
              </p>
            </div>

            <form class="space-y-4" @submit.prevent="handleRegister">
              <!-- Legal Name -->
              <div>
                <label for="name" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Full Legal Name <span class="text-rose-500">*</span>
                </label>
                <div class="relative mt-1.5">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                    <User class="h-4 w-4" />
                  </div>
                  <input
                    id="name"
                    v-model.trim="form.name"
                    type="text"
                    required
                    autocomplete="name"
                    placeholder="Surname Firstname Othername"
                    class="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pr-3.5 pl-10 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
                  />
                </div>
              </div>

              <!-- Matric Number & Institutional Email -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div class="flex items-center justify-between">
                    <label for="matric_no" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Matric No <span class="text-rose-500">*</span>
                    </label>
                    <span class="font-mono text-[10px] text-slate-400">9 digits</span>
                  </div>
                  <div class="relative mt-1.5">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <Hash class="h-4 w-4" />
                    </div>
                    <input
                      id="matric_no"
                      v-model.trim="form.matric_no"
                      type="text"
                      required
                      maxlength="9"
                      placeholder="220903898"
                      class="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pr-3.5 pl-10 font-mono text-xs tracking-wider text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Institutional Email <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative mt-1.5">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <Mail class="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      v-model.trim="form.email"
                      type="email"
                      required
                      autocomplete="email"
                      placeholder="student@institution.edu.ng"
                      class="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pr-3.5 pl-10 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
                    />
                  </div>
                </div>
              </div>

              <!-- Passwords -->
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative mt-1.5">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <Lock class="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      minlength="8"
                      autocomplete="new-password"
                      placeholder="Min. 8 characters"
                      class="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pr-10 pl-10 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
                    />
                    <button
                      type="button"
                      tabindex="-1"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 transition-colors dark:text-slate-500 dark:hover:text-slate-300"
                      @click="showPassword = !showPassword"
                    >
                      <EyeOff v-if="showPassword" class="h-3.5 w-3.5" />
                      <Eye v-else class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label for="confirm_password" class="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Confirm Password <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative mt-1.5">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
                      <Lock class="h-4 w-4" />
                    </div>
                    <input
                      id="confirm_password"
                      v-model="form.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      required
                      minlength="8"
                      autocomplete="new-password"
                      placeholder="Repeat password"
                      class="block w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pr-10 pl-10 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-950"
                    />
                    <button
                      type="button"
                      tabindex="-1"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 transition-colors dark:text-slate-500 dark:hover:text-slate-300"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <EyeOff v-if="showConfirmPassword" class="h-3.5 w-3.5" />
                      <Eye v-else class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="pt-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
                  <span v-else>Register Trainee Account</span>
                  <ArrowRight v-if="!isLoading" class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>

            <!-- Bottom Link -->
            <div class="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-500">
              Already registered on the cohort roster?
              <NuxtLink to="/login" class="ml-1 font-semibold text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                Sign in to workspace
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
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import {
  Sun,
  Moon,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  Hash,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ArrowRight
} from 'lucide-vue-next'
import { useCookie, navigateTo, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'
import { usePlacementStore } from '~/stores/placement'

// ...
const placementStore = usePlacementStore()

// Right before navigating:
definePageMeta({ layout: false })

const toast = useToast()
const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''

const form = reactive({
  name: '',
  matric_no: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const isDark = ref(false)

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

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    toast.error(new Error('Password confirmation does not match the entered password.'), 'Validation Error')
    return
  }

  if (form.matric_no.length !== 9 || !/^\d{9}$/.test(form.matric_no)) {
    toast.error(new Error('Matriculation number must be exactly 9 numeric digits.'), 'Invalid Format')
    return
  }

  isLoading.value = true

  try {
    const res = await axios.post(`${apiBase}/api/auth/register`, {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      matric_no: form.matric_no.trim(),
      password: form.password,
      role: 'STUDENT'
    })

    toast.success('Registration Approved', 'Your account has been verified against the SIWES roster.', 2500)

    const authToken = useCookie('auth_token', {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    authToken.value = res.data.access_token
placementStore.resetState()

    if (res.data.refresh_token) {
      const refreshToken = useCookie('refresh_token', {
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
      refreshToken.value = res.data.refresh_token
    }

    setTimeout(async () => {
      await navigateTo('/student/dashboard', { replace: true })
    }, 700)
  } catch (err: unknown) {
    toast.error(err, 'Registration Denied')
  } finally {
    isLoading.value = false
  }
}
</script>