'use client'

import { useMemo, useState, useEffect } from 'react'
import { SEARCH_CONSTANTS } from '@/shared/config/constants'

interface UsePaginationOptions {
  totalItems: number
  pageSize?: number
  initialPage?: number
}

interface UsePaginationReturn<T> {
  currentPage: number
  totalPages: number
  pageSize: number
  setPage: (page: number | ((prev: number) => number)) => void
  goToNextPage: () => void
  goToPrevPage: () => void
  pagedItems: T[]
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * 페이지네이션 로직을 관리하는 공통 훅
 * SearchResultsPanel에서 중복되던 로직을 통합
 */
export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = { totalItems: 0 },
): UsePaginationReturn<T> {
  const { totalItems, pageSize = SEARCH_CONSTANTS.PAGE_SIZE, initialPage = 1 } = options

  const [page, setPage] = useState(initialPage)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // 페이지 번호가 유효하지 않은 경우 1로 설정
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page
  const currentPage = Math.min(safePage, totalPages)

  // 페이지가 변경되면 유효한 범위로 조정
  useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage)
    }
  }, [currentPage, page])

  const pagedItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  )

  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalItems)

  const goToNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1))
  }

  const goToPrevPage = () => {
    setPage((p) => Math.max(1, p - 1))
  }

  return {
    currentPage,
    totalPages,
    pageSize,
    setPage,
    goToNextPage,
    goToPrevPage,
    pagedItems,
    startIndex,
    endIndex,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }
}

