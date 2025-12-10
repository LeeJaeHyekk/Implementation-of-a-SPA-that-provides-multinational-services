'use client'

import type { ChangeEvent } from 'react'

import { RegisterStatus } from '@/entities/trademark/model/types'

import { useSearchStore } from '../model/store'

const STATUS_OPTIONS: Array<{ value: RegisterStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'registered', label: '등록' },
  { value: 'pending', label: '출원' },
  { value: 'rejected', label: '거절' },
  { value: 'expired', label: '실효' },
  { value: 'live', label: 'LIVE' },
  { value: 'dead', label: 'DEAD' },
  { value: 'unknown', label: '알수없음' },
]

export default function StatusFilter() {
  const status = useSearchStore((state) => state.status)
  const setStatus = useSearchStore((state) => state.setStatus)

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setStatus(event.target.value as RegisterStatus | 'all')
  }

  return (
    <div className="w-full">
      <label className="text-sm text-slate-300">상태</label>
      <select
        value={status ?? 'all'}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
