# 문서 디렉토리

이 디렉토리에는 프로젝트의 모든 문서가 카테고리별로 정리되어 있습니다.

## 📁 문서 구조

```
docs/
├── docs.md                    # 이 파일 (문서 디렉토리 안내)
├── api-reference/             # API 레퍼런스 문서
│   ├── README.md
│   ├── trademark-lib.md
│   ├── search-lib.md
│   └── pages-legacy.md
├── resources/                 # 리소스 관련 문서
│   ├── README.md
│   ├── assets-images.md
│   └── public-images.md
├── features/                  # 기능 관련 문서
│   ├── README.md
│   ├── comparison-plan.md
│   └── comparison-implementation.md
├── development/               # 개발 관련 문서
│   ├── README.md
│   ├── esm-migration.md
│   ├── structure-optimization.md
│   └── search-algorithm.md
└── requirements/              # 요구사항 관련 문서
    ├── README.md
    └── checklist.md
```

## 📚 카테고리별 문서

### API 레퍼런스 (`api-reference/`)
소스 코드 관련 문서가 포함되어 있습니다.
- 상표 엔티티 라이브러리 문서
- 검색 기능 라이브러리 문서
- 레거시 코드 안내

자세한 내용은 [`api-reference/README.md`](./api-reference/README.md)를 참조하세요.

### 리소스 (`resources/`)
리소스(이미지, 정적 파일 등) 관련 문서가 포함되어 있습니다.
- Assets 이미지 폴더 안내
- 정적 이미지 폴더 안내

자세한 내용은 [`resources/README.md`](./resources/README.md)를 참조하세요.

### 기능 (`features/`)
주요 기능에 대한 계획 및 구현 문서가 포함되어 있습니다.
- 국가별 데이터 비교 기능 계획
- 국가별 데이터 비교 기능 구현 예시

자세한 내용은 [`features/README.md`](./features/README.md)를 참조하세요.

### 개발 (`development/`)
프로젝트 개발 과정에서 작성된 기술 문서가 포함되어 있습니다.
- ESM 모듈 시스템 마이그레이션
- 프로젝트 구조 최적화
- 검색 알고리즘 개선

자세한 내용은 [`development/README.md`](./development/README.md)를 참조하세요.

### 요구사항 (`requirements/`)
프로젝트 요구사항 관련 문서가 포함되어 있습니다.
- 요구사항 체크리스트

자세한 내용은 [`requirements/README.md`](./requirements/README.md)를 참조하세요.

## 📝 문서 작성 가이드

새로운 문서를 추가할 때는 다음 규칙을 따르시기 바랍니다:

1. **카테고리 선택**: 문서의 성격에 맞는 카테고리 폴더를 선택합니다.
2. **파일명 규칙**: `kebab-case.md` 형식을 사용합니다.
3. **README 작성**: 각 카테고리 폴더에는 해당 카테고리의 문서 목록과 설명을 담은 `README.md`가 있습니다.
4. **문서 구조**: 문서는 목적, 내용, 사용 방법을 명확히 설명해야 합니다.

## 🔗 관련 링크

- [메인 README](../README.md): 프로젝트 개요 및 시작 가이드
