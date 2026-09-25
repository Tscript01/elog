<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 sm:p-8">
      <div class="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      <div class="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-rose-700 uppercase dark:bg-rose-950/50 dark:text-rose-300">
              <Users class="h-3 w-3" />
              Academic Supervision
            </span>
            <span class="text-slate-300 dark:text-slate-700">&bull;</span>
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Department Roster</span>
          </div>
          <h1 class="mt-2 text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Supervised Trainees Dashboard
          </h1>
          <p class="mt-1 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
            Monitor daily activities, verify weekly industrial endorsements, and track clearance progress for students under your institutional supervision.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 sm:self-auto dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          @click="fetchData"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin text-rose-600' : '']" />
          <span>Refresh Data</span>
        </button>
      </div>

      <!-- KPI Summary Cards -->
      <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div class="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-950/40">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <GraduationCap class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Trainees</p>
            <p class="text-xl font-black text-slate-900 dark:text-white">{{ stats.total }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 rounded-2xl border border-rose-100 bg-rose-50/40 p-4 dark:border-rose-950/30 dark:bg-rose-950/20">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400">
            <Activity class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-rose-600/80 dark:text-rose-400">Active Logging</p>
            <p class="text-xl font-black text-rose-700 dark:text-rose-300">{{ stats.active }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-950/30 dark:bg-emerald-950/20">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400">Cleared for Defense</p>
            <p class="text-xl font-black text-emerald-700 dark:text-emerald-300">{{ stats.cleared }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 dark:border-amber-950/30 dark:bg-amber-950/20">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 dark:text-amber-400">
            <AlertCircle class="h-5 w-5" />
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-amber-600/80 dark:text-amber-400">Pending Review</p>
            <p class="text-xl font-black text-amber-700 dark:text-amber-300">{{ stats.pending }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model.trim="searchQuery"
          type="text"
          placeholder="Search by student name, matric no, or firm..."
          class="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 shadow-2xs transition focus:border-rose-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="statusFilter"
          class="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-rose-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="ALL">All Statuses</option>
          <option value="CLEARED">Cleared</option>
          <option value="ACTIVE">In Progress</option>
        </select>
      </div>
    </div>

    <!-- Main Table Container -->
    <div class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800/80 dark:bg-slate-900">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 class="h-7 w-7 animate-spin text-rose-600" />
        <p class="mt-3 text-xs font-medium">Loading trainees directory...</p>
      </div>

      <div v-else-if="filteredStudents.length === 0" class="py-20 text-center">
        <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <Users class="h-7 w-7 text-slate-400" />
        </div>
        <h3 class="mt-4 text-sm font-bold text-slate-900 dark:text-white">No Trainees Found</h3>
        <p class="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          No students match your filter criteria or have been assigned to your supervision desk.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
              <th class="px-6 py-4">Trainee Candidate</th>
              <th class="px-6 py-4">Host Firm & Placement</th>
              <th class="px-6 py-4">Industry Supervisor</th>
              <th class="px-6 py-4">Progress Metric</th>
              <th class="px-6 py-4">Clearance</th>
              <th class="px-6 py-4 text-right">Audit Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr
              v-for="item in filteredStudents"
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
                    <p class="font-mono text-[11px] text-slate-400">{{ item.student?.matric_no || 'Unassigned Matric' }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800 dark:text-slate-200">{{ item.company_name }}</p>
                <p class="text-[11px] text-slate-400 truncate max-w-xs">{{ item.company_address || 'Address unrecorded' }}</p>
              </td>

              <td class="px-6 py-4">
                <p class="font-medium text-slate-700 dark:text-slate-300">{{ item.ind_supervisor?.name || 'Assigned Supervisor' }}</p>
                <p class="text-[11px] text-slate-400 truncate max-w-xs">{{ item.ind_supervisor?.email }}</p>
              </td>

              <td class="px-6 py-4 min-w-[140px]">
                <div class="flex items-center justify-between text-[11px] font-semibold mb-1">
                  <span class="text-slate-700 dark:text-slate-300">{{ item.metrics?.approved_weeks }} / {{ item.metrics?.total_weeks }} wks</span>
                  <span class="text-rose-600 dark:text-rose-400 font-mono">{{ calculatePercent(item.metrics?.approved_weeks, item.metrics?.total_weeks) }}%</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-300"
                    :style="{ width: `${calculatePercent(item.metrics?.approved_weeks, item.metrics?.total_weeks)}%` }"
                  />
                </div>
              </td>

              <td class="px-6 py-4">
                <span
                  v-if="item.metrics?.is_cleared"
                  class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300"
                >
                  <CheckCircle2 class="h-3 w-3" />
                  Cleared
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300"
                >
                  <Clock class="h-3 w-3" />
                  In Progress
                </span>
              </td>

              <td class="px-6 py-4 text-right">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  @click="openInspectModal(item.id)"
                >
                  <Eye class="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                  <span>Inspect Logs</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Slide-over Drawer for Logbook Audit -->
    <div
      v-if="inspectModalOpen && activeLogbook"
      class="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click.self="inspectModalOpen = false"
    >
      <div class="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="w-screen max-w-2xl border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <!-- Drawer Header -->
          <div class="border-b border-slate-100 p-6 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <span class="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 uppercase dark:bg-rose-950/50 dark:text-rose-300">
                Logbook Inspection
              </span>
              <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                @click="inspectModalOpen = false"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <h2 class="mt-3 text-lg font-black text-slate-900 dark:text-white">
              {{ activeLogbook.student?.name }}
            </h2>
            <div class="mt-1 flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{{ activeLogbook.student?.matric_no }}</span>
              <span>&bull;</span>
              <span>{{ activeLogbook.company_name }}</span>
            </div>
          </div>

          <!-- Drawer Content: Chronological Weekly Entries -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div
              v-if="activeLogbook.weekly_submissions?.length === 0"
              class="py-12 text-center text-xs text-slate-400"
            >
              No weekly submissions recorded for this trainee yet.
            </div>

            <div
              v-for="week in activeLogbook.weekly_submissions"
              :key="week.id"
              class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition dark:border-slate-800/80 dark:bg-slate-950/40"
            >
              <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div class="flex items-center gap-2">
                  <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600 text-[10px] font-bold text-white">
                    W{{ week.week_no }}
                  </span>
                  <span class="text-xs font-bold text-slate-900 dark:text-white">Week {{ week.week_no }} Summary</span>
                </div>
                <span
                  :class="[
                    'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    week.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  ]"
                >
                  {{ week.status }}
                </span>
              </div>

              <!-- Supervisor Remarks Callout -->
              <div class="mt-3 rounded-xl bg-white p-3 border border-slate-100 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Industry Supervisor Remarks</p>
                <p class="italic text-slate-700 dark:text-slate-200">
                  {{ week.supervisor_remarks || 'Pending supervisor endorsement remarks.' }}
                </p>
              </div>

              <!-- Daily Logs Timeline -->
              <div class="mt-3 space-y-2">
                <div
                  v-for="daily in week.daily_logs"
                  :key="daily.id"
                  class="rounded-lg border border-slate-100/80 bg-white/70 p-2.5 text-xs dark:border-slate-800/60 dark:bg-slate-900/60"
                >
                  <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span class="font-bold text-slate-700 dark:text-slate-300">{{ daily.day_of_week }}</span>
                    <span class="font-mono text-[10px]">{{ formatDate(daily.log_date) }}</span>
                  </div>
                  <p class="mt-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {{ daily.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div class="border-t border-slate-100 p-6 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="inspectModalOpen = false"
            >
              Close Dossier
            </button>
          </div>
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
  Activity,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  RefreshCw,
  Search,
  Eye,
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
const students = ref<any[]>([])
const searchQuery = ref('')
const statusFilter = ref('ALL')
const inspectModalOpen = ref(false)
const activeLogbook = ref<any | null>(null)

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const stats = computed(() => {
  const total = students.value.length
  const cleared = students.value.filter((s) => s.metrics?.is_cleared).length
  const active = total - cleared
  const pending = students.value.filter((s) => s.metrics?.is_ready_for_clearance && !s.metrics?.is_cleared).length

  return { total, active, cleared, pending }
})

const filteredStudents = computed(() => {
  return students.value.filter((item) => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch =
      item.student?.name?.toLowerCase().includes(q) ||
      item.student?.matric_no?.toLowerCase().includes(q) ||
      item.company_name?.toLowerCase().includes(q)

    const matchesStatus =
      statusFilter.value === 'ALL' ||
      (statusFilter.value === 'CLEARED' && item.metrics?.is_cleared) ||
      (statusFilter.value === 'ACTIVE' && !item.metrics?.is_cleared)

    return matchesSearch && matchesStatus
  })
})

const getInitials = (name?: string) => {
  if (!name) return 'TR'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const calculatePercent = (approved = 0, total = 0) => {
  if (!total || total === 0) return 0
  return Math.round((approved / total) * 100)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/coordinator/dashboard`, {
      headers: getHeaders(),
      withCredentials: true
    })
    students.value = res.data.data.students || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Trainees Roster')
  } finally {
    isLoading.value = false
  }
}

const openInspectModal = async (placementId: string) => {
  try {
    const res = await axios.get(`${apiBase}/api/coordinator/placements/${placementId}/logbook`, {
      headers: getHeaders(),
      withCredentials: true
    })
    activeLogbook.value = res.data.data
    inspectModalOpen.value = true
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Logbook Details')
  }
}

onMounted(() => {
  fetchData()
})
</script>