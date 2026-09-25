<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 sm:p-8">
      <div class="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div class="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-rose-700 uppercase dark:bg-rose-950/50 dark:text-rose-300">
              <ShieldCheck class="h-3 w-3" />
              ITF-08 Endorsement Desk
            </span>
            <span class="text-slate-300 dark:text-slate-700">&bull;</span>
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Institutional Examination</span>
          </div>
          <h1 class="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Academic Assessment & Final Clearance
          </h1>
          <p class="mt-1 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
            Audit industrial logbook completions, issue weighted grades (0-100), and certify student files for official ITF defense presentation.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="fetchCandidates"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin text-rose-600' : '']" />
          <span>Sync Registry</span>
        </button>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/60 dark:bg-slate-950/40">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200/60 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Users class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed Attachments</p>
            <p class="text-lg font-black text-slate-900 dark:text-white">{{ candidates.length }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 rounded-2xl border border-rose-100 bg-rose-50/40 p-3.5 dark:border-rose-950/30 dark:bg-rose-950/20">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400">
            <Clock class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-rose-600/80 dark:text-rose-400">Awaiting Your Grade</p>
            <p class="text-lg font-black text-rose-700 dark:text-rose-300">{{ pendingCount }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 dark:border-emerald-950/30 dark:bg-emerald-950/20">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400">Certified for Defense</p>
            <p class="text-lg font-black text-emerald-700 dark:text-emerald-300">{{ clearedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Clearance Table -->
    <div class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 class="h-7 w-7 animate-spin text-rose-600" />
        <p class="mt-3 text-xs font-medium">Validating supervisor approvals...</p>
      </div>

      <div v-else-if="candidates.length === 0" class="py-20 text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <FileCheck class="h-7 w-7 text-slate-400" />
        </div>
        <h3 class="mt-4 text-sm font-bold text-slate-900 dark:text-white">Clearance Queue Empty</h3>
        <p class="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          Students appear here automatically once 100% of their weekly logbook submissions have been approved by their host industry supervisor.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
              <th class="px-6 py-4">Trainee Candidate</th>
              <th class="px-6 py-4">Host Firm & Placement</th>
              <th class="px-6 py-4">Industrial Review</th>
              <th class="px-6 py-4">Institutional Score</th>
              <th class="px-6 py-4">Accreditation</th>
              <th class="px-6 py-4 text-right">Dossier Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              v-for="item in candidates"
              :key="item.id"
              class="group transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-red-600 font-mono text-xs font-bold text-white shadow-2xs">
                    {{ getInitials(item.student?.name) }}
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {{ item.student?.name }}
                    </p>
                    <p class="font-mono text-[11px] text-slate-400">{{ item.student?.matric_no || 'No Matric' }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800 dark:text-slate-200">{{ item.company_name }}</p>
                <p class="text-[11px] text-slate-400 truncate max-w-xs">{{ item.company_address || 'Address unrecorded' }}</p>
              </td>

              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 class="h-3 w-3" />
                  {{ item.metrics?.approved_weeks }}/{{ item.metrics?.total_weeks }} Wks Verified
                </span>
              </td>

              <td class="px-6 py-4">
                <div v-if="item.clearance?.coordinator_score !== null && item.clearance?.coordinator_score !== undefined" class="flex items-baseline gap-1">
                  <span class="font-mono text-base font-black text-rose-700 dark:text-rose-400">
                    {{ item.clearance.coordinator_score }}
                  </span>
                  <span class="text-[10px] font-bold text-slate-400">/ 100</span>
                </div>
                <span v-else class="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 italic">
                  <AlertCircle class="h-3 w-3 text-amber-500" />
                  Ungraded
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  v-if="item.metrics?.is_cleared"
                  class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300"
                >
                  <Award class="h-3 w-3" />
                  Certified
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300"
                >
                  <Clock class="h-3 w-3" />
                  Pending Sign-off
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <button
                  type="button"
                  :class="[
                    'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow-xs',
                    item.metrics?.is_cleared
                      ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20'
                  ]"
                  @click="openGrading(item)"
                >
                  <FileSignature class="h-3.5 w-3.5" />
                  <span>{{ item.metrics?.is_cleared ? 'View Endorsement' : 'Evaluate & Certify' }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Slide-Over Audit Drawer -->
    <div
      v-if="showModal && activeItem"
      class="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click.self="showModal = false"
    >
      <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="w-screen max-w-lg border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <!-- Drawer Header -->
          <div class="border-b border-slate-100 p-6 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <span class="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 uppercase dark:bg-rose-950/50 dark:text-rose-300">
                Form ITF-08 Assessment
              </span>
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                @click="showModal = false"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <h2 class="mt-3 text-lg font-black text-slate-900 dark:text-white">
              {{ activeItem.student?.name }}
            </h2>
            <div class="mt-1 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{{ activeItem.student?.matric_no }}</span>
              <span>&bull;</span>
              <span>{{ activeItem.company_name }}</span>
            </div>
          </div>

          <!-- Drawer Form Body -->
          <form id="gradingForm" class="flex-1 overflow-y-auto p-6 space-y-6" @submit.prevent="submitAssessment">
            <!-- Inspection Summary Card -->
            <div class="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2.5 dark:border-slate-800 dark:bg-slate-950/50">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Attachment Tenure</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ activeItem.metrics?.approved_weeks }} Weeks Complete</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Industry Supervisor</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ activeItem.ind_supervisor?.name || 'Verified' }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Logbook Status</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">100% Industry Endorsed</span>
              </div>
            </div>

            <!-- Grade Slider / Number Field -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Institutional Defense Grade
                </label>
                <span class="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                  {{ form.score }} / 100 Marks
                </span>
              </div>
              <div class="relative flex items-center gap-4">
                <input
                  v-model.number="form.score"
                  type="range"
                  min="0"
                  max="100"
                  :disabled="activeItem.metrics?.is_cleared"
                  class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-rose-600 dark:bg-slate-800"
                />
                <input
                  v-model.number="form.score"
                  type="number"
                  min="0"
                  max="100"
                  required
                  :disabled="activeItem.metrics?.is_cleared"
                  class="w-20 rounded-xl border border-slate-200 bg-white p-2 text-center font-mono text-sm font-bold text-slate-900 focus:border-rose-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <!-- Written Assessment -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Evaluation Remarks & Comments
              </label>
              <textarea
                v-model.trim="form.remarks"
                rows="4"
                required
                :disabled="activeItem.metrics?.is_cleared"
                placeholder="Enter formal academic assessment regarding student logbook technical quality, consistency, and defense readiness..."
                class="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <!-- Digital Signature Stamp -->
            <div v-if="!activeItem.metrics?.is_cleared" class="space-y-1.5">
              <label class="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Institutional Stamp Signature
              </label>
              <div class="relative">
                <FileSignature class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  v-model.trim="form.signature"
                  type="text"
                  placeholder="Type Full Name / Designation Stamp (e.g. Dr. A. Adebayo)"
                  class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-rose-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <p class="text-[10px] text-slate-400">
                This identifier will be digitally encoded into the cryptographic verification hash of the student's Form ITF-08.
              </p>
            </div>
          </form>

          <!-- Drawer Footer -->
          <div class="border-t border-slate-100 p-6 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              class="w-1/3 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="showModal = false"
            >
              Cancel
            </button>
            <button
              v-if="!activeItem.metrics?.is_cleared"
              type="submit"
              form="gradingForm"
              :disabled="isSubmitting"
              class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/25 transition hover:bg-rose-500 disabled:opacity-50"
            >
              <Award class="h-4 w-4" />
              <span>{{ isSubmitting ? 'Signing Document...' : 'Endorse & Sign Clearance' }}</span>
            </button>
            <div v-else class="flex-1 text-center py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Clearance Form Signed & Certified
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  ShieldCheck,
  RefreshCw,
  Users,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Award,
  FileSignature,
  X,
  Loader2
} from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'coordinator' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const isSubmitting = ref(false)
const candidates = ref<any[]>([])
const showModal = ref(false)
const activeItem = ref<any | null>(null)

const form = reactive({
  score: 80,
  remarks: '',
  signature: ''
})

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const pendingCount = computed(() => {
  return candidates.value.filter((c) => !c.metrics?.is_cleared).length
})

const clearedCount = computed(() => {
  return candidates.value.filter((c) => c.metrics?.is_cleared).length
})

const getInitials = (name?: string) => {
  if (!name) return 'TR'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const fetchCandidates = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/coordinator/dashboard`, {
      headers: getHeaders(),
      withCredentials: true
    })
    candidates.value = (res.data.data.students || []).filter((s: any) => s.metrics?.is_ready_for_clearance)
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Clearance Candidates')
  } finally {
    isLoading.value = false
  }
}

const openGrading = (item: any) => {
  activeItem.value = item
  form.score = item.clearance?.coordinator_score ?? 80
  form.remarks = item.clearance?.coordinator_remarks ?? ''
  form.signature = item.clearance?.coordinator_signature ?? ''
  showModal.value = true
}

const submitAssessment = async () => {
  if (!activeItem.value) return
  isSubmitting.value = true

  try {
    await axios.post(
      `${apiBase}/api/coordinator/placements/${activeItem.value.id}/assess`,
      {
        score: form.score,
        remarks: form.remarks,
        signature_stamp: form.signature
      },
      { headers: getHeaders(), withCredentials: true }
    )

    toast.success('Clearance Endorsed', 'Logbook certified. Student can now download their dossier and request ITF validation.')
    showModal.value = false
    await fetchCandidates()
  } catch (err: unknown) {
    toast.error(err, 'Evaluation Submission Failed')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchCandidates()
})
</script>