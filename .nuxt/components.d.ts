
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


export const AppToast: typeof import("../app/components/AppToast.vue")['default']
export const LayoutApiConfigModal: typeof import("../app/components/layout/ApiConfigModal.vue")['default']
export const LayoutAppBreadcrumbs: typeof import("../app/components/layout/AppBreadcrumbs.vue")['default']
export const LayoutAppHeader: typeof import("../app/components/layout/AppHeader.vue")['default']
export const LayoutAppSidebar: typeof import("../app/components/layout/AppSidebar.vue")['default']
export const LayoutThemeToggle: typeof import("../app/components/layout/ThemeToggle.vue")['default']
export const LayoutUserMenu: typeof import("../app/components/layout/UserMenu.vue")['default']
export const StudentDayNavigator: typeof import("../app/components/student/DayNavigator.vue")['default']
export const StudentLogEntryEditor: typeof import("../app/components/student/LogEntryEditor.vue")['default']
export const StudentMediaUploader: typeof import("../app/components/student/MediaUploader.vue")['default']
export const StudentSupervisorFeedbackCard: typeof import("../app/components/student/SupervisorFeedbackCard.vue")['default']
export const StudentWeekLogSheet: typeof import("../app/components/student/WeekLogSheet.vue")['default']
export const StudentWeekSelector: typeof import("../app/components/student/WeekSelector.vue")['default']
export const StudentWeekSubmissionPanel: typeof import("../app/components/student/WeekSubmissionPanel.vue")['default']
export const UiBaseBadge: typeof import("../app/components/ui/BaseBadge.vue")['default']
export const UiBaseButton: typeof import("../app/components/ui/BaseButton.vue")['default']
export const UiBaseCard: typeof import("../app/components/ui/BaseCard.vue")['default']
export const UiEmptyState: typeof import("../app/components/ui/EmptyState.vue")['default']
export const UiProgressBar: typeof import("../app/components/ui/ProgressBar.vue")['default']
export const UiStatCard: typeof import("../app/components/ui/StatCard.vue")['default']
export const UiToastContainer: typeof import("../app/components/ui/ToastContainer.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAppToast: LazyComponent<typeof import("../app/components/AppToast.vue")['default']>
export const LazyLayoutApiConfigModal: LazyComponent<typeof import("../app/components/layout/ApiConfigModal.vue")['default']>
export const LazyLayoutAppBreadcrumbs: LazyComponent<typeof import("../app/components/layout/AppBreadcrumbs.vue")['default']>
export const LazyLayoutAppHeader: LazyComponent<typeof import("../app/components/layout/AppHeader.vue")['default']>
export const LazyLayoutAppSidebar: LazyComponent<typeof import("../app/components/layout/AppSidebar.vue")['default']>
export const LazyLayoutThemeToggle: LazyComponent<typeof import("../app/components/layout/ThemeToggle.vue")['default']>
export const LazyLayoutUserMenu: LazyComponent<typeof import("../app/components/layout/UserMenu.vue")['default']>
export const LazyStudentDayNavigator: LazyComponent<typeof import("../app/components/student/DayNavigator.vue")['default']>
export const LazyStudentLogEntryEditor: LazyComponent<typeof import("../app/components/student/LogEntryEditor.vue")['default']>
export const LazyStudentMediaUploader: LazyComponent<typeof import("../app/components/student/MediaUploader.vue")['default']>
export const LazyStudentSupervisorFeedbackCard: LazyComponent<typeof import("../app/components/student/SupervisorFeedbackCard.vue")['default']>
export const LazyStudentWeekLogSheet: LazyComponent<typeof import("../app/components/student/WeekLogSheet.vue")['default']>
export const LazyStudentWeekSelector: LazyComponent<typeof import("../app/components/student/WeekSelector.vue")['default']>
export const LazyStudentWeekSubmissionPanel: LazyComponent<typeof import("../app/components/student/WeekSubmissionPanel.vue")['default']>
export const LazyUiBaseBadge: LazyComponent<typeof import("../app/components/ui/BaseBadge.vue")['default']>
export const LazyUiBaseButton: LazyComponent<typeof import("../app/components/ui/BaseButton.vue")['default']>
export const LazyUiBaseCard: LazyComponent<typeof import("../app/components/ui/BaseCard.vue")['default']>
export const LazyUiEmptyState: LazyComponent<typeof import("../app/components/ui/EmptyState.vue")['default']>
export const LazyUiProgressBar: LazyComponent<typeof import("../app/components/ui/ProgressBar.vue")['default']>
export const LazyUiStatCard: LazyComponent<typeof import("../app/components/ui/StatCard.vue")['default']>
export const LazyUiToastContainer: LazyComponent<typeof import("../app/components/ui/ToastContainer.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
