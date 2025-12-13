/**
 * 에러 상태 컴포넌트
 * 반복되는 에러 상태 UI 패턴 통합
 */

import { ReactNode } from 'react'
import { GLASS_CARD_CLASSES, TEXT_CLASSES } from '../config/css-classes'

interface ErrorStateProps {
  message: string
  action?: ReactNode
  className?: string
}

export default function ErrorState({ message, action, className }: ErrorStateProps) {
  return (
    <div className={`${GLASS_CARD_CLASSES.error} p-4 text-center sm:p-6 ${className ?? ''}`}>
      <p className={TEXT_CLASSES.error}>{message}</p>
      {action && <div className="mt-3 sm:mt-4">{action}</div>}
    </div>
  )
}

