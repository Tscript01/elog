<template>
  <div class="space-y-8">
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Endorsement Queue
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Weekly Log Inspections
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Centralized Logbook Reviews
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Review, approve, or request revisions on weekly technical submissions from all assigned interns.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
          <button
            type="button"
            :class="[
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            ]"
            @click="statusFilter = 'ALL'"
          >
            All
          </button>
          <button
            type="button"
            :class="[
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              statusFilter === 'PENDING' ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            ]"
            @click="statusFilter = 'PENDING'"
          >
            Pending
          </button>
          <button
            type="button"
            :class="[
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              statusFilter === 'APPROVED' ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            ]"
            @click="statusFilter = 'APPROVED'"
          >
            Approved
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Submissions Registry</h2>
          <p class="text-xs text-slate-500">Showing {{ filteredSubmissions.length }} review items</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          @click="fetchReviews"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin' : '']" />
          <span>Refresh Queue</span>
        </button>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <Loader2 class="h-6 w-6 animate-spin text-emerald-600" />
        <p class="mt-2 text-xs">Loading review queue...</p>
      </div>

      <div v-else-if="filteredSubmissions.length === 0" class="p-16 text-center">
        <ClipboardCheck class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
        <p class="mt-3 text-sm font-bold text-slate-900 dark:text-white">No submissions found</p>
        <p class="mt-1 text-xs text-slate-500">There are no weekly log submissions matching your current filter criteria.</p>
      </div>

      <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="sub in filteredSubmissions"
          :key="sub.id"
          class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="font-bold text-slate-900 dark:text-white">{{ sub.student_name || 'Trainee' }}</span>
              <span class="text-xs text-slate-400">&bull;</span>
              <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Week {{ sub.week_no }}</span>
              <span
                :class="[
                  'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
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
              {{ sub.daily_logs?.length || 0 }} daily activity logs recorded for this period
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              @click="openReviewModal(sub)"
            >
              <Eye class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Inspect & Endorse</span>
            </button>
          </div>
        </div>
      </div>
    </div>

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
              {{ activeSubmission.student_name }} - Week {{ activeSubmission.week_no }} Review
            </h3>
            <p class="text-xs text-slate-500">Inspect logs and sign off with professional feedback</p>
          </div>
          <button
            type="button"
            class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="isModalOpen = false"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="mt-5 space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Recorded Activities</h4>
          
          <div v-if="!activeSubmission.daily_logs || activeSubmission.daily_logs.length === 0" class="p-4 text-xs text-slate-500 italic">
            No logs recorded for this weekly period.
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
                  Attachment &rarr;
                </a>
              </div>
              <p class="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{{ log.description }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6 space-y-2">
          <label for="review-remarks" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Supervisor Remarks
          </label>
          <textarea
            id="review-remarks"
            v-model="supervisorRemarks"
            rows="3"
            placeholder="Write evaluation or feedback notes..."
            class="block w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          ></textarea>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            :disabled="isSubmittingReview"
            class="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 px-4 py-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            @click="submitReview('REJECTED')"
          >
            <XCircle class="h-4 w-4" />
            <span>Decline</span>
          </button>

          <button
            type="button"
            :disabled="isSubmittingReview"
            class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
            @click="submitReview('APPROVED')"
          >
            <CheckCircle2 class="h-4 w-4" />
            <span>Approve</span>
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
  ClipboardCheck,
  RefreshCw,
  Loader2,
  Eye,
  X,
  CheckCircle2,
  XCircle
} from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'supervisor' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const submissions = ref<any[]>([])
const isLoading = ref(false)
const statusFilter = ref<'ALL' | 'PENDING' | 'APPROVED'>('ALL')

const isModalOpen = ref(false)
const activeSubmission = ref<any | null>(null)
const supervisorRemarks = ref('')
const isSubmittingReview = ref(false)

const filteredSubmissions = computed(() => {
  if (statusFilter.value === 'ALL') return submissions.value
  return submissions.value.filter((s) => (s.status || 'PENDING') === statusFilter.value)
})

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchReviews = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/supervisor/reviews`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    submissions.value = res.data.submissions || res.data || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Submissions')
  } finally {
    isLoading.value = false
  }
}

const openReviewModal = (sub: any) => {
  activeSubmission.value = sub
  supervisorRemarks.value = sub.supervisor_remarks || ''
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

    toast.success('Review Recorded', `Weekly submission updated successfully.`)
    isModalOpen.value = false
    await fetchReviews()
  } catch (err: unknown) {
    toast.error(err, 'Failed to Record Review')
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
  fetchReviews()
})
</script>