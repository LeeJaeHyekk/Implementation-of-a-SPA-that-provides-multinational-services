'use client'

/**
 * 네비게이션 버튼 컴포넌트
 * 반복되는 네비게이션 버튼 패턴 통합
 */

import { useRouter } from 'next/navigation'
import { navigateToSearch, navigateToFavorites } from '../utils/navigation'
import { GLASS_BUTTON_CLASSES } from '../config/css-classes'

interface NavigateButtonProps {
  to: 'search' | 'favorites'
  label?: string
  variant?: 'default' | 'primary'
  className?: string
}

const BUTTON_LABELS = {
  search: '검색으로 돌아가기',
  favorites: '즐겨찾기로 이동',
} as const

export default function NavigateButton({
  to,
  label,
  variant = 'default',
  className,
}: NavigateButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (to === 'search') {
      navigateToSearch(router)
    } else {
      navigateToFavorites(router)
    }
  }

  const buttonClass = variant === 'primary' ? GLASS_BUTTON_CLASSES.primary : GLASS_BUTTON_CLASSES.base

  return (
    <button type="button" onClick={handleClick} className={`${buttonClass} ${className ?? ''}`}>
      {label ?? BUTTON_LABELS[to]}
    </button>
  )
}

