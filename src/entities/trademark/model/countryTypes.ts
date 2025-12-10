export interface KRTrademarkRaw {
  productName: string
  productNameEng?: string
  applicationNumber: string
  applicationDate?: string
  registerStatus?: string
  publicationNumber?: string | null
  publicationDate?: string | null
  registrationNumber?: string[] | null
  registrationDate?: string[] | null
  registrationPubNumber?: string | null
  registrationPubDate?: string | null
  internationalRegNumbers?: string[] | null
  internationalRegDate?: string | null
  priorityClaimNumList?: string[] | null
  priorityClaimDateList?: string[] | null
  asignProductMainCodeList?: string[] | null
  asignProductSubCodeList?: string[] | null
  viennaCodeList?: string[] | null
}

export interface USTrademarkRaw {
  productName: string | null
  applicationNumber: string
  applicationDate?: string
  registerStatus?: string
  publicationDate?: string | null
  registrationNumber?: string[] | null
  registrationDate?: string[] | null
  internationalRegNumbers?: string[] | null
  internationalRegDate?: string | null
  priorityClaimNumList?: string[] | null
  priorityClaimDateList?: string[] | null
  asignProductMainCodeList?: string[] | null
  usClassCodeList?: string[] | null
  viennaCodeList?: string[] | null
}

export type TrademarkRaw = KRTrademarkRaw | USTrademarkRaw

