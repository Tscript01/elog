import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useCookie, navigateTo } from '#app'

interface DecodedToken {
  id?: string
  sub?: string
  name?: string
  email?: string
  matric_no?: string
  role?: string
  [key: string]: unknown
}

export interface UserProfile {
  id: string
  name: string
  email: string
  matric_no: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token')

  const user = ref<UserProfile>({
    id: '',
    name: '',
    email: '',
    matric_no: '',
    role: ''
  })

  const isAuthenticated = computed(() => Boolean(token.value))

  const userInitials = computed(() => {
    const cleanName = (user.value.name || '').trim()
    if (!cleanName) return 'ST'

    const parts = cleanName.split(/\s+/).filter(Boolean)
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return cleanName.slice(0, 2).toUpperCase()
  })

  const initUser = () => {
    if (!token.value) {
      user.value = { id: '', name: '', email: '', matric_no: '', role: '' }
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token.value)
      user.value = {
        id: decoded.id || decoded.sub || '',
        name: decoded.name || 'Student Trainee',
        email: decoded.email || '',
        matric_no: decoded.matric_no || '',
        role: decoded.role || 'STUDENT'
      }
    } catch {
      user.value = {
        id: '',
        name: 'Student Trainee',
        email: '',
        matric_no: '',
        role: ''
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = { id: '', name: '', email: '', matric_no: '', role: '' }
    return navigateTo('/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    userInitials,
    initUser,
    logout
  }
})