'use client'

import { TrendingUp, TrendingDown, Clock } from 'lucide-react'

type Props = {
  totalInvested: number
  totalCurrent: number
  lastUpdated: Date | null
  isLoading: boolean
}

export default function SummaryBar({ totalInvested, totalCurrent, lastUpdated, isLoading }: Props) {
  const totalGL    = totalCurrent - totalInvested
  const totalGLPct = totalInvested > 0 ? (totalGL / totalInvested) * 100 : 0
  const isProfit   = totalGL >= 0

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)

  const Skeleton = () => (
    <div className="h-8 w-32 bg-[#1a1a1a] rounded-lg animate-pulse mt-1" />
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">

      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <p className="text-[10px] text-[#444] uppercase tracking-[0.12em] mb-2">Total Invested</p>
        <p className="text-[22px] font-bold text-white">₹{fmt(totalInvested)}</p>
      </div>

      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <p className="text-[10px] text-[#444] uppercase tracking-[0.12em] mb-2">Current Value</p>
        {isLoading ? <Skeleton /> : (
          <p className="text-[22px] font-bold text-white">₹{fmt(totalCurrent)}</p>
        )}
      </div>

      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <p className="text-[10px] text-[#444] uppercase tracking-[0.12em] mb-2">Total P&amp;L</p>
        {isLoading ? <Skeleton /> : (
          <div className={`flex items-center gap-2 ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <p className="text-[22px] font-bold">
              {isProfit ? '+' : ''}₹{fmt(totalGL)}
            </p>
          </div>
        )}
      </div>

      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <p className="text-[10px] text-[#444] uppercase tracking-[0.12em] mb-2">Returns</p>
        {isLoading ? <Skeleton /> : (
          <p className={`text-[22px] font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            {isProfit ? '+' : ''}{totalGLPct.toFixed(2)}%
          </p>
        )}
        {lastUpdated && (
          <div className="flex items-center gap-1 mt-2">
            <Clock size={10} className="text-[#444]" />
            <p className="text-[10px] text-[#444]">{lastUpdated.toLocaleTimeString()}</p>
          </div>
        )}
      </div>

    </div>
  )
}