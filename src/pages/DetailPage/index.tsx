'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function DetailPage() {
  const router = useRouter()
  const id = router.query['id']

  useEffect(() => {
    if (typeof id === 'string') {
      void router.replace(`/trademark/${id}`)
      return
    }
    void router.replace('/search')
  }, [id, router])

  return null
}
