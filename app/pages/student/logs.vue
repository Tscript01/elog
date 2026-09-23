<template>
  <div class="space-y-8">
    <!-- Header Banner -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            Form ITF / SIWES-08
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Official Daily Entry
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Daily Record of Technical Activities
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          State precise technical tasks, equipment operated, methodologies observed, or engineering procedures performed.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
          <CalendarDays class="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Active: Week {{ currentActiveWeek }}</span>
        </span>
      </div>
    </div>

    <!-- Week Lock Warning Banner -->
    <div
      v-if="isWeekLocked"
      class="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
    >
      <Lock class="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <p class="font-bold">Week {{ selectedWeek }} Logging Closed</p>
        <p class="mt-0.5 text-[11px] text-amber-800/80 dark:text-amber-300/80">
          Per SIWES regulations, activities can only be submitted during their active calendar period. You are currently in Week {{ currentActiveWeek }}.
        </p>
      </div>
    </div>

    <!-- Feedback Banners -->
    <div
      v-if="feedbackMessage"
      :class="[
        'flex items-center gap-2.5 rounded-xl p-4 text-xs font-medium',
        isSuccess
          ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400'
          : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400'
      ]"
    >
      <CheckCircle2 v-if="isSuccess" class="h-4 w-4 shrink-0" />
      <AlertCircle v-else class="h-4 w-4 shrink-0" />
      <span>{{ feedbackMessage }}</span>
    </div>

    <div
      v-if="dateError"
      class="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      <AlertCircle class="h-4 w-4 shrink-0" />
      <span>{{ dateError }}</span>
    </div>

    <!-- Entry Creation Form Card -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div class="flex items-center gap-2.5 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          <PenTool class="h-4 w-4" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">New Activity Entry</h2>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Select week and day of the week to calculate the date automatically</p>
        </div>
      </div>

      <form class="mt-6 space-y-6" @submit.prevent="submitEntry">
        <!-- Date / Period Selectors -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label for="log-week" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Training Week (Current: Week {{ currentActiveWeek }})
            </label>
            <select
              id="log-week"
              v-model.number="selectedWeek"
              required
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
              @change="onWeekOrDayChanged"
            >
              <option v-for="w in placementStore.maxWeeks" :key="w" :value="w">
                Week {{ w }} {{ w === currentActiveWeek ? '(Current Active)' : (w < currentActiveWeek ? '(Locked - Past)' : '(Upcoming)') }}
              </option>
            </select>
          </div>

          <div>
            <label for="log-day" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Day of the Week (Mon - Sat)
            </label>
            <select
              id="log-day"
              v-model="selectedDay"
              required
              :disabled="isWeekLocked"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
              @change="onWeekOrDayChanged"
            >
              <option v-for="day in availableDays" :key="day" :value="day">
                {{ day }}
              </option>
            </select>
          </div>

          <div>
            <label for="log-date" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Computed Entry Date
            </label>
            <input
              id="log-date"
              v-model="formDate"
              type="date"
              required
              readonly
              :disabled="isWeekLocked"
              class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-mono text-slate-700 shadow-2xs cursor-not-allowed focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
            />
          </div>
        </div>

        <!-- Description Textarea -->
        <div>
          <div class="flex items-center justify-between">
            <label for="log-description" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Detailed Description of Work Done / Experience Gained
            </label>
            <span class="text-[11px] text-slate-400">Technical engineering log format</span>
          </div>
          <div class="mt-2 overflow-hidden rounded-xl border border-slate-300 transition focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 dark:border-slate-700 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500">
            <textarea
              id="log-description"
              v-model="description"
              rows="6"
              required
              :disabled="isWeekLocked"
              placeholder="State precise technical tasks, equipment operated, methodologies observed, or engineering procedures performed on this date..."
              class="block w-full resize-y bg-white p-4 text-sm leading-relaxed text-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-800/80 dark:text-white dark:disabled:bg-slate-800/50 dark:placeholder:text-slate-500"
            ></textarea>
          </div>
        </div>

        <!-- Visual Attachment Section -->
        <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Supporting Visual Attachment (Optional)
              </span>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                Schematic blueprint, circuit diagram, code snippet, or technical apparatus photo.
              </p>
            </div>
            <div class="flex rounded-lg bg-slate-200/80 p-0.5 dark:bg-slate-700">
              <button
                type="button"
                :disabled="isWeekLocked"
                :class="[
                  'rounded-md px-3 py-1 text-xs font-semibold transition',
                  attachmentMode === 'url'
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                ]"
                @click="attachmentMode = 'url'"
              >
                Image URL
              </button>
              <button
                type="button"
                :disabled="isWeekLocked"
                :class="[
                  'rounded-md px-3 py-1 text-xs font-semibold transition',
                  attachmentMode === 'file'
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                ]"
                @click="attachmentMode = 'file'"
              >
                File Upload
              </button>
            </div>
          </div>

          <div v-if="attachmentMode === 'url'" class="mt-3.5">
            <input
              v-model="imageUrlInput"
              type="url"
              :disabled="isWeekLocked"
              placeholder="https://example.com/images/schematic.png"
              class="block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50"
            />
          </div>

          <div v-else class="mt-3.5 space-y-2">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              :disabled="isWeekLocked"
              class="block w-full cursor-pointer text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800 disabled:opacity-50 dark:text-slate-400 dark:file:bg-blue-600 dark:hover:file:bg-blue-500"
              @change="handleFileChange"
            />
            <p v-if="selectedFile" class="text-[11px] text-slate-500 dark:text-slate-400">
              Selected: {{ selectedFile.name }} ({{ (selectedFile.size / 1024).toFixed(1) }} KB)
            </p>
          </div>
        </div>

        <!-- Form Submit Bar -->
        <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="submit"
            :disabled="dailyLogsStore.isSubmitting || !!dateError || isWeekLocked"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <Loader2 v-if="dailyLogsStore.isSubmitting" class="h-4 w-4 animate-spin" />
            <Lock v-else-if="isWeekLocked" class="h-4 w-4" />
            <Plus v-else class="h-4 w-4" />
            <span>{{ isWeekLocked ? 'Week Locked' : (dailyLogsStore.isSubmitting ? 'Recording Entry...' : 'Submit Daily Log Entry') }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Weekly Recorded Entries Section -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
        <div>
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Logged Activities for Week {{ selectedWeek }}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Review individual daily recordings submitted for supervisor endorsement</p>
        </div>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ currentWeekLogs.length }} of 6 days logged
        </span>
      </div>

      <div v-if="dailyLogsStore.isLoading" class="flex flex-col items-center justify-center py-12 text-slate-400">
        <Loader2 class="h-6 w-6 animate-spin text-blue-600" />
        <p class="mt-2 text-xs">Loading activities for Week {{ selectedWeek }}...</p>
      </div>

      <div v-else-if="currentWeekLogs.length === 0" class="p-10 text-center">
        <FileText class="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">No activities recorded yet</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          You have not recorded any technical activities for Week {{ selectedWeek }}. Use the form above to post an entry.
        </p>
      </div>

      <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="item in currentWeekLogs"
          :key="item.id"
          class="flex flex-col justify-between gap-4 p-5.5 transition hover:bg-slate-50/50 sm:flex-row sm:items-center dark:hover:bg-slate-800/40"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {{ formatDisplayDate(item.log_date) }}
              </span>
              <span
                :class="[
                  'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  item.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : item.status === 'DECLINED' || item.status === 'DRAFT'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                ]"
              >
                {{ item.status || 'PENDING' }}
              </span>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {{ item.description }}
            </p>
          </div>

          <div v-if="item.image_url" class="shrink-0">
            <a
              :href="item.image_url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
            >
              <ExternalLink class="h-3.5 w-3.5" />
              <span>Attachment</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  CalendarDays,
  PenTool,
  Plus,
  FileText,
  ExternalLink,
  Lock
} from 'lucide-vue-next'
import { useDailyLogsStore } from '~/stores/dailyLogs'
import { usePlacementStore } from '~/stores/placement'

definePageMeta({ layout: 'student' })

const dailyLogsStore = useDailyLogsStore()
const placementStore = usePlacementStore()

const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dayOffsets: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5
}

const selectedWeek = ref<number>(1)
const selectedDay = ref<string>('Monday')
const formDate = ref<string>('')
const description = ref<string>('')
const imageUrlInput = ref<string>('')
const attachmentMode = ref<'url' | 'file'>('url')
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const feedbackMessage = ref('')
const isSuccess = ref(false)
const dateError = ref('')

const placementStartDate = computed(() => placementStore.placement?.start_date?.split('T')[0] || undefined)
const placementEndDate = computed(() => placementStore.placement?.end_date?.split('T')[0] || undefined)
const currentWeekLogs = computed(() => dailyLogsStore.logsByWeek(selectedWeek.value))

const parseDateUTC = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y!, m! - 1, d))
}

const formatUTC = (date: Date): string => {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const formatDisplayDate = (dateStr: string): string => {
  const raw = dateStr.split('T')[0] ?? ''
  const [y, m, d] = raw.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y!, m! - 1, d)))
}

// Compute active week relative to placement start date
const currentActiveWeek = computed<number>(() => {
  if (!placementStartDate.value) return 1
  const startUTC = parseDateUTC(placementStartDate.value)
  const now = new Date()
  const diffMs = now.getTime() - startUTC.getTime()
  if (diffMs < 0) return 1
  const computedWeek = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.min(Math.max(computedWeek, 1), placementStore.maxWeeks || 24)
})

const isWeekLocked = computed<boolean>(() => {
  return selectedWeek.value !== currentActiveWeek.value
})

const computeDateFromWeekAndDay = () => {
  dateError.value = ''
  if (!placementStartDate.value) return

  const startUTC = parseDateUTC(placementStartDate.value)
  const targetDate = new Date(startUTC.getTime())
  const daysToAdd = (selectedWeek.value - 1) * 7 + (dayOffsets[selectedDay.value] ?? 0)
  targetDate.setUTCDate(targetDate.getUTCDate() + daysToAdd)

  const dateStr = formatUTC(targetDate)

  if (placementEndDate.value && dateStr > placementEndDate.value) {
    dateError.value = 'Calculated date exceeds the placement end date.'
  }

  formDate.value = dateStr
}

const onWeekOrDayChanged = () => {
  computeDateFromWeekAndDay()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

const submitEntry = async () => {
  if (isWeekLocked.value) {
    feedbackMessage.value = `You can only record logs for Week ${currentActiveWeek.value}.`
    isSuccess.value = false
    return
  }

  if (dateError.value) return
  feedbackMessage.value = ''

  try {
    let finalImageUrl: string | undefined = undefined

    if (attachmentMode.value === 'url' && imageUrlInput.value.trim()) {
      finalImageUrl = imageUrlInput.value.trim()
    } else if (attachmentMode.value === 'file' && selectedFile.value) {
      finalImageUrl = await dailyLogsStore.uploadImageToCloudinary(selectedFile.value)
    }

    await dailyLogsStore.createLog({
      log_date: formDate.value,
      week_no: selectedWeek.value,
      description: description.value.trim(),
      ...(finalImageUrl ? { image_url: finalImageUrl } : {})
    })

    isSuccess.value = true
    feedbackMessage.value = 'Daily log entry recorded successfully.'
    description.value = ''
    imageUrlInput.value = ''
    selectedFile.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
  } catch (err: any) {
    isSuccess.value = false
    feedbackMessage.value = err.message || 'Failed to submit log entry.'
  }
}

onMounted(async () => {
  if (!placementStore.placement) {
    await placementStore.fetchPlacement()
  }

  // Set selected week to current active week and default day selection to Monday
  selectedWeek.value = currentActiveWeek.value
  selectedDay.value = 'Monday'

  // Derive the initial formDate based on Week & Day selection
  computeDateFromWeekAndDay()

  if (dailyLogsStore.logs.length === 0) {
    await dailyLogsStore.fetchLogs({ limit: 150 })
  }
})
</script>