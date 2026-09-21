import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRuntimeConfig } from '#app'
import { useAuthStore } from './auth'

export interface PlacementData {
  id?: string
  company_name: string
  company_address?: string | null
  company_email?: string | null
  company_contact?: string | null
  supervisor_email?: string | null
  start_date: string
  end_date: string
  created_at?: string
  createdAt?: string
  created_timestamp?: string
  supervisor?: { name?: string; email?: string }
  coordinator?: { name?: string; email?: string }
}

export const usePlacementStore = defineStore('placement', () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBaseUrl as string) || ''
  const authStore = useAuthStore()

  const placement = ref<PlacementData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasPlacement = computed(() => !!placement.value?.id)

  const maxWeeks = computed(() => {
    if (!placement.value?.start_date || !placement.value?.end_date) return 24
    const startDate = placement.value.start_date.slice(0, 10)
    const endDate = placement.value.end_date.slice(0, 10)
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? Math.max(Math.ceil(diffDays / 7), 1) : 24
  })

  const isEditableWithinWindow = computed(() => {
    if (!placement.value) return true
    const timestamp =
      placement.value.created_at ||
      placement.value.createdAt ||
      placement.value.created_timestamp ||
      placement.value.start_date
    if (!timestamp) return true
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    return Date.now() - new Date(timestamp).getTime() <= thirtyDaysMs
  })

  const getHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
    'Content-Type': 'application/json'
  })

  const fetchPlacement = async () => {
    if (!authStore.token) return
    isLoading.value = true
    error.value = null

    try {
      const res = await axios.get<PlacementData>(`${apiBase}/api/placements/current`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        withCredentials: true
      })
      placement.value = res.data
    } catch {
      placement.value = null
    } finally {
      isLoading.value = false
    }
  }

  const savePlacement = async (payload: {
    company_name: string
    company_address: string | null
    company_email: string | null
    company_contact: string | null
    supervisor_email: string
    start_date: string
    end_date: string
  }) => {
    if (!authStore.token) throw new Error('Unauthenticated')
    isLoading.value = true
    error.value = null

    try {
      if (hasPlacement.value && placement.value?.id) {
        await axios.put(`${apiBase}/api/placements/${placement.value.id}`, payload, {
          headers: getHeaders(),
          withCredentials: true
        })
      } else {
        await axios.post(`${apiBase}/api/placements`, payload, {
          headers: getHeaders(),
          withCredentials: true
        })
      }

      await fetchPlacement()
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      const message = axiosErr.response?.data?.message || axiosErr.response?.data?.error || axiosErr.message || 'Failed to save placement'
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  return {
    placement,
    isLoading,
    error,
    hasPlacement,
    maxWeeks,
    isEditableWithinWindow,
    fetchPlacement,
    savePlacement
  }
})