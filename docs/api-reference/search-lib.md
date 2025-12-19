# 검색 기능 라이브러리

검색어 처리 및 필터링 관련 유틸리티 모듈입니다.

## 구조

```
lib/
├── index.ts                    # 통합 export
├── combineFilters.ts           # 필터 결합
├── sanitizeKeyword.ts          # 레거시 API (@deprecated)
├── sanitizers/                 # 검색어 정제
│   ├── character-filters.ts
│   ├── implementations.ts
│   └── types.ts
├── normalizers/                # 검색어 정규화
│   ├── implementations.ts
│   └── types.ts
├── matchers/                   # 검색어 매칭
│   ├── implementations.ts
│   └── types.ts
├── validators/                 # 검색어 검증
│   ├── implementations.ts
│   └── types.ts
├── profanity/                  # 욕설 필터링
│   ├── filters.ts
│   └── types.ts
├── errors/                     # 에러 처리
│   ├── index.ts
│   └── types.ts
└── cache/                      # 캐시
    └── normalization-cache.ts
```

## 주요 기능

### 검색어 정제
- `createKoreanSanitizer`: 한국어 검색어 정제기
- `createEnglishSanitizer`: 영어 검색어 정제기
- `createMultiLanguageSanitizer`: 다국어 검색어 정제기

### 검색어 정규화
- `createKoreanNormalizer`: 한국어 정규화
- `createEnglishNormalizer`: 영어 정규화
- `createMultiLanguageNormalizer`: 다국어 정규화

### 검색어 매칭
- `createKeywordMatcher`: 키워드 매칭기 생성

### 검색어 검증
- `validateKeyword`: 검색어 유효성 검증

### 필터 결합
- `combineFilters`: 동기 필터 결합
- `combineFiltersAsync`: 비동기 필터 결합 (대량 데이터용)

