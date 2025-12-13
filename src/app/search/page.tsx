import type { Metadata } from 'next'
import TrademarkSearchLayout from '@/processes/trademark-search/ui/TrademarkSearchLayout'

export const metadata: Metadata = {
  title: '검색',
  description: '한국(KR)과 미국(US) 상표를 검색하고 필터링하세요. 상표명, 출원번호, 등록 상태, 출원일 범위로 검색할 수 있습니다.',
  openGraph: {
    title: '상표 검색 | 다국가 상표 검색',
    description: '한국(KR)과 미국(US) 상표를 검색하고 필터링하세요.',
  },
}

export default function SearchRoute() {
  return <TrademarkSearchLayout />
}
