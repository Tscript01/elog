<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Registry
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Department of Computer Science</span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Trainees Directory
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Inspect student placements, verify supervisor contacts, and review historical logbook submissions.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          @click="fetchStudents"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin' : '']" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Filter and Search Bar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model.trim="searchQuery"
          type="text"
          placeholder="Search by name, matric no, or host company..."
          class="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500"
        />
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="companyFilter"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <option value="ALL">All Organizations</option>
          <option v-for="company in uniqueCompanies" :key="company" :value="company">
            {{ company }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table Card -->
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <Loader2 class="h-6 w-6 animate-spin text-indigo-600" />
        <p class="mt-2 text-xs">Loading departmental trainee registry...</p>
      </div>

      <div v-else-if="filteredStudents.length === 0" class="p-16 text-center">
        <Users class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <p class="mt-3 text-sm font-bold text-slate-900 dark:text-white">No records found</p>
        <p class="mt-1 text-xs text-slate-500">Try changing your search query or filters.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse text-left text-xs">
          <thead>
            <tr class="bg-slate-50 uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <th scope="col" class="px-6 py-3.5 font-semibold">Trainee</th>
              <th scope="col" class="px-6 py-3.5 font-semibold">Host Organization</th>
              <th scope="col" class="px-6 py-3.5 font-semibold">Industry Supervisor</th>
              <th scope="col" class="px-6 py-3.5 font-semibold">Duration & Dates</th>
              <th scope="col" class="px-6 py-3.5 font-semibold">Approved Logs</th>
              <th scope="col" class="px-6 py-3.5 text-right font-semibold">Inspect</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              v-for="item in filteredStudents"
              :key="item.id"
              class="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            >
              <td class="px-6 py-4">
                <p class="font-bold text-slate-900 dark:text-white">{{ item.student.name }}</p>
                <p class="font-mono text-[11px] text-slate-500 dark:text-slate-400">{{ item.student.matric_no || item.student.email }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800 dark:text-slate-200">{{ item.company_name }}</p>
                <p class="max-w-xs truncate text-[11px] text-slate-400">{{ item.company_address || 'Address unrecorded' }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-700 dark:text-slate-300">{{ item.supervisor?.name || 'Unassigned' }}</p>
                <p class="text-[11px] text-slate-400">{{ item.supervisor_email }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-slate-700 dark:text-slate-300">{{ formatDate(item.start_date) }}</p>
                <p class="text-[11px] text-slate-400">to {{ formatDate(item.end_date) }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="font-semibold text-indigo-600 dark:text-indigo-400">
                  {{ item.approved_weeks_count }} Weeks Verified
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  @click="inspectTrainee(item)"
                >
                  <Eye class="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>View Dossier</span>
                </button>
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
import { Search, Users, Eye, RefreshCw, Loader2 } from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'coordinator' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const searchQuery = ref('')
const companyFilter = ref('ALL')
const students = ref<any[]>([])

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchStudents = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/coordinator/students`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    students.value = res.data.data || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Students')
  } finally {
    isLoading.value = false
  }
}

const uniqueCompanies = computed(() => {
  const set = new Set<string>()
  students.value.forEach(s => {
    if (s.company_name) set.add(s.company_name)
  })
  return Array.from(set)
})

const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const matchesSearch =
      s.student?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.student?.matric_no?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.company_name?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesCompany =
      companyFilter.value === 'ALL' || s.company_name === companyFilter.value

    return matchesSearch && matchesCompany
  })
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const inspectTrainee = (item: any) => {
  toast.success('Dossier Opened', `Inspecting placement dossier for ${item.student?.name}`)
}

onMounted(() => {
  fetchStudents()
})
</script>