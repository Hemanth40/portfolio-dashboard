'use client'

import { EnrichedStock } from '@/types'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'

type Props = {
  stock: EnrichedStock
  totalInvested: number
}

export default function StockRow({ stock, totalInvested }: Props) {
  const fmt = (n: number | null, d = 2) =>
    n !== null ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: d }).format(n) : '—'

  const pct      = totalInvested > 0 ? ((stock.investment / totalInvested) * 100).toFixed(2) : '0.00'
  const isProfit = stock.gainLoss !== null && stock.gainLoss >= 0

  return (
    <tr className="border-b border-[#141414] hover:bg-[#0f0f0f] transition-colors duration-100">

      <td className="py-3 px-4">
        <span className="text-[#e5e5e5] font-medium text-[13px]">{stock.name}</span>
      </td>

      <td className="py-3 px-4">
        <span className="text-[#555] text-[13px]">₹{fmt(stock.purchasePrice, 0)}</span>
      </td>

      <td className="py-3 px-4">
        <span className="text-[#555] text-[13px]">{stock.qty}</span>
      </td>

      <td className="py-3 px-4">
        <span className="text-[#aaa] text-[13px]">₹{fmt(stock.investment, 0)}</span>
      </td>

      <td className="py-3 px-4">
        <span className="text-[#444] text-[12px]">{pct}%</span>
      </td>

      <td className="py-3 px-4">
        <span className="text-[11px] bg-[#1a1a1a] border border-[#252525] px-2 py-1 rounded-md text-[#666] font-mono">
          {stock.ticker.replace('.NS', '')}
        </span>
      </td>

      <td className="py-3 px-4">
        {stock.isLoading ? (
          <Loader2 size={13} className="animate-spin text-[#333]" />
        ) : stock.hasError ? (
          <span className="text-[11px] bg-red-950 text-red-800 px-2 py-0.5 rounded">N/A</span>
        ) : (
          <span className="text-white font-semibold text-[13px]">₹{fmt(stock.cmp, 2)}</span>
        )}
      </td>

      <td className="py-3 px-4">
        <span className="text-[#aaa] text-[13px]">
          {stock.presentValue !== null ? `₹${fmt(stock.presentValue, 0)}` : '—'}
        </span>
      </td>

      <td className="py-3 px-4">
        {stock.gainLoss === null ? (
          <span className="text-[#333]">—</span>
        ) : (
          <div className={`${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
            <div className="flex items-center gap-1">
              {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="font-semibold text-[13px]">
                {isProfit ? '+' : ''}₹{fmt(stock.gainLoss, 0)}
              </span>
            </div>
            {stock.gainLossPct !== null && (
              <span className="text-[11px] opacity-50 pl-4">
                {isProfit ? '+' : ''}{stock.gainLossPct.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </td>

      <td className="py-3 px-4">
        <span className="text-[#555] text-[13px]">
          {stock.peRatio !== null ? `${stock.peRatio.toFixed(1)}x` : '—'}
        </span>
      </td>

      <td className="py-3 px-4">
        <span className="text-[#555] text-[13px]">
          {stock.latestEarnings !== null ? `₹${fmt(stock.latestEarnings, 2)}` : '—'}
        </span>
      </td>

    </tr>
  )
}