# Multinational Trademark Search SPA

한국(KR)과 미국(US)의 상표 데이터를 로컬 JSON 파일로 불러와 검색, 필터링, 정렬, 즐겨찾기, 비교 기능을 제공하는 Next.js App Router 기반의 단일 페이지 애플리케이션(SPA)입니다.

## 📋 목차

- [프로젝트 실행 방법](#-프로젝트-실행-방법)
- [주요 기능 및 구조](#-주요-기능-및-구조)
- [기술적 의사결정](#-기술적-의사결정)
- [문제 해결 과정](#-문제-해결-과정)
- [개선하고 싶은 부분](#-개선하고-싶은-부분)

## 🚀 프로젝트 실행 방법

### 필수 요구사항
- **Node.js**: 18 이상 권장
- **패키지 매니저**: npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# TypeScript 타입 체크
npx tsc --noEmit

# ESLint 린트 검사
npm run lint
```

### 개발 환경 설정
프로젝트는 Next.js 16의 App Router를 사용하며, Turbopack이 기본 번들러로 설정되어 있습니다. ESM(ECMAScript Modules) 모듈 시스템을 사용하므로 모든 파일에서 `import`/`export` 문법을 사용합니다.

## 🏗️ 주요 기능 및 구조

### 주요 기능

#### 1. 검색 기능
- **다국어 검색 지원**: 한국어 및 영어 검색어를 모두 처리할 수 있도록 구현했습니다.
- **부분 일치 검색**: 사용자가 "솔"을 입력하면 "솔향기"와 같은 상표도 검색되도록 구현했습니다.
- **검색어 정제 및 정규화**: 특수문자 제거, 욕설 필터링, 띄어쓰기 및 대소문자 정규화를 통해 검색 품질을 향상시키기 위해 노력했습니다.
- **실시간 검증**: 입력 길이, 반복 문자 등을 검증하여 사용자 경험을 개선했습니다.
- **Debouncing**: 성능 최적화를 위해 입력 지연 처리를 구현했습니다.

#### 2. 필터링 기능
- **키워드 필터**: 상품명 또는 영문명으로 검색
- **출원번호 필터**: 정확한 출원번호로 검색
- **상태 필터**: 국가별 등록 상태 필터링 (한국: 등록/출원/거절/실효, 미국: LIVE/DEAD)
- **날짜 범위 필터**: 출원일 기준으로 기간 필터링
- **필터 배지**: 검색 결과에서 개별 필터를 제거할 수 있는 UI 제공
- **필터 초기화**: 모든 필터를 한 번에 초기화하는 기능

#### 3. 정렬 기능
- 출원일, 등록일, 상품명 등 다양한 기준으로 정렬
- 오름차순/내림차순 지원

#### 4. 즐겨찾기 기능
- **영구 저장**: Zustand와 localStorage를 통한 브라우저 영구 저장 구현
- **즐겨찾기 페이지**: 저장된 상표 목록을 별도 페이지에서 조회
- **즐겨찾기 버튼**: 상세 페이지에서 즐겨찾기 추가/제거

#### 5. 국가별 데이터 비교 기능
- 여러 국가의 상표를 동시에 비교할 수 있는 기능
- 최대 5개까지 비교 가능
- 비교 테이블을 통한 시각적 비교

### 프로젝트 구조

프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처 패턴을 따르고 있습니다. 이는 확장성과 유지보수성을 고려하여 선택한 구조입니다.

```
src/
├─ app/                    # Next.js App Router
│  ├─ layout.tsx          # 루트 레이아웃 (SEO 메타데이터)
│  ├─ page.tsx            # 홈 페이지
│  ├─ providers.tsx       # React Query Provider
│  ├─ error.tsx           # 세그먼트 레벨 에러 바운더리
│  ├─ global-error.tsx    # 글로벌 에러 바운더리
│  ├─ not-found.tsx       # 404 페이지
│  ├─ search/             # 검색 페이지
│  ├─ favorites/          # 즐겨찾기 페이지
│  ├─ compare/            # 비교 페이지
│  └─ trademark/[id]/     # 상표 상세 페이지
│
├─ processes/              # 비즈니스 프로세스 조합
│  └─ trademark-search/    # 상표 검색 프로세스
│     ├─ ui/              # 검색 레이아웃 및 결과 패널
│     └─ logic/           # 프로세스 로직
│
├─ features/               # 독립 기능 모듈
│  ├─ search/             # 검색 기능
│  │  ├─ lib/             # 검색 로직 (sanitizers, normalizers, matchers, validators)
│  │  ├─ model/           # 상태 관리 (Zustand store)
│  │  └─ ui/              # UI 컴포넌트
│  ├─ country-switcher/   # 국가 선택 기능
│  ├─ favorites/          # 즐겨찾기 기능
│  ├─ comparison/         # 비교 기능
│  └─ sorting/            # 정렬 기능
│
├─ entities/               # 도메인 엔티티
│  └─ trademark/          # 상표 엔티티
│     ├─ lib/             # 상표 처리 로직
│     │  ├─ matchers/     # 매칭 로직
│     │  ├─ type-guards/  # 타입 가드
│     │  ├─ filters.ts    # 필터링
│     │  ├─ parseKR.ts    # 한국 상표 파싱
│     │  ├─ parseUS.ts    # 미국 상표 파싱
│     │  └─ normalizers.ts # 데이터 정규화
│     ├─ model/           # 타입 정의
│     └─ ui/              # UI 컴포넌트
│
└─ shared/                 # 공통 모듈
   ├─ api/                 # API 클라이언트
   ├─ hooks/               # 공통 React Hooks
   ├─ ui/                  # 공통 UI 컴포넌트
   ├─ utils/               # 유틸리티
   └─ config/             # 설정 및 상수
```

### 주요 컴포넌트 설명

#### 공통 UI 컴포넌트 (`shared/ui`)
- **LoadingSpinner**: 로딩 상태 표시
- **QueryStateHandler**: TanStack Query 상태 처리 (로딩/에러/빈 상태)
- **ErrorMessage**: 에러 메시지 표시 (레이아웃 시프트 방지)
- **SearchInput**: 검색 입력 필드 (로딩, 에러 처리 포함)
- **ActionButton**: 공통 액션 버튼
- **EmptyState**: 빈 상태 표시
- **ErrorState**: 에러 상태 표시

#### 검색 기능 모듈 (`features/search/lib`)
- **sanitizers**: 검색어 정제 (특수문자, 욕설 제거)
- **normalizers**: 검색어 정규화 (띄어쓰기, 대소문자)
- **matchers**: 검색어 매칭 (부분 일치 지원)
- **validators**: 검색어 검증 (길이, 반복 문자)
- **cache**: 정규화 결과 캐싱

#### 상표 엔티티 모듈 (`entities/trademark/lib`)
- **parseKR.ts / parseUS.ts**: 국가별 원시 데이터를 공통 형식으로 변환
- **normalizers.ts**: 데이터 정규화 유틸리티
- **filters.ts**: 필터링 로직
- **type-guards**: 타입 안전성 보장

## 🔧 기술적 의사결정

### 상태 관리 라이브러리 선택

프로젝트에서는 **Zustand**와 **TanStack Query**를 함께 사용했습니다.

#### Zustand를 선택한 이유

1. **간결성과 학습 곡선**: Redux와 비교하여 보일러플레이트 코드가 적고, 학습 곡선이 낮아 빠른 개발이 가능하다고 판단했습니다.
2. **TypeScript 지원**: TypeScript와의 통합이 우수하여 타입 안전성을 확보할 수 있었습니다.
3. **localStorage 통합**: `persist` 미들웨어를 통해 즐겨찾기와 비교 목록을 브라우저에 영구 저장하는 기능을 쉽게 구현할 수 있었습니다.
4. **성능**: 작은 번들 사이즈와 빠른 런타임 성능을 고려했습니다.

클라이언트 상태 관리(검색 필터, 즐겨찾기, 비교 목록, 정렬 옵션, 국가 선택)에 Zustand를 사용했습니다.

#### TanStack Query를 선택한 이유

1. **서버 상태 관리**: 데이터 페칭, 캐싱, 동기화, 백그라운드 업데이트 등 서버 상태 관리에 특화되어 있습니다.
2. **자동 캐싱**: 동일한 쿼리에 대한 자동 캐싱으로 불필요한 네트워크 요청을 줄일 수 있었습니다.
3. **로딩 및 에러 상태 관리**: 로딩, 에러, 성공 상태를 자동으로 관리하여 UI 개발을 단순화했습니다.
4. **React 19 호환성**: 최신 React 버전과의 호환성이 우수합니다.

서버 상태 관리(상표 데이터 페칭)에 TanStack Query를 사용했습니다.

### 다국가 데이터 처리 설계

한국과 미국의 상표 데이터는 서로 다른 스키마를 가지고 있습니다. 이를 통합적으로 처리하기 위해 다음과 같이 설계했습니다.

#### 1. 공통 인터페이스 정의

`NormalizedTrademark` 타입을 정의하여 두 국가의 데이터를 하나의 공통 형식으로 통합했습니다:

```typescript
interface NormalizedTrademark {
  id: string                    // "KR-{applicationNumber}" 또는 "US-{applicationNumber}"
  country: 'KR' | 'US'          // 국가 식별자
  productName: string            // 상품명 (한국: 한글명, 미국: 영문명)
  productNameEng?: string        // 영문명 (한국만 존재)
  applicationNumber: string      // 출원번호
  applicationDate: string | null // 출원일
  registerStatus: RegisterStatus // 등록 상태 (통합된 enum)
  // ... 기타 필드
}
```

#### 2. 국가별 파서 구현

각 국가의 원시 데이터를 공통 형식으로 변환하는 파서를 구현했습니다:

- **`parseKR.ts`**: 한국 상표 데이터(`KRTrademarkRaw`)를 `NormalizedTrademark`로 변환
- **`parseUS.ts`**: 미국 상표 데이터(`USTrademarkRaw`)를 `NormalizedTrademark`로 변환

각 파서는 국가별 스키마 차이를 처리하고, 누락된 필드는 기본값으로 채웁니다.

#### 3. 등록 상태 통합

한국과 미국은 서로 다른 등록 상태 체계를 사용합니다:
- **한국**: 등록, 출원, 거절, 실효
- **미국**: LIVE, DEAD

이를 통합된 `RegisterStatus` enum으로 정의하고, 국가별 매핑을 통해 변환했습니다:

```typescript
type RegisterStatus = 
  | 'registered' | 'rejected' | 'pending' | 'expired'  // 한국 상태
  | 'live' | 'dead'                                    // 미국 상태
  | 'unknown'                                          // 알 수 없음
```

#### 4. 국가별 기본값 처리

데이터가 누락된 경우 국가별로 적절한 기본값을 제공하도록 구현했습니다:
- **한국**: "미상"
- **미국**: "Unknown"

이를 위해 `getDefaultValue(country)` 유틸리티 함수를 만들어 사용했습니다.

#### 5. 국가별 상태 라벨 표시

UI에서 등록 상태를 표시할 때 국가에 따라 적절한 언어로 표시되도록 구현했습니다:
- **한국**: "등록", "출원", "거절", "실효", "알수없음"
- **미국**: "LIVE", "DEAD", "Unknown"

`getStatusLabel(status, country)` 함수를 통해 국가별 라벨을 반환하도록 했습니다.

#### 6. 확장성 고려

새로운 국가를 추가할 때는 다음 단계만 수행하면 되도록 설계했습니다:
1. `countryTypes.ts`에 새로운 원시 데이터 타입 정의
2. `parse{Country}.ts` 파서 구현
3. `constants.ts`에 상태 매핑 추가
4. `country-switcher`에 국가 옵션 추가

이러한 설계를 통해 코드 중복을 최소화하고 유지보수성을 높이기 위해 노력했습니다.

### 공통 컴포넌트 구성

코드 재사용성과 일관성을 위해 공통 컴포넌트를 체계적으로 구성했습니다.

#### 1. 레이아웃 시프트 방지 패턴

에러 메시지가 나타날 때 입력 필드가 이동하는 문제를 해결하기 위해 `ErrorMessage` 컴포넌트를 만들었습니다. 이 컴포넌트는 항상 최소 높이를 유지하고, 에러가 없을 때는 투명하게 처리하여 공간을 예약합니다.

#### 2. 검색 입력 필드 통합

`SearchInput` 컴포넌트를 만들어 검색 입력 필드의 공통 패턴을 통합했습니다. 이 컴포넌트는 로딩 스피너, 에러 메시지, 접근성 속성을 포함합니다.

#### 3. 액션 버튼 통합

`ActionButton` 컴포넌트를 만들어 비교 버튼, 즐겨찾기 버튼 등에서 공통으로 사용되는 패턴을 통합했습니다. 로딩 상태, 비활성화 상태, 다양한 스타일 변형을 지원합니다.

#### 4. 검증 로직 훅화

`useSearchValidation` 훅을 만들어 검색어 검증 및 정제 로직을 재사용 가능하게 했습니다. 이를 통해 `SearchBar`와 `SearchBarWithFilters` 컴포넌트 간의 중복 코드를 제거했습니다.

#### 5. CSS 클래스 상수화

반복되는 CSS 클래스 문자열을 `shared/config/css-classes.ts`에 상수로 정의하여 일관성을 유지하고 유지보수를 용이하게 했습니다.

#### 6. 에러 처리 유틸리티

`safeExecute` 유틸리티 함수를 만들어 에러가 발생할 수 있는 함수 호출을 안전하게 래핑했습니다. 이를 통해 전역적으로 일관된 에러 처리를 구현했습니다.

## 💡 문제 해결 과정

### 한국/미국 데이터 스키마 차이 처리

가장 큰 도전 과제 중 하나는 한국과 미국의 상표 데이터 스키마가 완전히 다르다는 점이었습니다.

#### 문제점

1. **필드 이름 차이**: 한국은 `productName`, `productNameEng`를 사용하지만, 미국은 `productName`만 존재합니다.
2. **등록 상태 체계 차이**: 한국은 "등록", "출원", "거절", "실효"를 사용하지만, 미국은 "LIVE", "DEAD"를 사용합니다.
3. **필수 필드 차이**: 한국에는 있지만 미국에는 없는 필드들이 있습니다 (예: `publicationNumber`, `registrationPubNumber`).

#### 해결 방법

1. **정규화 단계 도입**: 각 국가의 원시 데이터를 공통 형식(`NormalizedTrademark`)으로 변환하는 정규화 단계를 도입했습니다. 이를 통해 이후 로직에서는 국가를 구분하지 않고 동일한 인터페이스로 처리할 수 있게 되었습니다.

2. **옵셔널 필드 활용**: 국가별로 존재하지 않는 필드는 옵셔널(`?`)로 정의하고, UI에서 조건부로 렌더링하도록 구현했습니다.

3. **타입 가드 시스템**: 런타임에서 데이터의 유효성을 검증하기 위해 타입 가드 시스템을 구축했습니다. 이를 통해 잘못된 데이터가 애플리케이션에 전파되는 것을 방지했습니다.

4. **기본값 처리**: 데이터가 누락된 경우 국가별로 적절한 기본값("미상" 또는 "Unknown")을 제공하도록 구현했습니다.

### 타입 안전성 강화

TypeScript의 strict 모드를 활성화하고 모든 strict 옵션을 켜서 타입 안전성을 최대한 확보하려고 노력했습니다.

#### 구현한 타입 가드

1. **기본 타입 가드**: `validateObject`, `validateArray` 등 기본적인 타입 검증 함수
2. **도메인별 타입 가드**: `isValidTrademarkId`, `isTrademarkArray` 등 도메인 특화 타입 가드
3. **상태 검증 가드**: `isValidComparisonState`, `canAddToComparison` 등 상태 유효성 검증

이러한 타입 가드를 통해 런타임에서도 데이터의 유효성을 보장할 수 있게 되었습니다.

### 성능 최적화

대량의 데이터를 처리할 때 성능 문제가 발생할 수 있어 다음과 같은 최적화를 적용했습니다.

1. **데이터 전처리**: 검색 인덱스를 사전에 생성하여 검색 속도를 향상시켰습니다.
2. **청크 단위 처리**: 대량 데이터를 작은 청크로 나누어 처리하여 메인 스레드 블로킹을 방지했습니다.
3. **필터링 파이프라인 최적화**: 빠른 필터를 우선 적용하여 불필요한 연산을 줄였습니다.
4. **정규화 캐싱**: LRU 캐시를 사용하여 중복 계산을 방지했습니다.

### 에러 처리 강화

사용자 경험을 위해 에러 처리를 체계적으로 개선했습니다.

1. **에러 바운더리 구현**: Next.js의 `error.tsx`와 `global-error.tsx`를 활용하여 UI 레벨에서 에러를 처리했습니다.
2. **안전한 함수 실행**: `safeExecute` 유틸리티를 통해 에러가 발생할 수 있는 함수 호출을 안전하게 래핑했습니다.
3. **사용자 친화적 메시지**: 기술적인 에러 메시지 대신 사용자가 이해하기 쉬운 메시지를 표시하도록 했습니다.
4. **부분 실패 처리**: 일부 데이터만 로드에 실패한 경우에도 나머지 데이터를 표시할 수 있도록 구현했습니다.

### 레이아웃 시프트 방지

에러 메시지가 나타날 때 입력 필드가 이동하는 문제를 해결하기 위해 다음과 같이 구현했습니다.

1. **고정 높이 예약**: 에러 메시지 영역에 최소 높이(`min-h-[1.25rem]`)를 설정하여 항상 공간을 예약했습니다.
2. **투명 처리**: 에러가 없을 때는 텍스트를 투명하게 처리하여 시각적으로는 보이지 않지만 공간은 유지되도록 했습니다.

이를 통해 사용자 경험을 개선할 수 있었습니다.

### 중복 코드 모듈화

프로젝트 진행 중 중복 코드가 발견되어 다음과 같이 모듈화했습니다.

1. **공통 컴포넌트 추출**: `ErrorMessage`, `SearchInput`, `ActionButton` 등 공통 UI 컴포넌트를 추출했습니다.
2. **공통 훅 추출**: `useSearchValidation` 훅을 만들어 검증 로직을 재사용 가능하게 했습니다.
3. **유틸리티 중앙화**: `storage.ts`, `navigation.ts` 등 공통 유틸리티를 중앙화했습니다.
4. **상수 중앙화**: CSS 클래스, 검색 상수 등을 중앙에서 관리하도록 했습니다.

이를 통해 코드 중복을 줄이고 유지보수성을 향상시킬 수 있었습니다.

## 🚀 개선하고 싶은 부분

프로젝트를 진행하면서 개선하고 싶은 부분들을 다음과 같이 정리했습니다.


###  접근성 개선

현재 기본적인 ARIA 속성과 시맨틱 HTML을 사용하고 있지만, 더 나은 접근성을 위해 다음을 개선하고 싶습니다:
- 키보드 네비게이션 개선
- 색상 대비 비율 검증 및 개선

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

## 📚 추가 문서

모든 문서는 [`docs/`](./docs/) 폴더에 카테고리별로 정리되어 있습니다.

### 문서 디렉토리 안내
- [`docs/docs.md`](./docs/docs.md): 문서 디렉토리 전체 안내 및 구조

### API 레퍼런스 (`docs/api-reference/`)
- [`trademark-lib.md`](./docs/api-reference/trademark-lib.md): 상표 엔티티 라이브러리 문서
- [`search-lib.md`](./docs/api-reference/search-lib.md): 검색 기능 라이브러리 문서
- [`pages-legacy.md`](./docs/api-reference/pages-legacy.md): Pages Router 레거시 코드 안내

### 기능 문서 (`docs/features/`)
- [`comparison-plan.md`](./docs/features/comparison-plan.md): 국가별 데이터 비교 기능 계획
- [`comparison-implementation.md`](./docs/features/comparison-implementation.md): 국가별 데이터 비교 기능 구현 예시

### 개발 문서 (`docs/development/`)
- [`esm-migration.md`](./docs/development/esm-migration.md): ESM 모듈 시스템 마이그레이션
- [`structure-optimization.md`](./docs/development/structure-optimization.md): 프로젝트 구조 최적화
- [`search-algorithm.md`](./docs/development/search-algorithm.md): 검색 알고리즘 개선

### 요구사항 문서 (`docs/requirements/`)
- [`checklist.md`](./docs/requirements/checklist.md): 프로젝트 요구사항 체크리스트

### 리소스 문서 (`docs/resources/`)
- [`assets-images.md`](./docs/resources/assets-images.md): Assets 이미지 폴더 안내
- [`public-images.md`](./docs/resources/public-images.md): 정적 이미지 폴더 안내

## 📄 라이선스

MIT
