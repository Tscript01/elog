<template>
  <div class="space-y-8">
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Federal Republic of Nigeria
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Zonal Inspection & Clearance Desk
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          ITF Logbook Verification & Stamping Portal
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Audit student training volume, inspect technical entries, and endorse the official Directorate cryptographic seal.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          :disabled="isExporting"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          @click="exportAuditData"
        >
          <Download class="h-3.5 w-3.5 text-slate-500" />
          <span>{{ isExporting ? 'Exporting...' : 'Export Audit CSV' }}</span>
        </button>

        <button
          type="button"
          :disabled="isLoading"
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
          @click="fetchOverview"
        >
          <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': isLoading }" />
          <span>Sync Data</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">Registered Interns</span>
          <Users class="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <p class="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          {{ overviewData.summary.totalStudents }}
        </p>
        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {{ overviewData.summary.placementRate }}% placement conversion
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">Host Organizations</span>
          <Building2 class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p class="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          {{ overviewData.summary.totalPlacements }}
        </p>
        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {{ overviewData.summary.unassignedSupervisorsCount }} without industry supervisor
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">Pending Directorate Review</span>
          <Clock class="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <p class="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          {{ overviewData.summary.pendingClearances }}
        </p>
        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Awaiting zonal official signature
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">Logbooks Endorsed</span>
          <Stamp class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p class="mt-3 text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {{ overviewData.summary.completedClearances }}
        </p>
        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Certified with verification hash
        </p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Zonal Attachment Distribution</h2>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Trainees grouped by verified host state</p>
        </div>
        <MapPin class="h-4 w-4 text-slate-400" />
      </div>

      <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="zone in overviewData.zonalClusters"
          :key="zone.state"
          class="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
        >
          <span class="block truncate text-xs font-bold text-slate-800 dark:text-slate-200">{{ zone.state }}</span>
          <span class="mt-1 block text-sm font-black text-emerald-600 dark:text-emerald-400">{{ zone.studentCount }} Trainees</span>
          <span class="block text-[10px] text-slate-400">{{ zone.cities.length }} Cities active</span>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Student Logbook Clearance Queue</h2>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Inspect technical activities and apply the official ITF accreditation seal</p>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search student, matric, or company..."
            class="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 transition focus:border-emerald-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead class="border-b border-slate-100 bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th class="px-6 py-3.5">Student Trainee</th>
              <th class="px-6 py-3.5">Host Company</th>
              <th class="px-6 py-3.5">Territory</th>
              <th class="px-6 py-3.5">Clearance Status</th>
              <th class="px-6 py-3.5 text-right">Directorate Endorsement</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="filteredPlacements.length === 0">
              <td colspan="5" class="py-10 text-center text-slate-400">
                No matching trainees in this queue.
              </td>
            </tr>
            <tr
              v-for="row in filteredPlacements"
              :key="row.id"
              class="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            >
              <td class="px-6 py-4">
                <span class="block font-bold text-slate-900 dark:text-white">{{ row.studentName }}</span>
                <span class="block font-mono text-[10px] text-slate-400">{{ row.matricNo }} &bull; {{ row.department }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="block font-medium text-slate-900 dark:text-white">{{ row.companyName }}</span>
                <span class="block text-[10px] text-slate-400">Sup: {{ row.supervisorName }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <MapPin class="h-3 w-3 text-slate-400" />
                  {{ row.location }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    row.itfStatus === 'CLEARED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  ]"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="row.itfStatus === 'CLEARED' ? 'bg-emerald-500' : 'bg-amber-500'" />
                  {{ row.itfStatus === 'CLEARED' ? 'STAMPED' : 'PENDING' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    :disabled="previewingId === row.id"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    @click="previewLogbook(row.id)"
                  >
                    <Loader2 v-if="previewingId === row.id" class="h-3.5 w-3.5 animate-spin text-blue-600" />
                    <FileText v-else class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>View Logbook</span>
                  </button>

                  <button
                    type="button"
                    :disabled="stampingId === row.id || row.itfStatus === 'CLEARED'"
                    :class="[
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition shadow-xs',
                      row.itfStatus === 'CLEARED'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50'
                    ]"
                    @click="stampClearance(row.id)"
                  >
                    <Loader2 v-if="stampingId === row.id" class="h-3.5 w-3.5 animate-spin" />
                    <CheckCircle2 v-else-if="row.itfStatus === 'CLEARED'" class="h-3.5 w-3.5 text-emerald-500" />
                    <Stamp v-else class="h-3.5 w-3.5" />
                    <span>{{ row.itfStatus === 'CLEARED' ? 'Stamped' : 'Stamp Logbook' }}</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { useCookie, useRuntimeConfig } from '#app'
import {
  Users,
  Building2,
  Clock,
  Stamp,
  RefreshCw,
  MapPin,
  FileText,
  Loader2,
  Download,
  CheckCircle2
} from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'itf' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const isExporting = ref(false)
const stampingId = ref<string | null>(null)
const previewingId = ref<string | null>(null)
const searchQuery = ref('')

const overviewData = reactive({
  summary: {
    totalStudents: 0,
    totalPlacements: 0,
    placementRate: 0,
    totalSubmissions: 0,
    pendingClearances: 0,
    completedClearances: 0,
    unassignedSupervisorsCount: 0
  },
  zonalClusters: [] as Array<{ state: string; studentCount: number; cities: Array<{ name: string; count: number }> }>,
  recentPlacements: [] as Array<{
    id: string
    studentName: string
    matricNo: string
    department: string
    companyName: string
    location: string
    hasSupervisor: boolean
    supervisorName: string
    itfStatus: string
    registeredAt: string
  }>
})

const filteredPlacements = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return overviewData.recentPlacements

  return overviewData.recentPlacements.filter(p =>
    p.studentName.toLowerCase().includes(query) ||
    p.matricNo.toLowerCase().includes(query) ||
    p.companyName.toLowerCase().includes(query) ||
    p.location.toLowerCase().includes(query)
  )
})

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchOverview = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/itf/overview`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })

    if (res.data) {
      overviewData.summary = res.data.summary || overviewData.summary
      overviewData.zonalClusters = res.data.zonalClusters || []
      overviewData.recentPlacements = res.data.recentPlacements || []
    }
  } catch (err: unknown) {
    toast.error(err, 'Failed to fetch ITF overview data')
  } finally {
    isLoading.value = false
  }
}

const stampClearance = async (placementId: string) => {
  stampingId.value = placementId
  try {
    const res = await axios.post(
      `${apiBase}/api/itf/clearance/${placementId}/stamp`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    )

    toast.success('Logbook Certified', res.data?.message || 'ITF verification stamp applied.', 3500)
    await fetchOverview()
  } catch (err: unknown) {
    toast.error(err, 'Failed to endorse logbook')
  } finally {
    stampingId.value = null
  }
}

const previewLogbook = async (placementId: string) => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) {
    toast.error(new Error('Session expired'), 'Unauthorized')
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

const exportAuditData = async () => {
  isExporting.value = true
  try {
    const res = await axios.get(`${apiBase}/api/itf/students-export`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })

    const rows = res.data?.records || []
    if (rows.length === 0) {
      toast.error(new Error('No records available for export.'), 'Empty Dataset')
      return
    }

    const headers = Object.keys(rows[0]).join(',')
    const csvContent = [
      headers,
      ...rows.map((r: Record<string, unknown>) =>
        Object.values(r)
          .map(val => `"${String(val ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `ITF_SIWES_Logbook_Audit_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    toast.success('Audit File Ready', 'Zonal CSV downloaded successfully.', 3500)
  } catch (err: unknown) {
    toast.error(err, 'Export Generation Failed')
  } finally {
    isExporting.value = false
  }
}

onMounted(async () => {
  await fetchOverview()
})
</script>