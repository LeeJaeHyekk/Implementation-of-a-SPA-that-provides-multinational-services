'use client'

import { useEffect } from 'react'
import ErrorState from '@/shared/ui/ErrorState'
import NavigateButton from '@/shared/ui/NavigateButton'
import { LAYOUT_CLASSES } from '@/shared/config/css-classes'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅
    globalThis.console?.error?.('[ErrorBoundary]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.centered}>
        <div className={LAYOUT_CLASSES.centeredContent}>
          <ErrorState
            message="예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요."
            action={
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={reset}
                  className="glass-button glass-button-primary rounded-lg px-4 py-2 text-sm font-medium text-indigo-200 transition"
                >
                  다시 시도
                </button>
                <NavigateButton to="search" variant="primary" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}

