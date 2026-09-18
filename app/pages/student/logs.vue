<template>
  <div class="space-y-8">
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="border-b border-slate-200 pb-4 text-center dark:border-slate-800">
        <span class="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Form ITF / SIWES-08
        </span>
        <h2 class="mt-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Students Industrial Work Experience Scheme - Daily Record of Activities
        </h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official Electronic Logbook Entry
        </p>
      </div>

      <div
        v-if="feedbackMessage"
        :class="[
          'mt-4 flex items-center gap-2 rounded-lg p-3.5 text-xs',
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
        class="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
      >
        <AlertCircle class="h-4 w-4 shrink-0" />
        <span>{{ dateError }}</span>
      </div>

      <form class="mt-6 space-y-6" @submit.prevent="submitLog">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label for="log-week" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Training Week (1 - {{ maxWeeks }})
            </label>
            <select
              id="log-week"
              v-model.number="selectedWeek"
              required
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              @change="onWeekOrDayChanged"
            >
              <option v-for="w in maxWeeks" :key="w" :value="w">
                Week {{ w }}
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
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              @change="onWeekOrDayChanged"
            >
              <option v-for="day in availableDays" :key="day" :value="day">
                {{ day }}
              </option>
            </select>
          </div>

          <div>
            <label for="log-date" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Date of Entry
            </label>
            <input
              id="log-date"
              v-model="formDate"
              type="date"
              required
              :min="minDateString"
              :max="maxDateString"
              class="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-2xs focus:border-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              @change="onDateManualInput"
            />
          </div>
        </div>

        <div>
          <label for="log-description" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Description of Work Done
          </label>
          <div class="mt-2 overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
            <textarea
              id="log-description"
              v-model="description"
              rows="7"
              required
              placeholder="Record technical tasks performed on this date..."
              class="block w-full resize-y bg-white p-3 text-sm text-slate-900 focus:outline-hidden dark:bg-slate-800 dark:text-white"
            ></textarea>
          </div>
        </div>

        <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Attachment (Optional)
            </span>
            <div class="flex rounded-md bg-slate-200 p-0.5 dark:bg-slate-700">
              <button
                type="button"
                :class="[
                  'rounded px-2.5 py-1 text-xs font-medium',
                  attachmentMode === 'url' ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                ]"
                @click="attachmentMode = 'url'"
              >
                Image URL
              </button>
              <button
                type="button"
                :class="[
                  'rounded px-2.5 py-1 text-xs font-medium',
                  attachmentMode === 'file' ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
                ]"
                @click="attachmentMode = 'file'"
              >
                File Upload
              </button>
            </div>
          </div>

          <div v-if="attachmentMode === 'url'" class="mt-3">
            <input
              v-model="imageUrlInput"
              type="url"
              placeholder="https://..."
              class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div v-else class="mt-3">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="block w-full text-xs text-slate-500"
              @change="handleFileChange"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="submit"
            :disabled="isSubmitting || !!dateError"
            class="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600"
          >
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            <span>{{ isSubmitting ? 'Saving...' : 'Submit Daily Log' }}</span>
          </button>
        </div>
      </form>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Logged Activities for Week {{ selectedWeek }}</h3>
      <div v-if="isLoadingLogs" class="py-6 text-center text-xs text-slate-500">Loading...</div>
      <div v-else-if="weekLogs.length === 0" class="py-6 text-center text-xs text-slate-500">No logs for this week.</div>
      <div v-else class="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        <div v-for="item in weekLogs" :key="item.id" class="py-3">
          <div class="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
        <span>{{ formatLogDate(item.log_date) }}</span>
            <span class="uppercase text-slate-500">{{ item.status }}</span>
          </div>
          <p class="mt-1 text-xs text-slate-700 dark:text-slate-300">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRuntimeConfig, useCookie } from '#app'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-vue-next'

definePageMeta({ layout: 'student' })

export interface LogRecord {
  id: string
  placement_id: string
  weekly_submission_id?: string | null
  week_no: number
  status?: 'pending' | 'approved' | 'rejected'
  log_date: string // ISO string from backend (e.g. "2026-06-15T00:00:00.000Z")
  description: string
  image_url?: string | null
  created_timestamp?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface LogsApiResponse {
  pagination: PaginationMeta
  data: LogRecord[]
}

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const cloudinaryCloudName = (config.public.cloudinaryCloudName as string) || ''
const cloudinaryUploadPreset = (config.public.cloudinaryUploadPreset as string) || 'wedparty'

const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const dayOffsets: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5
}

const placementStartDate = ref<string>('')
const placementEndDate = ref<string>('')
const maxWeeks = ref<number>(24)

const selectedWeek = ref<number>(1)
const selectedDay = ref<string>('Monday')
const formDate = ref<string>('')
const description = ref<string>('')
const imageUrlInput = ref<string>('')
const attachmentMode = ref<'url' | 'file'>('url')
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const isSubmitting = ref(false)
const isLoadingLogs = ref(false)
const feedbackMessage = ref('')
const isSuccess = ref(false)
const dateError = ref('')
const allLogs = ref<LogRecord[]>([])

const minDateString = computed(() => placementStartDate.value || undefined)
const maxDateString = computed(() => placementEndDate.value || undefined)
const weekLogs = computed(() => allLogs.value.filter((l) => l.week_no === selectedWeek.value))

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

const getWeekMondayUTC = (date: Date): Date => {
  const copy = new Date(date.getTime())
  const day = copy.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  copy.setUTCDate(copy.getUTCDate() + diff)
  return copy
}

const computeDateFromWeekAndDay = () => {
  dateError.value = ''
  if (!placementStartDate.value) return

  const startUTC = parseDateUTC(placementStartDate.value)
  const baseMonday = getWeekMondayUTC(startUTC)

  const targetDate = new Date(baseMonday.getTime())
  const totalDaysToAdd = (selectedWeek.value - 1) * 7 + (dayOffsets[selectedDay.value] ?? 0)
  targetDate.setUTCDate(targetDate.getUTCDate() + totalDaysToAdd)

  const dateStr = formatUTC(targetDate)

  if (placementEndDate.value && dateStr > placementEndDate.value) {
    dateError.value = 'Calculated date is beyond the placement duration.'
  }

  formDate.value = dateStr
}
const formatLogDate = (dateStr: string | Date): string => {
  if (!dateStr) return ''
  
  // Extract YYYY-MM-DD directly if it's an ISO string to prevent local timezone offsets
  const rawDate = typeof dateStr === 'string' ? (dateStr.split('T')[0] ?? '') : (dateStr.toISOString().split('T')[0] ?? '')
  const [year, month, day] = rawDate.split('-').map(Number)

  const date = new Date(Date.UTC(year!, month! - 1, day!))

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
}

const onWeekOrDayChanged = () => {
  computeDateFromWeekAndDay()
  loadLogs()
}

const onDateManualInput = () => {
  dateError.value = ''
  if (!formDate.value) return

  const inputDate = parseDateUTC(formDate.value)
  const dayOfWeek = inputDate.getUTCDay()

  if (dayOfWeek === 0) {
    dateError.value = 'Entries on Sunday are not permitted.'
    return
  }

  if (placementStartDate.value && formDate.value < placementStartDate.value) {
    dateError.value = `Date cannot precede training start (${placementStartDate.value}).`
    return
  }
  if (placementEndDate.value && formDate.value > placementEndDate.value) {
    dateError.value = `Date exceeds training end date (${placementEndDate.value}).`
    return
  }

  const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  selectedDay.value = daysArr[dayOfWeek]!

  if (placementStartDate.value) {
    const startMonday = getWeekMondayUTC(parseDateUTC(placementStartDate.value))
    const inputMonday = getWeekMondayUTC(inputDate)
    const diffMs = inputMonday.getTime() - startMonday.getTime()
    const computedWeek = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1

    if (computedWeek >= 1 && computedWeek <= maxWeeks.value) {
      selectedWeek.value = computedWeek
    }
  }

  loadLogs()
}

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchPlacementDetails = async () => {
  try {
    const res = await axios.get<{ start_date: string; end_date: string }>(`${apiBase}/placements/current`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
console.log(res);    

    if (res.data?.start_date && res.data?.end_date) {
      placementStartDate.value = res.data.start_date.split('T')[0] ?? ''
      placementEndDate.value = res.data.end_date.split('T')[0] ?? ''

      const start = parseDateUTC(placementStartDate.value)
      const end = parseDateUTC(placementEndDate.value)
      const diffWeeks = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000))
      maxWeeks.value = Math.max(diffWeeks, 1)

      computeDateFromWeekAndDay()
    }
  } catch {
    const today = new Date()
    placementStartDate.value = formatUTC(today)
    placementEndDate.value = formatUTC(new Date(today.getTime() + 168 * 24 * 60 * 60 * 1000))
    computeDateFromWeekAndDay()
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'wedparty') // Use the preset from .env

  const res = await axios.post<{ secure_url: string }>(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    formData
  )
  return res.data.secure_url
}

const loadLogs = async () => {
  isLoadingLogs.value = true
  try {
    const res = await axios.get<LogsApiResponse>(`${apiBase}/logs`, {
      headers: getAuthHeaders(),
      withCredentials: true,
      params: { week: selectedWeek.value }
    })
    
    allLogs.value = Array.isArray(res.data.data) ? res.data.data : []
  } catch {
    allLogs.value = []
  } finally {
    isLoadingLogs.value = false
  }
}

const submitLog = async () => {
  if (dateError.value) return
  isSubmitting.value = true
  feedbackMessage.value = ''

  try {
    let resolvedImageUrl: string | undefined = undefined

    if (attachmentMode.value === 'url' && imageUrlInput.value.trim()) {
      resolvedImageUrl = imageUrlInput.value.trim()
    } else if (attachmentMode.value === 'file' && selectedFile.value) {
      resolvedImageUrl = await uploadToCloudinary(selectedFile.value)
    }

    await axios.post(
      `${apiBase}/logs`,
      {
        log_date: formDate.value,
        week_no: selectedWeek.value,
        description: description.value.trim(),
        ...(resolvedImageUrl ? { image_url: resolvedImageUrl } : {})
      },
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )

    isSuccess.value = true
    feedbackMessage.value = 'Entry saved successfully.'
    description.value = ''
    imageUrlInput.value = ''
    selectedFile.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''

    await loadLogs()
  } catch (err: any) {
    isSuccess.value = false
    feedbackMessage.value = err.response?.data?.message || 'Failed to submit log entry.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await fetchPlacementDetails()
  await loadLogs()
})
</script>