<template>
  <div class="space-y-6 max-w-2xl">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <h1 class="text-xl font-black text-slate-900 dark:text-white">Supervisor Profile</h1>
      <p class="text-xs text-slate-500 mt-1">Your name and designation will be affixed to students' approved Form ITF-08.</p>

      <form class="mt-6 space-y-4" @submit.prevent="saveProfile">
        <div>
          <label class="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Full Name & Academic Title</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full rounded-xl border border-slate-200 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-950"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Email Address (Read Only)</label>
          <input
            v-model="form.email"
            type="email"
            disabled
            class="mt-1 block w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-slate-100 dark:border-slate-800 dark:bg-slate-900 text-slate-400"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold uppercase text-slate-600 dark:text-slate-400">Department / Faculty</label>
          <input
            v-model="form.department"
            type="text"
            class="mt-1 block w-full rounded-xl border border-slate-200 p-2.5 text-xs dark:border-slate-800 dark:bg-slate-950"
          />
        </div>

        <button
          type="submit"
          :disabled="isSaving"
          class="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          {{ isSaving ? 'Saving...' : 'Save Settings' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'coordinator' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isSaving = ref(false)
const form = reactive({ name: '', email: '', department: '' })

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const loadProfile = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/coordinator/profile`, { headers: getHeaders(), withCredentials: true })
    form.name = res.data.data.name || ''
    form.email = res.data.data.email || ''
    form.department = res.data.data.department || ''
  } catch (err) {
    toast.error(err, 'Failed to Load Profile')
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    await axios.put(`${apiBase}/api/coordinator/profile`, form, { headers: getHeaders(), withCredentials: true })
    toast.success('Updated', 'Profile settings saved.')
  } catch (err) {
    toast.error(err, 'Failed to Save')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>