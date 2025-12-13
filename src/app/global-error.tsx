'use client'

import { useEffect } from 'react'
import ErrorState from '@/shared/ui/ErrorState'
import { LAYOUT_CLASSES } from '@/shared/config/css-classes'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 글로벌 에러 로깅
    globalThis.console?.error?.('[GlobalErrorBoundary]', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    })
  }, [error])

  return (
    <html lang="ko">
      <body>
        <div className={LAYOUT_CLASSES.container}>
          <div className={LAYOUT_CLASSES.centered}>
            <div className={LAYOUT_CLASSES.centeredContent}>
              <ErrorState
                message="심각한 오류가 발생했습니다. 페이지를 새로고침해주세요."
                action={
                  <button
                    type="button"
                    onClick={reset}
                    className="glass-button glass-button-primary rounded-lg px-4 py-2 text-sm font-medium text-indigo-200 transition"
                  >
                    페이지 새로고침
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

