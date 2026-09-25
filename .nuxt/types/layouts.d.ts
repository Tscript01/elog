import type { ComputedRef, MaybeRef } from "vue";
import type { ComponentProps } from "../../node_modules/vue-component-type-helpers/index.js";

declare module 'nuxt/app' {
  interface NuxtLayouts {
    coordinator: ComponentProps<typeof import("C:/Users/T_script/Desktop/log/app/layouts/coordinator.vue").default>
    student: ComponentProps<typeof import("C:/Users/T_script/Desktop/log/app/layouts/student.vue").default>
    supervisor: ComponentProps<typeof import("C:/Users/T_script/Desktop/log/app/layouts/supervisor.vue").default>
  }
  export type LayoutKey = keyof NuxtLayouts extends never ? string : keyof NuxtLayouts
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false> | {
      [K in LayoutKey]: {
        name?: MaybeRef<K | false> | ComputedRef<K | false>
        props?: NuxtLayouts[K]
      }
    }[LayoutKey]
  }
}