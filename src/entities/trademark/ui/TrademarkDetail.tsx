import { NormalizedTrademark } from '../model/types'
import { formatDateToDot, formatDateArray } from '@/shared/utils/date-utils'
import { joinArrayOrDash } from '@/shared/utils/string-utils'
import { getTrademarkStatusLabel } from '../lib/getStatusLabel'
import { GRID_CLASSES } from '@/shared/config/css-classes'
import { safeExecute } from '@/shared/utils/error-handler'

interface TrademarkDetailProps {
  trademark: NormalizedTrademark
}

interface DetailField {
  label: string
  value: string
}

export default function TrademarkDetail({ trademark }: TrademarkDetailProps) {
  // trademark 유효성 검증
  if (!trademark || typeof trademark !== 'object' || !trademark.id) {
    globalThis.console?.warn?.('[TrademarkDetail] Invalid trademark prop', { trademark })
    return (
      <div className="glass-card rounded-xl p-4 text-center sm:rounded-2xl sm:p-6">
        <p className="text-xs sm:text-sm text-slate-300">상표 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  const statusLabel = safeExecute(
    () => getTrademarkStatusLabel(trademark),
    '알수없음',
    { trademarkId: trademark.id, action: 'getStatusLabel' },
  )
  const isKR = trademark.country === 'KR'

  // 국가별 필드 정의 (안전한 값 추출)
  const fields: DetailField[] = safeExecute(
    () => {
      const getSafeValue = (getter: () => string): string => {
        return safeExecute(getter, '-', { trademarkId: trademark.id })
      }

      return isKR
        ? [
            { label: '출원번호', value: trademark.applicationNumber || '-' },
            { label: '출원일', value: getSafeValue(() => formatDateToDot(trademark.applicationDate, trademark.country)) },
            { label: '상태', value: statusLabel },
            { label: '공고번호', value: trademark.publicationNumber ?? '-' },
            { label: '공고일', value: getSafeValue(() => formatDateToDot(trademark.publicationDate, trademark.country)) },
            { label: '등록번호', value: getSafeValue(() => joinArrayOrDash(trademark.registrationNumber)) },
            { label: '등록일', value: getSafeValue(() => formatDateArray(trademark.registrationDate, trademark.country)) },
            { label: '등록 공고 번호', value: trademark.registrationPubNumber ?? '-' },
            { label: '등록 공고일', value: getSafeValue(() => formatDateToDot(trademark.registrationPubDate, trademark.country)) },
            { label: '국제등록번호', value: getSafeValue(() => joinArrayOrDash(trademark.internationalRegNumbers)) },
            { label: '국제등록일', value: getSafeValue(() => formatDateToDot(trademark.internationalRegDate, trademark.country)) },
            { label: '우선권번호', value: getSafeValue(() => joinArrayOrDash(trademark.priorityClaimNumList)) },
            { label: '우선권일', value: getSafeValue(() => formatDateArray(trademark.priorityClaimDateList, trademark.country)) },
            { label: '상품 주 분류 코드', value: getSafeValue(() => joinArrayOrDash(trademark.productMainCodes)) },
            { label: '상품 유사군 코드', value: getSafeValue(() => joinArrayOrDash(trademark.productSubCodes)) },
            { label: '비엔나 코드', value: getSafeValue(() => joinArrayOrDash(trademark.viennaCodeList)) },
          ]
        : [
            { label: '출원번호', value: trademark.applicationNumber || '-' },
            { label: '출원일', value: getSafeValue(() => formatDateToDot(trademark.applicationDate, trademark.country)) },
            { label: '상태', value: statusLabel },
            { label: '공고일', value: getSafeValue(() => formatDateToDot(trademark.publicationDate, trademark.country)) },
            { label: '등록번호', value: getSafeValue(() => joinArrayOrDash(trademark.registrationNumber)) },
            { label: '등록일', value: getSafeValue(() => formatDateArray(trademark.registrationDate, trademark.country)) },
            { label: '국제등록번호', value: getSafeValue(() => joinArrayOrDash(trademark.internationalRegNumbers)) },
            { label: '국제등록일', value: getSafeValue(() => formatDateToDot(trademark.internationalRegDate, trademark.country)) },
            { label: '우선권번호', value: getSafeValue(() => joinArrayOrDash(trademark.priorityClaimNumList)) },
            { label: '우선권일', value: getSafeValue(() => formatDateArray(trademark.priorityClaimDateList, trademark.country)) },
            { label: 'Nice 분류 코드', value: getSafeValue(() => joinArrayOrDash(trademark.productMainCodes)) },
            { label: 'US 코드', value: getSafeValue(() => joinArrayOrDash(trademark.usClassCodes)) },
            { label: '비엔나 코드', value: getSafeValue(() => joinArrayOrDash(trademark.viennaCodeList)) },
          ]
    },
    [],
    { trademarkId: trademark.id, action: 'buildFields' },
  )

  return (
    <section className="glass-card space-y-4 rounded-xl p-4 sm:space-y-6 sm:rounded-2xl sm:p-6">
      <div className="space-y-1.5 sm:space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-indigo-300 drop-shadow-sm">
          {trademark.country}
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-50 drop-shadow-md break-words">
          {trademark.productName || '이름 없음'}
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
