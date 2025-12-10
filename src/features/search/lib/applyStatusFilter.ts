import { filterByStatus } from '@/entities/trademark/lib'
import { NormalizedTrademark, RegisterStatus } from '@/entities/trademark/model'

export function applyStatusFilter(items: NormalizedTrademark[], status?: RegisterStatus | 'all') {
  return filterByStatus(items, status)
}
