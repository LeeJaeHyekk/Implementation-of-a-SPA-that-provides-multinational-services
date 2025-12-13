'use client'

import { useComparisonStore } from '../model/store'
import { isValidTrademarkId } from '../model/guards'
import { safeExecute } from '@/shared/utils/error-handler'

interface CompareButtonProps {
  trademarkId: string
  size?: 'sm' | 'md'
}

export default function CompareButton({ trademarkId, size = 'md' }: CompareButtonProps) {
  // 타입 가드로 ID 검증
  if (!isValidTrademarkId(trademarkId)) {
    globalThis.console?.warn?.('[CompareButton] Invalid trademark ID', { trademarkId })
    return null
  }

  const isInComparison = useComparisonStore((state) => state.isInComparison(trademarkId))
  const canAdd = useComparisonStore((state) => state.canAdd())
  const add = useComparisonStore((state) => state.add)
  const remove = useComparisonStore((state) => state.remove)

  const isDisabled = !isInComparison && !canAdd

  function handleClick() {
    // 클릭 시에도 ID 재검증
    if (!isValidTrademarkId(trademarkId)) {
      globalThis.console?.warn?.('[CompareButton] Invalid trademark ID on click', { trademarkId })
      return
    }

    safeExecute(
      () => {
        if (isInComparison) {
          remove(trademarkId)
        } else if (canAdd) {
          add(trademarkId)
        }
      },
      undefined,
      { trademarkId, action: isInComparison ? 'remove' : 'add' },
    )
  }

  const sizeClasses = {
    sm: 'h-3.5 w-3.5 sm:h-4 sm:w-4',
    md: 'h-4 w-4 sm:h-5 sm:w-5',
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`glass-button flex items-center justify-center rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 transition ${
        isInComparison
          ? 'glass-button-primary text-indigo-200'
          : 'text-slate-200 hover:text-indigo-200'
      } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
      aria-label={isInComparison ? '비교에서 제거' : '비교에 추가'}
      title={isDisabled && !isInComparison ? '최대 비교 개수에 도달했습니다 (최대 5개)' : undefined}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} transition-colors ${isInComparison ? 'fill-current' : 'fill-none'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    </button>
  )
}

