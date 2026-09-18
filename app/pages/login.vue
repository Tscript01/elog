<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-blue-600">
          <GraduationCap class="h-6 w-6" />
        </div>
        <h2 class="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Elog SIWES Portal
        </h2>
        <p class="mt-2 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Student Industrial Work Experience Scheme
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
      >
        <AlertCircle class="h-4 w-4 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <form class="mt-6 space-y-5" @submit.prevent="handleLogin">
        <div>
          <label for="identifier" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Email or Matric Number
          </label>
          <div class="relative mt-1.5">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail class="h-4 w-4" />
            </div>
            <input
              id="identifier"
              v-model="identifier"
              type="text"
              required
              autocomplete="username"
              placeholder="e.g. 2021/ENG/1042 or user@university.edu"
              class="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div class="relative mt-1.5">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock class="h-4 w-4" />
            </div>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="Enter your password"
              class="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-10 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-hidden dark:hover:text-slate-200"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-500"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            <span>{{ isLoading ? 'Signing in...' : 'Sign In to Elog' }}</span>
          </button>
        </div>
      </form>

      <div class="border-t border-slate-200 pt-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        SIWES Directorate Verification and Access System
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { GraduationCap, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-vue-next'
import { useCookie, navigateTo, useRuntimeConfig } from '#app'

definePageMeta({
  layout: false
})

interface LoginResponse {
  token?: string
  accessToken?: string
  role?: string
  message?: string
  access_token? :string
  user?: {
    role?: string
  }
}

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''

const roleDashboards: Record<string, string> = {
  student: '/student/dashboard',
  supervisor: '/supervisor/dashboard',
  coordinator: '/coordinator/dashboard',
  admin: '/admin/dashboard'
}

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  const url = `${apiBase}/auth/login`

  try {
    const response = await axios.post<LoginResponse>(
      url,
      {
        email: identifier.value.trim(),
        password: password.value
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const token = response.data.access_token || response.data.accessToken
    const role = response.data.user?.role
    console.log(role);
    

    if (token && role) {
      const authCookie = useCookie<string>('auth_token', {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
      authCookie.value = token

      const destination = roleDashboards[role] || '/student/dashboard'
      await navigateTo(destination, { replace: true })
    } else {
      errorMessage.value = 'Invalid server response structure'
    }
  } catch (error: unknown) {
    console.log(error)
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value =
      axiosError.response?.data?.message || axiosError.message || 'Authentication failed. Please verify your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>