<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2.5 pointer-events-none sm:max-w-md">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-2 opacity-0 scale-95"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-xl transition-all',
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-slate-900/95 text-emerald-200'
              : toast.type === 'error'
                ? 'border-rose-500/30 bg-slate-900/95 text-rose-200'
                : 'border-blue-500/30 bg-slate-900/95 text-blue-200'
          ]"
        >
          <CheckCircle2 v-if="toast.type === 'success'" class="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
          <AlertTriangle v-else-if="toast.type === 'error'" class="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
          <Info v-else class="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />

          <div class="flex-1">
            <h4 class="text-xs font-bold tracking-wide text-white">{{ toast.title }}</h4>
            <p class="mt-0.5 text-xs text-slate-300 leading-relaxed">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-md p-1 text-slate-400 hover:text-white transition-colors"
            @click="dismiss(toast.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

const { toasts, dismiss } = useToast()
</script>