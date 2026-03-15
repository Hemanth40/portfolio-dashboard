export type Stock = {
  id: number
  name: string
  ticker: string
  purchasePrice: number
  qty: number
  sector: string
}

export type LiveStockData = {
  ticker: string
  cmp: number | null
  peRatio: number | null
  latestEarnings: number | null
  error?: string
}

export type EnrichedStock = {
  id: number
  name: string
  ticker: string
  sector: string
  purchasePrice: number
  qty: number
  investment: number
  portfolioPct: number
  cmp: number | null
  presentValue: number | null
  gainLoss: number | null
  gainLossPct: number | null
  peRatio: number | null
  latestEarnings: number | null
  isLoading: boolean
  hasError: boolean
}