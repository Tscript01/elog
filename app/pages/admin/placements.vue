<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-4 border-b border-purple-100 pb-5 dark:border-purple-950/60 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
            Form ITF-08 Registry
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Institutional Master Ledger
          </span>
        </div>
        <h1 class="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Master Placements Audit
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Complete inventory of all student attachments, company assignments, territorial clusters, and clearance evaluations.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-700"
          @click="exportCsv"
        >
          <Download class="h-3.5 w-3.5" />
          <span>Export Master CSV</span>
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <div class="sm:col-span-2">
        <input
          v-model.trim="search"
          type="text"
          placeholder="Search by student name, matric number, or host company..."
          class="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          @input="debounceFetch"
        />
      </div>

      <div>
        <select
          v-model="statusFilter"
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          @change="fetchPlacements"
        >
          <option value="">All Allocation States</option>
          <option value="assigned">Assigned to Coordinator</option>
          <option value="unassigned">Unassigned Only</option>
        </select>
      </div>

      <div>
        <input
          v-model.trim="stateFilter"
          type="text"
          placeholder="Filter by State (e.g. Lagos)"
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          @input="debounceFetch"
        />
      </div>
    </div>

    <!-- Placements Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-slate-100 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
            <tr>
              <th class="py-3 px-4">Trainee</th>
              <th class="py-3 px-4">Host Company & Location</th>
              <th class="py-3 px-4">Zonal Cluster</th>
              <th class="py-3 px-4">Coordinator</th>
              <th class="py-3 px-4 text-center">Weeks</th>
              <th class="py-3 px-4 text-center">Score</th>
              <th class="py-3 px-4 text-right">Clearance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr v-if="isLoading">
              <td colspan="7" class="py-12 text-center text-purple-600">
                <Loader2 class="h-6 w-6 animate-spin mx-auto" />
                <span class="block mt-2 font-medium">Fetching placement registry...</span>
              </td>
            </tr>

            <tr v-else-if="placements.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">
                No placement records match the filter criteria.
              </td>
            </tr>

            <tr v-for="p in placements" :key="p.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ p.student?.name }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ p.student?.matric_no || 'N/A' }}</div>
              </td>

              <td class="py-3 px-4">
                <div class="font-semibold text-slate-800 dark:text-slate-200">{{ p.company_name }}</div>
                <div class="text-[10px] text-slate-400 truncate max-w-xs">{{ p.company_address || 'Address unlisted' }}</div>
              </td>

              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  <MapPin class="h-2.5 w-2.5" />
                  {{ p.city }}, {{ p.state }}
                </span>
              </td>

              <td class="py-3 px-4">
                <div v-if="p.inst_coordinator" class="font-semibold text-slate-800 dark:text-slate-200">
                  {{ p.inst_coordinator.name }}
                </div>
                <span v-else class="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                  Unassigned
                </span>
              </td>

              <td class="py-3 px-4 text-center font-bold">
                {{ p._count?.weekly_submissions || 0 }}
              </td>

              <td class="py-3 px-4 text-center">
                <span v-if="p.clearance?.coordinator_score !== null && p.clearance?.coordinator_score !== undefined" class="font-bold text-purple-700 dark:text-purple-400">
                  {{ p.clearance.coordinator_score }}/100
                </span>
                <span v-else class="text-slate-400 text-[11px]">-</span>
              </td>

              <td class="py-3 px-4 text-right">
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    p.clearance?.coordinator_status === 'CLEARED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  ]"
                >
                  {{ p.clearance?.coordinator_status || 'PENDING' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Download, MapPin, Loader2 } from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const placements = ref<any[]>([])
const search = ref('')
const statusFilter = ref('')
const stateFilter = ref('')

let debounceTimeout: any = null

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchPlacements = async () => {
  isLoading.value = true
  try {
    const params: any = {}
    if (search.value) params.search = search.value
    if (statusFilter.value) params.status = statusFilter.value
    if (stateFilter.value) params.state = stateFilter.value

    const res = await axios.get(`${apiBase}/api/admin/placements`, {
      headers: getHeaders(),
      params
    })
    placements.value = res.data.data || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Fetch Placements')
  } finally {
    isLoading.value = false
  }
}

const debounceFetch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchPlacements()
  }, 350)
}

const exportCsv = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/admin/reports/master`, {
      headers: getHeaders()
    })
    const rows = res.data.data || []
    if (rows.length === 0) {
      toast.error(new Error('No placement records to export.'), 'Export Cancelled')
      return
    }

    const headers = Object.keys(rows[0]).join(',')
    const csvContent = [
      headers,
      ...rows.map((row: any) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `siwes-master-placements-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Report Exported', 'Master CSV downloaded successfully.')
  } catch (err: unknown) {
    toast.error(err, 'Failed to Export Report')
  }
}

onMounted(() => {
  fetchPlacements()
})
</script>