<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Weekly Logbook Records
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Official daily activity breakdown according to SIWES/ITF logbook guidelines
        </p>
      </div>

      <div class="flex items-center gap-3">
        <label for="select-week" class="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          Week:
        </label>
        <div class="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            :disabled="currentWeek <= 1"
            class="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
            @click="currentWeek--"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <select
            id="select-week"
            v-model.number="currentWeek"
            class="bg-transparent px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-hidden dark:text-white"
          >
            <option v-for="w in 24" :key="w" :value="w">
              Week {{ w }}
            </option>
          </select>
          <button
            type="button"
            :disabled="currentWeek >= 24"
            class="rounded p-1 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800"
            @click="currentWeek++"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-300 bg-slate-100/75 px-6 py-4 text-center dark:border-slate-800 dark:bg-slate-800/50">
        <span class="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          ITF Form 8
        </span>
        <h2 class="mt-1 text-base font-bold uppercase tracking-wide text-slate-900 dark:text-white sm:text-lg">
          Weekly Progress Chart — Week {{ currentWeek }}
        </h2>
        <div class="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <span>Total Recorded Days: <strong class="text-slate-900 dark:text-white">{{ completedDaysCount }}/6</strong></span>
          <span>Week Endorsement: 
            <strong :class="weeklyStatusClass">{{ weeklyStatus }}</strong>
          </span>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-slate-400">
        <Loader2 class="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
        <span class="mt-2 text-xs">Retrieving Week {{ currentWeek }} records...</span>
      </div>

      <div v-else class="divide-y divide-slate-300 border-b border-slate-300 dark:divide-slate-800 dark:border-slate-800">
        <div
          v-for="day in weekDays"
          :key="day.name"
          class="flex flex-col md:flex-row"
        >
          <div class="flex w-full shrink-0 flex-row items-center justify-between border-b border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 md:w-48 md:flex-col md:items-start md:justify-center md:border-b-0 md:border-r md:border-slate-300 md:dark:border-slate-800">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                {{ day.name }}
              </span>
              <div class="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                {{ getLogForDay(day.name)?.date ? formatDate(getLogForDay(day.name)!.date) : 'No Date Set' }}
              </div>
            </div>

            <div class="mt-0 md:mt-2">
              <span
                v-if="getLogForDay(day.name)"
                class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
              >
                RECORDED
              </span>
              <span v-else class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
                EMPTY
              </span>
            </div>
          </div>

          <div class="relative min-h-[96px] flex-1 bg-[linear-gradient(transparent_31px,#f1f5f9_32px)] bg-[size:100%_32px] p-4 text-xs leading-8 text-slate-800 dark:bg-[linear-gradient(transparent_31px,#1e293b_32px)] dark:text-slate-200">
            <div v-if="getLogForDay(day.name)">
              <p class="whitespace-pre-line">
                {{ getLogForDay(day.name)?.description }}
              </p>

              <div v-if="getLogForDay(day.name)?.image_url" class="mt-3 flex items-center gap-2">
                <Paperclip class="h-3.5 w-3.5 text-slate-400" />
                <a
                  :href="getLogForDay(day.name)?.image_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-medium text-blue-600 underline hover:text-blue-500 dark:text-blue-400"
                >
                  View Attached Technical Diagram
                </a>
              </div>
            </div>

            <div v-else class="flex h-full items-center text-slate-400 italic dark:text-slate-600">
              No entries logged for this day.
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 divide-y divide-slate-300 bg-slate-50/50 dark:divide-slate-800 dark:bg-slate-800/20 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div class="p-5">
          <div class="flex items-center justify-between">
            <span class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Industry Supervisor's Weekly Endorsement
            </span>
            <span :class="['rounded px-2 py-0.5 text-[10px] font-bold uppercase', weeklyBadgeClass]">
              {{ weeklyStatus }}
            </span>
          </div>
          <div class="mt-2 min-h-16 rounded border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            {{ supervisorFeedback || 'Awaiting weekly review and digital sign-off from your assigned industry supervisor.' }}
          </div>
        </div>

        <div class="p-5">
          <span class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Institutional Coordinator's Stamp
          </span>
          <div class="mt-2 flex min-h-16 items-center justify-center rounded border border-dashed border-slate-300 bg-white p-3 text-center text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
            Official University SIWES Unit Electronic Verification Stamp
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import { ChevronLeft, ChevronRight, Loader2, Paperclip } from 'lucide-vue-next'

definePageMeta({
  layout: 'student'
})

interface LogRecord {
  id: string | number
  date: string
  week: number
  description: string
  image_url?: string
  status?: 'APPROVED' | 'PENDING' | 'DECLINED' | 'DRAFT'
  supervisor_remarks?: string
}

const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl || ''

const currentWeek = ref<number>(1)
const isLoading = ref<boolean>(false)
const weekLogs = ref<LogRecord[]>([])
const supervisorFeedback = ref<string>('')

const weekDays = [
  { name: 'Monday' },
  { name: 'Tuesday' },
  { name: 'Wednesday' },
  { name: 'Thursday' },
  { name: 'Friday' },
  { name: 'Saturday' }
]

const getAuthHeaders = (): Record<string, string> => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const parseDayName = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (year && month && day) {
    const d = new Date(year, month - 1, day)
    return d.toLocaleDateString('en-US', { weekday: 'long' })
  }
  return ''
}

const getLogForDay = (dayName: string): LogRecord | undefined => {
  return weekLogs.value.find((log) => parseDayName(log.date).toLowerCase() === dayName.toLowerCase())
}

const completedDaysCount = computed<number>(() => {
  return weekDays.filter((day) => !!getLogForDay(day.name)).length
})

const weeklyStatus = computed<string>(() => {
  if (weekLogs.value.length === 0) return 'NO ENTRIES'
  const firstWithStatus = weekLogs.value.find((l) => l.status)
  return firstWithStatus?.status || 'DRAFT'
})

const weeklyStatusClass = computed<string>(() => {
  switch (weeklyStatus.value) {
    case 'APPROVED':
      return 'text-emerald-600 dark:text-emerald-400'
    case 'PENDING':
      return 'text-amber-600 dark:text-amber-400'
    case 'DECLINED':
      return 'text-rose-600 dark:text-rose-400'
    default:
      return 'text-slate-600 dark:text-slate-400'
  }
})

const weeklyBadgeClass = computed<string>(() => {
  switch (weeklyStatus.value) {
    case 'APPROVED':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
    case 'DECLINED':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
    default:
      return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  }
})

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (year && month && day) {
    return new Date(year, month - 1, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return dateStr
}

const loadWeekData = async () => {
  isLoading.value = true
  supervisorFeedback.value = ''
  try {
    const response = await $fetch<LogRecord[]>(`${apiBase}/api/logs`, {
      headers: getAuthHeaders(),
      query: { week: currentWeek.value }
    })
    weekLogs.value = Array.isArray(response) ? response : []
    const logWithFeedback = weekLogs.value.find((l) => l.supervisor_remarks)
    if (logWithFeedback?.supervisor_remarks) {
      supervisorFeedback.value = logWithFeedback.supervisor_remarks
    }
  } catch {
    weekLogs.value = []
  } finally {
    isLoading.value = false
  }
}

watch(currentWeek, () => {
  loadWeekData()
})

onMounted(() => {
  loadWeekData()
})
</script>