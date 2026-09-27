<template>
  <div class="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4 text-center">
    <!-- Background glow aesthetics -->
    <div class="relative w-full max-w-2xl">
      <div class="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-emerald-500/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <!-- Top Badge -->
      <div class="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 backdrop-blur-xs dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
        <Sparkles class="h-3.5 w-3.5 text-amber-500 animate-spin" />
        <span>Official SIWES Clearance Ready</span>
      </div>

      <!-- Main Headline -->
      <h1 class="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
        Claim Your Official <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">ITF Form 8</span>
      </h1>
      
      <p class="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
        All daily logs, supervisor remarks, and institutional verification stamps merged into one master audit document. No scissors or glue required.
      </p>

      <!-- Placement Summary Mini-Card -->
      <div class="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 text-left grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Entries</span>
          <span class="text-base font-extrabold text-slate-900 dark:text-white">{{ totalEntriesCount }} Days Logged</span>
        </div>
        <div>
          <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Duration</span>
          <span class="text-base font-extrabold text-slate-900 dark:text-white">Week {{ placementStore.maxWeeks }}</span>
        </div>
        <div>
          <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Territory</span>
          <span class="text-base font-extrabold text-slate-900 dark:text-white truncate">{{ placementStore.placement?.city || 'Lagos' }}, {{ placementStore.placement?.state || 'State' }}</span>
        </div>
        <div>
          <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Host Company</span>
          <span class="text-base font-extrabold text-slate-900 dark:text-white truncate">{{ placementStore.placement?.company_name || 'Active Attachment' }}</span>
        </div>
      </div>

      <!-- THE MASSIVE BUTTON -->
      <div class="mt-10 flex flex-col items-center justify-center gap-3">
        <button
          type="button"
          :disabled="isDownloading"
          class="group relative inline-flex items-center justify-center gap-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-10 py-7 text-xl font-black text-white shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/70 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-2xl"
          @click="triggerDownload"
        >
          <div class="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 opacity-30 blur-lg transition duration-500 group-hover:opacity-70 group-hover:blur-xl" />
          
          <span class="relative flex items-center gap-3">
            <Loader2 v-if="isDownloading" class="h-8 w-8 animate-spin" />
            <Download v-else class="h-8 w-8 transition-transform group-hover:-translate-y-1 group-hover:rotate-12" />
            <span>{{ isDownloading ? 'SUMMONING YOUR PDF...' : 'DOWNLOAD MY LOGBOOK NOW' }}</span>
          </span>
        </button>

        <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Instant PDF compilation &bull; Direct server stream &bull; Ready for coordinator defense
        </span>
      </div>

      <!-- Error / Status Prompt -->
      <div
        v-if="errorMessage"
        class="mt-6 flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
      >
        <AlertCircle class="h-4 w-4 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useCookie, useRuntimeConfig } from '#app'
import { Download, Sparkles, AlertCircle, Loader2 } from 'lucide-vue-next'
import { usePlacementStore } from '~/stores/placement'
import { useDailyLogsStore } from '~/stores/dailyLogs'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'student' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const placementStore = usePlacementStore()
const dailyLogsStore = useDailyLogsStore()
const toast = useToast()

const isDownloading = ref(false)
const errorMessage = ref('')

const totalEntriesCount = computed(() => dailyLogsStore.logs.length)

const triggerDownload = async () => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) {
    toast.error(new Error('Session expired. Please log in again.'), 'Unauthorized')
    return
  }

  isDownloading.value = true
  errorMessage.value = ''

  try {
    const res = await axios.get(`${apiBase}/api/placements/export/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
      withCredentials: true,
    })

    const blob = new Blob([res.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    
    const company = (placementStore.placement?.company_name || 'Organization').replace(/[^a-zA-Z0-9]/g, '_')
    link.download = `SIWES_Form8_${company}.pdf`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    toast.success('Logbook Downloaded', 'Your Form 8 booklet is ready for printing and defense.', 4000)
  } catch (err: unknown) {
    errorMessage.value = 'Failed to generate logbook PDF. Make sure your placement and daily entries exist.'
    toast.error(err, 'Export Failed')
  } finally {
    isDownloading.value = false
  }
}

onMounted(async () => {
  if (!placementStore.placement) {
    await placementStore.fetchPlacement()
  }
  if (dailyLogsStore.logs.length === 0) {
    await dailyLogsStore.fetchLogs({ limit: 200 })
  }
})
</script>