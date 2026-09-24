<template>
  <div class="space-y-8">
    <!-- Header Summary Bar -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Industry Desk
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Trainee Oversight & Endorsements
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Supervisor Review Console
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Monitor assigned undergraduate interns, inspect technical activities, and sign off on weekly log submissions.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="fetchSupervisorData"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin' : '']" />
          <span>Refresh Console</span>
        </button>
      </div>
    </div>

    <!-- Stats Overview Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Trainees</span>
          <Users class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p class="mt-3 text-3xl font-black text-slate-900 dark:text-white">{{ trainees.length }}</p>
        <p class="mt-1 text-[11px] text-slate-500">Active student interns under your mentorship</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Reviews</span>
          <ClipboardClock class="h-4 w-4 text-amber-500" />
        </div>
        <p class="mt-3 text-3xl font-black text-slate-900 dark:text-white">{{ pendingSubmissionsCount }}</p>
        <p class="mt-1 text-[11px] text-slate-500">Weekly logs awaiting your endorsement</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Endorsed Submissions</span>
          <ShieldCheck class="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <p class="mt-3 text-3xl font-black text-slate-900 dark:text-white">{{ approvedSubmissionsCount }}</p>
        <p class="mt-1 text-[11px] text-slate-500">Successfully signed off weekly records</p>
      </div>
    </div>

    <!-- Assigned Trainees & Submissions Section -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <!-- Left: Assigned Trainees List -->
      <div class="xl:col-span-5 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Active Trainees</h2>
          <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {{ trainees.length }} Enrolled
          </span>
        </div>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 class="h-6 w-6 animate-spin text-emerald-600" />
          <p class="mt-2 text-xs">Loading roster...</p>
        </div>

        <div v-else-if="trainees.length === 0" class="p-10 text-center">
          <UserX class="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">No trainees assigned</p>
          <p class="mt-1 text-xs text-slate-500">Students who register your email as their industrial supervisor will appear here.</p>
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="trainee in trainees"
            :key="trainee.id"
            :class="[
              'flex items-center justify-between p-4.5 transition cursor-pointer',
              selectedTrainee?.id === trainee.id ? 'bg-slate-50 dark:bg-slate-800/60' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
            ]"
            @click="selectTrainee(trainee)"
          >
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ trainee.student_name || trainee.name }}</p>
              <p class="text-[11px] font-mono text-slate-500">{{ trainee.matric_no || 'Matriculation pending' }}</p>
              <p class="mt-1 text-[11px] text-slate-400 truncate">{{ trainee.company_name }}</p>
            </div>
            <ChevronRight class="h-4 w-4 text-slate-400 shrink-0 ml-3" />
          </div>
        </div>
      </div>

      <!-- Right: Selected Trainee Submissions & Review Panel -->
      <div class="xl:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
          <div>
            <h2 class="text-sm font-bold text-slate-900 dark:text-white">
              {{ selectedTrainee ? `${selectedTrainee.student_name || selectedTrainee.name}'s Submissions` : 'Select a Trainee' }}
            </h2>
            <p class="text-xs text-slate-500">Review and endorse weekly logbook records</p>
          </div>
          <span v-if="selectedTrainee" class="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {{ traineeSubmissions.length }} Weeks Submitted
          </span>
        </div>

        <div v-if="!selectedTrainee" class="p-16 text-center">
          <Users class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
          <p class="mt-3 text-sm font-bold text-slate-900 dark:text-white">No trainee selected</p>
          <p class="mt-1 text-xs text-slate-500">Click on a student from the left roster to view their weekly logbook submissions.</p>
        </div>

        <div v-else-if="loadingSubmissions" class="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 class="h-6 w-6 animate-spin text-emerald-600" />
          <p class="mt-2 text-xs">Fetching weekly logs...</p>
        </div>

        <div v-else-if="traineeSubmissions.length === 0" class="p-12 text-center">
          <FileText class="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">No submissions recorded</p>
          <p class="mt-1 text-xs text-slate-500">This student has not submitted any weekly logs for endorsement yet.</p>
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
          <div
            v-for="sub in traineeSubmissions"
            :key="sub.id"
            class="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div class="flex items-center gap-2.5">
                <span class="text-xs font-bold text-slate-900 dark:text-white">Week {{ sub.week_no }}</span>
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    sub.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : sub.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  ]"
                >
                  {{ sub.status || 'PENDING' }}
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-500">
                {{ sub.daily_logs?.length || 0 }} daily activities logged
              </p>
            </div>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              @click="openReviewModal(sub)"
            >
              <Eye class="h-3.5 w-3.5" />
              <span>Review & Endorse</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Review & Endorse Modal -->
    <div
      v-if="isModalOpen && activeSubmission"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div class="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              Week {{ activeSubmission.week_no }} Endorsement Review
            </h3>
            <p class="text-xs text-slate-500">Inspect daily logs and provide feedback remarks</p>
          </div>
          <button
            type="button"
            class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="isModalOpen = false"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Daily Logs Breakdown -->
        <div class="mt-5 space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Technical Activities</h4>
          
          <div v-if="!activeSubmission.daily_logs || activeSubmission.daily_logs.length === 0" class="p-4 text-xs text-slate-500 italic">
            No daily log items recorded for this week.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="log in activeSubmission.daily_logs"
              :key="log.id"
              class="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ formatDisplayDate(log.log_date) }}</span>
                <a v-if="log.image_url" :href="log.image_url" target="_blank" class="text-[11px] text-blue-600 hover:underline dark:text-blue-400">
                  View Attachment &rarr;
                </a>
              </div>
              <p class="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{{ log.description }}</p>
            </div>
          </div>
        </div>

        <!-- Supervisor Feedback Input -->
        <div class="mt-6 space-y-2">
          <label for="supervisor-remarks" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Supervisor Remarks & Feedback
          </label>
          <textarea
            id="supervisor-remarks"
            v-model="supervisorRemarks"
            rows="3"
            placeholder="Provide technical evaluation, corrections, or approval notes for the student..."
            class="block w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            :disabled="isSubmittingReview"
            class="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 px-4 py-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            @click="submitReview('REJECTED')"
          >
            <XCircle class="h-4 w-4" />
            <span>Decline / Request Revision</span>
          </button>

          <button
            type="button"
            :disabled="isSubmittingReview"
            class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
            @click="submitReview('APPROVED')"
          >
            <CheckCircle2 class="h-4 w-4" />
            <span>Approve & Endorse Week</span>
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
  Users,
  ClipboardClock,
  ShieldCheck,
  Loader2,
  UserX,
  ChevronRight,
  FileText,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'supervisor' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const trainees = ref<any[]>([])
const selectedTrainee = ref<any | null>(null)
const traineeSubmissions = ref<any[]>([])
const isLoading = ref(false)
const loadingSubmissions = ref(false)

const isModalOpen = ref(false)
const activeSubmission = ref<any | null>(null)
const supervisorRemarks = ref('')
const isSubmittingReview = ref(false)

const pendingSubmissionsCount = computed(() => {
  // Can be aggregated across trainees once loaded
  return trainees.value.reduce((acc, t) => acc + (t.pending_count || 0), 0)
})

const approvedSubmissionsCount = computed(() => {
  return trainees.value.reduce((acc, t) => acc + (t.approved_count || 0), 0)
})

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchSupervisorData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/supervisor/trainees`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    trainees.value = res.data.trainees || res.data || []
    
    if (trainees.value.length > 0 && !selectedTrainee.value) {
      await selectTrainee(trainees.value[0])
    }
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Roster')
  } finally {
    isLoading.value = false
  }
}

const selectTrainee = async (trainee: any) => {
  selectedTrainee.value = trainee
  loadingSubmissions.value = true

  try {
    const placementId = trainee.placement_id || trainee.id
    const res = await axios.get(`${apiBase}/api/supervisor/placements/${placementId}/submissions`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    traineeSubmissions.value = res.data.submissions || res.data || []
  } catch (err: unknown) {
    traineeSubmissions.value = []
    toast.error(err, 'Failed to Load Trainee Submissions')
  } finally {
    loadingSubmissions.value = false
  }
}

const openReviewModal = (submission: any) => {
  activeSubmission.value = submission
  supervisorRemarks.value = submission.supervisor_remarks || ''
  isModalOpen.value = true
}

const submitReview = async (status: 'APPROVED' | 'REJECTED') => {
  if (!activeSubmission.value) return

  isSubmittingReview.value = true
  try {
    await axios.put(
      `${apiBase}/api/supervisor/submissions/${activeSubmission.value.id}/review`,
      {
        status,
        remarks: supervisorRemarks.value.trim() || null
      },
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    )

    toast.success('Review Recorded', `Weekly log status updated to ${status}.`)
    isModalOpen.value = false

    // Refresh submission list for active trainee
    if (selectedTrainee.value) {
      await selectTrainee(selectedTrainee.value)
    }
  } catch (err: unknown) {
    toast.error(err, 'Review Submission Failed')
  } finally {
    isSubmittingReview.value = false
  }
}

const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const raw = dateStr.split('T')[0] ?? ''
  const [y, m, d] = raw.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y!, m! - 1, d)))
}

onMounted(() => {
  fetchSupervisorData()
})
</script>