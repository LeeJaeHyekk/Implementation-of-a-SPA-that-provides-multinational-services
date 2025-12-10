'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function SearchPage() {
  const router = useRouter()

  useEffect(() => {
    void router.replace('/search')
  }, [router])

  return null
}
