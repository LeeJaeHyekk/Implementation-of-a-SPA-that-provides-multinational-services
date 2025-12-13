import type { ReactNode } from 'react'

import '@/styles/globals.css'

import AnimatedBackground from '@/shared/ui/AnimatedBackground'
import Providers from './providers'

export const metadata = {
  title: {
    default: '다국가 상표 검색',
    template: '%s | 다국가 상표 검색',
  },
  description: '한국(KR)과 미국(US) 상표 데이터를 통합 검색하고 필터링할 수 있는 서비스입니다. 상표명, 출원번호, 등록 상태, 출원일 범위로 검색하세요.',
  keywords: ['상표 검색', 'trademark search', 'KR 상표', 'US 상표', '다국가 상표', '상표 조회', 'trademark lookup'],
  authors: [{ name: 'Multinational Trademark Search' }],
  creator: 'Multinational Trademark Search',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://trademark-search.example.com',
    title: '다국가 상표 검색',
    description: '한국(KR)과 미국(US) 상표 데이터를 통합 검색하고 필터링할 수 있는 서비스입니다.',
    siteName: '다국가 상표 검색',
  },
  twitter: {
    card: 'summary_large_image',
    title: '다국가 상표 검색',
    description: '한국(KR)과 미국(US) 상표 데이터를 통합 검색하고 필터링할 수 있는 서비스입니다.',
  },
  icons: {
    icon: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="relative">
        <AnimatedBackground />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
