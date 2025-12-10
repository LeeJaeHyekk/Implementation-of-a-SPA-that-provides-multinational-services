'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function FavoritesPage() {
  const router = useRouter()

  useEffect(() => {
    void router.replace('/favorites')
  }, [router])

  return null
}
