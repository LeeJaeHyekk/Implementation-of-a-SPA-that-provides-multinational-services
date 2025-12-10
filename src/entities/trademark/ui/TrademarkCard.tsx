'use client'

import FavoriteButton from '@/features/favorites/ui/FavoriteButton'
import { NormalizedTrademark } from '../model/types'

interface TrademarkCardProps {
  trademark: NormalizedTrademark
  onSelect?: (id: string) => void
}

export default function TrademarkCard({ trademark, onSelect }: TrademarkCardProps) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow-sm transition hover:border-indigo-400">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-slate-400">{trademark.country}</p>
          <h3 className="text-lg font-semibold text-slate-100">{trademark.productName}</h3>
          {trademark.productNameEng ? (
            <p className="text-sm text-slate-300">{trademark.productNameEng}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-indigo-300">
            {trademark.registerStatus}
          </span>
          <FavoriteButton trademarkId={trademark.id} />
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div>
          <dt className="text-slate-500">출원번호</dt>
          <dd className="font-medium text-slate-100">{trademark.applicationNumber}</dd>
        </div>
        <div>
          <dt className="text-slate-500">출원일</dt>
          <dd className="font-medium text-slate-100">
            {trademark.applicationDate ?? '미상'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">국제분류</dt>
          <dd className="font-medium text-slate-100">
            {trademark.productMainCodes.join(', ') || '-'}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">비엔나 코드</dt>
          <dd className="font-medium text-slate-100">
            {trademark.viennaCodeList.join(', ') || '-'}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onSelect?.(trademark.id)}
          className="rounded-md border border-indigo-500 px-3 py-1 text-sm text-indigo-200 transition hover:bg-indigo-500 hover:text-slate-900"
        >
          상세보기
        </button>
      </div>
    </article>
  )
}
