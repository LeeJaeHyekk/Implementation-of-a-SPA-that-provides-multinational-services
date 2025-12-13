/**
 * 청크 단위 데이터 처리 유틸리티
 * 대량 데이터를 작은 단위로 나눠 처리하여 메인 스레드 블로킹 방지
 */

/**
 * 청크 단위로 데이터 처리
 * @param items 처리할 데이터 배열
 * @param processor 각 항목을 처리하는 함수
 * @param chunkSize 청크 크기 (기본값: 100)
 * @param onProgress 진행률 콜백 (선택)
 * @returns 처리된 결과 배열
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize = 100,
  onProgress?: (processed: number, total: number) => void,
): Promise<R[]> {
  const results: R[] = []
  const total = items.length

  for (let i = 0; i < total; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    const chunkResults = chunk.map(processor)
    results.push(...chunkResults)

    // 진행률 콜백
    if (onProgress) {
      onProgress(Math.min(i + chunkSize, total), total)
    }

    // 다음 이벤트 루프로 양보 (메인 스레드 블로킹 방지)
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return results
}

/**
 * 청크 단위로 필터링
 */
export async function filterInChunks<T>(
  items: T[],
  predicate: (item: T) => boolean,
  chunkSize = 100,
  onProgress?: (processed: number, total: number) => void,
): Promise<T[]> {
  const results: T[] = []
  const total = items.length

  for (let i = 0; i < total; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)
    const chunkResults = chunk.filter(predicate)
    results.push(...chunkResults)

    if (onProgress) {
      onProgress(Math.min(i + chunkSize, total), total)
    }

    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return results
}

/**
 * 청크 단위로 맵 변환
 */
export async function mapInChunks<T, R>(
  items: T[],
  mapper: (item: T) => R,
  chunkSize = 100,
  onProgress?: (processed: number, total: number) => void,
): Promise<R[]> {
  return processInChunks(items, mapper, chunkSize, onProgress)
}

