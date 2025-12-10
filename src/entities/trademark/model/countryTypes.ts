export interface KRTrademarkRaw {
  productName: string | null
  productNameEng?: string | null
  applicationNumber: string
  applicationDate?: string
  registerStatus?: string
  publicationNumber?: string | null
  publicationDate?: string | null
  registrationNumber?: (string | null)[] | null
  registrationDate?: (string | null)[] | null
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
  registrationNumber?: (string | null)[] | null
  registrationDate?: (string | null)[] | null
  internationalRegNumbers?: string[] | null
  internationalRegDate?: string | null
  priorityClaimNumList?: string[] | null
  priorityClaimDateList?: string[] | null
  asignProductMainCodeList?: string[] | null
  usClassCodeList?: string[] | null
  viennaCodeList?: (string | null)[] | null
}

export type TrademarkRaw = KRTrademarkRaw | USTrademarkRaw

