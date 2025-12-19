# 국가별 데이터 비교 기능 구현 계획

## 📋 기능 개요

여러 국가의 상표를 동시에 비교하여 차이점을 쉽게 파악할 수 있는 기능

## 🎯 구현 접근 방법

### 1. 아키텍처 설계

현재 프로젝트의 Feature-Sliced Design 구조를 따라 구현:

```
src/
├─ features/
│  └─ comparison/              # 비교 기능 모듈
│     ├─ model/
│     │  └─ store.ts           # 비교 목록 상태 관리 (Zustand)
│     ├─ ui/
│     │  ├─ CompareButton.tsx  # 비교 추가/제거 버튼
│     │  ├─ ComparisonPanel.tsx # 비교 패널 (플로팅)
│     │  └─ ComparisonTable.tsx # 비교 테이블 컴포넌트
│     └─ lib/
│        └─ findSimilarTrademarks.ts # 유사 상표 찾기 (선택적)
│
├─ app/
│  └─ compare/
│     └─ page.tsx              # 비교 페이지 (전체 화면)
│
└─ processes/
   └─ trademark-comparison/     # 비교 프로세스 (선택적)
      └─ ui/
         └─ ComparisonView.tsx
```

### 2. 상태 관리 설계

**Zustand Store 패턴** (favorites와 유사):

```typescript
interface ComparisonState {
  items: string[]  // 상표 ID 배열
  maxItems: number  // 최대 비교 가능 개수 (예: 5개)
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  isInComparison: (id: string) => boolean
  canAdd: () => boolean
}
```

**특징**:
- 최대 비교 개수 제한 (UX 고려)
- localStorage 영구 저장 (선택적)
- 실시간 UI 업데이트

### 3. UI 컴포넌트 설계

#### 3.1 CompareButton 컴포넌트
- 위치: `TrademarkCard` 내부 또는 상세 페이지
- 기능: 비교 목록에 추가/제거
- 상태 표시: 체크박스 또는 별도 아이콘

#### 3.2 ComparisonPanel 컴포넌트 (플로팅 패널)
- 위치: 화면 하단 또는 우측 고정
- 기능: 
  - 비교 중인 상표 목록 미리보기
  - 빠른 제거
  - "비교하기" 버튼으로 전체 비교 뷰 이동
- 조건부 렌더링: 비교 항목이 있을 때만 표시

#### 3.3 ComparisonTable 컴포넌트
- 위치: 비교 페이지 또는 모달
- 기능: 
  - 테이블 형태로 상표 정보 비교
  - 국가별 필드 차이 처리
  - 공통 필드와 국가별 필드 구분 표시

### 4. 비교 테이블 구조

#### 4.1 비교 항목 구성

**공통 필드** (모든 국가):
- 상표명 (한글/영문)
- 출원번호
- 출원일
- 등록 상태
- 등록번호
- 등록일
- 국제출원번호
- 우선권 정보
- 비엔나 코드

**국가별 필드**:
- **한국**: 공고번호, 등록 공고 번호, 상품 주 분류 코드, 상품 유사군 코드
- **미국**: Nice 분류 코드, US 코드

#### 4.2 테이블 레이아웃

```
┌─────────────┬──────────────┬──────────────┐
│   항목      │   상표 1     │   상표 2     │
│             │   (KR)       │   (US)       │
├─────────────┼──────────────┼──────────────┤
│ 상표명      │  Apple       │  Apple       │
│ 출원번호    │  10-2023...  │  98765432    │
│ 출원일      │  2023.01.01  │  2023-01-01  │
│ 등록 상태   │  등록        │  LIVE        │
│ ...         │  ...         │  ...         │
│ [KR 전용]   │              │              │
│ 공고번호    │  123456      │  -           │
│ [US 전용]   │              │              │
│ US 코드     │  -           │  025, 035    │
└─────────────┴──────────────┴──────────────┘
```

### 5. 구현 단계

#### Phase 1: 기본 비교 기능
1. ✅ 비교 상태 관리 Store 생성
2. ✅ CompareButton 컴포넌트 구현
3. ✅ TrademarkCard에 비교 버튼 추가
4. ✅ ComparisonPanel 플로팅 패널 구현

#### Phase 2: 비교 뷰 구현
5. ✅ 비교 페이지 생성 (`/compare`)
6. ✅ ComparisonTable 컴포넌트 구현
7. ✅ 국가별 필드 차이 처리
8. ✅ 반응형 테이블 디자인

#### Phase 3: 고급 기능 (선택적)
9. ⚪ 유사 상표 자동 추천
10. ⚪ 비교 결과 내보내기 (CSV/PDF)
11. ⚪ 비교 히스토리 저장

### 6. 기술적 고려사항

#### 6.1 데이터 로딩
- 비교 목록의 상표 ID로부터 실제 데이터 조회
- 여러 국가 데이터를 동시에 로드해야 함
- TanStack Query를 활용한 효율적인 데이터 페칭

#### 6.2 성능 최적화
- 비교 항목이 많을 경우 가상 스크롤 고려
- 테이블 렌더링 최적화 (React.memo)
- 대량 데이터 비교 시 청크 처리

#### 6.3 사용자 경험
- 비교 항목 개수 제한 (최대 5-10개 권장)
- 비교 패널은 항상 접근 가능하도록 고정
- 비교 항목 제거 시 즉시 반영
- 빈 비교 상태 안내

### 7. 코드 예시 구조

#### 7.1 Store 예시
```typescript
// src/features/comparison/model/store.ts
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
      remove: (id) => set((state) => ({ 
        items: state.items.filter((item) => item !== id) 
      })),
      clear: () => set({ items: [] }),
      isInComparison: (id) => get().items.includes(id),
      canAdd: () => get().items.length < get().maxItems,
    }),
    {
      name: 'comparison-storage',
      storage: createJSONStorage(() => getStorage()),
    },
  ),
)
```

#### 7.2 비교 테이블 데이터 구조
```typescript
interface ComparisonRow {
  label: string
  field: keyof NormalizedTrademark | 'country-specific'
  countries: TrademarkCountry[]
  values: Record<string, string | string[] | null>
}
```

### 8. UI/UX 디자인 고려사항

#### 8.1 비교 버튼
- 위치: TrademarkCard의 FavoriteButton 옆
- 아이콘: 비교 아이콘 (예: ↔️ 또는 📊)
- 상태: 
  - 미추가: 회색 아이콘
  - 추가됨: 인디고 색상 + 체크 표시
  - 최대 개수 도달: 비활성화 + 툴팁

#### 8.2 비교 패널
- 위치: 화면 하단 고정 (모바일) 또는 우측 사이드바 (데스크톱)
- 스타일: Glassmorphism 디자인 유지
- 기능:
  - 비교 중인 상표 카드 미리보기
  - 개별 제거 버튼
  - 전체 제거 버튼
  - "비교하기" 버튼 (비교 페이지로 이동)

#### 8.3 비교 테이블
- 스타일: Glassmorphism 카드 내부
- 반응형: 모바일에서는 세로 스크롤, 데스크톱에서는 가로 스크롤
- 하이라이트: 차이점 강조 (색상 또는 배경)
- 정렬: 국가별로 컬럼 정렬

### 9. 확장 가능성

#### 9.1 유사 상표 찾기
- 같은 상표명이나 유사한 상표명을 가진 상표 자동 추천
- 키워드 매칭 알고리즘 활용

#### 9.2 비교 내보내기
- CSV 형식으로 비교 결과 다운로드
- PDF 리포트 생성 (선택적)

#### 9.3 비교 히스토리
- 이전 비교 기록 저장
- 빠른 재비교

## 🚀 구현 우선순위

### 필수 (MVP)
1. 비교 상태 관리 Store
2. CompareButton 컴포넌트
3. ComparisonPanel 플로팅 패널
4. 비교 페이지 및 테이블

### 선택 (향후 개선)
5. 유사 상표 추천
6. 비교 결과 내보내기
7. 비교 히스토리

## 📝 참고사항

- 현재 프로젝트의 favorites 기능과 유사한 패턴 활용
- Feature-Sliced Design 아키텍처 준수
- 기존 디자인 시스템 (Glassmorphism) 유지
- 반응형 디자인 필수
- 접근성 고려 (ARIA 속성, 키보드 네비게이션)

