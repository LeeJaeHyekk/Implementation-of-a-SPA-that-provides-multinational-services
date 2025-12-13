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
    <div className="glass-card rounded-lg px-4 py-3 text-sm text-slate-200">
      <div className="flex items-center gap-2">
        {isLoading && <LoadingSpinner size="sm" color="indigo" />}
        <p className="font-medium">
          {country} 상표 {isLoading ? '불러오는 중...' : `${filtered} / ${total}건`}
        </p>
      </div>
    </div>
  )
}
