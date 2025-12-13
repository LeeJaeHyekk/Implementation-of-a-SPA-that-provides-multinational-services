# 검색 알고리즘 개선 제안

현재 프로젝트의 검색 기능을 분석한 결과, 다음과 같은 알고리즘 도입이 필요합니다.

## 🔍 현재 상태 분석

### 구현된 기능
- ✅ 부분 일치 검색 (`includes` 기반)
- ✅ 정규화 및 정제
- ✅ 인덱스 기반 빠른 검색
- ✅ 필터링 파이프라인 최적화

### 부족한 기능
- ❌ 검색 결과 관련도 점수 계산
- ❌ 오타 허용 검색 (Fuzzy Search)
- ❌ 검색어 자동완성
- ❌ 검색 결과 하이라이팅
- ❌ 검색 랭킹 알고리즘 (BM25, TF-IDF)

## 🎯 우선순위별 개선 제안

### 1. 검색 결과 관련도 점수 알고리즘 (High Priority) ⭐⭐⭐

**문제점**: 현재는 단순히 매칭 여부만 확인하고, 가장 관련성 높은 결과를 상위에 표시하지 않음

**해결책**: 관련도 점수(Relevance Score) 계산 알고리즘 도입

```typescript
// 관련도 점수 계산 요소
interface RelevanceScore {
  exactMatch: number        // 완전 일치: 100점
  startsWith: number        // 시작 일치: 80점
  contains: number          // 포함 일치: 60점
  fieldWeight: {
    productName: number     // 상품명 매칭 가중치: 1.0
    productNameEng: number  // 영문명 매칭 가중치: 0.8
  }
  positionBonus: number     // 검색어 위치 보너스
}
```

**구현 위치**: `src/entities/trademark/lib/matchers/relevance-scorer.ts`

**효과**: 사용자가 원하는 결과를 더 빠르게 찾을 수 있음

---

### 2. 퍼지 검색 (Fuzzy Search) (Medium Priority) ⭐⭐

**문제점**: 오타가 있으면 검색 결과가 나오지 않음

**해결책**: Levenshtein 거리 알고리즘 또는 유사도 알고리즘 도입

```typescript
// Levenshtein 거리 기반 유사도 계산
function calculateSimilarity(str1: string, str2: string): number {
  // 편집 거리 계산
  // 유사도 = 1 - (편집 거리 / 최대 길이)
}
```

**구현 위치**: `src/features/search/lib/matchers/fuzzy-matcher.ts`

**효과**: 오타가 있어도 검색 가능, 사용자 경험 향상

---

### 3. 검색어 자동완성 (Autocomplete) (Medium Priority) ⭐⭐

**문제점**: 검색어 입력 시 자동완성 제안이 없음

**해결책**: Trie 자료구조 기반 자동완성

```typescript
// Trie 노드 구조
class TrieNode {
  children: Map<string, TrieNode>
  isEndOfWord: boolean
  suggestions: string[]
}

// 자동완성 검색
function autocomplete(prefix: string): string[]
```

**구현 위치**: `src/features/search/lib/autocomplete/trie.ts`

**효과**: 검색 속도 향상, 사용자 편의성 증가

---

### 4. 검색 결과 하이라이팅 (Low Priority) ⭐

**문제점**: 검색어와 일치하는 부분을 시각적으로 강조하지 않음

**해결책**: 검색어 매칭 부분을 `<mark>` 태그로 감싸기

```typescript
function highlightMatch(text: string, keyword: string): string {
  // 검색어와 일치하는 부분을 <mark> 태그로 감싸기
}
```

**구현 위치**: `src/shared/utils/highlight.ts`

**효과**: 검색 결과의 가독성 향상

---

### 5. BM25 검색 랭킹 알고리즘 (High Priority) ⭐⭐⭐

**문제점**: 단순 매칭만으로는 검색 품질이 제한적

**해결책**: BM25 (Best Matching 25) 알고리즘 도입

```typescript
// BM25 점수 계산
function calculateBM25Score(
  term: string,
  document: string,
  allDocuments: string[]
): number {
  // TF (Term Frequency)
  // IDF (Inverse Document Frequency)
  // BM25 공식 적용
}
```

**구현 위치**: `src/entities/trademark/lib/matchers/bm25-scorer.ts`

**효과**: 검색 엔진 수준의 랭킹 품질

---

### 6. 검색어 분석 및 동의어 처리 (Low Priority) ⭐

**문제점**: 동의어나 유사어를 인식하지 못함

**해결책**: 동의어 사전 및 형태소 분석

```typescript
// 동의어 사전
const SYNONYMS: Record<string, string[]> = {
  '상표': ['트레이드마크', '브랜드'],
  '등록': ['레지스터', '등기']
}
```

**구현 위치**: `src/features/search/lib/analyzers/synonym-expander.ts`

**효과**: 검색 범위 확장, 더 많은 결과 발견

---

### 7. 검색 히스토리 및 인기 검색어 (Low Priority) ⭐

**문제점**: 사용자 검색 패턴을 활용하지 않음

**해결책**: 검색 히스토리 저장 및 인기 검색어 추적

```typescript
// 검색 히스토리
interface SearchHistory {
  keyword: string
  timestamp: number
  resultCount: number
}

// 인기 검색어 계산
function getPopularKeywords(history: SearchHistory[]): string[]
```

**구현 위치**: `src/features/search/lib/history/search-history.ts`

**효과**: 사용자 경험 개선, 검색 편의성 향상

---

## 📊 구현 우선순위

### Phase 1 (즉시 구현 권장)
1. **검색 결과 관련도 점수 알고리즘** - 가장 큰 영향
2. **BM25 검색 랭킹 알고리즘** - 검색 품질 향상

### Phase 2 (중기 개선)
3. **퍼지 검색** - 사용자 경험 향상
4. **검색어 자동완성** - 검색 속도 향상

### Phase 3 (장기 개선)
5. **검색 결과 하이라이팅** - 가독성 향상
6. **동의어 처리** - 검색 범위 확장
7. **검색 히스토리** - 사용자 편의성

## 🔧 구현 예시

### 관련도 점수 계산 예시

```typescript
// src/entities/trademark/lib/matchers/relevance-scorer.ts
export interface RelevanceScore {
  score: number
  reasons: string[]
}

export function calculateRelevanceScore(
  trademark: PreprocessedTrademark,
  keyword: string
): RelevanceScore {
  let score = 0
  const reasons: string[] = []
  const normalizedKeyword = keyword.toLowerCase().trim()

  // 완전 일치 (100점)
  if (trademark.productName?.toLowerCase() === normalizedKeyword) {
    score += 100
    reasons.push('상품명 완전 일치')
  }

  // 시작 일치 (80점)
  if (trademark.productName?.toLowerCase().startsWith(normalizedKeyword)) {
    score += 80
    reasons.push('상품명 시작 일치')
  }

  // 포함 일치 (60점)
  if (trademark.productName?.toLowerCase().includes(normalizedKeyword)) {
    score += 60
    reasons.push('상품명 포함 일치')
  }

  // 영문명 매칭 (가중치 0.8)
  if (trademark.productNameEng?.toLowerCase().includes(normalizedKeyword)) {
    score += 60 * 0.8
    reasons.push('영문명 포함 일치')
  }

  return { score, reasons }
}
```

## 📈 예상 효과

- **검색 정확도**: 30-50% 향상
- **사용자 만족도**: 관련도 높은 결과 우선 표시로 향상
- **검색 성공률**: 오타 허용으로 20-30% 향상
- **검색 속도**: 자동완성으로 입력 시간 단축

