<template>
  <UiBaseCard
    title="Weekly submissions"
    description="Every week of your industrial training"
    :padded="false"
  >
    <template #actions>
      <div class="flex items-center gap-2">
        <label for="status-filter" class="sr-only">Filter by status</label>
        <select id="status-filter" v-model="statusFilter" class="field-control w-48">
          <option value="ALL">All statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">
            {{ submissionLabel[status] }}
          </option>
        </select>
      </div>
    </template>

    <div v-if="logbook.isLoading" class="flex items-center justify-center py-12 text-xs text-slate-500">
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      <span>Loading weekly submissions...</span>
    </div>

    <div v-else-if="logbook.error" class="p-6 text-center text-xs text-rose-600 dark:text-rose-400">
      {{ logbook.error }}
    </div>

    <div v-else-if="filteredWeeks.length === 0" class="p-8 text-center text-xs text-slate-500">
      No submissions recorded for the selected filter.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse text-left text-sm">
        <caption class="sr-only">
          Submission status for each training week
        </caption>
        <thead>
          <tr
            class="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <th scope="col" class="px-4 py-2.5 font-semibold">Week</th>
            <th scope="col" class="px-4 py-2.5 font-semibold">Period</th>
            <th scope="col" class="px-4 py-2.5 font-semibold">Entries</th>
            <th scope="col" class="px-4 py-2.5 font-semibold">Status</th>
            <th scope="col" class="px-4 py-2.5 text-right font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="week in filteredWeeks"
            :key="week.id || week.week_no"
            class="border-t border-slate-200 dark:border-slate-800"
          >
            <th scope="row" class="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
              Week {{ week.week_no }}
            </th>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
              {{ getPeriodString(week.week_no) }}
            </td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">
              {{ week.daily_logs?.length || 0 }}/6
            </td>
            <td class="px-4 py-3">
              <UiBaseBadge :tone="submissionTone[week.status]" dot>
                {{ submissionLabel[week.status] }}
              </UiBaseBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 transition hover:bg-slate-100 dark:text-blue-400 dark:hover:bg-slate-800"
                @click="openWeek(week.week_no)"
              >
                Open
                <span class="sr-only">week {{ week.week_no }}</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { navigateTo } from '#app'
import { Loader2 } from 'lucide-vue-next'
import { useLogbookStore, type SubmissionStatus } from '~/stores/logbook'
import { usePlacementStore } from '~/stores/placement'

definePageMeta({
  layout: 'student'
})

const logbook = useLogbookStore()
const placementStore = usePlacementStore()

const statuses: SubmissionStatus[] = ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED']
const statusFilter = ref<SubmissionStatus | 'ALL'>('ALL')

const submissionLabel: Record<SubmissionStatus, string> = {
  PENDING: 'In Progress',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Declined'
}

const submissionTone: Record<SubmissionStatus, 'neutral' | 'info' | 'success' | 'danger'> = {
  PENDING: 'neutral',
  SUBMITTED: 'info',
  APPROVED: 'success',
  REJECTED: 'danger'
}

const filteredWeeks = computed(() =>
  logbook.weeks.filter((week) => statusFilter.value === 'ALL' || week.status === statusFilter.value)
)

const parseDateUTC = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const getWeekMondayUTC = (date: Date): Date => {
  const copy = new Date(date.getTime())
  const day = copy.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setUTCDate(copy.getUTCDate() + diff)
  return copy
}

const formatDateShort = (d: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(d)
}

const getPeriodString = (weekNo: number): string => {
  if (!placementStore.placement?.start_date) return `Week ${weekNo}`

  const startDateClean = placementStore.placement.start_date.split('T')[0]
  const baseMonday = getWeekMondayUTC(parseDateUTC(startDateClean))

  const weekStart = new Date(baseMonday.getTime())
  weekStart.setUTCDate(weekStart.getUTCDate() + (weekNo - 1) * 7)

  const weekEnd = new Date(weekStart.getTime())
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 5) // Mon - Sat

  return `${formatDateShort(weekStart)} – ${formatDateShort(weekEnd)}`
}

const openWeek = async (weekNo: number) => {
  logbook.setActiveWeek(weekNo)
  await navigateTo({
    path: '/student/logs',
    query: { week: weekNo }
  })
}

onMounted(async () => {
  if (!placementStore.placement) {
    await placementStore.fetchPlacement()
  }
  await logbook.fetchSubmissions()
})
</script>