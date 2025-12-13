/**
 * CSS 클래스 상수
 * 반복되는 CSS 클래스 문자열 통합
 */

/**
 * Glassmorphism 버튼 클래스
 */
export const GLASS_BUTTON_CLASSES = {
  base: 'glass-button rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-slate-200 transition',
  primary: 'glass-button glass-button-primary rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-indigo-200 transition',
  back: 'glass-button flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-slate-200 transition hover:text-indigo-200',
  small: 'glass-button rounded-lg px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm font-medium text-slate-200 transition',
  disabled: 'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none',
} as const

/**
 * Glassmorphism 카드 클래스
 */
export const GLASS_CARD_CLASSES = {
  base: 'glass-card rounded-2xl',
  error: 'glass-card rounded-2xl border-red-500/40 bg-red-950/30',
  small: 'glass-card rounded-xl',
  large: 'glass-card rounded-2xl p-6',
} as const

/**
 * Glassmorphism 배지 클래스
 */
export const GLASS_BADGE_CLASSES = {
  base: 'glass-badge rounded-lg px-3 py-1',
  small: 'glass-badge rounded-lg px-2 py-1 text-xs',
} as const

/**
 * 레이아웃 클래스
 */
export const LAYOUT_CLASSES = {
  container: 'mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6',
  centered: 'flex min-h-screen items-center justify-center px-4 py-4 sm:px-6 sm:py-6',
  centeredContent: 'w-full max-w-4xl',
  spaceY: 'space-y-4 sm:space-y-6',
  pageHeader: 'mb-3 sm:mb-4',
  pageTitle: 'text-2xl sm:text-3xl font-bold text-slate-50 drop-shadow-md',
  pageSubtitle: 'text-xs sm:text-sm font-medium text-indigo-300 drop-shadow-sm',
} as const

/**
 * 그리드 레이아웃 클래스
 */
export const GRID_CLASSES = {
  cardGrid: 'grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3',
  detailGrid: 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3',
  filterGrid: 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4',
} as const

/**
 * 텍스트 클래스
 */
export const TEXT_CLASSES = {
  error: 'text-xs sm:text-sm font-medium text-red-200',
  empty: 'text-xs sm:text-sm font-medium text-slate-300',
  loading: 'text-xs sm:text-sm font-medium text-slate-300 drop-shadow-sm',
  label: 'text-xs sm:text-sm font-medium text-slate-200 drop-shadow-sm',
} as const

