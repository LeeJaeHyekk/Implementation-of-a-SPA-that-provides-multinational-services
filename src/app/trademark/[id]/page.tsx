'use client'

import { useMemo, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import FavoriteButton from '@/features/favorites/ui/FavoriteButton'
import TrademarkDetail from '@/entities/trademark/ui/TrademarkDetail'
import { TrademarkCountry } from '@/entities/trademark/model'
import { resolveCountry } from '@/entities/trademark/lib/resolve-country'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import QueryStateHandler from '@/shared/ui/QueryStateHandler'
import BackButton from '@/shared/ui/BackButton'
import NavigateButton from '@/shared/ui/NavigateButton'
import { navigateToSearch } from '@/shared/utils/navigation'
import { LAYOUT_CLASSES } from '@/shared/config/css-classes'

interface TrademarkDetailRouteProps {
  params: Promise<{
    id: string
  }>
}

export default function TrademarkDetailRoute({ params }: TrademarkDetailRouteProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  
  // resolveCountry 에러 처리
  let country: TrademarkCountry
  try {
    country = resolveCountry(resolvedParams.id)
  } catch (error) {
    globalThis.console?.error?.('[TrademarkDetail] Failed to resolve country', error)
    // 기본값으로 KR 사용
    country = 'KR'
  }
  
  const { data, isLoading, isError } = useTrademarksQuery({ country })
  const trademarks = useMemo(() => data ?? [], [data])

  const trademark = useMemo(
    () => trademarks.find((item) => item.id === resolvedParams.id),
    [trademarks, resolvedParams.id],
  )

  // 페이지 제목 동적 업데이트
  useEffect(() => {
    if (typeof document !== 'undefined' && trademark) {
      document.title = `${trademark.productName} | 다국가 상표 검색`
    }
  }, [trademark])

  return (
    <QueryStateHandler
      isLoading={isLoading || !data}
      isError={isError}
      isEmpty={!trademark}
      errorMessage="데이터를 불러오는 중 오류가 발생했습니다."
      emptyMessage="해당 상표를 찾을 수 없습니다."
      loadingMessage="불러오는 중..."
      onErrorAction={() => navigateToSearch(router)}
      errorActionLabel="검색으로 돌아가기"
    >
      {trademark ? (
        <>
          <div className={LAYOUT_CLASSES.centered}>
            <div className={`${LAYOUT_CLASSES.centeredContent} ${LAYOUT_CLASSES.spaceY}`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <BackButton />
                <FavoriteButton trademarkId={trademark.id} />
              </div>
              <TrademarkDetail trademark={trademark} />
            </div>
          </div>
        </>
      ) : (
        <div className={LAYOUT_CLASSES.centered}>
          <div className={LAYOUT_CLASSES.centeredContent}>
            <div className="glass-card rounded-xl p-4 text-center sm:rounded-2xl sm:p-6">
              <p className="text-xs sm:text-sm text-slate-300">해당 상표를 찾을 수 없습니다.</p>
              <NavigateButton to="search" variant="primary" className="mt-3 sm:mt-4" />
            </div>
          </div>
        </div>
      )}
    </QueryStateHandler>
  )
}
