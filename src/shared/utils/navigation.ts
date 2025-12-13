/**
 * 네비게이션 유틸리티
 * 라우터 네비게이션 패턴 통합
 */

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

/**
 * 상표 상세 페이지로 이동
 */
export function navigateToTrademarkDetail(router: AppRouterInstance, id: string): void {
  router.push(`/trademark/${id}`)
}

/**
 * 검색 페이지로 이동
 */
export function navigateToSearch(router: AppRouterInstance): void {
  router.push('/search')
}

/**
 * 즐겨찾기 페이지로 이동
 */
export function navigateToFavorites(router: AppRouterInstance): void {
  router.push('/favorites')
}

/**
 * 이전 페이지로 이동
 */
export function navigateBack(router: AppRouterInstance): void {
  router.back()
}

