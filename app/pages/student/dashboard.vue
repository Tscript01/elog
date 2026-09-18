<template>
  <div class="space-y-8">
    <div class="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">SIWES Student Overview</h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Track industrial attachment progress, supervisor reviews, and log submissions.</p>
      </div>
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/student/placement"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60"
        >
          <Briefcase class="h-4 w-4" />
          <span>Placement Setup</span>
        </NuxtLink>
        <NuxtLink
          to="/student/logs"
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus class="h-4 w-4" />
          <span>Log Today's Activity</span>
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Placement Status</span>
          <span
            :class="[
              'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
              placement?.company_name
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
            ]"
          >
            {{ placement?.company_name ? 'Active' : 'Unassigned' }}
          </span>
        </div>
        <div class="mt-3 truncate text-lg font-bold text-slate-900 dark:text-white">
          {{ placement?.company_name || 'No Placement Registered' }}
        </div>
        <div class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
          Supervisor ID: {{ placement?.supervisor_id || 'Pending Assignment' }}
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Weeks Completed</span>
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ weeksCompleted }} / 24</span>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-900 dark:text-white">{{ weeksCompleted }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">of 24 weeks</span>
        </div>
        <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            class="h-full rounded-full bg-slate-900 transition-all duration-300 dark:bg-blue-600"
            :style="{ width: `${Math.min((weeksCompleted / 24) * 100, 100)}%` }"
          />
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 lg:col-span-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pending Reviews</span>
          <Clock class="h-4 w-4 text-amber-500" />
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-3xl font-extrabold text-slate-900 dark:text-white">{{ pendingReviewsCount }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">awaiting review</span>
        </div>
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Daily entries submitted and awaiting supervisor endorsement.
        </p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Recent Daily Log Entries</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Chronological log of activities entered in your SIWES electronic book.</p>
        </div>
        <NuxtLink
          to="/student/logs"
          class="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all logs
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
        Loading recent log records...
      </div>

      <div v-else-if="logs.length === 0" class="p-8 text-center">
        <FileText class="mx-auto h-8 w-8 text-slate-400" />
        <p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">No log entries found</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">You have not submitted any daily logbook entries yet.</p>
        <NuxtLink
          to="/student/logs"
          class="mt-4 inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus class="h-3.5 w-3.5" />
          <span>Write First Entry</span>
        </NuxtLink>
      </div>

      <div v-else class="divide-y divide-slate-200 dark:divide-slate-800">
        <div
          v-for="log in logs"
          :key="log.id"
          class="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
        >
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2.5">
              <span class="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Week {{ log.week }}
              </span>
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                {{ formatDate(log.date) }}
              </span>
              <span
                :class="[
                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  log.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : log.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                ]"
              >
                {{ log.status }}
              </span>
            </div>
            <p class="mt-2 line-clamp-2 text-sm text-slate-700 dark:text-slate-300">
              {{ log.description }}
            </p>
          </div>

          <div v-if="log.image_url" class="shrink-0">
            <a
              :href="log.image_url"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Attachment
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Briefcase, Plus, Clock, FileText } from 'lucide-vue-next'

definePageMeta({
  layout: 'student'
})

interface Placement {
  company_name?: string
  supervisor_id?: string
  start_date?: string
  end_date?: string
}

interface LogEntry {
  id: string | number
  date: string
  week: number
  description: string
  image_url?: string
  status: 'APPROVED' | 'PENDING' | 'DRAFT'
}

const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl || ''

const placement = ref<Placement | null>(null)
const logs = ref<LogEntry[]>([])
const isLoading = ref(true)

const weeksCompleted = computed(() => {
  const uniqueWeeks = new Set(logs.value.map((l) => l.week))
  return uniqueWeeks.size
})

const pendingReviewsCount = computed(() => {
  return logs.value.filter((l) => l.status === 'PENDING').length
})

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

const fetchData = async () => {
  isLoading.value = true
  const token = useCookie<string | null>('auth_token').value
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

  try {
    const placementData = await $fetch<Placement>(`${apiBase}/api/placements/current`, {
      headers
    }).catch(() => null)
    if (placementData) {
      placement.value = placementData
    }

    const logsData = await $fetch<LogEntry[]>(`${apiBase}/api/logs`, {
      headers
    }).catch(() => [])
    if (Array.isArray(logsData)) {
      logs.value = logsData
    }
  } catch {
    placement.value = null
    logs.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
