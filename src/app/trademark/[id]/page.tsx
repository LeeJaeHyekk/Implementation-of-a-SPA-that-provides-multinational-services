'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import FavoriteButton from '@/features/favorites/ui/FavoriteButton'
import { TrademarkCountry } from '@/entities/trademark/model'
import TrademarkDetail from '@/entities/trademark/ui/TrademarkDetail'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'

interface TrademarkDetailRouteProps {
  params: {
    id: string
  }
}

function resolveCountry(id: string): TrademarkCountry {
  if (id.startsWith('US-')) return 'US'
  return 'KR'
}

export default function TrademarkDetailRoute({ params }: TrademarkDetailRouteProps) {
  const router = useRouter()
  const country = resolveCountry(params.id)
  const { data, isLoading, isError } = useTrademarksQuery({ country })
  const trademarks = useMemo(() => data ?? [], [data])

  const trademark = useMemo(
    () => trademarks.find((item) => item.id === params.id),
    [trademarks, params.id],
  )

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-sm text-red-200">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-sm text-slate-300">불러오는 중...</p>
      </div>
    )
  }

  if (!trademark) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <p className="text-sm text-slate-300">해당 상표를 찾을 수 없습니다.</p>
        <button
          type="button"
          onClick={() => router.push('/search')}
          className="mt-3 rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-200 transition hover:bg-indigo-500 hover:text-slate-900"
        >
          검색으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 transition hover:border-indigo-400"
      >
        뒤로가기
      </button>
      <div className="flex items-center justify-between">
        <p className="text-sm text-indigo-300">상세 보기</p>
        <FavoriteButton trademarkId={trademark.id} />
      </div>
      <TrademarkDetail trademark={trademark} />
    </div>
  )
}
