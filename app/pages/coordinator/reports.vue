<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <div>
        <h1 class="text-xl font-black text-slate-900 dark:text-white">Departmental Clearance Reports</h1>
        <p class="text-xs text-slate-500 mt-1">Export cleared student defense eligibility rosters for faculty records.</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-xs"
        @click="exportCSV"
      >
        <Download class="h-3.5 w-3.5" />
        <span>Export Cleared CSV</span>
      </button>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-2">Defense Eligibility Summary</h3>
      <p class="text-xs text-slate-500">Lists students who have achieved 100% industry review and complete institutional sign-off.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'coordinator' })

const toast = useToast()

const exportCSV = () => {
  toast.success('Export Ready', 'Downloading departmental master list...')
}
</script>