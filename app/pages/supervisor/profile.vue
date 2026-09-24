<template>
  <div class="space-y-8 max-w-4xl mx-auto">
    <!-- Header Banner -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Account Preferences
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Supervisor Credentials
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Profile & Security Settings
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Update your professional identification details, official contact info, and account password.
        </p>
      </div>
    </div>

    <!-- Profile Update Form Card -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div class="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <UserCog class="h-4 w-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Professional Information</h2>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Details displayed to student interns and institution coordinators</p>
        </div>
      </div>

      <form class="mt-6 space-y-6" @submit.prevent="updateProfile">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label for="profile-name" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Full Name & Professional Title <span class="text-rose-500">*</span>
            </label>
            <input
              id="profile-name"
              v-model.trim="profileForm.name"
              type="text"
              required
              placeholder="e.g. Engr. Babatunde Adeleke"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label for="profile-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Email Address (Login ID)
            </label>
            <input
              id="profile-email"
              v-model.trim="profileForm.email"
              type="email"
              disabled
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 shadow-2xs cursor-not-allowed dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
            />
            <p class="mt-1 text-[11px] text-slate-400">Email address cannot be changed directly. Contact system admin.</p>
          </div>

          <div>
            <label for="profile-phone" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Official Contact Line
            </label>
            <input
              id="profile-phone"
              v-model.trim="profileForm.phone"
              type="tel"
              placeholder="+234..."
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div class="flex items-center justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="submit"
            :disabled="isUpdatingProfile"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Loader2 v-if="isUpdatingProfile" class="h-4 w-4 animate-spin" />
            <Save v-else class="h-4 w-4" />
            <span>{{ isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Details' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Password Update Card -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div class="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <Lock class="h-4 w-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Security & Password</h2>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Ensure your account is secure with a strong password</p>
        </div>
      </div>

      <form class="mt-6 space-y-6" @submit.prevent="updatePassword">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label for="current-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Current Password <span class="text-rose-500">*</span>
            </label>
            <input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              placeholder="••••••••"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label for="new-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              New Password <span class="text-rose-500">*</span>
            </label>
            <input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              required
              placeholder="••••••••"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label for="confirm-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Confirm New Password <span class="text-rose-500">*</span>
            </label>
            <input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              placeholder="••••••••"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div class="flex items-center justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="submit"
            :disabled="isUpdatingPassword"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Loader2 v-if="isUpdatingPassword" class="h-4 w-4 animate-spin" />
            <Lock v-else class="h-4 w-4" />
            <span>{{ isUpdatingPassword ? 'Updating Password...' : 'Update Password' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import { UserCog, Lock, Save, Loader2 } from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'supervisor' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const profileForm = reactive({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isUpdatingProfile = ref(false)
const isUpdatingPassword = ref(false)

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchProfile = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/auth/me`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    const user = res.data.user || res.data
    profileForm.name = user.name || ''
    profileForm.email = user.email || ''
    profileForm.phone = user.phone || ''
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Profile')
  }
}

const updateProfile = async () => {
  if (!profileForm.name.trim()) {
    toast.error(new Error('Name cannot be empty.'), 'Validation Error')
    return
  }

  isUpdatingProfile.value = true
  try {
    await axios.put(
      `${apiBase}/api/auth/profile`,
      {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim() || null
      },
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    )
    toast.success('Profile Updated', 'Your supervisor credentials have been updated successfully.')
  } catch (err: unknown) {
    toast.error(err, 'Failed to Update Profile')
  } finally {
    isUpdatingProfile.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.error(new Error('New passwords do not match.'), 'Validation Error')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    toast.error(new Error('Password must be at least 6 characters long.'), 'Validation Error')
    return
  }

  isUpdatingPassword.value = true
  try {
    await axios.put(
      `${apiBase}/api/auth/password`,
      {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      },
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    )

    toast.success('Password Updated', 'Your account password has been changed successfully.')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err: unknown) {
    toast.error(err, 'Failed to Update Password')
  } finally {
    isUpdatingPassword.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>