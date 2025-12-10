import { z } from 'zod'

import { RegisterStatus, TrademarkFilters } from '@/entities/trademark/model'

const statusSchema = z
  .enum(['registered', 'rejected', 'pending', 'expired', 'live', 'dead', 'unknown', 'all'])
  .optional()

const filterSchema = z.object({
  keyword: z.string().optional(),
  status: statusSchema,
  from: z.string().optional(),
  to: z.string().optional(),
})

function toStringValue(value?: string | string[]) {
  if (!value) return undefined
  return Array.isArray(value) ? value[0] : value
}

function toStatus(value?: string): RegisterStatus | 'all' | undefined {
  if (!value) return undefined
  const parsed = statusSchema.safeParse(value)
  if (!parsed.success) return undefined
  return parsed.data as RegisterStatus | 'all'
}

export function parseFiltersFromQuery(
  params: Record<string, string | string[] | undefined>,
): TrademarkFilters {
  const result = filterSchema.safeParse({
    keyword: toStringValue(params.keyword),
    status: toStringValue(params.status),
    from: toStringValue(params.from),
    to: toStringValue(params.to),
  })

  if (!result.success) return {}

  const { keyword, status, from, to } = result.data

  return {
    keyword,
    status: toStatus(status),
    dateRange: from || to ? { from, to } : undefined,
  }
}
