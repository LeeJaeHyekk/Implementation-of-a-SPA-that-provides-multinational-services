/**
 * 로딩 스피너 컴포넌트
 */

interface LoadingSpinnerProps {
  /**
   * 스피너 크기 (기본값: 'md')
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 스피너 색상 (기본값: 'indigo')
   */
  color?: 'indigo' | 'slate' | 'white'
  /**
   * 텍스트 표시 여부
   */
  text?: string
  /**
   * 전체 화면 오버레이 여부
   */
  fullScreen?: boolean
}

export default function LoadingSpinner({
  size = 'md',
  color = 'indigo',
  text,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  }

  const colorClasses = {
    indigo: 'border-indigo-500 border-t-transparent',
    slate: 'border-slate-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  }

  const textColorClasses = {
    indigo: 'text-slate-300',
    slate: 'text-slate-300',
    white: 'text-white',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin rounded-full`}
        role="status"
        aria-label="로딩 중"
      >
        <span className="sr-only">로딩 중...</span>
      </div>
      {text && <p className={`${textColorClasses[color]} text-xs sm:text-sm`}>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur">
        {spinner}
      </div>
    )
  }

  return spinner
}

