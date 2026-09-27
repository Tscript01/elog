<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Statutory Reporting
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Directorate Audit
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Zonal SIWES Audit Export
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Generate accredited institutional spreadsheets and clearance schedules for regional ITF verification.
        </p>
      </div>
    </div>

    <!-- Parameter Config Card -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-sm font-bold text-slate-900 dark:text-white">Export Parameters</h2>
      <p class="text-[11px] text-slate-500 dark:text-slate-400">Configure territorial filters before compiling the audit manifest</p>

      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Target State / Cluster
          </label>
          <select
            v-model="filterState"
            class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-emerald-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">All Nigerian States (National Manifest)</option>
            <option v-for="state in states" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Clearance Status Scope
          </label>
          <select
            v-model="filterStatus"
            class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 transition focus:border-emerald-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="ALL">All Placements (Both Pending & Stamped)</option>
            <option value="APPROVED">Certified & Stamped Only</option>
            <option value="PENDING">Pending Directorate Seal</option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
        <button
          type="button"
          :disabled="isGenerating"
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
          @click="generateExport"
        >
          <Loader2 v-if="isGenerating" class="h-4 w-4 animate-spin" />
          <Download v-else class="h-4 w-4" />
          <span>{{ isGenerating ? 'Compiling Manifest...' : 'Download CSV Manifest' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useCookie, useRuntimeConfig } from '#app'
import { Download, Loader2 } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'itf' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isGenerating = ref(false)
const filterState = ref('')
const filterStatus = ref('ALL')

const states = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory (FCT)',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
]

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const generateExport = async () => {
  isGenerating.value = true
  try {
    const params: Record<string, string> = {}
    if (filterState.value) params.state = filterState.value

    const res = await axios.get(`${apiBase}/api/itf/students-export`, {
      headers: getAuthHeaders(),
      params,
      withCredentials: true
    })

    let records: any[] = res.data?.records || []

    if (filterStatus.value !== 'ALL') {
      records = records.filter(r => r.itfStatus === filterStatus.value)
    }

    if (records.length === 0) {
      toast.error(new Error('No records matched the selected criteria.'), 'Empty Export')
      return
    }

    const headers = Object.keys(records[0]).join(',')
    const rows = records.map(r =>
      Object.values(r)
        .map(val => `"${String(val ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    const csvData = [headers, ...rows].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `ITF_Audit_${filterState.value || 'National'}_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    toast.success('Generated', 'Audit spreadsheet downloaded.')
  } catch (err: unknown) {
    toast.error(err, 'Export compilation failed')
  } finally {
    isGenerating.value = false
  }
}
</script>