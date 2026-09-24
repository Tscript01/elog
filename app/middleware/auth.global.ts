import { jwtDecode } from 'jwt-decode'

interface AuthJwtPayload {
  role?: string
  exp?: number
  [key: string]: unknown
}

export default defineNuxtRouteMiddleware((to) => {
  // Allow public access to login and register pages immediately
  const isPublicRoute = to.path === '/login' || to.path === '/register' || to.path === '/forgot-password' || to.path === '/reset-password'
  if (isPublicRoute) {
    return
  }

  const tokenCookie = useCookie<string | null>('auth_token')
  const token = tokenCookie.value

  const redirectCookie = useCookie<string | null>('redirect_after_login', {
    maxAge: 600,
    path: '/',
    sameSite: 'lax'
  })

  // Role landing route mapping
  const roleLandingRoutes: Record<string, string> = {
    student: '/student/dashboard', 
    supervisor: '/supervisor/dashboard',
    coordinator: '/coordinator/dashboard',
    admin: '/admin/dashboard'
  }

  // 1. Handle missing token for protected routes
  if (!token) {
    redirectCookie.value = to.fullPath
    return navigateTo('/login')
  }

  // 2. Decode token and verify expiration
  let rawRole: string | null = null
  let isExpired = false

  try {
    const decoded = jwtDecode<AuthJwtPayload>(token)
    const currentTime = Date.now() / 1000

    if (!decoded.exp || decoded.exp <= currentTime) {
      isExpired = true
    } else {
      rawRole = decoded.role ? String(decoded.role).toLowerCase() : null
    }
  } catch {
    isExpired = true
  }

  // 3. Handle expired or malformed tokens
  if (isExpired || !rawRole) {
    tokenCookie.value = null
    redirectCookie.value = to.fullPath
    return navigateTo('/login')
  }

  // Normalize backend role variants
  let role = rawRole
  if (rawRole === 'ind_supervisor' || rawRole === 'is') role = 'supervisor'
  if (rawRole === 'inst_coordinator' || rawRole === 'coordinator') role = 'coordinator'

  const targetLanding = roleLandingRoutes[role] || '/login'

  // 4. Handle root path redirection for authenticated users
  if (to.path === '/') {
    const returnTarget = redirectCookie.value
    redirectCookie.value = null

    if (
      returnTarget &&
      returnTarget !== '/login' &&
      returnTarget !== '/register' &&
      returnTarget !== '/' &&
      returnTarget.startsWith(`/${role}`)
    ) {
      return navigateTo(returnTarget)
    }

    return navigateTo(targetLanding)
  }

  // 5. Restrict cross-role access (prevent students from visiting supervisor pages and vice versa)
  const expectedPrefix = `/${role}`
  if (!to.path.startsWith(expectedPrefix)) {
    return navigateTo(targetLanding)
  }
})