<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
    <div class="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
          <KeyRound class="h-6 w-6" />
        </div>
        <h1 class="mt-4 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Reset Your Password
        </h1>
        <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          Enter your registered email address and we will send you a secure link to reset your password.
        </p>
      </div>

      <div v-if="isSubmitted" class="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <CheckCircle2 class="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        <h2 class="mt-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">Check your email</h2>
        <p class="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
          If an account exists for <span class="font-semibold">{{ form.email }}</span>, you will receive password reset instructions shortly.
        </p>
        <NuxtLink
          to="/login"
          class="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500"
        >
          Return to Login
        </NuxtLink>
      </div>

      <form v-else class="space-y-4" @submit.prevent="handleForgotPassword">
        <div v-if="errorMessage" class="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          {{ errorMessage }}
        </div>

        <div>
          <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div class="relative mt-1.5">
            <Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              required
              placeholder="name@example.com"
              class="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-xs text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
          <span>{{ isLoading ? 'Sending Reset Link...' : 'Send Reset Instructions' }}</span>
        </button>

        <div class="text-center">
          <NuxtLink
            to="/login"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft class="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import axios from 'axios'
import { KeyRound, Mail, CheckCircle2, Loader2, ArrowLeft } from 'lucide-vue-next'
import { useRuntimeConfig } from '#app'

definePageMeta({ layout: false })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''

const form = reactive({
  email: ''
})

const isLoading = ref(false)
const isSubmitted = ref(false)
const errorMessage = ref('')

const handleForgotPassword = async () => {
  if (!form.email) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await axios.post(`${apiBase}/api/auth/forgot-password`, {
      email: form.email.trim().toLowerCase()
    })
    isSubmitted.value = true
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || err.response?.data?.error || 'Failed to process request. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>