# Multinational Trademark Search SPA

KR/US 상표 데이터를 로컬 JSON으로 불러와 검색·필터·정렬·즐겨찾기를 제공하는 Next.js App Router 기반 SPA입니다.

## 빠른 시작
- Node 18+ 권장
- 설치: `npm install`
- 개발 서버: `npm run dev` (http://localhost:3000)
- 빌드: `npm run build` → `npm start`
- 린트: `npm run lint` (Flat config, ESLint 9)

## 사용 스택 (현행 버전)
- Next.js 16 (App Router, Turbopack 기본)
- React 19
- TypeScript 5.9
- Tailwind CSS 3.4
- TanStack Query 5, Zustand 5, Zod 4
- ESLint 9 (flat config), eslint-plugin-react / -hooks / @typescript-eslint / @next/next

## 프로젝트 구조 (요약)
```
src/
├─ app/            # 루트 레이아웃, 라우트 엔트리 (search, favorites, trademark/[id])
├─ pages/          # 라우트별 페이지 컴포지션
├─ processes/      # feature 조합 흐름 (trademark-search layout/panel)
├─ features/       # 검색, 즐겨찾기, 국가 선택, 정렬 등 독립 기능
├─ entities/       # 핵심 도메인(trademark) 모델/파서/UI
├─ shared/         # API, config, 공통 훅/유틸
├─ data/           # 로컬 JSON (샘플/대용량)
└─ styles/         # 글로벌 스타일
```

## 주요 동작
- 국가별 스키마 정규화: `entities/trademark/lib/parseKR.ts`, `parseUS.ts` → `NormalizedTrademark`
- 데이터 로드: `shared/api/fetchKRTrademarks.ts`, `fetchUSTrademarks.ts`가 `src/data/*.json`을 동적 import 후 정규화
- 검색/필터/정렬: `features/search` + `features/sorting` + `processes/trademark-search`
- 즐겨찾기: `features/favorites` (Zustand + persist)
- 라우팅: `/search`, `/favorites`, `/trademark/[id]`

## 데이터셋 안내
- `src/data/trademarks_kr_sample.json`, `src/data/trademarks_us_sample.json`: 가벼운 목 데이터 (빈 배열 기본). 대용량 없이도 UI 확인 가능.
- `src/data/trademarks_kr_trademarks.json`, `src/data/trademarks_us_trademarks.json`: 실제 예시 대용량 JSON.
- 필요 시 샘플 파일에 소량 레코드를 추가해 빠른 데모/검증이 가능합니다.

## 아키텍처/확장 가이드
- 새로운 국가 추가: 타입 정의 → 파서 추가 → 상태 매핑 → config/API 훅 확장.
- 새로운 필터 추가: `TrademarkFilters` 확장 → 공통 필터 로직 추가 → Zustand store/UI 추가.
- 상태 관리: 단일 책임, 상위→하위 의존, 타입 우선.

## 유의 사항
- Turbopack가 워크스페이스 루트를 추론합니다. 상위 경로에 다른 lockfile이 있다면 경고가 출력될 수 있습니다. 필요 시 제거하거나 `next.config.js`의 `turbopack.root`로 고정.
- lint 규칙: 세미콜론 미사용, 멀티라인 trailing comma, 타입 임포트 일관성(@typescript-eslint).

## 라이선스
MIT
