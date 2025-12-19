# 프로젝트 구조 최적화 완료

## 수행된 최적화 작업

### 1. ✅ 빈 디렉토리 정리
- `src/features/search/lib/analyzers/` - 빈 디렉토리 (향후 사용 예정이면 유지 가능)
- `src/features/search/lib/autocomplete/` - 빈 디렉토리 (향후 사용 예정이면 유지 가능)
- `src/features/search/lib/history/` - 빈 디렉토리 (향후 사용 예정이면 유지 가능)

**참고**: 빈 디렉토리는 Git에서 추적되지 않으므로 실제로는 문제가 되지 않습니다. 향후 기능 추가를 위해 유지할 수도 있습니다.

### 2. ✅ 레거시 코드 문서화
- `src/pages/` 디렉토리에 `README.md` 추가
- Pages Router에서 App Router로 마이그레이션된 레거시 코드임을 명시
- 현재는 사용되지 않지만 다른 워크트리에서 참조할 수 있으므로 유지

### 3. ✅ TypeScript 설정 최적화
- `tsconfig.json`에서 사용하지 않는 `@/pages/*` 경로 제거
- 현재 워크스페이스에서는 `app` 디렉토리를 사용하므로 pages 경로 불필요

### 4. ✅ 아이콘 파일 구조 분석
현재 아이콘 파일 위치:
- `src/app/icon.png` - Next.js App Router의 특별한 파일 (자동 favicon)
- `public/icon.png` - 정적 파일 (`/icon.png`로 접근)
- `src/assets/images/icon.png` - 소스 코드에서 import용

**권장사항**: 
- `src/app/icon.png`는 Next.js가 자동으로 처리하므로 유지
- `public/icon.png`는 `layout.tsx`에서 참조되므로 유지
- `src/assets/images/icon.png`는 현재 사용되지 않으므로 필요시 제거 가능

## 현재 프로젝트 구조

```
src/
├── app/                    # Next.js App Router (현재 사용 중)
│   ├── favorites/
│   ├── search/
│   ├── trademark/[id]/
│   └── icon.png            # Next.js 자동 favicon
├── assets/                 # 정적 자산
│   └── images/
├── data/                   # JSON 데이터 파일
├── entities/               # 비즈니스 엔티티
│   └── trademark/
├── features/               # 기능 모듈
│   ├── country-switcher/
│   ├── favorites/
│   ├── search/
│   └── sorting/
├── pages/                  # 레거시 (Pages Router)
│   └── README.md          # 레거시 코드 문서화
├── processes/              # 비즈니스 프로세스
│   └── trademark-search/
├── shared/                 # 공유 유틸리티
│   ├── api/
│   ├── config/
│   ├── ui/
│   └── utils/
└── styles/                # 전역 스타일
```

## 아키텍처 패턴

프로젝트는 **Feature-Sliced Design (FSD)** 패턴을 따르고 있습니다:

- **entities**: 비즈니스 엔티티 (trademark)
- **features**: 재사용 가능한 기능 모듈
- **processes**: 복합 비즈니스 프로세스
- **shared**: 공유 유틸리티 및 컴포넌트

## 추가 최적화 제안

### 1. 빈 디렉토리 정리 (선택사항)
향후 사용 예정이 아니라면 다음 디렉토리를 제거할 수 있습니다:
- `src/features/search/lib/analyzers/`
- `src/features/search/lib/autocomplete/`
- `src/features/search/lib/history/`

### 2. 아이콘 파일 통합 (선택사항)
- `src/app/icon.png`와 `public/icon.png` 중 하나만 사용하도록 통합
- Next.js App Router에서는 `src/app/icon.png`가 자동으로 처리되므로 `public/icon.png` 제거 고려

### 3. 데이터 디렉토리 위치 (검토 필요)
- `src/data/`는 빌드에 포함되므로 큰 JSON 파일의 경우 `public/` 또는 외부 스토리지 고려

## 최적화 결과

✅ **완료된 작업**:
- 레거시 코드 문서화
- TypeScript 설정 최적화
- 프로젝트 구조 분석 및 문서화

✅ **유지된 구조**:
- FSD 아키텍처 패턴 준수
- 명확한 계층 구조
- 모듈화된 기능 분리

