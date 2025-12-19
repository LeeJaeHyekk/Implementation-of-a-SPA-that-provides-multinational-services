# 상표 엔티티 라이브러리

상표 데이터 처리 관련 유틸리티 모듈입니다.

## 구조

```
lib/
├── index.ts              # 통합 export
├── filters.ts            # 필터링 함수
├── optimized-filters.ts  # 최적화된 필터링 (대량 데이터용)
├── normalize.ts          # 데이터 정규화
├── parseKR.ts            # 한국 상표 파싱
├── parseUS.ts            # 미국 상표 파싱
├── preprocessing.ts      # 검색 최적화 전처리
├── indexing.ts           # 인덱스 기반 검색
└── matchers/             # 매칭 로직
    ├── base.ts
    ├── keyword-matcher.ts
    ├── application-number-matcher.ts
    ├── status-matcher.ts
    └── date-matcher.ts
```

## 주요 기능

### 파싱 및 정규화
- `parseKR`: 한국 상표 데이터 파싱
- `parseUS`: 미국 상표 데이터 파싱
- `normalizeTrademarks`: 국가별 데이터 정규화

### 필터링
- `filterTrademarks`: 기본 필터링
- `filterTrademarksOptimized`: 최적화된 필터링 (대량 데이터용)
- `filterByKeyword`, `filterByApplicationNumber`, `filterByStatus`, `filterByDateRange`: 개별 필터

### 전처리
- `preprocessTrademark`: 단일 상표 전처리
- `preprocessTrademarks`: 상표 배열 일괄 전처리

### 매칭
- `matchKeyword`: 키워드 매칭
- `matchApplicationNumber`: 출원번호 매칭
- `matchStatus`: 상태 매칭
- `matchDateRange`: 날짜 범위 매칭

