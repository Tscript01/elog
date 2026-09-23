import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRuntimeConfig, useCookie } from '#app'
import { useAuthStore } from './auth'

export interface PlacementData {
  supervisor: any
  coordinator: any
  id?: string
  student_id?: string
  company_name: string
  company_address?: string | null
  company_email?: string | null
  company_contact?: string | null
  ind_supervisor_name?: string | null
  ind_supervisor_email?: string | null
  supervisor_email?: string | null
  ind_supervisor_id?: string | null
  inst_coordinator_id?: string | null
  start_date: string
  end_date: string
  created_at?: string
  createdAt?: string
  created_timestamp?: string
  ind_supervisor?: { id?: string; name?: string; email?: string }
  inst_coordinator?: { id?: string; name?: string; email?: string }
}

export interface SavePlacementPayload {
  company_name: string
  company_address?: string | null
  company_email?: string | null
  company_contact?: string | null
  ind_supervisor_name?: string | null
  ind_supervisor_email?: string | null
  supervisor_email?: string | null
  start_date: string
  end_date: string
}

export const usePlacementStore = defineStore('placement', () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBaseUrl as string) || ''
  const authStore = useAuthStore()

  const placement = ref<PlacementData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasPlacement = computed(() => Boolean(placement.value?.id))

  const maxWeeks = computed(() => {
    if (!placement.value?.start_date || !placement.value?.end_date) return 24
    const start = new Date(placement.value.start_date.slice(0, 10))
    const end = new Date(placement.value.end_date.slice(0, 10))
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

  const getValidToken = () => {
    return authStore.token || useCookie<string | null>('auth_token').value || null
  }

  const getHeaders = () => {
    const token = getValidToken()
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
const resetState = () => {
  placement.value = null
  isLoading.value = false
  error.value = null
}
  const fetchPlacement = async () => {
    const token = getValidToken()
    if (!token) return

    isLoading.value = true
    error.value = null

    try {
      const res = await axios.get<any>(`${apiBase}/api/placements/current`, {
        headers: getHeaders(),
        withCredentials: true
      })

      // Handles both direct object response and wrapped { placement: ... } responses
      placement.value = res.data?.placement || res.data || null
      return placement.value
    } catch (err: unknown) {
      const axiosErr = err as AxiosError
      if (axiosErr.response?.status === 404) {
        placement.value = null
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const savePlacement = async (payload: SavePlacementPayload) => {
    const token = getValidToken()
    if (!token) throw new Error('Unauthenticated: No active access token')

    isLoading.value = true
    error.value = null

    // Ensure state is fresh before deciding between POST and PUT
    if (!placement.value?.id) {
      await fetchPlacement()
    }

    // Format dates to ISO 8601 strings and normalize empty strings to null
    const cleanedPayload = {
      company_name: payload.company_name.trim(),
      company_address: payload.company_address?.trim() || null,
      company_email: payload.company_email?.trim().toLowerCase() || null,
      company_contact: payload.company_contact?.trim() || null,
      ind_supervisor_name: payload.ind_supervisor_name?.trim() || null,
      ind_supervisor_email:
        payload.ind_supervisor_email?.trim().toLowerCase() ||
        payload.supervisor_email?.trim().toLowerCase() ||
        null,
      supervisor_email:
        payload.supervisor_email?.trim().toLowerCase() ||
        payload.ind_supervisor_email?.trim().toLowerCase() ||
        null,
      start_date: new Date(payload.start_date).toISOString(),
      end_date: new Date(payload.end_date).toISOString()
    }

    try {
      let res

      if (placement.value?.id) {
        res = await axios.put(
          `${apiBase}/api/placements/${placement.value.id}`,
          cleanedPayload,
          {
            headers: getHeaders(),
            withCredentials: true
          }
        )
      } else {
        res = await axios.post(`${apiBase}/api/placements`, cleanedPayload, {
          headers: getHeaders(),
          withCredentials: true
        })
      }

      // Update state directly from response, then re-fetch
      placement.value = res.data?.placement || res.data || null
      await fetchPlacement()
      return placement.value
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>
      const message =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        'Failed to save placement record'

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
    savePlacement,
    resetState
  }
})