/**
 * 뒤로가기 버튼 컴포넌트
 * 반복되는 뒤로가기 버튼 패턴 통합
 */

import { useRouter } from 'next/navigation'
import { navigateBack } from '../utils/navigation'
import { GLASS_BUTTON_CLASSES } from '../config/css-classes'

interface BackButtonProps {
  label?: string
  className?: string
}

export default function BackButton({ label = '뒤로가기', className }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => navigateBack(router)}
      className={`${GLASS_BUTTON_CLASSES.back} ${className ?? ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

