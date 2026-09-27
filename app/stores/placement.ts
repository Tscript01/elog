import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRuntimeConfig, useCookie } from '#app'
import { useAuthStore } from './auth'

export interface PlacementData {
  id?: string
  student_id?: string
  company_name: string
  state: string
  city: string
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
  ind_supervisor?: { id?: string; name?: string; email?: string } | null
  inst_coordinator?: { id?: string; name?: string; email?: string } | null
  [key: string]: any
}

export interface SavePlacementPayload {
  company_name: string
  state: string
  city: string
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

  const hasPlacement = computed(() => Boolean(placement.value?.id || placement.value?.company_name))

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
      placement.value.start_date
    if (!timestamp) return true
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    return Date.now() - new Date(timestamp).getTime() <= thirtyDaysMs
  })

  const getHeaders = () => {
    const token = authStore.token || useCookie<string | null>('auth_token').value || null
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const normalizePlacement = (rawData: any): PlacementData | null => {
    if (!rawData) return null
    const target = rawData.placement || rawData.data || rawData
    if (!target || typeof target !== 'object') return null
    if (!target.id && !target.company_name) return null

    return {
      ...target,
      company_name: target.company_name || '',
      state: target.state || '',
      city: target.city || '',
      company_address: target.company_address || null,
      company_email: target.company_email || null,
      company_contact: target.company_contact || null,
      ind_supervisor_name: target.ind_supervisor_name || target.ind_supervisor?.name || null,
      ind_supervisor_email: target.ind_supervisor_email || target.supervisor_email || target.ind_supervisor?.email || null,
      start_date: target.start_date ? target.start_date.split('T')[0] : '',
      end_date: target.end_date ? target.end_date.split('T')[0] : ''
    }
  }

  const resetState = () => {
    placement.value = null
    isLoading.value = false
    error.value = null
  }

  const fetchPlacement = async () => {
    const token = authStore.token || useCookie<string | null>('auth_token').value
    if (!token) return null

    isLoading.value = true
    error.value = null

    try {
      const res = await axios.get(`${apiBase}/api/placements/current`, {
        headers: getHeaders(),
        params: { _t: Date.now() },
        withCredentials: true
      })

      placement.value = normalizePlacement(res.data)
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
    const token = authStore.token || useCookie<string | null>('auth_token').value
    if (!token) throw new Error('Unauthenticated: No active session')

    isLoading.value = true
    error.value = null

    const companyName = String(payload.company_name || '').trim()
    const stateVal = String(payload.state || '').trim()
    const cityVal = String(payload.city || '').trim()

    if (!companyName || !stateVal || !cityVal || !payload.start_date || !payload.end_date) {
      isLoading.value = false
      throw new Error('Company name, state, town/city, start date, and end date are mandatory')
    }

    if (!placement.value?.id) {
      await fetchPlacement()
    }

    const cleanedPayload = {
      company_name: companyName,
      state: stateVal,
      city: cityVal,
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
      const existingId = placement.value?.id

      if (existingId) {
        res = await axios.put(`${apiBase}/api/placements/${existingId}`, cleanedPayload, {
          headers: getHeaders(),
          withCredentials: true
        })
      } else {
        res = await axios.post(`${apiBase}/api/placements`, cleanedPayload, {
          headers: getHeaders(),
          withCredentials: true
        })
      }

      const updated = normalizePlacement(res.data)
      placement.value = updated
      return updated
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