'use client'

import { type ReactNode } from 'react'

interface ActionButtonProps {
  onClick: () => void
  isActive?: boolean
  isDisabled?: boolean
  ariaLabel: string
  title?: string
  size?: 'sm' | 'md'
  className?: string
  children: ReactNode
}

/**
 * 공통 액션 버튼 컴포넌트
 * CompareButton, FavoriteButton 등에서 사용되는 공통 패턴을 모듈화
 */
export default function ActionButton({
  onClick,
  isActive = false,
  isDisabled = false,
  ariaLabel,
  title,
  size = 'md',
  className = '',
  children,
}: ActionButtonProps) {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 sm:px-2 sm:py-1',
    md: 'px-1.5 py-0.5 sm:px-2 sm:py-1',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`glass-button flex items-center justify-center rounded-lg ${sizeClasses[size]} transition ${
        isActive
          ? 'glass-button-primary text-indigo-200'
          : 'text-slate-200 hover:text-indigo-200'
      } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </button>
  )
}

