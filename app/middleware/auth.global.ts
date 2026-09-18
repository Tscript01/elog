import { jwtDecode } from 'jwt-decode'

interface AuthJwtPayload {
  role?: string
  exp?: number
  [key: string]: unknown
}

export default defineNuxtRouteMiddleware(async(to) => {
  const tokenCookie = useCookie<string | null>('auth_token')
  const redirectCookie = useCookie<string | null>('redirect_after_login', {
    maxAge: 600,
    path: '/',
    sameSite: 'lax'
  })

  const token = tokenCookie.value

  const roleLandingRoutes: Record<string, string> = {
    student: '/student/dashboard',
    supervisor: '/supervisor/dashboard',
    coordinator: '/coordinator/dashboard',
    admin: '/admin/dashboard'
  }

  const isPublicRoute = to.path === '/login' || to.path === '/signup'

  // 1. Unauthenticated handling
  if (!token) {
    if (!isPublicRoute) {
      redirectCookie.value = to.fullPath
      return navigateTo('/login')
    }
    return // Already on a public route; stop navigation
  }

  // 2. Token decoding & expiration verification
  let role: string | null = null
  let isExpired = false

  try {
    const decoded = jwtDecode<AuthJwtPayload>(token)
    const currentTime = Date.now() / 1000

    if (!decoded.exp || decoded.exp <= currentTime) {
      isExpired = true
    } else {
      role = decoded.role ? String(decoded.role).toLowerCase() : null
    }
  } catch {
    isExpired = true
  }

  // 3. Expired or malformed token handling
  if (isExpired || !role) {
    tokenCookie.value = null
    if (!isPublicRoute) {
      redirectCookie.value = to.fullPath
      return navigateTo('/login')
    }
    return // Stop here if already on /login or /signup
  }

  const targetLanding = roleLandingRoutes[role] || '/login'

  // 4. Authenticated user visiting public landing or root
  if (isPublicRoute || to.path === '/') {
    const returnTarget = redirectCookie.value
    redirectCookie.value = null

    // Ensure target isn't public, matches the role, and isn't the current path
    if (
      returnTarget &&
      returnTarget !== '/login' &&
      returnTarget !== '/signup' &&
      returnTarget !== '/' &&
      returnTarget.startsWith(`/${role}`) &&
      to.fullPath !== returnTarget
    ) {
      return navigateTo(returnTarget)
    }

    if (to.path !== targetLanding) {
      return navigateTo(targetLanding)
    }
    return
  }

  // 5. Role path restriction (prevent cross-role access)
  const expectedPrefix = `/${role}`
  if (!to.path.startsWith(expectedPrefix)) {
    if (to.path !== targetLanding) {
      return navigateTo(targetLanding)
    }
    return
  }
})