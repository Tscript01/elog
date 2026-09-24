<template>
  <div class="space-y-8">
    <!-- Header Banner -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Roster Management
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Assigned Student Interns
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Industrial Trainee Roster
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Complete directory of students deployed to your supervision under the SIWES program.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or matric..."
            class="block w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3.5 text-xs text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
    </div>

    <!-- Trainees Table / Grid Section -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Active Interns Directory</h2>
          <p class="text-xs text-slate-500">Showing {{ filteredTrainees.length }} registered trainees</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          @click="fetchTrainees"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin' : '']" />
          <span>Refresh List</span>
        </button>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <Loader2 class="h-6 w-6 animate-spin text-emerald-600" />
        <p class="mt-2 text-xs">Loading trainee database...</p>
      </div>

      <div v-else-if="filteredTrainees.length === 0" class="p-16 text-center">
        <Users class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <p class="mt-3 text-sm font-bold text-slate-900 dark:text-white">No trainees found</p>
        <p class="mt-1 text-xs text-slate-500">
          {{ searchQuery ? 'No student records match your search criteria.' : 'No students have registered your supervisory email yet.' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead class="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th scope="col" class="px-6 py-3.5">Student Name & Matric</th>
              <th scope="col" class="px-6 py-3.5">Institution & Course</th>
              <th scope="col" class="px-6 py-3.5">Deployment Window</th>
              <th scope="col" class="px-6 py-3.5">Status</th>
              <th scope="col" class="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              v-for="trainee in filteredTrainees"
              :key="trainee.id"
              class="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            >
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900 dark:text-white">{{ trainee.student_name || trainee.name }}</p>
                <p class="font-mono text-[11px] text-slate-400">{{ trainee.matric_no || trainee.email }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800 dark:text-slate-200">{{ trainee.institution || 'Ekiti State University' }}</p>
                <p class="text-[11px] text-slate-400">{{ trainee.department || 'Computer Science' }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5 font-mono text-[11px]">
                  <Calendar class="h-3.5 w-3.5 text-slate-400" />
                  <span>{{ formatDate(trainee.start_date) }} &rarr; {{ formatDate(trainee.end_date) }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                  Active Rotation
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <NuxtLink
                  :to="`/supervisor/dashboard?trainee=${trainee.placement_id || trainee.id}`"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Eye class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>View Logs</span>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  Calendar,
  Eye
} from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'supervisor' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const trainees = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')

const filteredTrainees = computed(() => {
  if (!searchQuery.value.trim()) return trainees.value
  const q = searchQuery.value.toLowerCase()
  return trainees.value.filter(
    (t) =>
      (t.student_name || t.name || '').toLowerCase().includes(q) ||
      (t.matric_no || '').toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q)
  )
})

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchTrainees = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/supervisor/trainees`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    trainees.value = res.data.trainees || res.data || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Roster')
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A'
  const raw = dateStr.split('T')[0] ?? ''
  const [y, m, d] = raw.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y!, m! - 1, d)))
}

onMounted(() => {
  fetchTrainees()
})
</script>