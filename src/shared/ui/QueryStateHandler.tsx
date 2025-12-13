/**
 * TanStack Query 상태 처리 공통 컴포넌트
 * 로딩, 에러, 빈 상태를 일관되게 처리
 */

import { ReactNode } from 'react'
import LoadingSpinner from './LoadingSpinner'

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
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-2xl border-red-500/40 bg-red-950/30 p-6 text-center">
            <p className="text-sm font-medium text-red-200">{errorMessage}</p>
            {onErrorAction && (
              <button
                type="button"
                onClick={onErrorAction}
                className="glass-button mt-4 rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-indigo-200"
              >
                {errorActionLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-2xl p-6 text-center">
            <LoadingSpinner size="lg" color="indigo" text={loadingMessage} />
          </div>
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-sm font-medium text-slate-300">{emptyMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

