/**
 * 빈 상태 컴포넌트
 * 반복되는 빈 상태 UI 패턴 통합
 */

import { ReactNode } from 'react'
import { GLASS_CARD_CLASSES, TEXT_CLASSES } from '../config/css-classes'

interface EmptyStateProps {
  message: string
  action?: ReactNode
  className?: string
}

export default function EmptyState({ message, action, className }: EmptyStateProps) {
  return (
    <div className={`${GLASS_CARD_CLASSES.large} text-center ${className ?? ''}`}>
      <p className={TEXT_CLASSES.empty}>{message}</p>
      {action && <div className="mt-3 sm:mt-4">{action}</div>}
    </div>
  )
}

