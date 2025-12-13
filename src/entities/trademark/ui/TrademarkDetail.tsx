import { NormalizedTrademark } from '../model/types'
import { formatDateToDot, formatDateArray } from '@/shared/utils/date-utils'
import { joinArrayOrDash } from '@/shared/utils/string-utils'
import { STATUS_LABELS } from '../model/constants'
import { GRID_CLASSES } from '@/shared/config/css-classes'

interface TrademarkDetailProps {
  trademark: NormalizedTrademark
}

interface DetailField {
  label: string
  value: string
}

export default function TrademarkDetail({ trademark }: TrademarkDetailProps) {
  const statusLabel = STATUS_LABELS[trademark.registerStatus] || trademark.registerStatus
  const isKR = trademark.country === 'KR'

  // 국가별 필드 정의
  const fields: DetailField[] = isKR
    ? [
        { label: '출원번호', value: trademark.applicationNumber },
        { label: '출원일', value: formatDateToDot(trademark.applicationDate) },
        { label: '상태', value: statusLabel },
        { label: '공고번호', value: trademark.publicationNumber ?? '-' },
        { label: '공고일', value: formatDateToDot(trademark.publicationDate) },
        { label: '등록번호', value: joinArrayOrDash(trademark.registrationNumber) },
        { label: '등록일', value: formatDateArray(trademark.registrationDate) },
        { label: '등록 공고 번호', value: trademark.registrationPubNumber ?? '-' },
        { label: '등록 공고일', value: formatDateToDot(trademark.registrationPubDate) },
        { label: '국제등록번호', value: joinArrayOrDash(trademark.internationalRegNumbers) },
        { label: '국제등록일', value: formatDateToDot(trademark.internationalRegDate) },
        { label: '우선권번호', value: joinArrayOrDash(trademark.priorityClaimNumList) },
        { label: '우선권일', value: formatDateArray(trademark.priorityClaimDateList) },
        { label: '상품 주 분류 코드', value: joinArrayOrDash(trademark.productMainCodes) },
        { label: '상품 유사군 코드', value: joinArrayOrDash(trademark.productSubCodes) },
        { label: '비엔나 코드', value: joinArrayOrDash(trademark.viennaCodeList) },
      ]
    : [
        { label: '출원번호', value: trademark.applicationNumber },
        { label: '출원일', value: formatDateToDot(trademark.applicationDate) },
        { label: '상태', value: statusLabel },
        { label: '공고일', value: formatDateToDot(trademark.publicationDate) },
        { label: '등록번호', value: joinArrayOrDash(trademark.registrationNumber) },
        { label: '등록일', value: formatDateArray(trademark.registrationDate) },
        { label: '국제등록번호', value: joinArrayOrDash(trademark.internationalRegNumbers) },
        { label: '국제등록일', value: formatDateToDot(trademark.internationalRegDate) },
        { label: '우선권번호', value: joinArrayOrDash(trademark.priorityClaimNumList) },
        { label: '우선권일', value: formatDateArray(trademark.priorityClaimDateList) },
        { label: 'Nice 분류 코드', value: joinArrayOrDash(trademark.productMainCodes) },
        { label: 'US 코드', value: joinArrayOrDash(trademark.usClassCodes) },
        { label: '비엔나 코드', value: joinArrayOrDash(trademark.viennaCodeList) },
      ]

  return (
    <section className="glass-card space-y-4 rounded-xl p-4 sm:space-y-6 sm:rounded-2xl sm:p-6">
      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-300 drop-shadow-sm">
          {trademark.country}
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-50 drop-shadow-md break-words">
          {trademark.productName}
        </h1>
        {trademark.productNameEng ? (
          <p className="text-xs sm:text-sm text-slate-300 drop-shadow-sm break-words">{trademark.productNameEng}</p>
        ) : null}
      </div>

      <div className={GRID_CLASSES.detailGrid}>
        {fields.map((field) => (
          <DetailItem key={field.label} label={field.label} value={field.value} />
        ))}
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
    <div className="glass-card flex flex-col gap-0.5 sm:gap-1 rounded-lg px-2.5 py-1.5 sm:rounded-xl sm:px-3 sm:py-2">
      <p className="text-xs text-slate-400 drop-shadow-sm">{label}</p>
      <p className="text-xs sm:text-sm font-medium text-slate-100 break-words drop-shadow-sm">{value}</p>
    </div>
  )
}
