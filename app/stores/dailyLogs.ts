import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRuntimeConfig } from '#app'
import { useAuthStore } from './auth'
import { useUiStore } from './ui'

export interface LogRecord {
  id: string
  placement_id: string
  week_no: number
  log_date: string
  description: string
  image_url?: string | null
  status?: 'APPROVED' | 'PENDING' | 'DECLINED' | 'DRAFT'
  created_at?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface FetchLogsParams {
  week?: number
  month?: number
  year?: number
  page?: number
  limit?: number
}

export const useDailyLogsStore = defineStore('dailyLogs', () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBaseUrl as string) || ''
  const cloudinaryCloudName = (config.public.cloudinaryCloudName as string) || ''
  const  cloudinaryUploadPreset = (config.public.cloudinaryUploadPreset as string) || ''

  const authStore = useAuthStore()
  const uiStore = useUiStore()

  const logs = ref<LogRecord[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const logsByWeek = computed(() => {
    return (weekNo: number) => logs.value.filter((log) => log.week_no === weekNo)
  })

  const getHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
    'Content-Type': 'application/json'
  })

  const fetchLogs = async (params: FetchLogsParams = {}) => {
    if (!authStore.token) return
    isLoading.value = true
    error.value = null

    try {
      const res = await axios.get<{ pagination: PaginationMeta; data: LogRecord[] }>(
        `${apiBase}/api/logs`,
        {
          headers: { Authorization: `Bearer ${authStore.token}` },
          params,
          withCredentials: true
        }
      )

      logs.value = Array.isArray(res.data?.data) ? res.data.data : []
      pagination.value = res.data?.pagination || null
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      error.value = axiosErr.response?.data?.message || axiosErr.message || 'Failed to fetch logs'
      logs.value = []
      pagination.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Inside stores/dailyLogs.ts

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const config = useRuntimeConfig();

  // Cloudinary credentials from runtimeConfig.public or fallback strings
  const cloudName = (config.public.cloudinaryCloudName as string) || '';
  const uploadPreset = (config.public.cloudinaryUploadPreset as string) || '';

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing. Ensure cloud_name and upload_preset are defined.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const res = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      {
       
        headers: {},
      }
    );

    return res.data.secure_url;
  } catch (err: any) {
    const cloudinaryMsg = err.response?.data?.error?.message;
    console.error('Cloudinary API Error:', err.response?.data);

    if (cloudinaryMsg) {
      throw new Error(`Cloudinary Error: ${cloudinaryMsg}`);
    }

    throw new Error('Failed to upload image attachment to media server.');
  }
};

  const createLog = async (payload: {
    log_date: string
    week_no: number
    description: string
    image_url?: string
  }) => {
    if (!authStore.token) throw new Error('Unauthenticated')
    isSubmitting.value = true
    error.value = null

    try {
      const res = await axios.post<{ message: string; log: LogRecord }>(
        `${apiBase}/api/logs`,
        payload,
        {
          headers: getHeaders(),
          withCredentials: true
        }
      )

      await fetchLogs({ week: payload.week_no })
      await uiStore.fetchCounters()

      return res.data
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      const message = axiosErr.response?.data?.message || axiosErr.response?.data?.error || axiosErr.message || 'Failed to submit log entry'
      error.value = message
      throw new Error(message)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    logs,
    pagination,
    isLoading,
    isSubmitting,
    error,
    logsByWeek,
    fetchLogs,
    uploadImageToCloudinary,
    createLog
  }
})