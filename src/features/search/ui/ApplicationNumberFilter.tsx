'use client'

import type { ChangeEvent } from 'react'

import { useSearchStore } from '../model/store'

export default function ApplicationNumberFilter() {
  const applicationNumber = useSearchStore((state) => state.applicationNumber)
  const setApplicationNumber = useSearchStore((state) => state.setApplicationNumber)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setApplicationNumber(event.target.value)
  }

  return (
    <div className="w-full">
      <label className="text-sm text-slate-300">출원번호</label>
      <input
        value={applicationNumber}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
        placeholder="정확한 출원번호를 입력"
      />
    </div>
  )
}

