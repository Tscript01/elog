<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-40 border-b border-purple-100 bg-white/90 backdrop-blur-md dark:border-purple-950/60 dark:bg-slate-900/90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Brand & Context -->
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm shadow-purple-500/30">
            <ShieldAlert class="h-5 w-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-black tracking-tight text-slate-900 dark:text-white">SIWES Portal</span>
              <span class="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
                Admin Console
              </span>
            </div>
            <p class="text-[10px] text-slate-400 font-medium leading-none">Institutional Operations & Logistics Desk</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink
            to="/admin/supervisors"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300"
          >
            Zonal Territories
          </NuxtLink>
          <NuxtLink
            to="/admin/placements"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          >
            All Placements
          </NuxtLink>
          <NuxtLink
            to="/admin/users"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
          >
            Faculty & Trainees
          </NuxtLink>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex flex-col text-right">
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ authStore.user?.name || 'Administrator' }}</span>
            <span class="text-[10px] text-purple-600 dark:text-purple-400 font-mono">Central Directorate</span>
          </div>
          <button
            type="button"
            class="h-9 w-9 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
            @click="logout"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Viewport Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Admin Footer -->
    <footer class="border-t border-slate-200 bg-white py-4 dark:border-slate-800 dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>SIWES Electronic Directorate &bull; Form ITF-08 Audit Controls</span>
        <span>Secure Session &bull; Role Authorization: ADMIN</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from '#app'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  if (authStore.logout) {
    await authStore.logout()
  }
  router.push('/login')
}
</script>