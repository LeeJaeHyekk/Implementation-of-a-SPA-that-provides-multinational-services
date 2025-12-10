import type { ReactNode } from 'react'

import '@/styles/globals.css'

import Providers from './providers'

export const metadata = {
  title: 'Multinational Trademark Search',
  description: 'KR/US trademark search demo with local JSON datasets',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
