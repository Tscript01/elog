
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  LayoutApiConfigModal: typeof import("../../app/components/layout/ApiConfigModal.vue")['default']
  LayoutAppBreadcrumbs: typeof import("../../app/components/layout/AppBreadcrumbs.vue")['default']
  LayoutAppHeader: typeof import("../../app/components/layout/AppHeader.vue")['default']
  LayoutAppSidebar: typeof import("../../app/components/layout/AppSidebar.vue")['default']
  LayoutThemeToggle: typeof import("../../app/components/layout/ThemeToggle.vue")['default']
  LayoutUserMenu: typeof import("../../app/components/layout/UserMenu.vue")['default']
  StudentDayNavigator: typeof import("../../app/components/student/DayNavigator.vue")['default']
  StudentLogEntryEditor: typeof import("../../app/components/student/LogEntryEditor.vue")['default']
  StudentMediaUploader: typeof import("../../app/components/student/MediaUploader.vue")['default']
  StudentSupervisorFeedbackCard: typeof import("../../app/components/student/SupervisorFeedbackCard.vue")['default']
  StudentWeekLogSheet: typeof import("../../app/components/student/WeekLogSheet.vue")['default']
  StudentWeekSelector: typeof import("../../app/components/student/WeekSelector.vue")['default']
  StudentWeekSubmissionPanel: typeof import("../../app/components/student/WeekSubmissionPanel.vue")['default']
  UiBaseBadge: typeof import("../../app/components/ui/BaseBadge.vue")['default']
  UiBaseButton: typeof import("../../app/components/ui/BaseButton.vue")['default']
  UiBaseCard: typeof import("../../app/components/ui/BaseCard.vue")['default']
  UiEmptyState: typeof import("../../app/components/ui/EmptyState.vue")['default']
  UiProgressBar: typeof import("../../app/components/ui/ProgressBar.vue")['default']
  UiStatCard: typeof import("../../app/components/ui/StatCard.vue")['default']
  UiToastContainer: typeof import("../../app/components/ui/ToastContainer.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyLayoutApiConfigModal: LazyComponent<typeof import("../../app/components/layout/ApiConfigModal.vue")['default']>
  LazyLayoutAppBreadcrumbs: LazyComponent<typeof import("../../app/components/layout/AppBreadcrumbs.vue")['default']>
  LazyLayoutAppHeader: LazyComponent<typeof import("../../app/components/layout/AppHeader.vue")['default']>
  LazyLayoutAppSidebar: LazyComponent<typeof import("../../app/components/layout/AppSidebar.vue")['default']>
  LazyLayoutThemeToggle: LazyComponent<typeof import("../../app/components/layout/ThemeToggle.vue")['default']>
  LazyLayoutUserMenu: LazyComponent<typeof import("../../app/components/layout/UserMenu.vue")['default']>
  LazyStudentDayNavigator: LazyComponent<typeof import("../../app/components/student/DayNavigator.vue")['default']>
  LazyStudentLogEntryEditor: LazyComponent<typeof import("../../app/components/student/LogEntryEditor.vue")['default']>
  LazyStudentMediaUploader: LazyComponent<typeof import("../../app/components/student/MediaUploader.vue")['default']>
  LazyStudentSupervisorFeedbackCard: LazyComponent<typeof import("../../app/components/student/SupervisorFeedbackCard.vue")['default']>
  LazyStudentWeekLogSheet: LazyComponent<typeof import("../../app/components/student/WeekLogSheet.vue")['default']>
  LazyStudentWeekSelector: LazyComponent<typeof import("../../app/components/student/WeekSelector.vue")['default']>
  LazyStudentWeekSubmissionPanel: LazyComponent<typeof import("../../app/components/student/WeekSubmissionPanel.vue")['default']>
  LazyUiBaseBadge: LazyComponent<typeof import("../../app/components/ui/BaseBadge.vue")['default']>
  LazyUiBaseButton: LazyComponent<typeof import("../../app/components/ui/BaseButton.vue")['default']>
  LazyUiBaseCard: LazyComponent<typeof import("../../app/components/ui/BaseCard.vue")['default']>
  LazyUiEmptyState: LazyComponent<typeof import("../../app/components/ui/EmptyState.vue")['default']>
  LazyUiProgressBar: LazyComponent<typeof import("../../app/components/ui/ProgressBar.vue")['default']>
  LazyUiStatCard: LazyComponent<typeof import("../../app/components/ui/StatCard.vue")['default']>
  LazyUiToastContainer: LazyComponent<typeof import("../../app/components/ui/ToastContainer.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
