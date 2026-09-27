<template>
  <div class="space-y-8">
    <!-- Header Banner -->
    <div class="flex flex-col justify-between gap-4 border-b border-purple-100 pb-5 dark:border-purple-950/60 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
            Directorate Intelligence
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Operations Center
          </span>
        </div>
        <h1 class="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          SIWES Central Directorate
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Executive performance summary, trainee placement ratios, supervisory distribution, and clearance flows.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-semibold text-purple-700 shadow-2xs transition hover:bg-purple-50 dark:border-purple-900 dark:bg-slate-900 dark:text-purple-300 dark:hover:bg-purple-950/40"
          @click="fetchStats"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin' : '']" />
          <span>Refresh Metrics</span>
        </button>
      </div>
    </div>

    <!-- Metrics Matrix Grid -->
    <div v-if="isLoading" class="py-20 text-center text-xs text-purple-600 dark:text-purple-400">
      <Loader2 class="h-8 w-8 animate-spin mx-auto text-purple-600" />
      <span class="block mt-2 font-medium">Assembling directorate telemetry...</span>
    </div>

    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Total Trainees -->
        <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs dark:border-purple-950/50 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Trainees</span>
            <div class="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/60 dark:text-purple-400">
              <GraduationCap class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ stats.totalStudents }}</p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Enrolled student cohort</p>
        </div>

        <!-- Placements Active -->
        <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs dark:border-purple-950/50 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Host Placements</span>
            <div class="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/60 dark:text-purple-400">
              <Building2 class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ stats.totalPlacements }}</p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Active company attachments</p>
        </div>

        <!-- Unassigned Trainees Alert -->
        <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs dark:border-purple-950/50 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Unassigned Trainees</span>
            <div class="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-950/60 dark:text-amber-400">
              <AlertTriangle class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-2 text-3xl font-black text-amber-600 dark:text-amber-400">{{ stats.unassignedPlacements }}</p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Awaiting faculty coordinator</p>
        </div>

        <!-- Cleared Trainees -->
        <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs dark:border-purple-950/50 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Cleared & Graded</span>
            <div class="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle class="h-4 w-4" />
            </div>
          </div>
          <p class="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">{{ stats.clearedPlacements }}</p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Form ITF-08 dossiers certified</p>
        </div>
      </div>

      <!-- Quick Action Navigation Hub -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Zonal Allocation Gateway -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div class="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center dark:bg-purple-950 dark:text-purple-300">
              <MapPin class="h-5 w-5" />
            </div>
            <h3 class="mt-4 text-base font-black text-slate-900 dark:text-white">Zonal Allocations</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Assign faculty coordinators based on student company State and Town/City clusters to streamline travel logistics.
            </p>
          </div>
          <NuxtLink
            to="/admin/supervisors"
            class="mt-6 inline-flex items-center justify-between rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-700"
          >
            <span>Open Zonal Clusters</span>
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>

        <!-- Master Placements Desk -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div class="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center dark:bg-purple-950 dark:text-purple-300">
              <FileSpreadsheet class="h-5 w-5" />
            </div>
            <h3 class="mt-4 text-base font-black text-slate-900 dark:text-white">Placements Master Registry</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Inspect all registered industrial placements, verify company addresses, track industry mentors, and review defense scores.
            </p>
          </div>
          <NuxtLink
            to="/admin/placements"
            class="mt-6 inline-flex items-center justify-between rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 dark:border-purple-900 dark:bg-slate-900 dark:text-purple-300"
          >
            <span>Audit Master Records</span>
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>

        <!-- Identity & Role Control -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div class="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center dark:bg-purple-950 dark:text-purple-300">
              <UserCog class="h-5 w-5" />
            </div>
            <h3 class="mt-4 text-base font-black text-slate-900 dark:text-white">Faculty & Trainee Accounts</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Provision coordinator logins, manage credentials, elevate faculty permissions, and oversee system identity records.
            </p>
          </div>
          <NuxtLink
            to="/admin/users"
            class="mt-6 inline-flex items-center justify-between rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-50 dark:border-purple-900 dark:bg-slate-900 dark:text-purple-300"
          >
            <span>Manage System Users</span>
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  GraduationCap,
  Building2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  MapPin,
  FileSpreadsheet,
  UserCog,
  ArrowRight
} from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const stats = ref({
  totalStudents: 0,
  totalPlacements: 0,
  totalCoordinators: 0,
  unassignedPlacements: 0,
  totalWeeklySubmissions: 0,
  pendingClearances: 0,
  clearedPlacements: 0
})

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchStats = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/admin/dashboard-stats`, {
      headers: getHeaders()
    })
    stats.value = res.data.data
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Directorate Metrics')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>