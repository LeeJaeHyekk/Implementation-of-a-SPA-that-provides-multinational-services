import LoadingSpinner from '@/shared/ui/LoadingSpinner'

interface ResultSummaryProps {
  total: number
  filtered: number
  country: string
  isLoading?: boolean
}

export default function ResultSummary({
  total,
  filtered,
  country,
  isLoading = false,
}: ResultSummaryProps) {
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm text-slate-200">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {isLoading && <LoadingSpinner size="sm" color="indigo" />}
        <p className="font-medium">
          {country} 상표 {isLoading ? '불러오는 중...' : `${filtered} / ${total}건`}
        </p>
      </div>
    </div>
  )
}
