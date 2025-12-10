export type TrademarkCountry = 'KR' | 'US'

export type RegisterStatus =
  | 'registered'
  | 'rejected'
  | 'pending'
  | 'expired'
  | 'live'
  | 'dead'
  | 'unknown'

export interface NormalizedTrademark {
  id: string
  country: TrademarkCountry
  productName: string
  productNameEng?: string | null
  applicationNumber: string
  applicationDate?: string | null
  registerStatus: RegisterStatus
  publicationNumber?: string | null
  publicationDate?: string | null
  registrationNumber: string[]
  registrationDate: string[]
  registrationPubNumber?: string | null
  registrationPubDate?: string | null
  internationalRegNumbers: string[]
  internationalRegDate?: string | null
  priorityClaimNumList: string[]
  priorityClaimDateList: string[]
  productMainCodes: string[]
  productSubCodes?: string[]
  usClassCodes?: string[]
  viennaCodeList: string[]
}

export interface TrademarkFilters {
  keyword?: string
  applicationNumber?: string
  status?: RegisterStatus | 'all'
  dateRange?: {
    from?: string
    to?: string
  }
}

