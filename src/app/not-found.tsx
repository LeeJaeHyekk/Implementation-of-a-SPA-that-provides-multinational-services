import Link from 'next/link'
import NavigateButton from '@/shared/ui/NavigateButton'
import { LAYOUT_CLASSES } from '@/shared/config/css-classes'

export const metadata = {
  title: '404 - 페이지를 찾을 수 없습니다',
  description: '요청하신 페이지를 찾을 수 없습니다.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className={LAYOUT_CLASSES.centered}>
      <div className={LAYOUT_CLASSES.centeredContent}>
        <div className="glass-card rounded-xl p-6 text-center sm:rounded-2xl sm:p-8">
          <div className="mb-4">
            <h1 className="text-6xl sm:text-8xl font-bold text-indigo-400 drop-shadow-lg">404</h1>
            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-slate-50 drop-shadow-md">
              페이지를 찾을 수 없습니다
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>
          
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <NavigateButton to="search" variant="primary" />
            <Link
              href="/favorites"
              className="glass-button rounded-lg px-4 py-2 text-sm font-medium text-slate-200 transition hover:text-indigo-200 sm:px-6"
            >
              즐겨찾기로 이동
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

