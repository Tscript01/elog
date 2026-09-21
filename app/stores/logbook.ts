import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'
import { useAuthStore } from './auth'

export type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

export interface WeeklySubmissionRecord {
  id: string
  placement_id: string
  week_no: number
  status: SubmissionStatus
  supervisor_remarks?: string | null
  submitted_at?: string | null
  daily_logs: Array<{
    id: string
    log_date: string
    description: string
    image_url?: string | null
  }>
}

export const useLogbookStore = defineStore('logbook', () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBaseUrl as string) || ''
  const authStore = useAuthStore()

  const weeks = ref<WeeklySubmissionRecord[]>([])
  const activeWeek = ref<number>(1)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const setActiveWeek = (weekNo: number) => {
    activeWeek.value = weekNo
  }

  const fetchSubmissions = async () => {
    if (!authStore.token) return
    isLoading.value = true
    error.value = null

    try {
      const res = await axios.get<WeeklySubmissionRecord[]>(`${apiBase}/api/submissions`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        },
        withCredentials: true
      })
      weeks.value = Array.isArray(res.data) ? res.data : []
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Failed to fetch weekly submissions'
      weeks.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    weeks,
    activeWeek,
    isLoading,
    error,
    setActiveWeek,
    fetchSubmissions
  }
})