<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Zonal Inspection
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Field Records
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Accredited Trainees Directory
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Comprehensive roster of students undergoing supervised industrial attachment across verified employers.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <span class="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
          Total Trainees: {{ filteredTrainees.length }}
        </span>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative w-full sm:w-72">
          <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search student, matric no, or employer..."
            class="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3.5 text-xs text-slate-900 placeholder-slate-400 transition focus:border-emerald-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <select
          v-model="selectedState"
          class="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 transition focus:border-emerald-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white sm:w-48"
        >
          <option value="">All States</option>
          <option v-for="state in statesList" :key="state" :value="state">
            {{ state }}
          </option>
        </select>
      </div>

      <button
        type="button"
        :disabled="isLoading"
        class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        @click="fetchTrainees"
      >
        <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': isLoading }" />
        <span>Reload</span>
      </button>
    </div>

    <!-- Trainees Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead class="border-b border-slate-100 bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th class="px-6 py-3.5">Student Information</th>
              <th class="px-6 py-3.5">Host Company</th>
              <th class="px-6 py-3.5">Zonal Location</th>
              <th class="px-6 py-3.5">Duration</th>
              <th class="px-6 py-3.5">Endorsement</th>
              <th class="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="isLoading">
              <td colspan="6" class="py-12 text-center text-slate-400">
                <Loader2 class="mx-auto h-6 w-6 animate-spin text-emerald-600" />
                <p class="mt-2 text-xs">Loading accredited trainee roster...</p>
              </td>
            </tr>
            <tr v-else-if="filteredTrainees.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-400">
                <Users class="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                <p class="mt-2 font-semibold text-slate-700 dark:text-slate-300">No trainees matched your filter</p>
                <p class="mt-0.5 text-[11px]">Adjust your search query or state selection.</p>
              </td>
            </tr>
            <tr
              v-for="student in filteredTrainees"
              :key="student.placementId || student.matricNo"
              class="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            >
              <td class="px-6 py-4">
                <span class="block font-bold text-slate-900 dark:text-white">{{ student.studentName }}</span>
                <span class="block font-mono text-[10px] text-slate-400">{{ student.matricNo }} &bull; {{ student.department }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="block font-medium text-slate-900 dark:text-white">{{ student.company }}</span>
                <span class="block text-[10px] text-slate-400">Supervisor: {{ student.industrySupervisor }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <MapPin class="h-3 w-3 text-slate-400" />
                  {{ student.city }}, {{ student.state }}
                </span>
              </td>
              <td class="px-6 py-4 font-mono text-[11px] text-slate-500">
                {{ formatDate(student.startDate) }} &mdash; {{ formatDate(student.endDate) }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    student.itfStatus === 'CLEARED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  ]"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="student.itfStatus === 'CLEARED' ? 'bg-emerald-500' : 'bg-amber-500'" />
                  {{ student.itfStatus === 'CLEARED' ? 'ENDORSED' : 'PENDING' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  type="button"
                  :disabled="previewingId === student.placementId"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  @click="previewLogbook(student.placementId)"
                >
                  <Loader2 v-if="previewingId === student.placementId" class="h-3.5 w-3.5 animate-spin text-blue-600" />
                  <FileText v-else class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>View Logbook</span>
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
import { useCookie, useRuntimeConfig } from '#app'
import { Search, MapPin, FileText, Loader2, Users, RefreshCw } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'itf' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const previewingId = ref<string | null>(null)
const searchQuery = ref('')
const selectedState = ref('')
const trainees = ref<any[]>([])

const statesList = computed(() => {
  const set = new Set<string>()
  trainees.value.forEach(t => { if (t.state) set.add(t.state) })
  return Array.from(set).sort()
})

const filteredTrainees = computed(() => {
  return trainees.value.filter(t => {
    const matchesState = !selectedState.value || t.state === selectedState.value
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch = !q ||
      (t.studentName && t.studentName.toLowerCase().includes(q)) ||
      (t.matricNo && t.matricNo.toLowerCase().includes(q)) ||
      (t.company && t.company.toLowerCase().includes(q)) ||
      (t.city && t.city.toLowerCase().includes(q))
    return matchesState && matchesSearch
  })
})

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-GB')
}

const fetchTrainees = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/itf/students-export`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    trainees.value = res.data?.records || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to fetch trainee roster')
  } finally {
    isLoading.value = false
  }
}

// Exactly identical to pages/itf/dashboard.vue
const previewLogbook = async (placementId: string) => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) {
    toast.error(new Error('Session expired'), 'Unauthorized')
    return
  }

  if (!placementId) {
    toast.error(new Error('No placement ID associated with this student.'), 'Missing ID')
    return
  }

  previewingId.value = placementId
  try {
    const res = await axios.get(`${apiBase}/api/placements/export/pdf`, {
      params: { placementId },
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
      withCredentials: true
    })

    const blob = new Blob([res.data], { type: 'application/pdf' })
    const pdfUrl = URL.createObjectURL(blob)
    window.open(pdfUrl, '_blank')
  } catch (err: unknown) {
    toast.error(err, 'Failed to open logbook PDF')
  } finally {
    previewingId.value = null
  }
}

onMounted(() => {
  fetchTrainees()
})
</script>