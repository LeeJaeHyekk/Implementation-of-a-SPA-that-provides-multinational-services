'use client'

import Image from 'next/image'

import backgroundImg from '@/assets/images/backgroundImg.png'

/**
 * 애니메이션이 적용된 배경 컴포넌트
 * GIF처럼 부드럽게 움직이는 효과 제공 (Seamless Loop)
 * 마우스 이동에 반응하지 않는 순수 CSS 애니메이션
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 배경 이미지 레이어 - Seamless Loop */}
      <div className="absolute inset-0 animate-pan-slow">
        <div className="absolute inset-0 animate-zoom-slow">
          <Image
            src={backgroundImg}
            alt="Background"
            fill
            priority
            quality={90}
            className="object-cover"
            style={{
              objectPosition: '50% 50%',
              willChange: 'transform',
            }}
          />
        </div>
      </div>

      {/* 오버레이 그라데이션 레이어 (깊이감 추가) - Seamless Loop */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70 animate-gradient-shift" />

      {/* 빛나는 파티클 효과 - Seamless Loop */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-twinkle" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-indigo-300/40 rounded-full animate-twinkle-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-300/50 rounded-full animate-twinkle-delayed-2" />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-300/30 rounded-full animate-twinkle" />
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-white/20 rounded-full animate-twinkle-delayed" />
        <div className="absolute top-2/3 left-1/2 w-1 h-1 bg-purple-300/40 rounded-full animate-twinkle-delayed-2" />
        <div className="absolute bottom-1/2 left-1/4 w-1.5 h-1.5 bg-pink-300/30 rounded-full animate-twinkle" />
      </div>

      {/* 안개 효과 (mist) - Seamless Loop */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-mist" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-mist"
        style={{
          animationDelay: '12.5s',
        }}
      />
    </div>
  )
}

