'use client'

import { useMemo, use } from 'react'
import { useRouter } from 'next/navigation'

import FavoriteButton from '@/features/favorites/ui/FavoriteButton'
import { TrademarkCountry } from '@/entities/trademark/model'
import TrademarkDetail from '@/entities/trademark/ui/TrademarkDetail'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'

interface TrademarkDetailRouteProps {
  params: Promise<{
    id: string
  }>
}

function resolveCountry(id: string): TrademarkCountry {
  if (id.startsWith('US-')) return 'US'
  return 'KR'
}

export default function TrademarkDetailRoute({ params }: TrademarkDetailRouteProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const country = resolveCountry(resolvedParams.id)
  const { data, isLoading, isError } = useTrademarksQuery({ country })
  const trademarks = useMemo(() => data ?? [], [data])

  const trademark = useMemo(
    () => trademarks.find((item) => item.id === resolvedParams.id),
    [trademarks, resolvedParams.id],
  )

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-2xl border-red-500/40 bg-red-950/30 p-6 text-center">
            <p className="text-sm font-medium text-red-200">데이터를 불러오는 중 오류가 발생했습니다.</p>
            <button
              type="button"
              onClick={() => router.push('/search')}
              className="glass-button mt-4 rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-indigo-200"
            >
              검색으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-sm text-slate-300">불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!trademark) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-sm text-slate-300">해당 상표를 찾을 수 없습니다.</p>
            <button
              type="button"
              onClick={() => router.push('/search')}
              className="glass-button glass-button-primary mt-4 rounded-lg px-4 py-2 text-sm font-medium text-indigo-200 transition"
            >
              검색으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="glass-button flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-indigo-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
          <FavoriteButton trademarkId={trademark.id} />
        </div>
        <TrademarkDetail trademark={trademark} />
      </div>
    </div>
  )
}
