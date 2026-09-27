<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-4 border-b border-purple-100 pb-5 dark:border-purple-950/60 sm:flex-row sm:items-center">
      <div>
        <div class="flex items-center gap-2">
          <span class="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">
            Access Control
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Identity Provisioning
          </span>
        </div>
        <h1 class="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Faculty & Trainee Accounts
        </h1>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Provision institutional coordinator accounts, verify matriculation numbers, and manage role assignments.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-purple-700"
          @click="showCreateModal = true"
        >
          <UserPlus class="h-3.5 w-3.5" />
          <span>Provision New Account</span>
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div class="sm:col-span-2">
        <input
          v-model.trim="search"
          type="text"
          placeholder="Search by name, email, or matric number..."
          class="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          @input="debounceFetch"
        />
      </div>

      <div>
        <select
          v-model="roleFilter"
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-purple-600 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          @change="fetchUsers"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="INST_COORDINATOR">Institutional Coordinators</option>
          <option value="IND_SUPERVISOR">Industry Supervisors</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-slate-100 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
            <tr>
              <th class="py-3 px-4">User</th>
              <th class="py-3 px-4">Email</th>
              <th class="py-3 px-4">Role</th>
              <th class="py-3 px-4">Department / Matric</th>
              <th class="py-3 px-4">Assigned Territory</th>
              <th class="py-3 px-4 text-right">Created Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr v-if="isLoading">
              <td colspan="6" class="py-12 text-center text-purple-600">
                <Loader2 class="h-6 w-6 animate-spin mx-auto" />
                <span class="block mt-2 font-medium">Fetching identity accounts...</span>
              </td>
            </tr>

            <tr v-else-if="users.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-400">
                No user accounts found matching the criteria.
              </td>
            </tr>

            <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">
                {{ u.name }}
              </td>

              <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                {{ u.email }}
              </td>

              <td class="py-3 px-4">
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                    u.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                      : u.role === 'INST_COORDINATOR'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : u.role === 'IND_SUPERVISOR'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  ]"
                >
                  {{ u.role }}
                </span>
              </td>

              <td class="py-3 px-4">
                <div v-if="u.matric_no" class="font-mono text-[11px] font-bold">{{ u.matric_no }}</div>
                <div class="text-[11px] text-slate-500">{{ u.department || 'N/A' }}</div>
              </td>

              <td class="py-3 px-4">
                <span v-if="u.assigned_state" class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {{ u.assigned_city ? `${u.assigned_city}, ` : '' }}{{ u.assigned_state }}
                </span>
                <span v-else class="text-slate-400">-</span>
              </td>

              <td class="py-3 px-4 text-right text-slate-400">
                {{ new Date(u.created_at).toLocaleDateString('en-GB') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create User Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h3 class="text-base font-black text-slate-900 dark:text-white">Provision System Account</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Register a faculty coordinator or administrative user.</p>

        <form class="mt-5 space-y-4" @submit.prevent="createUser">
          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Full Name</label>
            <input
              v-model.trim="newUser.name"
              type="text"
              required
              placeholder="e.g. Dr. Jane Doe"
              class="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              v-model.trim="newUser.email"
              type="email"
              required
              placeholder="e.g. coordinator@institution.edu.ng"
              class="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Initial Password</label>
            <input
              v-model.trim="newUser.password"
              type="password"
              required
              placeholder="Temporary password"
              class="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Role</label>
              <select
                v-model="newUser.role"
                class="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="INST_COORDINATOR">Coordinator</option>
                <option value="ADMIN">Administrator</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Department</label>
              <input
                v-model.trim="newUser.department"
                type="text"
                placeholder="e.g. Computing"
                class="mt-1 w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-purple-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              class="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Provisioning...' : 'Create Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { UserPlus, Loader2 } from 'lucide-vue-next'
import { useCookie, useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })

const config = useRuntimeConfig()
const apiBase = (config.public.apiBaseUrl as string) || ''
const toast = useToast()

const isLoading = ref(false)
const isSubmitting = ref(false)
const showCreateModal = ref(false)

const users = ref<any[]>([])
const search = ref('')
const roleFilter = ref('')

const newUser = reactive({
  name: '',
  email: '',
  password: '',
  role: 'INST_COORDINATOR',
  department: '',
  matric_no: ''
})

let debounceTimeout: any = null

const getHeaders = () => {
  const token = useCookie<string | null>('auth_token').value
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const params: any = {}
    if (search.value) params.search = search.value
    if (roleFilter.value) params.role = roleFilter.value

    const res = await axios.get(`${apiBase}/api/admin/users`, {
      headers: getHeaders(),
      params
    })
    users.value = res.data.data || []
  } catch (err: unknown) {
    toast.error(err, 'Failed to Fetch Users')
  } finally {
    isLoading.value = false
  }
}

const debounceFetch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchUsers()
  }, 350)
}

const createUser = async () => {
  isSubmitting.value = true
  try {
    await axios.post(`${apiBase}/api/admin/users`, newUser, {
      headers: getHeaders()
    })
    toast.success('Account Provisioned', `User ${newUser.name} created successfully.`)
    showCreateModal.value = false
    newUser.name = ''
    newUser.email = ''
    newUser.password = ''
    newUser.department = ''
    await fetchUsers()
  } catch (err: unknown) {
    toast.error(err, 'Failed to Provision Account')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>