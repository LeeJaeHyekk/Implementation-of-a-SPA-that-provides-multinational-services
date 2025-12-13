import type { ReactNode } from 'react'

import '@/styles/globals.css'

import AnimatedBackground from '@/shared/ui/AnimatedBackground'
import Providers from './providers'

export const metadata = {
  title: 'Multinational Trademark Search',
  description: 'KR/US trademark search demo with local JSON datasets',
  icons: {
    icon: '/icon.png',
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
