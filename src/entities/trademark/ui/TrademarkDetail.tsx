import { NormalizedTrademark } from '../model/types'

interface TrademarkDetailProps {
  trademark: NormalizedTrademark
}

export default function TrademarkDetail({ trademark }: TrademarkDetailProps) {
  return (
    <section className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-100">
      <div>
        <p className="text-xs uppercase text-slate-400">{trademark.country}</p>
        <h1 className="text-2xl font-semibold">{trademark.productName}</h1>
        {trademark.productNameEng ? (
          <p className="text-slate-300">{trademark.productNameEng}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <DetailItem label="출원번호" value={trademark.applicationNumber} />
        <DetailItem label="출원일" value={trademark.applicationDate ?? '미상'} />
        <DetailItem label="상태" value={trademark.registerStatus} />
        <DetailItem label="공고번호" value={trademark.publicationNumber ?? '-'} />
        <DetailItem label="공고일" value={trademark.publicationDate ?? '-'} />
        <DetailItem label="등록번호" value={trademark.registrationNumber.join(', ') || '-'} />
        <DetailItem label="등록일" value={trademark.registrationDate.join(', ') || '-'} />
        <DetailItem label="국제등록번호" value={trademark.internationalRegNumbers.join(', ') || '-'} />
        <DetailItem label="국제등록일" value={trademark.internationalRegDate ?? '-'} />
        <DetailItem label="우선권번호" value={trademark.priorityClaimNumList.join(', ') || '-'} />
        <DetailItem label="우선권일" value={trademark.priorityClaimDateList.join(', ') || '-'} />
        <DetailItem label="상품류(주)" value={trademark.productMainCodes.join(', ') || '-'} />
        <DetailItem label="상품류(부)" value={trademark.productSubCodes?.join(', ') || '-'} />
        <DetailItem label="US Class" value={trademark.usClassCodes?.join(', ') || '-'} />
        <DetailItem label="비엔나 코드" value={trademark.viennaCodeList.join(', ') || '-'} />
      </div>
    </section>
  )
}

interface DetailItemProps {
  label: string
  value: string
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-100">{value}</p>
    </div>
  )
}
