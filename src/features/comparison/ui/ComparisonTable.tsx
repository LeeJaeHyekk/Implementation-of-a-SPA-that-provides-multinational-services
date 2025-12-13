'use client'

import { useMemo } from 'react'
import { NormalizedTrademark, TrademarkCountry } from '@/entities/trademark/model'
import { isTrademarkArray } from '@/entities/trademark/lib/type-guards'
import { getTrademarkStatusLabel } from '@/entities/trademark/lib/getStatusLabel'
import { validateArray, safeExecute } from '@/shared/utils/error-handler'
import { formatDateToDot, formatDateArray } from '@/shared/utils/date-utils'
import { joinArrayOrDash } from '@/shared/utils/string-utils'

interface ComparisonTableProps {
  items: NormalizedTrademark[]
}

interface ComparisonRow {
  label: string
  field: keyof NormalizedTrademark | 'custom'
  countries: TrademarkCountry[]
  getValue: (item: NormalizedTrademark) => string
}

export default function ComparisonTable({ items }: ComparisonTableProps) {
  // 타입 가드로 items 검증
  if (!validateArray(items) || !isTrademarkArray(items)) {
    globalThis.console?.warn?.('[ComparisonTable] Invalid items array', { items })
    return (
      <div className="glass-card rounded-xl p-4 text-center sm:rounded-2xl sm:p-6">
        <p className="text-xs sm:text-sm text-slate-300">비교할 상표 데이터가 유효하지 않습니다.</p>
      </div>
    )
  }

  // 공통 필드 정의
  const commonRows: ComparisonRow[] = [
    {
      label: '상표명',
      field: 'productName',
      countries: ['KR', 'US'],
      getValue: (item) => item.productName,
    },
    {
      label: '영문명',
      field: 'productNameEng',
      countries: ['KR', 'US'],
      getValue: (item) => item.productNameEng ?? '-',
    },
    {
      label: '출원번호',
      field: 'applicationNumber',
      countries: ['KR', 'US'],
      getValue: (item) => item.applicationNumber || '-',
    },
    {
      label: '출원일',
      field: 'applicationDate',
      countries: ['KR', 'US'],
      getValue: (item) => formatDateToDot(item.applicationDate, item.country) ?? (item.country === 'US' ? 'Unknown' : '-'),
    },
    {
      label: '등록 상태',
      field: 'registerStatus',
      countries: ['KR', 'US'],
      getValue: (item) => getTrademarkStatusLabel(item),
    },
    {
      label: '등록번호',
      field: 'registrationNumber',
      countries: ['KR', 'US'],
      getValue: (item) => joinArrayOrDash(item.registrationNumber),
    },
    {
      label: '등록일',
      field: 'registrationDate',
      countries: ['KR', 'US'],
      getValue: (item) => formatDateArray(item.registrationDate, item.country),
    },
    {
      label: '국제출원번호',
      field: 'internationalRegNumbers',
      countries: ['KR', 'US'],
      getValue: (item) => joinArrayOrDash(item.internationalRegNumbers),
    },
    {
      label: '국제출원일',
      field: 'internationalRegDate',
      countries: ['KR', 'US'],
      getValue: (item) => formatDateToDot(item.internationalRegDate, item.country) ?? (item.country === 'US' ? 'Unknown' : '-'),
    },
    {
      label: '우선권 번호',
      field: 'priorityClaimNumList',
      countries: ['KR', 'US'],
      getValue: (item) => joinArrayOrDash(item.priorityClaimNumList),
    },
    {
      label: '우선권 일자',
      field: 'priorityClaimDateList',
      countries: ['KR', 'US'],
      getValue: (item) => formatDateArray(item.priorityClaimDateList, item.country),
    },
    {
      label: '비엔나 코드',
      field: 'viennaCodeList',
      countries: ['KR', 'US'],
      getValue: (item) => joinArrayOrDash(item.viennaCodeList),
    },
  ]

  // 한국 전용 필드
  const krOnlyRows: ComparisonRow[] = [
    {
      label: '공고번호',
      field: 'publicationNumber',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? item.publicationNumber ?? '-' : '-'),
    },
    {
      label: '공고일',
      field: 'publicationDate',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? formatDateToDot(item.publicationDate, item.country) ?? '-' : '-'),
    },
    {
      label: '등록 공고 번호',
      field: 'registrationPubNumber',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? item.registrationPubNumber ?? '-' : '-'),
    },
    {
      label: '등록 공고일',
      field: 'registrationPubDate',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? formatDateToDot(item.registrationPubDate, item.country) ?? '-' : '-'),
    },
    {
      label: '상품 주 분류 코드',
      field: 'productMainCodes',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? joinArrayOrDash(item.productMainCodes) : '-'),
    },
    {
      label: '상품 유사군 코드',
      field: 'productSubCodes',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? joinArrayOrDash(item.productSubCodes) : '-'),
    },
  ]

  // 미국 전용 필드
  const usOnlyRows: ComparisonRow[] = [
    {
      label: 'Nice 분류 코드',
      field: 'productMainCodes',
      countries: ['US'],
      getValue: (item) => (item.country === 'US' ? joinArrayOrDash(item.productMainCodes) : '-'),
    },
    {
      label: 'US 코드',
      field: 'usClassCodes',
      countries: ['US'],
      getValue: (item) => (item.country === 'US' ? joinArrayOrDash(item.usClassCodes) : '-'),
    },
  ]

  // 비교 항목에 포함된 국가 확인
  const includedCountries = useMemo(() => {
    const countries = new Set<TrademarkCountry>()
    items.forEach((item) => {
      // 타입 가드로 country 검증
      if (item && typeof item === 'object' && 'country' in item) {
        const country = item.country
        if (country === 'KR' || country === 'US') {
          countries.add(country)
        }
      }
    })
    return Array.from(countries)
  }, [items])

  // 표시할 행 결정 (포함된 국가에 해당하는 행만)
  const allRows = useMemo(() => {
    const rows: ComparisonRow[] = [...commonRows]
    
    if (includedCountries.includes('KR')) {
      rows.push(...krOnlyRows)
    }
    
    if (includedCountries.includes('US')) {
      rows.push(...usOnlyRows)
    }
    
    return rows
  }, [includedCountries])

  // 테이블 헤더가 없을 경우 처리
  if (items.length === 0) {
    return (
      <div className="glass-card rounded-xl p-4 text-center sm:rounded-2xl sm:p-6">
        <p className="text-xs sm:text-sm text-slate-300">비교할 상표가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden sm:rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/30">
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-300 sticky left-0 bg-slate-800/30 z-10">
                항목
              </th>
              {items.map((item) => {
                // 타입 가드로 item 검증
                if (!item || typeof item !== 'object' || !('id' in item) || !('country' in item) || !('productName' in item)) {
                  return (
                    <th
                      key={`invalid-${Math.random()}`}
                      className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-300 min-w-[200px]"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400">유효하지 않은 데이터</p>
                      </div>
                    </th>
                  )
                }

                return (
                  <th
                    key={item.id}
                    className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-300 min-w-[200px]"
                  >
                    <div className="space-y-1">
                      <p className="text-xs uppercase text-indigo-300">{item.country || 'UNKNOWN'}</p>
                      <p className="font-medium text-slate-100 break-words">{item.productName || '이름 없음'}</p>
                      {item.productNameEng ? (
                        <p className="text-xs text-slate-400 break-words">{item.productNameEng}</p>
                      ) : null}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, index) => (
              <tr
                key={`${row.field}-${index}`}
                className="border-b border-slate-700/30 hover:bg-slate-800/20 transition"
              >
                <td className="px-4 py-3 text-xs sm:text-sm font-medium text-slate-400 sticky left-0 bg-slate-900/80 z-10">
                  {row.label}
                </td>
                {items.map((item) => {
                  // 타입 가드로 item 검증
                  if (!item || typeof item !== 'object' || !('id' in item)) {
                    return (
                      <td
                        key={`invalid-${row.field}`}
                        className="px-4 py-3 text-xs sm:text-sm text-slate-200 break-words"
                      >
                        -
                      </td>
                    )
                  }

                  try {
                    const value = safeExecute(
                      () => row.getValue(item),
                      '-',
                      { field: row.field, itemId: item.id },
                    )
                    return (
                      <td
                        key={`${item.id}-${row.field}`}
                        className="px-4 py-3 text-xs sm:text-sm text-slate-200 break-words"
                      >
                        {value}
                      </td>
                    )
                  } catch (error) {
                    globalThis.console?.warn?.('[ComparisonTable] Error getting value', {
                      error,
                      field: row.field,
                      itemId: item.id,
                    })
                    return (
                      <td
                        key={`${item.id}-${row.field}-error`}
                        className="px-4 py-3 text-xs sm:text-sm text-slate-200 break-words"
                      >
                        -
                      </td>
                    )
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

