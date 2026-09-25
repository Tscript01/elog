<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Top Header -->
    <div class="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            Form ITF / SIWES-08
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {{ currentDateDisplay }}
          </span>
        </div>
        <h2 class="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Digital Clearance & Logbook Docket
        </h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official institutional endorsement sheet and cryptographic ITF verification docket.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60"
          @click="fetchClearanceData"
        >
          <RefreshCw :class="['h-4 w-4', isLoading ? 'animate-spin text-blue-600' : '']" />
          <span>Sync Docket</span>
        </button>
      </div>
    </div>

    <!-- 4-Stage Horizontal Progression Tracker -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <!-- Stage 1 -->
        <div class="relative flex sm:flex-col items-start gap-3 sm:gap-2">
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition',
              isIndustryComplete
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
            ]"
          >
            <CheckCircle2 v-if="isIndustryComplete" class="h-4 w-4" />
            <span v-else>1</span>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900 dark:text-white">Industry Sign-Off</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ approvedWeeksCount }}/{{ totalWeeksCount }} Weeks Verified
            </p>
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="relative flex sm:flex-col items-start gap-3 sm:gap-2">
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition',
              isCoordinatorCleared
                ? 'bg-emerald-600 text-white'
                : isIndustryComplete
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            ]"
          >
            <CheckCircle2 v-if="isCoordinatorCleared" class="h-4 w-4" />
            <span v-else>2</span>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900 dark:text-white">Faculty Assessment</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ isCoordinatorCleared ? `Graded: ${clearance?.coordinator_score}/100` : 'Pending Scoring' }}
            </p>
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="relative flex sm:flex-col items-start gap-3 sm:gap-2">
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition',
              isCoordinatorCleared
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            ]"
          >
            <CheckCircle2 v-if="isCoordinatorCleared" class="h-4 w-4" />
            <span v-else>3</span>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900 dark:text-white">Dossier Unlocked</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ isCoordinatorCleared ? 'PDF Ready for Export' : 'Locked' }}
            </p>
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="relative flex sm:flex-col items-start gap-3 sm:gap-2">
          <div
            :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition',
              isItfCleared
                ? 'bg-emerald-600 text-white'
                : clearance?.itf_status === 'SUBMITTED'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            ]"
          >
            <CheckCircle2 v-if="isItfCleared" class="h-4 w-4" />
            <span v-else>4</span>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-900 dark:text-white">ITF Certification</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ isItfCleared ? 'Official Stamp Applied' : clearance?.itf_status === 'SUBMITTED' ? 'In Review at Area Office' : 'Awaiting Submission' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Official Certificate Docket Representation -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <!-- Certificate Header Band -->
      <div class="border-b border-slate-200 bg-slate-50/75 p-6 text-center dark:border-slate-800 dark:bg-slate-950/40">
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Industrial Training Fund (ITF) &bull; SIWES Form-08</span>
        <h3 class="mt-1 text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase sm:text-xl">
          Certificate of Practical Training & Institutional Endorsement
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          This digital docket certifies the satisfactory completion of industrial experience under the scheme regulations.
        </p>
      </div>

      <!-- Certificate Body -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Student & Host Placement Metadata Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Trainee Name</span>
            <p class="font-bold text-slate-900 dark:text-white mt-0.5 text-sm">{{ placement?.student?.name }}</p>
          </div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Matriculation No</span>
            <p class="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{{ placement?.student?.matric_no || 'N/A' }}</p>
          </div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Host Organization</span>
            <p class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{{ placement?.company_name }}</p>
          </div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Tenure Span</span>
            <p class="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{{ formatDate(placement?.start_date) }} &ndash; {{ formatDate(placement?.end_date) }}</p>
          </div>
        </div>

        <!-- Dual Endorsement Sections -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Section A: Industry Sign-Off Box -->
          <div class="rounded-xl border border-slate-200 p-5 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Section A: Industry Supervisor</span>
                <CheckCircle2 v-if="isIndustryComplete" class="h-4 w-4 text-emerald-600" />
                <Clock v-else class="h-4 w-4 text-amber-500" />
              </div>
              <p class="mt-3 text-xs text-slate-600 dark:text-slate-300">
                <span class="font-semibold text-slate-800 dark:text-slate-200">Endorser:</span>
                {{ placement?.ind_supervisor_name || 'Assigned Supervisor' }} ({{ placement?.ind_supervisor_email }})
              </p>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                <span class="font-semibold text-slate-800 dark:text-slate-200">Log Fidelity:</span>
                {{ approvedWeeksCount }} of {{ totalWeeksCount }} work cycles endorsed
              </p>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span class="block text-[10px] font-mono uppercase text-slate-400">Weekly Industry Verification Hash</span>
              <span class="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {{ isIndustryComplete ? 'IND-VERIFIED-ALL-CYCLES' : 'CYCLE-APPROVALS-PENDING' }}
              </span>
            </div>
          </div>

          <!-- Section B: Institutional Coordinator Box -->
          <div class="rounded-xl border border-slate-200 p-5 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div class="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Section B: Faculty Coordinator</span>
                <CheckCircle2 v-if="isCoordinatorCleared" class="h-4 w-4 text-emerald-600" />
                <Clock v-else class="h-4 w-4 text-amber-500" />
              </div>
              <div class="mt-3 flex items-baseline justify-between">
                <div>
                  <p class="text-xs text-slate-600 dark:text-slate-300">
                    <span class="font-semibold text-slate-800 dark:text-slate-200">Officer:</span>
                    {{ placement?.inst_coordinator?.name || 'Departmental Desk' }}
                  </p>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 italic">
                    "{{ clearance?.coordinator_remarks || 'Awaiting academic defense assessment.' }}"
                  </p>
                </div>
                <div v-if="isCoordinatorCleared" class="text-right shrink-0 pl-3">
                  <span class="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                    {{ clearance?.coordinator_score }}
                  </span>
                  <span class="text-xs font-bold text-slate-400">/100</span>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span class="block text-[10px] font-mono uppercase text-slate-400">Cryptographic Institutional Stamp</span>
              <span class="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {{ clearance?.final_pdf_hash || 'AWAITING-COORDINATOR-SIGN' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Section C: Official ITF Verification Seal Strip -->
        <div class="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-5 dark:border-slate-700 dark:bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold',
                isItfCleared
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              ]"
            >
              ITF
            </div>
            <div>
              <p class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Industrial Training Fund Area Office Seal
              </p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                {{ isItfCleared ? 'Docket stamped and certified for academic defense credit.' : clearance?.itf_status === 'SUBMITTED' ? 'Submitted to ITF Zonal Office. Awaiting official stamping.' : 'Requires institutional clearance before final ITF stamping.' }}
              </p>
            </div>
          </div>

          <div v-if="isItfCleared" class="shrink-0 text-right">
            <span class="rounded bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
              Certified &bull; {{ formatDate(clearance?.itf_cleared_at) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Actions Toolbar -->
      <div class="border-t border-slate-200 bg-slate-50/75 p-6 dark:border-slate-800 dark:bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          <span v-if="isCoordinatorCleared" class="font-semibold text-emerald-700 dark:text-emerald-400">
            Logbook dossier is fully compiled and ready for print.
          </span>
          <span v-else>
            Logbook export remains locked until institutional coordinator grades your submissions.
          </span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            :disabled="!isCoordinatorCleared || isDownloading"
            :class="[
              'flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-xs transition',
              isCoordinatorCleared
                ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
            ]"
            @click="downloadEndorsedLogbook"
          >
            <Printer class="h-4 w-4" />
            <span>{{ isDownloading ? 'Preparing PDF...' : 'Print / Download Official Logbook' }}</span>
          </button>

          <button
            v-if="isCoordinatorCleared && clearance?.itf_status === 'PENDING'"
            type="button"
            :disabled="isSubmittingItf"
            class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            @click="submitToITF"
          >
            <Send class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>{{ isSubmittingItf ? 'Sending...' : 'Forward to ITF' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  CheckCircle2,
  Clock,
  Printer,
  Send,
  RefreshCw
} from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'student' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const isDownloading = ref(false)
const isSubmittingItf = ref(false)

const placement = ref<any | null>(null)
const clearance = ref<any | null>(null)
const weeklySubmissions = ref<any[]>([])

const currentDateDisplay = computed(() => {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const totalWeeksCount = computed(() => weeklySubmissions.value.length || 24)
const approvedWeeksCount = computed(() => {
  return weeklySubmissions.value.filter((w) => w.status === 'APPROVED').length
})

const isIndustryComplete = computed(() => {
  return totalWeeksCount.value > 0 && approvedWeeksCount.value === totalWeeksCount.value
})

const isCoordinatorCleared = computed(() => {
  return clearance.value?.coordinator_status === 'CLEARED'
})

const isItfCleared = computed(() => {
  return clearance.value?.itf_status === 'CLEARED'
})

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const fetchClearanceData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/student/clearance-status`, {
      headers: getHeaders(),
      withCredentials: true
    })

    placement.value = res.data.data.placement
    clearance.value = res.data.data.clearance
    weeklySubmissions.value = res.data.data.weekly_submissions || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Clearance Records')
  } finally {
    isLoading.value = false
  }
}

const downloadEndorsedLogbook = async () => {
  if (!isCoordinatorCleared.value) return
  isDownloading.value = true

  try {
    const response = await axios.get(`${apiBase}/api/student/logbook/download-pdf`, {
      headers: getHeaders(),
      responseType: 'blob',
      withCredentials: true
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `SIWES_Logbook_${placement.value?.student?.matric_no || 'Docket'}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)

    toast.success('Dossier Downloaded', 'Endorsed Form ITF-08 logbook generated successfully.')
  } catch (err: unknown) {
    toast.error(err, 'Failed to Generate PDF Dossier')
  } finally {
    isDownloading.value = false
  }
}

const submitToITF = async () => {
  if (!isCoordinatorCleared.value) return
  isSubmittingItf.value = true

  try {
    await axios.post(
      `${apiBase}/api/student/clearance/submit-itf`,
      {},
      { headers: getHeaders(), withCredentials: true }
    )

    toast.success('Forwarded to ITF', 'Logbook submitted to ITF Zonal Office for final stamping.')
    await fetchClearanceData()
  } catch (err: unknown) {
    toast.error(err, 'Submission to ITF Failed')
  } finally {
    isSubmittingItf.value = false
  }
}

onMounted(() => {
  fetchClearanceData()
})
</script>