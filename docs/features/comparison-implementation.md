# 국가별 데이터 비교 기능 구현 예시 코드

## 1. 비교 상태 관리 Store

```typescript
// src/features/comparison/model/store.ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ComparisonState {
  items: string[]  // 상표 ID 배열
  maxItems: number
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  isInComparison: (id: string) => boolean
  canAdd: () => boolean
}

function getStorage(): Storage {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } as Storage
  }

  try {
    if (window.localStorage) {
      const testKey = '__comparison_storage_test__'
      window.localStorage.setItem(testKey, 'test')
      window.localStorage.removeItem(testKey)
      return window.localStorage
    }
  } catch (error) {
    globalThis.console?.warn?.('[ComparisonStore] localStorage not available', error)
  }

  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 5,
      add: (id) => {
        const { items, maxItems } = get()
        if (items.length < maxItems && !items.includes(id)) {
          set({ items: [...items, id] })
        }
      },
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item !== id),
        })),
      clear: () => set({ items: [] }),
      isInComparison: (id) => get().items.includes(id),
      canAdd: () => get().items.length < get().maxItems,
    }),
    {
      name: 'comparison-storage',
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
```

## 2. 비교 버튼 컴포넌트

```typescript
// src/features/comparison/ui/CompareButton.tsx
'use client'

import { useComparisonStore } from '../model/store'

interface CompareButtonProps {
  trademarkId: string
  size?: 'sm' | 'md'
}

export default function CompareButton({ trademarkId, size = 'md' }: CompareButtonProps) {
  const isInComparison = useComparisonStore((state) => state.isInComparison(trademarkId))
  const canAdd = useComparisonStore((state) => state.canAdd())
  const add = useComparisonStore((state) => state.add)
  const remove = useComparisonStore((state) => state.remove)

  const isDisabled = !isInComparison && !canAdd

  function handleClick() {
    if (isInComparison) {
      remove(trademarkId)
    } else if (canAdd) {
      add(trademarkId)
    }
  }

  const sizeClasses = {
    sm: 'h-3.5 w-3.5 sm:h-4 sm:w-4',
    md: 'h-4 w-4 sm:h-5 sm:w-5',
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`glass-button flex items-center justify-center rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 transition ${
        isInComparison
          ? 'glass-button-primary text-indigo-200'
          : 'text-slate-200 hover:text-indigo-200'
      } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
      aria-label={isInComparison ? '비교에서 제거' : '비교에 추가'}
      title={isDisabled && !isInComparison ? '최대 비교 개수에 도달했습니다' : undefined}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} transition-colors ${isInComparison ? 'fill-current' : 'fill-none'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    </button>
  )
}
```

## 3. 비교 패널 컴포넌트 (플로팅)

```typescript
// src/features/comparison/ui/ComparisonPanel.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useComparisonStore } from '../model/store'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import { resolveCountry } from '@/entities/trademark/lib/resolve-country'
import { NormalizedTrademark } from '@/entities/trademark/model'
import { navigateToComparison } from '@/shared/utils/navigation'

export default function ComparisonPanel() {
  const items = useComparisonStore((state) => state.items)
  const remove = useComparisonStore((state) => state.remove)
  const clear = useComparisonStore((state) => state.clear)
  const router = useRouter()

  // 모든 국가 데이터 로드
  const { data: krData } = useTrademarksQuery({ country: 'KR' })
  const { data: usData } = useTrademarksQuery({ country: 'US' })

  // 비교 항목 데이터 조회
  const comparisonItems = useMemo(() => {
    const allData = [...(krData ?? []), ...(usData ?? [])]
    return items
      .map((id) => allData.find((item) => item.id === id))
      .filter((item): item is NormalizedTrademark => item !== undefined)
  }, [items, krData, usData])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-4 sm:w-96">
      <div className="glass-card rounded-xl border border-indigo-500/30 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md sm:rounded-2xl sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-slate-100">
            비교 중 ({items.length}/5)
          </h3>
          <button
            type="button"
            onClick={clear}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
          >
            전체 제거
          </button>
        </div>

        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {comparisonItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-slate-800/50 p-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400">{item.country}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-100 truncate">
                  {item.productName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="text-slate-400 hover:text-red-400 transition"
                aria-label="제거"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigateToComparison(router)}
          className="glass-button glass-button-primary w-full rounded-lg px-4 py-2 text-sm font-medium text-indigo-200 transition"
        >
          비교하기 ({items.length}개)
        </button>
      </div>
    </div>
  )
}
```

## 4. 비교 테이블 컴포넌트

```typescript
// src/features/comparison/ui/ComparisonTable.tsx
'use client'

import { NormalizedTrademark, TrademarkCountry } from '@/entities/trademark/model'
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
      getValue: (item) => item.applicationNumber,
    },
    {
      label: '출원일',
      field: 'applicationDate',
      countries: ['KR', 'US'],
      getValue: (item) => formatDateToDot(item.applicationDate) ?? '-',
    },
    {
      label: '등록 상태',
      field: 'registerStatus',
      countries: ['KR', 'US'],
      getValue: (item) => item.registerStatus,
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
      getValue: (item) => formatDateArray(item.registrationDate),
    },
  ]

  // 국가별 필드 정의
  const krOnlyRows: ComparisonRow[] = [
    {
      label: '공고번호',
      field: 'publicationNumber',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? item.publicationNumber ?? '-' : '-'),
    },
    {
      label: '등록 공고 번호',
      field: 'registrationPubNumber',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? item.registrationPubNumber ?? '-' : '-'),
    },
    {
      label: '상품 주 분류 코드',
      field: 'productMainCodes',
      countries: ['KR'],
      getValue: (item) => (item.country === 'KR' ? joinArrayOrDash(item.productMainCodes) : '-'),
    },
  ]

  const usOnlyRows: ComparisonRow[] = [
    {
      label: 'US 코드',
      field: 'usClassCodes',
      countries: ['US'],
      getValue: (item) => (item.country === 'US' ? joinArrayOrDash(item.usClassCodes) : '-'),
    },
  ]

  const allRows = [...commonRows, ...krOnlyRows, ...usOnlyRows]

  return (
    <div className="glass-card rounded-xl overflow-hidden sm:rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/30">
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-300">
                항목
              </th>
              {items.map((item) => (
                <th
                  key={item.id}
                  className="px-4 py-3 text-left text-xs sm:text-sm font-semibold text-slate-300 min-w-[200px]"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-indigo-300">{item.country}</p>
                    <p className="font-medium text-slate-100 break-words">{item.productName}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allRows.map((row, index) => (
              <tr
                key={`${row.field}-${index}`}
                className="border-b border-slate-700/30 hover:bg-slate-800/20 transition"
              >
                <td className="px-4 py-3 text-xs sm:text-sm font-medium text-slate-400">
                  {row.label}
                </td>
                {items.map((item) => (
                  <td
                    key={`${item.id}-${row.field}`}
                    className="px-4 py-3 text-xs sm:text-sm text-slate-200 break-words"
                  >
                    {row.getValue(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

## 5. 비교 페이지

```typescript
// src/app/compare/page.tsx
'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useComparisonStore } from '@/features/comparison/model/store'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import { NormalizedTrademark } from '@/entities/trademark/model'
import ComparisonTable from '@/features/comparison/ui/ComparisonTable'
import BackButton from '@/shared/ui/BackButton'
import EmptyState from '@/shared/ui/EmptyState'
import { LAYOUT_CLASSES } from '@/shared/config/css-classes'

export default function ComparisonPage() {
  const items = useComparisonStore((state) => state.items)
  const clear = useComparisonStore((state) => state.clear)
  const router = useRouter()

  const { data: krData } = useTrademarksQuery({ country: 'KR' })
  const { data: usData } = useTrademarksQuery({ country: 'US' })

  const comparisonItems = useMemo(() => {
    const allData = [...(krData ?? []), ...(usData ?? [])]
    return items
      .map((id) => allData.find((item) => item.id === id))
      .filter((item): item is NormalizedTrademark => item !== undefined)
  }, [items, krData, usData])

  if (items.length === 0) {
    return (
      <div className={LAYOUT_CLASSES.centered}>
        <div className={LAYOUT_CLASSES.centeredContent}>
          <EmptyState
            message="비교할 상표가 없습니다."
            action={
              <BackButton />
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.centeredContent}>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-100">
                상표 비교 ({comparisonItems.length}개)
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                여러 국가의 상표를 한눈에 비교하세요
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clear}
                className="glass-button rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 transition hover:text-red-400"
              >
                전체 제거
              </button>
              <BackButton />
            </div>
          </div>

          <ComparisonTable items={comparisonItems} />
        </div>
      </div>
    </div>
  )
}
```

## 6. TrademarkCard에 비교 버튼 추가

```typescript
// src/entities/trademark/ui/TrademarkCard.tsx 수정
import CompareButton from '@/features/comparison/ui/CompareButton'

export default function TrademarkCard({ trademark, onSelect }: TrademarkCardProps) {
  return (
    <article className="glass-card ...">
      {/* ... 기존 코드 ... */}
      
      <div className="flex items-center gap-2 sm:flex-shrink-0">
        <span className="glass-badge ...">
          {trademark.registerStatus}
        </span>
        <CompareButton trademarkId={trademark.id} size="sm" />
        <FavoriteButton trademarkId={trademark.id} />
      </div>

      {/* ... 나머지 코드 ... */}
    </article>
  )
}
```

## 7. 네비게이션 유틸리티 추가

```typescript
// src/shared/utils/navigation.ts에 추가
export function navigateToComparison(router: AppRouterInstance) {
  router.push('/compare')
}
```

## 8. 레이아웃에 비교 패널 추가

```typescript
// src/processes/trademark-search/ui/TrademarkSearchLayout.tsx에 추가
import ComparisonPanel from '@/features/comparison/ui/ComparisonPanel'

export default function TrademarkSearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* ... 기존 레이아웃 ... */}
      <ComparisonPanel />
    </>
  )
}
```

## 구현 체크리스트

- [ ] 비교 상태 관리 Store 생성
- [ ] CompareButton 컴포넌트 구현
- [ ] TrademarkCard에 비교 버튼 추가
- [ ] ComparisonPanel 플로팅 패널 구현
- [ ] ComparisonTable 컴포넌트 구현
- [ ] 비교 페이지 생성
- [ ] 네비게이션 유틸리티 추가
- [ ] 레이아웃에 비교 패널 통합
- [ ] 반응형 디자인 테스트
- [ ] 접근성 검증

