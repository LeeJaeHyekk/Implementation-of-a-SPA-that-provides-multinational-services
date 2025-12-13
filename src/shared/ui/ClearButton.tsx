'use client'

interface ClearButtonProps {
  onClick: () => void
  ariaLabel: string
  className?: string
}

/**
 * 필터나 입력 필드에서 값을 초기화하는 데 사용하는 공통 Clear 버튼 컴포넌트
 */
export default function ClearButton({ onClick, ariaLabel, className }: ClearButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs text-slate-400 transition hover:text-red-300 ${className ?? ''}`}
      aria-label={ariaLabel}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
}

