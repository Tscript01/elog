<template>
  <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
    <form class="xl:col-span-2" novalidate @submit.prevent="save">
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="border-b border-slate-200 pb-4 dark:border-slate-800">
          <h2 class="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
            Placement Details
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Provide the company hosting your SIWES industrial training and supervisor contact
          </p>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label for="company-name" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Company Name<span class="text-rose-500">*</span>
            </label>
            <input
              id="company-name"
              v-model="form.company_name"
              type="text"
              required
              autocomplete="organization"
              placeholder="e.g. Chevron Nigeria Limited"
              :disabled="isLoading"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <p v-if="errors.company_name" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
              {{ errors.company_name }}
            </p>
          </div>

          <div class="sm:col-span-2">
            <label for="company-address" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Company Address
            </label>
            <textarea
              id="company-address"
              v-model="form.company_address"
              rows="3"
              placeholder="Street address, city, and state of placement..."
              :disabled="isLoading"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label for="company-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Company Email
            </label>
            <input
              id="company-email"
              v-model="form.company_email"
              type="email"
              autocomplete="email"
              placeholder="hr@company.com"
              :disabled="isLoading"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="company-contact" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Company Phone Number
            </label>
            <input
              id="company-contact"
              v-model="form.company_contact"
              type="tel"
              autocomplete="tel"
              placeholder="+234..."
              :disabled="isLoading"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div class="sm:col-span-2">
            <label for="supervisor-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Industry Supervisor Email<span class="text-rose-500">*</span>
            </label>
            <input
              id="supervisor-email"
              v-model="form.supervisor_email"
              type="email"
              required
              placeholder="supervisor@company.com"
              :disabled="isLoading"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Your weekly log sheets are routed directly to this address for official review.
            </p>
            <p v-if="errors.supervisor_email" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
              {{ errors.supervisor_email }}
            </p>
          </div>

          <div>
            <label for="start-date" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Training Start Date<span class="text-rose-500">*</span>
            </label>
            <input
              id="start-date"
              v-model="form.start_date"
              type="date"
              required
              :disabled="isLoading"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="end-date" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Training End Date<span class="text-rose-500">*</span>
            </label>
            <input
              id="end-date"
              v-model="form.end_date"
              type="date"
              required
              :disabled="isLoading"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
            <p v-if="errors.end_date" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
              {{ errors.end_date }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p
            v-if="feedbackMessage"
            :class="[
              'mr-auto flex items-center gap-2 text-xs font-medium',
              isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
            ]"
          >
            <CheckCircle2 v-if="isSuccess" class="h-4 w-4" />
            <AlertCircle v-else class="h-4 w-4" />
            <span>{{ feedbackMessage }}</span>
          </p>
          <button
            type="button"
            :disabled="isLoading"
            class="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            @click="reset"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
            <Save v-else class="h-4 w-4" />
            <span>{{ isLoading ? 'Saving...' : 'Save Placement' }}</span>
          </button>
        </div>
      </div>
    </form>

    <div class="space-y-6">
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 class="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Training Duration
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Calculated automatically from your dates</p>
        
        <div class="mt-4">
          <p class="text-3xl font-black text-slate-900 dark:text-white">{{ weekCount }}</p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400">Weeks of industrial attachment</p>
        </div>
        <p class="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
          Standard university SIWES placements span 24 weeks. Placements falling short of institutional guidelines require approval from your coordinator.
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 class="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Assigned Reviewers
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Personnel allocated to your placement record</p>

        <ul class="mt-4 space-y-4 text-xs">
          <li class="border-b border-slate-100 pb-3 dark:border-slate-800">
            <span class="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Industry Supervisor
            </span>
            <p class="mt-1 font-medium text-slate-800 dark:text-slate-100">
              {{ assignedSupervisor.name || 'Pending Verification' }}
            </p>
            <p class="text-slate-500 dark:text-slate-400">
              {{ form.supervisor_email || 'No email provided' }}
            </p>
          </li>
          <li>
            <span class="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Institution Coordinator
            </span>
            <p class="mt-1 font-medium text-slate-800 dark:text-slate-100">
              {{ assignedCoordinator.name || 'Institutional SIWES Desk' }}
            </p>
            <p class="text-slate-500 dark:text-slate-400">
              {{ assignedCoordinator.email || 'Awaiting supervisor confirmation' }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import { CheckCircle2, AlertCircle, Save, Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'student'
})

interface PlacementResponse {
  id?: string | number
  company_name: string
  company_address?: string | null
  company_email?: string | null
  company_contact?: string | null
  supervisor_email?: string | null
  start_date: string
  end_date: string
  supervisor?: {
    name?: string
    email?: string
  }
  coordinator?: {
    name?: string
    email?: string
  }
}

const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl || ''

const form = reactive({
  company_name: '',
  company_address: '',
  company_email: '',
  company_contact: '',
  supervisor_email: '',
  start_date: '',
  end_date: ''
})

const assignedSupervisor = reactive({ name: '', email: '' })
const assignedCoordinator = reactive({ name: '', email: '' })

const errors = ref<Record<string, string>>({})
const isLoading = ref<boolean>(false)
const feedbackMessage = ref<string>('')
const isSuccess = ref<boolean>(false)

const getAuthHeaders = (): Record<string, string> => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const weekCount = computed<number>(() => {
  if (!form.start_date || !form.end_date) return 0
  const start = new Date(form.start_date).getTime()
  const end = new Date(form.end_date).getTime()
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? Math.ceil(diffDays / 7) : 0
})

const loadCurrentPlacement = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<PlacementResponse>(`${apiBase}/api/placements/current`, {
      headers: getAuthHeaders()
    })

    if (data) {
      form.company_name = data.company_name || ''
      form.company_address = data.company_address || ''
      form.company_email = data.company_email || ''
      form.company_contact = data.company_contact || ''
      form.supervisor_email = data.supervisor_email || data.supervisor?.email || ''
      form.start_date = data.start_date ? (data.start_date.split('T')[0] ?? '') : ''
      form.end_date = data.end_date ? (data.end_date.split('T')[0] ?? '') : ''

      if (data.supervisor) {
        assignedSupervisor.name = data.supervisor.name || ''
        assignedSupervisor.email = data.supervisor.email || ''
      }
      if (data.coordinator) {
        assignedCoordinator.name = data.coordinator.name || ''
        assignedCoordinator.email = data.coordinator.email || ''
      }
    }
  } catch {
    // Leave default empty values if not found or pending placement
  } finally {
    isLoading.value = false
  }
}

const reset = () => {
  errors.value = {}
  feedbackMessage.value = ''
  loadCurrentPlacement()
}

const save = async () => {
  const nextErrors: Record<string, string> = {}

  if (form.company_name.trim().length < 2) {
    nextErrors.company_name = 'Enter the registered name of the hosting company.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supervisor_email)) {
    nextErrors.supervisor_email = 'Provide a valid industry supervisor email address.'
  }

  if (!form.start_date || !form.end_date) {
    nextErrors.end_date = 'Both start and end dates are required.'
  } else if (new Date(form.end_date).getTime() <= new Date(form.start_date).getTime()) {
    nextErrors.end_date = 'End date must occur after the start date.'
  }

  errors.value = nextErrors

  if (Object.keys(nextErrors).length > 0) {
    feedbackMessage.value = ''
    return
  }

  isLoading.value = true
  feedbackMessage.value = ''

  try {
    await $fetch(`${apiBase}/api/placements`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: {
        company_name: form.company_name.trim(),
        company_address: form.company_address.trim() || null,
        company_email: form.company_email.trim() || null,
        company_contact: form.company_contact.trim() || null,
        supervisor_email: form.supervisor_email.trim(),
        start_date: form.start_date,
        end_date: form.end_date
      }
    })

    isSuccess.value = true
    feedbackMessage.value = 'Placement details saved successfully.'
    await loadCurrentPlacement()
  } catch (err: any) {
    isSuccess.value = false
    feedbackMessage.value = err?.data?.message || err?.message || 'Failed to update placement details.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCurrentPlacement()
})
</script>