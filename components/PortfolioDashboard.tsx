'use client'

import { useEffect, useState, useCallback } from 'react'
import { portfolioData } from '@/data/portfolio'
import { EnrichedStock, LiveStockData } from '@/types'
import SummaryBar from './SummaryBar'
import SectorGroup from './SectorGroup'
import { RefreshCw, BarChart3 } from 'lucide-react'

const INTERVAL = 15000

export default function PortfolioDashboard() {
  const [liveData, setLiveData]       = useState<Record<string, LiveStockData>>({})
  const [isLoading, setIsLoading]     = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [refreshing, setRefreshing]   = useState(false)
  const [countdown, setCountdown]     = useState(15)

  const allTickers = portfolioData.flatMap(s => s.stocks).map(s => s.ticker)

  const fetchData = useCallback(async () => {
    setRefreshing(true)
    setCountdown(15)
    try {
      const res  = await fetch(`/api/stocks?tickers=${allTickers.join(',')}`)
      const json = await res.json() as LiveStockData[]
      const map: Record<string, LiveStockData> = {}
      json.forEach(item => { map[item.ticker] = item })
      setLiveData(map)
      setLastUpdated(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const iv = setInterval(fetchData, INTERVAL)
    return () => clearInterval(iv)
  }, [fetchData])

  useEffect(() => {
    const tick = setInterval(() => setCountdown(p => p <= 1 ? 15 : p - 1), 1000)
    return () => clearInterval(tick)
  }, [])

  const totalInvested = portfolioData
    .flatMap(s => s.stocks)
    .reduce((sum, s) => sum + s.purchasePrice * s.qty, 0)

  const totalCurrent = portfolioData
    .flatMap(s => s.stocks)
    .reduce((sum, s) => {
      const cmp = liveData[s.ticker]?.cmp ?? null
      return sum + (cmp !== null ? cmp * s.qty : s.purchasePrice * s.qty)
    }, 0)

  const enrich = (stock: (typeof portfolioData)[0]['stocks'][0]): EnrichedStock => {
    const live         = liveData[stock.ticker]
    const investment   = stock.purchasePrice * stock.qty
    const cmp          = live?.cmp ?? null
    const presentValue = cmp !== null ? cmp * stock.qty : null
    const gainLoss     = presentValue !== null ? presentValue - investment : null
    const gainLossPct  = gainLoss !== null ? (gainLoss / investment) * 100 : null

    return {
      ...stock,
      investment,
      portfolioPct:    (investment / totalInvested) * 100,
      cmp,
      presentValue,
      gainLoss,
      gainLossPct,
      peRatio:         live?.peRatio ?? null,
      latestEarnings:  live?.latestEarnings ?? null,
      isLoading,
      hasError:        !!live?.error,
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Sticky nav */}
      <div className="sticky top-0 z-10 border-b border-[#141414] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-950 border border-emerald-900 rounded-lg flex items-center justify-center">
              <BarChart3 size={15} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white leading-none">Portfolio Dashboard</p>
              <p className="text-[11px] text-[#444] mt-0.5">Priyanshu • NSE / BSE</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {!isLoading && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-[#444]">Refreshing in {countdown}s</span>
              </div>
            )}
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-[11px] text-[#666] hover:text-white border border-[#1f1f1f] hover:border-[#2a2a2a] bg-[#0f0f0f] hover:bg-[#141414] px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
            >
              <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 py-8">

        <SummaryBar
          totalInvested={totalInvested}
          totalCurrent={totalCurrent}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
        />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-[#333] uppercase tracking-[0.14em] font-medium">Holdings</span>
          <span className="text-[11px] text-[#333]">
            {portfolioData.flatMap(s => s.stocks).length} stocks across {portfolioData.length} sectors
          </span>
        </div>

        {portfolioData.map(sector => (
          <SectorGroup
            key={sector.name}
            sectorName={sector.name}
            stocks={sector.stocks.map(enrich)}
            totalInvested={totalInvested}
          />
        ))}

      </div>
    </div>
  )
}