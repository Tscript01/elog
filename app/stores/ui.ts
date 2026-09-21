import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useRuntimeConfig } from '#app'
import { useAuthStore } from './auth'

export const useUiStore = defineStore('ui', () => {
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBaseUrl as string) || ''
  const authStore = useAuthStore()

  const isDark = ref<boolean>(false)
  const pendingLogsCount = ref<number>(0)
  const unreadNotificationsCount = ref<number>(0)

  const initTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = saved === 'dark' || (!saved && systemPrefersDark)

      document.documentElement.classList.toggle('dark', isDark.value)
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  const fetchCounters = async () => {
    if (!authStore.token) return

    try {
      const headers = { Authorization: `Bearer ${authStore.token}` }

      const [logsRes, notifRes] = await Promise.all([
        axios.get<{ count: number }>(`${apiBase}/api/logs/pending-count`, {
          headers,
          withCredentials: true
        }),
        axios.get<{ unreadCount: number }>(`${apiBase}/api/notifications/unread-count`, {
          headers,
          withCredentials: true
        })
      ])

      pendingLogsCount.value = logsRes.data?.count ?? 0
      unreadNotificationsCount.value = notifRes.data?.unreadCount ?? 0
    } catch {
      pendingLogsCount.value = 0
      unreadNotificationsCount.value = 0
    }
  }

  return {
    isDark,
    pendingLogsCount,
    unreadNotificationsCount,
    initTheme,
    toggleTheme,
    fetchCounters
  }
})