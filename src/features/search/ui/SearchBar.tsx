'use client'

import type { ChangeEvent } from 'react'

import { useSearchStore } from '../model/store'

export default function SearchBar() {
  const keyword = useSearchStore((state) => state.keyword)
  const setKeyword = useSearchStore((state) => state.setKeyword)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setKeyword(event.target.value)
  }

  return (
    <div className="w-full">
      <label className="text-sm text-slate-300">검색어</label>
      <input
        value={keyword}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
        placeholder="상품명, 출원번호 등으로 검색"
      />
    </div>
  )
}
