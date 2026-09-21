<template>
  <div class="space-y-6">
    <!-- Header Summary Bar -->
    <div class="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            Form ITF / SIWES-01A
          </span>
          <span class="text-xs text-slate-400">•</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Institutional Master Record
          </span>
        </div>
        <h1 class="mt-1.5 text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Industrial Attachment Profile
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Official registration of your host organization, industry mentor, and active deployment dates.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="hasExistingPlacement && !isEditing && isEditableWithinWindow"
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          @click="enableEditMode"
        >
          <Pencil class="h-3.5 w-3.5" />
          <span>Edit Details</span>
        </button>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <!-- Left Column: Form -->
      <form class="xl:col-span-2" novalidate @submit.prevent="save">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                <Building2 class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-sm font-bold text-slate-900 dark:text-white">Organization & Supervision</h2>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Company location and technical mentor details</p>
              </div>
            </div>

            <span
              :class="[
                'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                hasExistingPlacement
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
              ]"
            >
              {{ hasExistingPlacement ? 'Registered' : 'Awaiting Registration' }}
            </span>
          </div>

          <!-- Alert Banners -->
          <div
            v-if="hasExistingPlacement && !isEditableWithinWindow"
            class="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
          >
            <Lock class="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p class="font-bold">Modification Window Expired</p>
              <p class="mt-0.5 text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Placement details lock 30 days after initial submission. Forward certified amendments to your departmental coordinator.
              </p>
            </div>
          </div>

          <div
            v-if="feedbackMessage"
            :class="[
              'mt-5 flex items-center gap-2.5 rounded-xl p-3.5 text-xs',
              isSuccess
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400'
            ]"
          >
            <CheckCircle2 v-if="isSuccess" class="h-4 w-4 shrink-0" />
            <AlertCircle v-else class="h-4 w-4 shrink-0" />
            <span>{{ feedbackMessage }}</span>
          </div>

          <!-- Inputs Grid -->
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="company-name" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Hosting Organization / Company Name<span class="text-rose-500">*</span>
              </label>
              <input
                id="company-name"
                v-model="form.company_name"
                type="text"
                required
                autocomplete="organization"
                placeholder="e.g. Chevron Nigeria Limited"
                :disabled="inputsDisabled"
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400"
              />
              <p v-if="errors.company_name" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                {{ errors.company_name }}
              </p>
            </div>

            <div class="sm:col-span-2">
              <label for="company-address" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Physical Office Address
              </label>
              <textarea
                id="company-address"
                v-model="form.company_address"
                rows="3"
                placeholder="Street address, city, state, or installation site..."
                :disabled="inputsDisabled"
                class="mt-1.5 block w-full resize-y rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400"
              ></textarea>
            </div>

            <div>
              <label for="company-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Organization Official Email
              </label>
              <input
                id="company-email"
                v-model="form.company_email"
                type="email"
                autocomplete="email"
                placeholder="hr@organization.com"
                :disabled="inputsDisabled"
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400"
              />
            </div>

            <div>
              <label for="company-contact" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Official Contact Line
              </label>
              <input
                id="company-contact"
                v-model="form.company_contact"
                type="tel"
                autocomplete="tel"
                placeholder="+234..."
                :disabled="inputsDisabled"
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400"
              />
            </div>

            <div class="sm:col-span-2">
              <label for="supervisor-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Industry Supervisor Email<span class="text-rose-500">*</span>
              </label>
              <input
                id="supervisor-email"
                v-model="form.supervisor_email"
                type="email"
                required
                placeholder="mentor@organization.com"
                :disabled="inputsDisabled"
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400"
              />
              <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Weekly log entries and evaluations are automatically addressed to this email.
              </p>
              <p v-if="errors.supervisor_email" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                {{ errors.supervisor_email }}
              </p>
            </div>

            <div>
              <label for="start-date" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Commencement Date<span class="text-rose-500">*</span>
              </label>
              <input
                id="start-date"
                v-model="form.start_date"
                type="date"
                required
                :disabled="inputsDisabled"
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400"
              />
            </div>

            <div>
              <label for="end-date" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Termination Date<span class="text-rose-500">*</span>
              </label>
              <input
                id="end-date"
                v-model="form.end_date"
                type="date"
                required
                :disabled="inputsDisabled"
                class="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition focus:border-slate-900 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400"
              />
              <p v-if="errors.end_date" class="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                {{ errors.end_date }}
              </p>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div
            v-if="!hasExistingPlacement || isEditing"
            class="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800"
          >
            <button
              type="button"
              :disabled="placementStore.isLoading"
              class="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              @click="cancelOrReset"
            >
              {{ hasExistingPlacement ? 'Cancel Editing' : 'Clear Form' }}
            </button>
            <button
              type="submit"
              :disabled="placementStore.isLoading"
              class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <Loader2 v-if="placementStore.isLoading" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              <span>{{ placementStore.isLoading ? 'Processing...' : (hasExistingPlacement ? 'Update Placement' : 'Submit Placement Record') }}</span>
            </button>
          </div>
        </div>
      </form>

      <!-- Right Column: Analytics & Meta -->
      <div class="space-y-6">
        <!-- Duration Analytics Card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Training Span</span>
            <Calendar class="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>

          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-4xl font-black text-slate-900 dark:text-white">{{ computedWeeks }}</span>
            <span class="text-xs font-semibold text-slate-400">Calculated Weeks</span>
          </div>

          <div class="mt-4 space-y-2 text-xs">
            <div class="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Gross Duration</span>
              <span class="font-bold text-slate-900 dark:text-white">{{ totalDays }} Calendar Days</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Standard SIWES Benchmark</span>
              <span class="font-bold text-slate-900 dark:text-white">24 Weeks</span>
            </div>
          </div>

          <div class="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            Federal SIWES attachments standardly require a 24-week rotation. Placements deviating from institutional length criteria demand clearance by your departmental coordinator.
          </div>
        </div>

        <!-- Assigned Stakeholders Card -->
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Regulatory Reviewers</span>
            <ShieldCheck class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>

          <ul class="mt-4 space-y-4 text-xs">
            <li class="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Industry Supervisor
              </span>
              <p class="mt-1 font-bold text-slate-800 dark:text-slate-100">
                {{ assignedSupervisor.name || 'Pending Verification' }}
              </p>
              <p class="mt-0.5 truncate text-slate-500 dark:text-slate-400">
                {{ form.supervisor_email || 'No email registered' }}
              </p>
            </li>

            <li class="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
              <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Institution Coordinator
              </span>
              <p class="mt-1 font-bold text-slate-800 dark:text-slate-100">
                {{ assignedCoordinator.name || 'Institutional SIWES Directorate' }}
              </p>
              <p class="mt-0.5 truncate text-slate-500 dark:text-slate-400">
                {{ assignedCoordinator.email || 'Awaiting supervisor confirmation' }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  Building2,
  Calendar,
  Save,
  Loader2,
  Pencil,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-vue-next'
import { usePlacementStore, type PlacementData } from '~/stores/placement'

definePageMeta({
  layout: 'student'
})

const placementStore = usePlacementStore()

const form = reactive({
  company_name: '',
  company_address: '',
  company_email: '',
  company_contact: '',
  supervisor_email: '',
  start_date: '',
  end_date: ''
})

const isEditing = ref(false)
const errors = ref<Record<string, string>>({})
const feedbackMessage = ref('')
const isSuccess = ref(false)

const assignedSupervisor = reactive({ name: '', email: '' })
const assignedCoordinator = reactive({ name: '', email: '' })

const hasExistingPlacement = computed(() => placementStore.hasPlacement)
const isEditableWithinWindow = computed(() => placementStore.isEditableWithinWindow)

const inputsDisabled = computed(() => {
  if (placementStore.isLoading) return true
  if (hasExistingPlacement.value && !isEditing.value) return true
  if (hasExistingPlacement.value && !isEditableWithinWindow.value) return true
  return false
})

const totalDays = computed(() => {
  if (!form.start_date || !form.end_date) return 0
  const start = new Date(form.start_date).getTime()
  const end = new Date(form.end_date).getTime()
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

const computedWeeks = computed(() => {
  return totalDays.value > 0 ? Math.ceil(totalDays.value / 7) : 0
})

const syncFormFromStore = (data: PlacementData | null) => {
  if (!data) return
  form.company_name = data.company_name || ''
  form.company_address = data.company_address || ''
  form.company_email = data.company_email || ''
  form.company_contact = data.company_contact || ''
  form.supervisor_email = data.supervisor_email || data.supervisor?.email || ''
  form.start_date = data.start_date ? data.start_date.split('T')[0] ?? '' : ''
  form.end_date = data.end_date ? data.end_date.split('T')[0] ?? '' : ''

  if (data.supervisor) {
    assignedSupervisor.name = data.supervisor.name || ''
    assignedSupervisor.email = data.supervisor.email || ''
  }
  if (data.coordinator) {
    assignedCoordinator.name = data.coordinator.name || ''
    assignedCoordinator.email = data.coordinator.email || ''
  }
}

const enableEditMode = () => {
  if (isEditableWithinWindow.value) {
    isEditing.value = true
    feedbackMessage.value = ''
  }
}

const cancelOrReset = () => {
  errors.value = {}
  feedbackMessage.value = ''
  if (hasExistingPlacement.value) {
    isEditing.value = false
    syncFormFromStore(placementStore.placement)
  } else {
    form.company_name = ''
    form.company_address = ''
    form.company_email = ''
    form.company_contact = ''
    form.supervisor_email = ''
    form.start_date = ''
    form.end_date = ''
  }
}

const save = async () => {
  const nextErrors: Record<string, string> = {}

  if (form.company_name.trim().length < 2) {
    nextErrors.company_name = 'Enter the registered name of the hosting organization.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supervisor_email)) {
    nextErrors.supervisor_email = 'Provide a valid industry supervisor email address.'
  }

  if (!form.start_date || !form.end_date) {
    nextErrors.end_date = 'Both commencement and termination dates are required.'
  } else if (new Date(form.end_date).getTime() <= new Date(form.start_date).getTime()) {
    nextErrors.end_date = 'Termination date must follow the commencement date.'
  }

  errors.value = nextErrors

  if (Object.keys(nextErrors).length > 0) {
    feedbackMessage.value = ''
    return
  }

  feedbackMessage.value = ''

  try {
    await placementStore.savePlacement({
      company_name: form.company_name.trim(),
      company_address: form.company_address.trim() || null,
      company_email: form.company_email.trim() || null,
      company_contact: form.company_contact.trim() || null,
      supervisor_email: form.supervisor_email.trim(),
      start_date: form.start_date,
      end_date: form.end_date
    })

    isSuccess.value = true
    feedbackMessage.value = hasExistingPlacement.value
      ? 'Placement details updated successfully.'
      : 'Placement record registered successfully.'
    isEditing.value = false
    syncFormFromStore(placementStore.placement)
  } catch (err: any) {
    isSuccess.value = false
    feedbackMessage.value = err.message || 'Failed to save placement details.'
  }
}

onMounted(async () => {
  if (!placementStore.placement) {
    await placementStore.fetchPlacement()
  }
  syncFormFromStore(placementStore.placement)
})
</script>