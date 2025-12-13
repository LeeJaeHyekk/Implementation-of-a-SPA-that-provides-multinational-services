# Multinational Trademark Search SPA

KR/US 상표 데이터를 로컬 JSON으로 불러와 검색·필터·정렬·즐겨찾기를 제공하는 Next.js App Router 기반 SPA입니다.

## 🚀 빠른 시작

- **Node.js**: 18+ 권장
- **설치**: `npm install`
- **개발 서버**: `npm run dev` (http://localhost:3000)
- **빌드**: `npm run build` → `npm start`
- **타입 체크**: `npx tsc --noEmit`
- **린트**: `npm run lint` (Flat config, ESLint 9)

## 📦 사용 스택

### 핵심 프레임워크
- **Next.js 16** (App Router, Turbopack 기본)
- **React 19**
- **TypeScript 5.9**

### 스타일링
- **Tailwind CSS 3.4**
- **Glassmorphism 디자인**: 반투명 유리 효과 UI

### 상태 관리 & 데이터 페칭
- **TanStack Query 5** (서버 상태 관리)
- **Zustand 5** (클라이언트 상태 관리, localStorage 영구 저장)
- **Zod 4** (스키마 검증)

### 개발 도구
- **ESLint 9** (flat config)
- **TypeScript ESLint** (타입 체크)
- **ESM 모듈 시스템** (`"type": "module"`)

## 🏗️ 프로젝트 구조

```
src/
├─ app/                    # Next.js App Router
│  ├─ layout.tsx          # 루트 레이아웃
│  ├─ page.tsx            # 홈 페이지 (리다이렉트)
│  ├─ providers.tsx       # React Query Provider
│  ├─ search/             # 검색 페이지
│  ├─ favorites/          # 즐겨찾기 페이지
│  └─ trademark/[id]/     # 상표 상세 페이지
│
├─ pages/                  # 레거시 Pages Router (리다이렉트용)
│  ├─ SearchPage/
│  ├─ FavoritesPage/
│  └─ DetailPage/
│
├─ processes/              # 비즈니스 프로세스 조합
│  └─ trademark-search/
│     ├─ ui/              # 검색 레이아웃 및 결과 패널
│     │  ├─ TrademarkSearchLayout.tsx
│     │  ├─ SearchBarWithFilters.tsx
│     │  ├─ SearchResultsPanel.tsx
│     │  └─ FilterSection.tsx
│     └─ logic/           # 프로세스 로직
│        └─ syncFiltersWithQuery.ts
│
├─ features/               # 독립 기능 모듈
│  ├─ search/             # 검색 기능
│  │  ├─ lib/             # 검색 로직 (모듈화)
│  │  │  ├─ sanitizers/   # 검색어 정제
│  │  │  ├─ normalizers/  # 검색어 정규화
│  │  │  ├─ matchers/     # 검색어 매칭
│  │  │  ├─ validators/   # 검색어 검증
│  │  │  ├─ profanity/    # 욕설 필터링
│  │  │  ├─ errors/       # 에러 처리
│  │  │  ├─ cache/        # 정규화 캐시
│  │  │  ├─ combineFilters.ts
│  │  │  └─ constants.ts
│  │  ├─ model/           # 상태 관리
│  │  │  ├─ store.ts
│  │  │  ├─ selectors.ts
│  │  │  └─ validators.ts
│  │  └─ ui/              # UI 컴포넌트
│  │     ├─ SearchBar.tsx
│  │     ├─ StatusFilter.tsx
│  │     ├─ ApplicationNumberFilter.tsx
│  │     ├─ DateRangeFilter.tsx
│  │     ├─ FilterFieldWrapper.tsx
│  │     └─ ResultSummary.tsx
│  ├─ country-switcher/   # 국가 선택
│  │  ├─ model/store.ts
│  │  └─ ui/CountrySwitcher.tsx
│  ├─ favorites/          # 즐겨찾기
│  │  ├─ model/store.ts   # localStorage 영구 저장
│  │  └─ ui/FavoriteButton.tsx
│  └─ sorting/            # 정렬
│     ├─ lib/sortTrademarks.ts
│     ├─ model/store.ts
│     └─ ui/SortSelector.tsx
│
├─ entities/               # 도메인 엔티티
│  └─ trademark/
│     ├─ lib/             # 상표 처리 로직
│     │  ├─ matchers/     # 매칭 로직 모듈
│     │  │  ├─ keyword-matcher.ts
│     │  │  ├─ application-number-matcher.ts
│     │  │  ├─ status-matcher.ts
│     │  │  ├─ date-matcher.ts
│     │  │  └─ base.ts
│     │  ├─ type-guards/  # 타입 가드
│     │  │  ├─ status-guards.ts
│     │  │  ├─ country-guards.ts
│     │  │  ├─ trademark-guards.ts
│     │  │  ├─ raw-guards.ts
│     │  │  ├─ array-guards.ts
│     │  │  └─ object-guards.ts
│     │  ├─ filters.ts    # 필터링
│     │  ├─ optimized-filters.ts  # 최적화된 필터링
│     │  ├─ preprocessing.ts      # 검색 최적화 전처리
│     │  ├─ indexing.ts           # 인덱스 기반 검색
│     │  ├─ parseKR.ts            # 한국 상표 파싱
│     │  ├─ parseUS.ts            # 미국 상표 파싱
│     │  ├─ normalizers.ts        # 데이터 정규화 유틸리티
│     │  ├─ resolve-country.ts    # 국가 해석 유틸리티
│     │  ├─ getStatusOptions.ts   # 상태 옵션 생성
│     │  └─ normalize.ts          # 데이터 정규화
│     ├─ model/           # 타입 정의
│     │  ├─ types.ts
│     │  ├─ countryTypes.ts
│     │  └─ constants.ts
│     └─ ui/              # UI 컴포넌트
│        ├─ TrademarkCard.tsx
│        └─ TrademarkDetail.tsx
│
├─ shared/                 # 공통 모듈
│  ├─ api/                 # API 클라이언트
│  │  ├─ fetchKRTrademarks.ts
│  │  ├─ fetchUSTrademarks.ts
│  │  ├─ loadLocalJson.ts
│  │  └─ useTrademarksQuery.ts
│  ├─ ui/                  # 공통 UI 컴포넌트
│  │  ├─ LoadingSpinner.tsx
│  │  ├─ QueryStateHandler.tsx
│  │  ├─ ClearButton.tsx
│  │  └─ AnimatedBackground.tsx
│  ├─ utils/               # 유틸리티
│  │  ├─ error-handler.ts  # 에러 처리 유틸
│  │  ├─ date-utils.ts    # 날짜 처리 유틸
│  │  ├─ string-utils.ts  # 문자열 처리 유틸
│  │  ├─ type-guards.ts   # 공통 타입 가드
│  │  ├─ chunk-processor.ts  # 청크 단위 처리
│  │  └─ performance-monitor.ts  # 성능 모니터링
│  └─ config/             # 설정
│     └─ constants.ts
│
├─ data/                   # 로컬 JSON 데이터
│  ├─ trademarks_kr_sample.json
│  ├─ trademarks_kr_trademarks.json
│  ├─ trademarks_us_sample.json
│  └─ trademarks_us_trademarks.json
│
└─ styles/                 # 글로벌 스타일
   └─ globals.css
```

## ✨ 주요 기능

### 🔍 검색 기능
- **다국어 검색 지원**: 한국어/영어 검색어 처리
- **부분 일치 검색**: "솔" 입력 시 "솔향기" 검색 가능
- **검색어 정제**: 특수문자, 욕설 필터링
- **검색어 정규화**: 띄어쓰기, 대소문자 무시
- **실시간 검증**: 입력 길이, 반복 문자 검증
- **Debouncing**: 성능 최적화를 위한 입력 지연 처리
- **국가별 검색 최적화**: 한국/미국별 맞춤 검색 로직

### 🎯 필터링
- **키워드 필터**: 상품명/영문명 검색
- **출원번호 필터**: 정확 일치 검색
- **상태 필터**: 국가별 등록 상태 필터링 (KR: 등록/출원/거절/실효, US: LIVE/DEAD)
- **날짜 범위 필터**: 출원일 기준 필터링
- **필터 배지**: 검색 결과에서 개별 필터 제거 가능
- **필터 초기화**: 모든 필터 한 번에 초기화

### 📊 정렬
- 출원일, 등록일, 상품명 등 다양한 기준 정렬
- 오름차순/내림차순 지원

### ⭐ 즐겨찾기
- **영구 저장**: Zustand + localStorage를 통한 브라우저 영구 저장
- **즐겨찾기 페이지**: 저장된 상표 목록 조회
- **즐겨찾기 버튼**: 상세 페이지에서 즐겨찾기 추가/제거

### 🎨 UI/UX
- **Glassmorphism 디자인**: 반투명 유리 효과의 모던한 UI
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- **로딩 상태**: 데이터 로딩 중 스피너 표시
- **에러 처리**: 사용자 친화적인 에러 메시지
- **빈 상태 처리**: 검색 결과 없음, 즐겨찾기 없음 등 상태 표시

### 🚀 성능 최적화
- **데이터 전처리**: 검색 인덱스 사전 생성
- **인덱스 기반 검색**: 대량 데이터 빠른 검색
- **청크 단위 처리**: 메인 스레드 블로킹 방지
- **정규화 캐싱**: LRU 캐시를 통한 중복 계산 방지
- **필터링 파이프라인 최적화**: 빠른 필터 우선 적용
- **대량 데이터 최적화**: 1000개 이상 데이터 자동 최적화 필터링

### 🛡️ 타입 안전성
- **엄격한 TypeScript 설정**: 모든 strict 옵션 활성화
- **타입 가드 시스템**: 런타임 타입 검증
- **타입 단언 최소화**: 안전한 타입 체크
- **인덱스 시그니처 안전 접근**: `noPropertyAccessFromIndexSignature` 활성화

## 🔧 주요 동작 흐름

### 데이터 로드
1. `shared/api/fetchKRTrademarks.ts` / `fetchUSTrademarks.ts`가 JSON 파일 로드
2. `entities/trademark/lib/parseKR.ts` / `parseUS.ts`로 국가별 스키마 정규화
3. `entities/trademark/lib/normalizers.ts`로 데이터 정규화
4. `entities/trademark/lib/preprocessing.ts`로 검색 최적화 전처리
5. `NormalizedTrademark` → `PreprocessedTrademark` 변환

### 검색/필터링
1. 사용자 입력 → `features/search/lib/sanitizers`로 정제
2. `features/search/lib/normalizers`로 정규화
3. `entities/trademark/lib/matchers`로 매칭
4. `entities/trademark/lib/filters.ts`로 필터링
5. 대량 데이터(1000개 이상)는 `optimized-filters.ts` 사용

### 상태 관리
- **서버 상태**: TanStack Query (`useTrademarksQuery`)
- **클라이언트 상태**: Zustand
  - 검색 필터 (`features/search/model/store.ts`)
  - 즐겨찾기 (`features/favorites/model/store.ts`) - localStorage 영구 저장
  - 정렬 (`features/sorting/model/store.ts`)
  - 국가 선택 (`features/country-switcher/model/store.ts`)

## 📚 모듈 구조

### 검색 기능 모듈 (`features/search/lib`)
- **sanitizers**: 검색어 정제 (특수문자, 욕설 제거)
- **normalizers**: 검색어 정규화 (띄어쓰기, 대소문자)
- **matchers**: 검색어 매칭 (부분 일치 지원)
- **validators**: 검색어 검증 (길이, 반복 문자)
- **profanity**: 욕설 필터링
- **errors**: 구조화된 에러 처리
- **cache**: 정규화 결과 캐싱

### 상표 필터링 모듈 (`entities/trademark/lib`)
- **matchers**: 매칭 로직 (키워드, 출원번호, 상태, 날짜)
- **filters**: 기본 필터링 함수
- **optimized-filters**: 대량 데이터 최적화 필터링
- **preprocessing**: 검색 성능 향상 전처리
- **indexing**: 인덱스 기반 빠른 검색
- **normalizers**: 데이터 정규화 유틸리티 (중복 제거)
- **type-guards**: 타입 안전성 보장
- **resolve-country**: 상표 ID에서 국가 추출

### 공통 유틸리티 (`shared/utils`)
- **error-handler**: 안전한 에러 처리 래퍼
- **date-utils**: 날짜 파싱 및 범위 체크, 포맷팅
- **string-utils**: 안전한 문자열 처리
- **type-guards**: 공통 타입 가드 유틸리티
- **chunk-processor**: 청크 단위 데이터 처리
- **performance-monitor**: 성능 모니터링

### 공통 UI 컴포넌트 (`shared/ui`)
- **LoadingSpinner**: 로딩 상태 표시
- **QueryStateHandler**: TanStack Query 상태 처리 (로딩/에러/빈 상태)
- **ClearButton**: 필터/입력 초기화 버튼
- **AnimatedBackground**: 애니메이션 배경

## 📖 문서

- [`src/entities/trademark/lib/README.md`](./src/entities/trademark/lib/README.md): 상표 엔티티 라이브러리 문서
- [`src/features/search/lib/README.md`](./src/features/search/lib/README.md): 검색 기능 라이브러리 문서
- [`src/pages/README.md`](./src/pages/README.md): Pages Router 레거시 코드 안내

## 📁 데이터셋 안내

- **샘플 데이터**: `trademarks_kr_sample.json`, `trademarks_us_sample.json`
  - 가벼운 목 데이터 (빈 배열 기본)
  - 대용량 없이도 UI 확인 가능
- **전체 데이터**: `trademarks_kr_trademarks.json`, `trademarks_us_trademarks.json`
  - 실제 예시 대용량 JSON
  - 필요 시 샘플 파일에 소량 레코드 추가 가능

## 🏛️ 아키텍처 원칙

### Feature-Sliced Design (FSD)
- **app**: Next.js 라우팅 레이어
- **processes**: 비즈니스 프로세스 조합
- **features**: 독립 기능 모듈
- **entities**: 도메인 엔티티
- **shared**: 공통 모듈

### 모듈화
- 기능별 독립 모듈 분리
- 재사용 가능한 유틸리티 모듈
- 명확한 책임 분리
- 중복 코드 제거

### 타입 안정성
- TypeScript strict 모드 활성화
- 모든 strict 옵션 활성화 (`noUnusedLocals`, `noImplicitReturns` 등)
- Zod를 통한 런타임 검증
- 타입 가드 시스템 활용
- 타입 단언 최소화
- 인덱스 시그니처 안전 접근

### 성능 최적화
- 데이터 전처리 및 인덱싱
- 캐싱 전략
- 청크 단위 처리
- 필터링 파이프라인 최적화
- 대량 데이터 자동 최적화

### 에러 처리
- 구조화된 에러 타입
- 안전한 폴백 메커니즘
- 상세한 에러 로깅
- 사용자 친화적 에러 메시지

### 확장성
- 새로운 국가 추가 용이
- 새로운 필터 추가 용이
- 플러그인 방식 모듈 구조
- 타입 가드로 안전한 확장

## 🔨 확장 가이드

### 새로운 국가 추가
1. `entities/trademark/model/countryTypes.ts`에 타입 정의
2. `entities/trademark/lib/parse{Country}.ts` 파서 추가
3. `entities/trademark/lib/normalizers.ts` 사용 (중복 제거됨)
4. `entities/trademark/model/constants.ts`에 상태 매핑 추가
5. `shared/api/fetch{Country}Trademarks.ts` API 클라이언트 추가
6. `features/country-switcher`에 국가 옵션 추가
7. `entities/trademark/lib/getStatusOptions.ts`에 상태 옵션 추가

### 새로운 필터 추가
1. `entities/trademark/model/types.ts`의 `TrademarkFilters` 확장
2. `entities/trademark/lib/matchers/`에 매칭 로직 추가
3. `entities/trademark/lib/filters.ts`에 필터 함수 추가
4. `features/search/model/store.ts`에 상태 추가
5. `features/search/ui/`에 UI 컴포넌트 추가
6. `processes/trademark-search/ui/SearchResultsPanel.tsx`에 필터 배지 추가

### 새로운 검색 기능 추가
1. `features/search/lib/`에 해당 모듈 추가
2. `features/search/lib/index.ts`에 export 추가
3. 필요 시 `sanitizeKeyword.ts`에 레거시 API 추가

## ⚙️ 설정

### TypeScript 설정
- **strict 모드**: 모든 strict 옵션 활성화
- **추가 엄격 옵션**:
  - `noUnusedLocals`: 사용하지 않는 지역 변수 체크
  - `noUnusedParameters`: 사용하지 않는 매개변수 체크
  - `noImplicitReturns`: 모든 코드 경로에서 반환값 체크
  - `noFallthroughCasesInSwitch`: switch 문 fallthrough 체크
  - `noUncheckedIndexedAccess`: 인덱스 접근 시 undefined 체크
  - `noImplicitOverride`: override 키워드 필수
  - `noPropertyAccessFromIndexSignature`: 인덱스 시그니처 속성 접근 제한
- `module: "ESNext"`: ESM 모듈 시스템
- `moduleResolution: "Bundler"`: 번들러 해상도
- `target: "ESNext"`: 최신 ECMAScript 타겟

### ESM 모듈 시스템
프로젝트는 완전한 ESM 문법을 사용합니다:
- `package.json`에 `"type": "module"` 설정
- 모든 파일이 `import`/`export` 문법 사용
- 최신 `import with { type: 'json' }` 구문 사용

### 린트 규칙
- 세미콜론 미사용
- 멀티라인 trailing comma
- 타입 임포트 일관성

## ⚠️ 유의 사항

- **Turbopack**: 워크스페이스 루트를 추론합니다. 상위 경로에 다른 lockfile이 있다면 경고가 출력될 수 있습니다. 필요 시 제거하거나 `next.config.js`의 `turbopack.root`로 고정하세요.
- **대량 데이터**: 1000개 이상의 데이터는 자동으로 최적화된 필터링을 사용합니다.
- **브라우저 호환성**: 최신 브라우저에서 ESM을 완전히 지원해야 합니다.
- **타입 체크**: 빌드 전 `npx tsc --noEmit`으로 타입 체크를 권장합니다.

## 📄 라이선스

MIT
