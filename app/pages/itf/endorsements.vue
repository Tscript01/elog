<template>
  <div class="space-y-6">
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            ITF Statutory Seal
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Logbook Verification Desk
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Logbook Endorsement Desk
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Issue cryptographic verification stamps and finalize formal industrial training clearance.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          :disabled="isBatchStamping || pendingPlacements.length === 0"
          class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
          @click="stampAllPending"
        >
          <Loader2 v-if="isBatchStamping" class="h-3.5 w-3.5 animate-spin" />
          <Stamp v-else class="h-3.5 w-3.5" />
          <span>Stamp All Pending ({{ pendingPlacements.length }})</span>
        </button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
        <div>
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Pending Endorsements</h2>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Logbooks awaiting Directorate cryptographic stamp and certification</p>
        </div>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ pendingPlacements.length }} queue items
        </span>
      </div>

      <div v-if="isLoading" class="py-16 text-center text-slate-400">
        <Loader2 class="mx-auto h-6 w-6 animate-spin text-emerald-600" />
        <p class="mt-2 text-xs">Loading queue items...</p>
      </div>

      <div v-else-if="pendingPlacements.length === 0" class="py-16 text-center text-slate-400">
        <CheckCircle2 class="mx-auto h-10 w-10 text-emerald-500" />
        <p class="mt-2 text-sm font-bold text-slate-900 dark:text-white">All Clear</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">There are no pending logbooks requiring your endorsement.</p>
      </div>

      <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
        <div
          v-for="item in pendingPlacements"
          :key="item.id"
          class="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-slate-900 dark:text-white">{{ item.studentName }}</span>
              <span class="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ item.matricNo }}</span>
            </div>
            <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Attached at <strong class="text-slate-900 dark:text-white">{{ item.companyName }}</strong> &bull; {{ item.location }}
            </p>
            <p class="mt-0.5 text-[11px] text-slate-400">
              Industry Supervisor: {{ item.supervisorName }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="previewingId === item.id"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              @click="previewLogbook(item.id)"
            >
              <Loader2 v-if="previewingId === item.id" class="h-3.5 w-3.5 animate-spin text-blue-600" />
              <FileText v-else class="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>View Logbook</span>
            </button>

            <button
              type="button"
              :disabled="stampingId === item.id"
              class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 disabled:opacity-50"
              @click="endorsePlacement(item.id)"
            >
              <Loader2 v-if="stampingId === item.id" class="h-3.5 w-3.5 animate-spin" />
              <Stamp v-else class="h-3.5 w-3.5" />
              <span>Endorse & Stamp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useCookie, useRuntimeConfig } from '#app'
import { Stamp, CheckCircle2, FileText, Loader2 } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'itf' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const isBatchStamping = ref(false)
const stampingId = ref<string | null>(null)
const previewingId = ref<string | null>(null)
const placements = ref<any[]>([])

const pendingPlacements = computed(() => {
  return placements.value.filter(p => p.itfStatus !== 'CLEARED')
})

const getAuthHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchClearanceQueue = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiBase}/api/itf/overview`, {
      headers: getAuthHeaders(),
      withCredentials: true
    })
    placements.value = res.data?.recentPlacements || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to fetch clearance queue')
  } finally {
    isLoading.value = false
  }
}

const endorsePlacement = async (placementId: string) => {
  stampingId.value = placementId
  try {
    const res = await axios.post(
      `${apiBase}/api/itf/clearance/${placementId}/stamp`,
      {},
      { headers: getAuthHeaders(), withCredentials: true }
    )
    toast.success('Endorsed', res.data?.message || 'ITF seal applied.')
    await fetchClearanceQueue()
  } catch (err: unknown) {
    toast.error(err, 'Failed to endorse placement')
  } finally {
    stampingId.value = null
  }
}

const stampAllPending = async () => {
  if (!confirm(`Are you sure you want to endorse all ${pendingPlacements.value.length} pending placements?`)) return

  isBatchStamping.value = true
  try {
    for (const p of pendingPlacements.value) {
      await axios.post(
        `${apiBase}/api/itf/clearance/${p.id}/stamp`,
        {},
        { headers: getAuthHeaders(), withCredentials: true }
      )
    }
    toast.success('Batch Endorsed', 'All eligible placements stamped.')
    await fetchClearanceQueue()
  } catch (err: unknown) {
    toast.error(err, 'Batch endorsement interrupted')
  } finally {
    isBatchStamping.value = false
  }
}

const previewLogbook = async (placementId: string) => {
  const token = useCookie<string | null>('auth_token').value
  if (!token) {
    toast.error(new Error('Session expired'), 'Unauthorized')
    return
  }

  if (!placementId) {
    toast.error(new Error('Missing placement ID.'), 'Error')
    return
  }

  previewingId.value = placementId
  try {
    const res = await axios.get(`${apiBase}/api/placements/export/pdf`, {
      params: { placementId },
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
      withCredentials: true
    })

    const blob = new Blob([res.data], { type: 'application/pdf' })
    const pdfUrl = URL.createObjectURL(blob)
    window.open(pdfUrl, '_blank')
  } catch (err: unknown) {
    toast.error(err, 'Failed to open logbook PDF')
  } finally {
    previewingId.value = null
  }
}

onMounted(() => {
  fetchClearanceQueue()
})
</script>