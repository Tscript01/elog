<template>
  <div class="space-y-8">
    <!-- Top Welcome Header -->
    <div class="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            Form ITF / SIWES-08
          </span>
          <span class="text-xs text-slate-400">•</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {{ currentDateDisplay }}
          </span>
        </div>
        <h2 class="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Welcome back, {{ studentFirstName }}
        </h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Supervise your industrial training milestones, logbook sign-offs, and compliance records.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <NuxtLink
          to="/student/placement"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60"
        >
          <Building2 class="h-4 w-4" />
          <span>Placement Info</span>
        </NuxtLink>
        <NuxtLink
          to="/student/logs"
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus class="h-4 w-4" />
          <span>Record Activity</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Metric Cards Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Training Progress</span>
          <CalendarDays class="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900 dark:text-white">{{ activeWeeksCount }}</span>
          <span class="text-xs font-semibold text-slate-400">/ {{ placementStore.maxWeeks }} Weeks</span>
        </div>
        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            class="h-full rounded-full bg-blue-600 transition-all duration-500"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
        <div class="mt-2 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{{ progressPercentage }}% Completed</span>
          <span>{{ placementStore.maxWeeks - activeWeeksCount }} remaining</span>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Logged Entries</span>
          <CheckCircle2 class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900 dark:text-white">{{ dailyLogsStore.logs.length }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">days logged</span>
        </div>
        <div class="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 class="h-3.5 w-3.5" />
          <span>{{ approvedCount }} approved by supervisor</span>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Reviews</span>
          <Clock class="h-4 w-4 text-amber-500" />
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900 dark:text-white">{{ pendingCount }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">awaiting review</span>
        </div>
        <p class="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          {{ pendingCount > 0 ? 'Requires industry supervisor endorsement.' : 'All logged entries up to date.' }}
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Approval Rate</span>
          <ShieldAlert v-if="rejectedCount > 0" class="h-4 w-4 text-rose-500" />
          <Award v-else class="h-4 w-4 text-indigo-500" />
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-black text-slate-900 dark:text-white">{{ approvalRate }}%</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">fidelity</span>
        </div>
        <div class="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>{{ approvedCount }} Approved</span>
          <span :class="rejectedCount > 0 ? 'font-bold text-rose-600 dark:text-rose-400' : ''">
            {{ rejectedCount }} Declined
          </span>
        </div>
      </div>
    </div>

    <!-- Main Overview Layout: 2 Columns on Desktop -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left Column: Activity Feed -->
      <div class="space-y-6 lg:col-span-2">
        <div class="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Recent Daily Log Entries</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Latest recorded technical tasks and practical work.</p>
            </div>
            <NuxtLink
              to="/student/logs"
              class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <span>View full logbook</span>
              <ArrowUpRight class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>

          <div v-if="dailyLogsStore.isLoading" class="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 class="h-6 w-6 animate-spin text-blue-600" />
            <p class="mt-2 text-xs">Retrieving activities from database...</p>
          </div>

          <div v-else-if="recentLogs.length === 0" class="p-10 text-center">
            <FileText class="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">No activity records found</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">You have not posted any technical entries for this placement yet.</p>
            <NuxtLink
              to="/student/logs"
              class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Plus class="h-3.5 w-3.5" />
              <span>Record First Day Entry</span>
            </NuxtLink>
          </div>

          <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="log in recentLogs"
              :key="log.id"
              class="flex flex-col justify-between gap-3 p-5 transition hover:bg-slate-50/50 sm:flex-row sm:items-center dark:hover:bg-slate-800/40"
            >
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Week {{ log.week_no }}
                  </span>
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {{ formatDisplayDate(log.log_date) }}
                  </span>
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                      log.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : log.status === 'DECLINED' || log.status === 'DRAFT'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                    ]"
                  >
                    {{ log.status || 'PENDING' }}
                  </span>
                </div>
                <p class="mt-2 line-clamp-2 text-xs leading-5 text-slate-700 dark:text-slate-300">
                  {{ log.description }}
                </p>
              </div>

              <div v-if="log.image_url" class="shrink-0">
                <a
                  :href="log.image_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
                >
                  <ExternalLink class="h-3 w-3" />
                  <span>Diagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Shortcut Actions -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NuxtLink
            to="/student/submissions"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <BookOpenCheck class="h-5 w-5" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                Weekly Sign-off Sheets
              </h4>
              <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Review bundled 6-day work weeks, sign-off stamps, and ITF coordinator remarks.
              </p>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/student/feedback"
            class="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <MessageSquareQuote class="h-5 w-5" />
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                Supervisor Evaluations
              </h4>
              <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                View weekly assessments, technical critiques, and progress grading notes.
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Right Column: Placement Info Card & Institutional Compliance -->
      <div class="space-y-6">
        <!-- Placement Status Card -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Attachment Profile</span>
            <span
              :class="[
                'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                placementStore.hasPlacement
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
              ]"
            >
              {{ placementStore.hasPlacement ? 'Active' : 'Unregistered' }}
            </span>
          </div>

          <div class="mt-4">
            <h4 class="text-sm font-extrabold text-slate-900 dark:text-white">
              {{ placementStore.placement?.company_name || 'No Placement Configured' }}
            </h4>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {{ placementStore.placement?.company_address || 'Physical address pending entry.' }}
            </p>
          </div>

          <div class="mt-4 space-y-3 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
            <div>
              <span class="block text-[10px] font-semibold uppercase text-slate-400">Duration Period</span>
              <p class="font-medium text-slate-700 dark:text-slate-300">
                {{ formatPlacementDuration }}
              </p>
            </div>

            <div>
              <span class="block text-[10px] font-semibold uppercase text-slate-400">Industry Supervisor</span>
              <p class="font-medium text-slate-700 dark:text-slate-300">
                {{ placementStore.placement?.supervisor?.name || placementStore.placement?.supervisor_email || 'Not assigned yet' }}
              </p>
            </div>

            <div>
              <span class="block text-[10px] font-semibold uppercase text-slate-400">Institution Coordinator</span>
              <p class="font-medium text-slate-700 dark:text-slate-300">
                {{ placementStore.placement?.coordinator?.name || 'Departmental SIWES Desk' }}
              </p>
            </div>
          </div>

          <div class="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <NuxtLink
              to="/student/placement"
              class="block w-full rounded-lg border border-slate-300 bg-white py-2 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Update Attachment Details
            </NuxtLink>
          </div>
        </div>

        <!-- Compliance / Regulations Card -->
        <div class="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-950/60 dark:bg-blue-950/20">
          <div class="flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <Info class="h-4 w-4 shrink-0" />
            <h4 class="text-xs font-bold uppercase tracking-wider">SIWES Log Rules</h4>
          </div>
          <ul class="mt-3 space-y-2 text-[11px] leading-relaxed text-blue-900/80 dark:text-blue-200/70">
            <li class="flex items-start gap-1.5">
              <span class="font-bold">•</span>
              <span>Sunday logging is restricted under standard scheme guidelines.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="font-bold">•</span>
              <span>All recorded logs are automatically grouped into weekly Form-08 batches for submission.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <span class="font-bold">•</span>
              <span>Placement modifications are locked after 30 days from initial creation.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  Building2,
  Plus,
  Clock,
  CheckCircle2,
  CalendarDays,
  FileText,
  ExternalLink,
  BookOpenCheck,
  MessageSquareQuote,
  ArrowUpRight,
  Info,
  Award,
  ShieldAlert,
  Loader2
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { usePlacementStore } from '~/stores/placement'
import { useDailyLogsStore } from '~/stores/dailyLogs'

definePageMeta({
  layout: 'student'
})

const authStore = useAuthStore()
const placementStore = usePlacementStore()
const dailyLogsStore = useDailyLogsStore()

const studentFirstName = computed(() => {
  const rawName = authStore.user.name || ''
  return rawName.split(' ')[0] || 'Student'
})

const currentDateDisplay = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())
})

const activeWeeksCount = computed(() => {
  const uniqueWeeks = new Set(dailyLogsStore.logs.map((l) => l.week_no))
  return uniqueWeeks.size
})

const progressPercentage = computed(() => {
  const max = placementStore.maxWeeks || 24
  return Math.min(Math.round((activeWeeksCount.value / max) * 100), 100)
})

const approvedCount = computed(() => {
  return dailyLogsStore.logs.filter((l) => l.status === 'APPROVED').length
})

const pendingCount = computed(() => {
  return dailyLogsStore.logs.filter((l) => !l.status || l.status === 'PENDING').length
})

const rejectedCount = computed(() => {
  return dailyLogsStore.logs.filter((l) => l.status === 'DECLINED' || l.status === 'DRAFT').length
})

const approvalRate = computed(() => {
  if (dailyLogsStore.logs.length === 0) return 100
  return Math.round((approvedCount.value / dailyLogsStore.logs.length) * 100)
})

const recentLogs = computed(() => {
  return [...dailyLogsStore.logs]
    .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime())
    .slice(0, 5)
})

const formatPlacementDuration = computed(() => {
  if (!placementStore.placement?.start_date || !placementStore.placement?.end_date) {
    return 'Not set'
  }
  const s = formatDisplayDate(placementStore.placement.start_date)
  const e = formatDisplayDate(placementStore.placement.end_date)
  return `${s} – ${e}`
})

const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const raw = dateStr.split('T')[0] ?? ''
  const [y, m, d] = raw.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y!, m! - 1, d)))
}

onMounted(async () => {
  if (!authStore.user.id) {
    authStore.initUser()
  }

  // Load placement cache once if not loaded
  if (!placementStore.placement) {
    await placementStore.fetchPlacement()
  }

  // Load logs once if not populated
  if (dailyLogsStore.logs.length === 0) {
    await dailyLogsStore.fetchLogs({ limit: 150 })
  }
})
</script>