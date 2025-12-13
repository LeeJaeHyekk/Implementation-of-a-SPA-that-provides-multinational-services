/**
 * TanStack Query 상태 처리 공통 컴포넌트
 * 로딩, 에러, 빈 상태를 일관되게 처리
 */

import { ReactNode } from 'react'
import LoadingSpinner from './LoadingSpinner'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import { LAYOUT_CLASSES } from '../config/css-classes'

interface QueryStateHandlerProps {
  isLoading: boolean
  isError?: boolean
  isEmpty?: boolean
  errorMessage?: string
  emptyMessage?: string
  loadingMessage?: string
  onErrorAction?: () => void
  errorActionLabel?: string
  children: ReactNode
}

export default function QueryStateHandler({
  isLoading,
  isError = false,
  isEmpty = false,
  errorMessage = '데이터를 불러오는 중 오류가 발생했습니다.',
  emptyMessage = '데이터가 없습니다.',
  loadingMessage = '불러오는 중...',
  onErrorAction,
  errorActionLabel = '다시 시도',
  children,
}: QueryStateHandlerProps) {
  if (isError) {
    return (
      <div className={LAYOUT_CLASSES.centered}>
        <div className={LAYOUT_CLASSES.centeredContent}>
          <ErrorState
            message={errorMessage}
            action={
              onErrorAction ? (
                <button
                  type="button"
                  onClick={onErrorAction}
                  className="glass-button mt-4 rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-indigo-200"
                >
                  {errorActionLabel}
                </button>
              ) : undefined
            }
          />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <LoadingSpinner size="lg" color="indigo" text={loadingMessage} fullScreen />
    )
  }

  if (isEmpty) {
    return (
      <div className={LAYOUT_CLASSES.centered}>
        <div className={LAYOUT_CLASSES.centeredContent}>
          <EmptyState message={emptyMessage} />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

