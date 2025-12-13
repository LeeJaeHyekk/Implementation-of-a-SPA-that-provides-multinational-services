/**
 * 네비게이션 유틸리티
 * 라우터 네비게이션 패턴 통합
 */

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { safeExecute } from './error-handler'

/**
 * 상표 상세 페이지로 이동
 */
export function navigateToTrademarkDetail(router: AppRouterInstance, id: string): void {
  safeExecute(
    () => {
      if (!id || typeof id !== 'string' || id.trim().length === 0) {
        globalThis.console?.warn?.('[Navigation] Invalid ID for trademark detail', { id })
        return
      }
      router.push(`/trademark/${id}`)
    },
    undefined,
    { action: 'navigateToTrademarkDetail', id },
  )
}

/**
 * 검색 페이지로 이동
 */
export function navigateToSearch(router: AppRouterInstance): void {
  safeExecute(
    () => {
      router.push('/search')
    },
    undefined,
    { action: 'navigateToSearch' },
  )
}

/**
 * 즐겨찾기 페이지로 이동
 */
export function navigateToFavorites(router: AppRouterInstance): void {
  safeExecute(
    () => {
      router.push('/favorites')
    },
    undefined,
    { action: 'navigateToFavorites' },
  )
}

/**
 * 이전 페이지로 이동
 */
export function navigateBack(router: AppRouterInstance): void {
  safeExecute(
    () => {
      router.back()
    },
    undefined,
    { action: 'navigateBack' },
  )
}

/**
 * 비교 페이지로 이동
 */
export function navigateToComparison(router: AppRouterInstance): void {
  safeExecute(
    () => {
      router.push('/compare')
    },
    undefined,
    { action: 'navigateToComparison' },
  )
}

