'use client'

import FavoriteButton from '@/features/favorites/ui/FavoriteButton'
import { NormalizedTrademark } from '../model/types'

interface TrademarkCardProps {
  trademark: NormalizedTrademark
  onSelect?: (id: string) => void
}

export default function TrademarkCard({ trademark, onSelect }: TrademarkCardProps) {
  return (
    <article className="glass-card rounded-xl border border-slate-700/30 bg-slate-900/40 p-4 shadow-lg backdrop-blur-md transition-all hover:border-indigo-400/40 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 drop-shadow-sm">
            {trademark.country}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-100 drop-shadow-sm">
            {trademark.productName}
          </h3>
          {trademark.productNameEng ? (
            <p className="mt-0.5 text-sm text-slate-300 drop-shadow-sm">{trademark.productNameEng}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="glass-badge rounded-lg bg-indigo-500/20 px-2 py-1 text-xs font-medium text-indigo-200 backdrop-blur-sm">
            {trademark.registerStatus}
          </span>
          <FavoriteButton trademarkId={trademark.id} />
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div>
          <dt className="text-slate-400 drop-shadow-sm">출원번호</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm">{trademark.applicationNumber}</dd>
        </div>
        <div>
          <dt className="text-slate-400 drop-shadow-sm">출원일</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm">
            {trademark.applicationDate ?? '미상'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400 drop-shadow-sm">국제분류</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm">
            {trademark.productMainCodes.join(', ') || '-'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400 drop-shadow-sm">비엔나 코드</dt>
          <dd className="mt-0.5 font-medium text-slate-100 drop-shadow-sm">
            {trademark.viennaCodeList.join(', ') || '-'}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onSelect?.(trademark.id)}
          className="glass-button glass-button-primary rounded-lg px-4 py-1.5 text-sm font-medium text-indigo-200 transition"
        >
          상세보기
        </button>
      </div>
    </article>
  )
}
