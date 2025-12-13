'use client'

import FavoriteButton from '@/features/favorites/ui/FavoriteButton'
import CompareButton from '@/features/comparison/ui/CompareButton'
import { NormalizedTrademark } from '../model/types'
import { getTrademarkStatusLabel } from '../lib/getStatusLabel'
import { getTrademarkDefaultValue } from '../lib/getDefaultValue'
import { safeExecute } from '@/shared/utils/error-handler'

interface TrademarkCardProps {
  trademark: NormalizedTrademark
  onSelect?: (id: string) => void
}

export default function TrademarkCard({ trademark, onSelect }: TrademarkCardProps) {
  // trademark 유효성 검증
  if (!trademark || typeof trademark !== 'object' || !trademark.id) {
    globalThis.console?.warn?.('[TrademarkCard] Invalid trademark prop', { trademark })
    return null
  }

  const handleSelect = () => {
    safeExecute(
      () => {
        if (trademark?.id && onSelect) {
          onSelect(trademark.id)
        }
      },
      undefined,
      { trademarkId: trademark.id, action: 'selectTrademark' },
    )
  }

  // 안전한 값 추출
  const statusLabel = safeExecute(
    () => getTrademarkStatusLabel(trademark),
    '알수없음',
    { trademarkId: trademark.id, action: 'getStatusLabel' },
  )

  const productName = trademark.productName || '이름 없음'
  const productNameEng = trademark.productNameEng || null
  const applicationNumber = trademark.applicationNumber || '-'
  const defaultValue = getTrademarkDefaultValue(trademark)
  const applicationDate = trademark.applicationDate ?? defaultValue
  const productMainCodes = Array.isArray(trademark.productMainCodes)
    ? trademark.productMainCodes
    : []
  const viennaCodeList = Array.isArray(trademark.viennaCodeList) ? trademark.viennaCodeList : []

  return (
    <article className="glass-card rounded-lg border border-slate-700/30 bg-slate-900/40 p-3 shadow-lg backdrop-blur-md transition-all hover:border-indigo-400/40 hover:shadow-xl sm:rounded-xl sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 drop-shadow-sm">
            {trademark.country}
          </p>
          <h3 className="mt-1 text-base sm:text-lg font-semibold text-slate-100 drop-shadow-sm break-words">
            {productName}
          </h3>
          {productNameEng ? (
            <p className="mt-0.5 text-xs sm:text-sm text-slate-300 drop-shadow-sm break-words">{productNameEng}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 sm:flex-shrink-0">
          <span className="glass-badge rounded-lg bg-indigo-500/20 px-1.5 py-0.5 text-xs font-medium text-indigo-200 backdrop-blur-sm sm:px-2 sm:py-1">
            {statusLabel}
          </span>
          <CompareButton trademarkId={trademark.id} size="sm" />
          <FavoriteButton trademarkId={trademark.id} />
        </div>
      </div>

      <dl className="mt-2 sm:mt-3 grid grid-cols-2 gap-1.5 sm:gap-2 text-xs text-slate-300">
        <div>
          <dt className="text-slate-400 drop-shadow-sm">출원번호</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm break-words">{applicationNumber}</dd>
        </div>
        <div>
          <dt className="text-slate-400 drop-shadow-sm">출원일</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm break-words">{applicationDate}</dd>
        </div>
        <div>
          <dt className="text-slate-400 drop-shadow-sm">국제분류</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm break-words">
            {productMainCodes.join(', ') || '-'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400 drop-shadow-sm">비엔나 코드</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm break-words">
            {viennaCodeList.join(', ') || '-'}
          </dd>
        </div>
      </dl>

      <div className="mt-2 sm:mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleSelect}
          className="glass-button glass-button-primary rounded-lg px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-medium text-indigo-200 transition"
        >
          상세보기
        </button>
      </div>
    </article>
  )
}
