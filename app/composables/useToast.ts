import { ref } from 'vue'
import axios from 'axios'

export interface ToastItem {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<ToastItem[]>([])

export const useToast = () => {
  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const show = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    duration = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ id, title, message, type })

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  const success = (title: string, message: string, duration = 4000) => {
    return show(title, message, 'success', duration)
  }

  const info = (title: string, message: string, duration = 4000) => {
    return show(title, message, 'info', duration)
  }

  /**
   * Translates raw HTTP codes, database collisions, and technical errors
   * into clean, readable explanations for normal users.
   */
  const error = (err: unknown, fallbackTitle = 'Action Failed', duration = 6000) => {
    if (!axios.isAxiosError(err)) {
      if (err instanceof Error) {
        return show(fallbackTitle, err.message, 'error', duration)
      }
      return show(
        fallbackTitle,
        'An unexpected system error occurred. Please refresh and try again.',
        'error',
        duration
      )
    }

    const status = err.response?.status
    const data = err.response?.data as any
    const backendMsg = data?.error || data?.message || ''
    const backendLower = String(backendMsg).toLowerCase()

    if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
      return show(
        'Connection Timed Out',
        'The server took too long to respond. Please check your internet connection.',
        'error',
        duration
      )
    }

    if (!err.response) {
      return show(
        'Server Unreachable',
        'Cannot establish connection to the SIWES portal. Please verify your network.',
        'error',
        duration
      )
    }

    if (status === 401 || backendLower.includes('invalid credentials') || backendLower.includes('password')) {
      return show(
        'Incorrect Credentials',
        'The email, matriculation number, or password does not match our records.',
        'error',
        duration
      )
    }

    if (status === 403) {
      if (backendLower.includes('roster') || backendLower.includes('not found in the approved')) {
        return show(
          'Matric Number Not Approved',
          'Your matriculation number is not on the departmental whitelist. Please contact your coordinator.',
          'error',
          duration
        )
      }
      return show(
        'Access Denied',
        backendMsg || 'You do not have administrative clearance to access this area.',
        'error',
        duration
      )
    }

    if (status === 404) {
      return show(
        'Record Not Found',
        backendMsg || 'The requested student account or document record could not be found.',
        'error',
        duration
      )
    }

    if (status === 409) {
      const field = backendLower.includes('matric') ? 'Matriculation number' : 'Email address'
      return show(
        'Account Already Exists',
        `${field} is already registered on the portal. Try signing in instead.`,
        'error',
        duration
      )
    }

    if (status === 429) {
      return show(
        'Too Many Attempts',
        'For system security, requests have been temporarily slowed. Please wait a minute.',
        'error',
        duration
      )
    }

    if (status && status >= 500) {
      return show(
        'Portal Maintenance',
        'The SIWES portal services are currently undergoing maintenance. Please retry shortly.',
        'error',
        duration
      )
    }

    return show(
      fallbackTitle,
      backendMsg || 'Could not complete the requested operation. Please verify your entries.',
      'error',
      duration
    )
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    dismiss
  }
}