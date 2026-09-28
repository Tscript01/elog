<template>
  <div class="mx-auto max-w-5xl space-y-8 py-6">
    <!-- Header Section -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            Federal Republic of Nigeria
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Industrial Training Fund (ITF)
          </span>
        </div>
        <h1 class="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          SIWES Electronic Logbook Export
        </h1>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
          Official statutory record of technical training activities, weekly industry supervisor assessments, institutional academic evaluations, and Zonal Directorate certification.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span
          :class="[
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
            isFullyCleared
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
          ]"
        >
          <span class="h-2 w-2 rounded-full" :class="isFullyCleared ? 'bg-emerald-500' : 'bg-amber-500'" />
          {{ isFullyCleared ? 'Statutory Cleared' : 'Provisional Draft' }}
        </span>
      </div>
    </div>

    <!-- Verification Audit Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">Daily Entries</span>
          <FileText class="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <p class="mt-3 text-2xl font-black text-slate-900 dark:text-white">
          {{ totalEntriesCount }} Days
        </p>
        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          Across {{ placementStore.maxWeeks || 24 }} attachment weeks
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">Host Facility</span>
          <Building2 class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <p class="mt-3 truncate text-lg font-bold text-slate-900 dark:text-white" :title="placementStore.placement?.company_name">
          {{ placementStore.placement?.company_name || 'Unassigned' }}
        </p>
        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {{ placementStore.placement?.city || 'Zone' }}, {{ placementStore.placement?.state || 'State' }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">Institution Desk</span>
          <GraduationCap class="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <p class="mt-3 text-base font-bold text-slate-900 dark:text-white">
          {{ isCoordinatorCleared ? 'Academic Sign-Off' : 'Pending Review' }}
        </p>
        <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {{ coordinatorStatusText }}
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-[11px] font-bold uppercase tracking-wider">ITF Directorate</span>
          <Stamp class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p class="mt-3 text-base font-bold" :class="isItfCleared ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'">
          {{ isItfCleared ? 'Verified & Stamped' : 'Pending Seal' }}
        </p>
        <p class="mt-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate">
          {{ itfHashText }}
        </p>
      </div>
    </div>

    <!-- Main Download Console -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left Column: Actions and Guidelines -->
      <div class="space-y-6 lg:col-span-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Document Compilation Protocol</h2>
          <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Export generates an authenticated, vector-rendered A4 document formatted to statutory industrial work experience scheme guidelines.
          </p>

          <div class="mt-5 space-y-3">
            <div class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="text-xs">
                <span class="font-bold text-slate-900 dark:text-white">Full Weekly Chronology:</span>
                <span class="text-slate-600 dark:text-slate-300"> All daily technical entries and tasks performed, formatted into standard timetable tables.</span>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="text-xs">
                <span class="font-bold text-slate-900 dark:text-white">Supervisor Remarks & Endorsements:</span>
                <span class="text-slate-600 dark:text-slate-300"> Formal industry supervisor feedback blocks appended to the conclusion of each work week.</span>
              </div>
            </div>

            <div class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="text-xs">
                <span class="font-bold text-slate-900 dark:text-white">Official Verification Seals:</span>
                <span class="text-slate-600 dark:text-slate-300"> Dual academic coordination and Zonal ITF digital stamps embedded on the final certification sheet.</span>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              :disabled="isDownloading || isPreviewing"
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              @click="triggerDownload"
            >
              <Loader2 v-if="isDownloading" class="h-4 w-4 animate-spin" />
              <Download v-else class="h-4 w-4" />
              <span>{{ isDownloading ? 'Compiling Official Document...' : 'Download Official PDF Booklet' }}</span>
            </button>

            <button
              type="button"
              :disabled="isDownloading || isPreviewing"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              @click="triggerPreview"
            >
              <Loader2 v-if="isPreviewing" class="h-4 w-4 animate-spin text-blue-600" />
              <ExternalLink v-else class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Preview in Browser</span>
            </button>
          </div>

          <div v-if="errorMessage" class="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            <AlertCircle class="h-4 w-4 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Trainee & Accreditation Specification -->
      <div class="space-y-6">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">Attachment Dossier</h2>
          
          <div class="mt-4 space-y-3.5 text-xs">
            <div class="border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span class="block text-[10px] font-bold uppercase text-slate-400">Trainee Name</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ userProfile.name || 'Trainee' }}</span>
            </div>

            <div class="border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span class="block text-[10px] font-bold uppercase text-slate-400">Matric / Reg No</span>
              <span class="font-mono font-semibold text-slate-800 dark:text-slate-200">{{ userProfile.matricNo || 'N/A' }}</span>
            </div>

            <div class="border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span class="block text-[10px] font-bold uppercase text-slate-400">Department</span>
              <span class="font-medium text-slate-800 dark:text-slate-200">{{ userProfile.department || 'N/A' }}</span>
            </div>

            <div class="border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <span class="block text-[10px] font-bold uppercase text-slate-400">Industry Supervisor</span>
              <span class="font-medium text-slate-800 dark:text-slate-200">{{ placementStore.placement?.ind_supervisor_name || 'Assigned Supervisor' }}</span>
            </div>

            <div>
              <span class="block text-[10px] font-bold uppercase text-slate-400">Calendar Period</span>
              <span class="font-mono text-slate-600 dark:text-slate-300">
                {{ formatDate(placementStore.placement?.start_date) }} &mdash; {{ formatDate(placementStore.placement?.end_date) }}
              </span>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div class="flex items-center gap-2 text-blue-900 dark:text-blue-300">
            <ShieldCheck class="h-4 w-4" />
            <h3 class="text-xs font-bold uppercase tracking-wider">Accreditation Advisory</h3>
          </div>
          <p class="mt-2 text-[11px] leading-relaxed text-blue-800/80 dark:text-blue-300/80">
            Retain printed copies of this document for oral examinations, departmental grading defense, and the physical ITF Area Office auditing desk.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useCookie, useRuntimeConfig } from '#app'
import {
  Download,
  FileText,
  Building2,
  GraduationCap,
  Stamp,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-vue-next'
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
const isPreviewing = ref(false)
const errorMessage = ref('')

const userProfile = reactive({
  name: '',
  matricNo: '',
  department: ''
})

const totalEntriesCount = computed(() => dailyLogsStore.logs.length)

const isCoordinatorCleared = computed(() => {
  const clearance = placementStore.placement?.clearance
  if (!clearance) return false
  const status = String(clearance.coordinator_status || '').toUpperCase()
  return status === 'CLEARED' || status === 'APPROVED' || Boolean(clearance.coordinator_cleared_at)
})

const isItfCleared = computed(() => {
  const clearance = placementStore.placement?.clearance
  if (!clearance) return false
  const status = String(clearance.itf_status || '').toUpperCase()
  return (status === 'CLEARED' || status === 'APPROVED') && Boolean(clearance.itf_cleared_at || clearance.itf_stamp_hash)
})

const isFullyCleared = computed(() => isCoordinatorCleared.value && isItfCleared.value)

const coordinatorStatusText = computed(() => {
  const clearance = placementStore.placement?.clearance
  if (!clearance) return 'Awaiting Institutional Review'
  if (clearance.coordinator_score) return `Score: ${clearance.coordinator_score}%`
  return isCoordinatorCleared.value ? 'Department Approved' : 'Under Evaluation'
})

const itfHashText = computed(() => {
  const clearance = placementStore.placement?.clearance
  if (isItfCleared.value && clearance?.itf_stamp_hash) {
    return `HASH: ${clearance.itf_stamp_hash}`
  }
  return 'Awaiting Zonal Seal'
})

const formatDate = (dateStr?: string | Date) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-GB')
}

const extractProfile = () => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) return
  try {
    const decoded = jwtDecode<{ name?: string; matric_no?: string; department?: string }>(token)
    userProfile.name = decoded.name || ''
    userProfile.matricNo = decoded.matric_no || ''
    userProfile.department = decoded.department || ''
  } catch {
    // Defaults retain reactivity
  }
}

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
      withCredentials: true
    })

    const blob = new Blob([res.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const sanitizedMatric = (userProfile.matricNo || 'Trainee').replace(/[^a-zA-Z0-9]/g, '_')
    link.download = `SIWES_Logbook_${sanitizedMatric}.pdf`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    toast.success('Document Exported', 'Official logbook booklet downloaded successfully.', 4000)
  } catch (err: unknown) {
    errorMessage.value = 'Failed to generate logbook PDF. Please verify your placement records.'
    toast.error(err, 'Export Error')
  } finally {
    isDownloading.value = false
  }
}

const triggerPreview = async () => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) {
    toast.error(new Error('Session expired. Please log in again.'), 'Unauthorized')
    return
  }

  isPreviewing.value = true
  errorMessage.value = ''

  try {
    const res = await axios.get(`${apiBase}/api/placements/export/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
      withCredentials: true
    })

    const blob = new Blob([res.data], { type: 'application/pdf' })
    const pdfUrl = URL.createObjectURL(blob)
    window.open(pdfUrl, '_blank')
  } catch (err: unknown) {
    errorMessage.value = 'Unable to stream logbook preview. Please try again.'
    toast.error(err, 'Preview Error')
  } finally {
    isPreviewing.value = false
  }
}

onMounted(async () => {
  extractProfile()
  if (!placementStore.placement) {
    await placementStore.fetchPlacement()
  }
  if (dailyLogsStore.logs.length === 0) {
    await dailyLogsStore.fetchLogs({ limit: 200 })
  }
})
</script>