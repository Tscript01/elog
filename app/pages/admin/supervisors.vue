<template>
  <div class="space-y-8">
    <!-- Header Banner -->
    <div class="flex flex-col justify-between gap-4 border-b border-purple-100 pb-5 dark:border-purple-950/60 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
            Logistics & Inspection Routing
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Geographic Clustering
          </span>
        </div>
        <h1 class="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Zonal Supervisor Allocations
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Group trainees by State and Town/City to prevent disjointed travel routes during institutional defense inspections.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          :disabled="isLoading"
          class="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs font-semibold text-purple-700 shadow-2xs transition hover:bg-purple-50 disabled:opacity-50 dark:border-purple-900 dark:bg-slate-900 dark:text-purple-300 dark:hover:bg-purple-950/40"
          @click="fetchData"
        >
          <RefreshCw :class="['h-3.5 w-3.5', isLoading ? 'animate-spin' : '']" />
          <span>Refresh Clusters</span>
        </button>
      </div>
    </div>

    <!-- Overview Operational KPI Row -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs dark:border-purple-950/50 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Active State Hubs</span>
          <div class="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/60 dark:text-purple-400">
            <Map class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ activeStateCount }}</p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Geographic regions with placed trainees</p>
      </div>

      <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs dark:border-purple-950/50 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Placed Trainees</span>
          <div class="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/60 dark:text-purple-400">
            <Users class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ totalTraineeCount }}</p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Students currently active in industry</p>
      </div>

      <div class="rounded-2xl border border-purple-100 bg-white p-5 shadow-xs dark:border-purple-950/50 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Faculty Coordinators</span>
          <div class="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/60 dark:text-purple-400">
            <UserCheck class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-2 text-3xl font-black text-slate-900 dark:text-white">{{ coordinators.length }}</p>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Available for regional route deployment</p>
      </div>
    </div>

    <!-- Cluster Management Deck -->
    <div v-if="isLoading" class="py-20 text-center text-xs text-purple-600 dark:text-purple-400">
      <Loader2 class="h-8 w-8 animate-spin mx-auto text-purple-600" />
      <span class="block mt-2 font-medium">Assembling geographical clusters...</span>
    </div>

    <div v-else-if="activeStateCount === 0" class="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
      <MapPinOff class="h-8 w-8 mx-auto text-slate-400" />
      <p class="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">No Zonal Data Available</p>
      <p class="text-xs text-slate-400 mt-0.5">No student placements have been registered with state/city data yet.</p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(cities, stateName) in clusters"
        :key="stateName"
        class="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900"
      >
        <!-- State Header Bar -->
        <div class="flex flex-col gap-4 border-b border-slate-100 bg-purple-50/40 p-5 dark:border-slate-800 dark:bg-purple-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-black text-sm">
              {{ String(stateName).slice(0, 2).toUpperCase() }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-slate-900 dark:text-white">{{ stateName }} State</h3>
                <span class="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {{ countTraineesInState(cities) }} Trainees
                </span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                Spanning {{ Object.keys(cities || {}).length }} registered Town/City centers
              </p>
            </div>
          </div>

          <!-- Batch Assign Entire State Controls -->
          <div class="flex flex-wrap items-center gap-2">
            <select
              v-model="stateAssignments[stateName]"
              class="rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-purple-600 focus:outline-hidden dark:border-purple-900 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="">Assign all {{ stateName }} to...</option>
              <option v-for="c in coordinators" :key="c.id" :value="c.id">
                {{ c.name }} ({{ c.department || 'General Faculty' }})
              </option>
            </select>
            <button
              type="button"
              :disabled="!stateAssignments[stateName] || isAssigning"
              class="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-700 disabled:opacity-40"
              @click="assignZone(String(stateName), null, String(stateAssignments[stateName] ?? ''))"
            >
              <Check class="h-3.5 w-3.5" />
              <span>Assign Entire State</span>
            </button>
          </div>
        </div>

        <!-- Cities Sub-Grid -->
        <div class="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(trainees, cityName) in cities"
            :key="cityName"
            class="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 transition hover:border-purple-300 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-purple-900"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin class="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span class="truncate">{{ cityName }}</span>
                </span>
                <span class="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  {{ trainees.length }} {{ trainees.length === 1 ? 'trainee' : 'trainees' }}
                </span>
              </div>

              <!-- Current Assigned Supervisor Tag -->
              <div class="mt-3 rounded-lg bg-white p-2.5 border border-slate-200/70 text-[11px] dark:border-slate-800 dark:bg-slate-900">
                <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Assigned Coordinator</span>
                <p class="font-bold text-purple-700 dark:text-purple-300 truncate mt-0.5">
                  {{ getAssignedCoordinatorName(trainees) }}
                </p>
              </div>

              <!-- Trainee List Samples -->
              <ul class="mt-3 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <li v-for="t in trainees.slice(0, 3)" :key="t.id" class="truncate flex items-center gap-1">
                  <span class="h-1 w-1 rounded-full bg-purple-400 shrink-0"></span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200 truncate">{{ t.student?.name || 'Unnamed Student' }}</span>
                  <span class="text-slate-400 truncate">({{ t.company_name }})</span>
                </li>
                <li v-if="trainees.length > 3" class="text-[10px] text-purple-600 font-semibold dark:text-purple-400">
                  +{{ trainees.length - 3 }} more in this locale
                </li>
              </ul>
            </div>

            <!-- Town-Level Direct Assignment Dropdown -->
            <div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <div class="flex items-center gap-1.5">
                <select
                  v-model="cityAssignments[`${stateName}_${cityName}`]"
                  class="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11px] text-slate-700 focus:border-purple-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  <option value="">Assign town to...</option>
                  <option v-for="c in coordinators" :key="c.id" :value="c.id">
                    {{ c.name }}
                  </option>
                </select>
                <button
                  type="button"
                  :disabled="!cityAssignments[`${stateName}_${cityName}`] || isAssigning"
                  class="rounded-lg bg-slate-900 p-1.5 text-white hover:bg-slate-800 disabled:opacity-30 dark:bg-purple-600 dark:hover:bg-purple-500 shrink-0"
                  @click="assignZone(String(stateName), String(cityName), String(cityAssignments[`${stateName}_${cityName}`] || ''))"
                >
                  <ArrowRight class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  Map,
  Users,
  UserCheck,
  RefreshCw,
  Loader2,
  MapPin,
  MapPinOff,
  Check,
  ArrowRight
} from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

interface TraineeRecord {
  id: string
  company_name: string
  state: string
  city: string
  student?: {
    id: string
    name: string
    matric_no?: string | null
  } | null
  inst_coordinator?: {
    id: string
    name: string
    email: string
  } | null
}

interface CoordinatorOption {
  id: string
  name: string
  email: string
  department?: string | null
}

type ClusterStructure = Record<string, Record<string, TraineeRecord[]>>

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const isAssigning = ref(false)

const clusters = ref<ClusterStructure>({})
const coordinators = ref<CoordinatorOption[]>([])

const stateAssignments = reactive<Record<string, string>>({})
const cityAssignments = reactive<Record<string, string>>({})

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const activeStateCount = computed(() => Object.keys(clusters.value).length)

const countTraineesInState = (cities: Record<string, TraineeRecord[]> | undefined): number => {
  if (!cities) return 0
  return Object.values(cities).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0)
}

const totalTraineeCount = computed(() => {
  let count = 0
  for (const stateName of Object.keys(clusters.value)) {
    count += countTraineesInState(clusters.value[stateName])
  }
  return count
})

const getAssignedCoordinatorName = (trainees: TraineeRecord[]): string => {
  const assigned = trainees.find((t) => Boolean(t.inst_coordinator?.name))
  return assigned?.inst_coordinator?.name || 'Unassigned'
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const [clusterRes, coordRes] = await Promise.all([
      axios.get(`${apiBase}/api/admin/placements/clusters`, { headers: getHeaders() }),
      axios.get(`${apiBase}/api/admin/coordinators`, { headers: getHeaders() })
    ])

    clusters.value = clusterRes.data?.data || {}
    coordinators.value = coordRes.data?.data || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Load Zonal Information')
  } finally {
    isLoading.value = false
  }
}

const assignZone = async (state: string, city: string | null, coordinatorId: string) => {
  if (!coordinatorId) return
  isAssigning.value = true

  try {
    const res = await axios.post(
      `${apiBase}/api/admin/placements/assign-zone`,
      { state, city, coordinator_id: coordinatorId },
      { headers: getHeaders() }
    )

    toast.success('Territory Allocated', res.data?.message || 'Supervisory zone allocated successfully.')
    await fetchData()
  } catch (err: unknown) {
    toast.error(err, 'Zonal Allocation Failed')
  } finally {
    isAssigning.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>