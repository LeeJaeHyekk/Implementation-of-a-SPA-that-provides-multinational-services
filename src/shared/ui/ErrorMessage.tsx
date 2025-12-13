'use client'

/**
 * 에러 메시지 표시 컴포넌트
 * 레이아웃 시프트를 방지하기 위해 항상 렌더링되며,
 * 에러가 없을 때는 투명하게 처리됩니다.
 */

interface ErrorMessageProps {
  message: string | null
  className?: string
}

export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`mt-1 min-h-[1.25rem] ${className}`}>
      <p
        className={`text-xs font-medium drop-shadow-sm transition-opacity sm:text-sm ${
          message
            ? 'text-red-300 opacity-100'
            : 'text-transparent opacity-0 pointer-events-none'
        }`}
        role="alert"
        aria-live="polite"
      >
        {message || '\u00A0'}
      </p>
    </div>
  )
}

