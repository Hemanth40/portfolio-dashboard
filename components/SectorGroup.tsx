'use client'

import { useState } from 'react'
import { EnrichedStock } from '@/types'
import StockRow from './StockRow'
import { ChevronDown, ChevronRight } from 'lucide-react'

type Props = {
  sectorName: string
  stocks: EnrichedStock[]
  totalInvested: number
}

const config: Record<string, { text: string; dot: string; badge: string; badgeText: string }> = {
  Financial:  { text: 'text-blue-400',   dot: 'bg-blue-400',   badge: 'bg-blue-950',   badgeText: 'text-blue-400' },
  Technology: { text: 'text-violet-400', dot: 'bg-violet-400', badge: 'bg-violet-950', badgeText: 'text-violet-400' },
  Consumer:   { text: 'text-orange-400', dot: 'bg-orange-400', badge: 'bg-orange-950', badgeText: 'text-orange-400' },
  Power:      { text: 'text-yellow-400', dot: 'bg-yellow-400', badge: 'bg-yellow-950', badgeText: 'text-yellow-400' },
  Pipes:      { text: 'text-cyan-400',   dot: 'bg-cyan-400',   badge: 'bg-cyan-950',   badgeText: 'text-cyan-400' },
  Others:     { text: 'text-gray-400',   dot: 'bg-gray-500',   badge: 'bg-[#1a1a1a]',  badgeText: 'text-gray-500' },
}

const cols = ['Stock', 'Buy Price', 'Qty', 'Invested', 'Portfolio %', 'Ticker', 'CMP', 'Present Value', 'Gain / Loss', 'P/E', 'EPS']

export default function SectorGroup({ sectorName, stocks, totalInvested }: Props) {
  const [open, setOpen] = useState(true)

  const c            = config[sectorName] ?? config['Others']
  const invested     = stocks.reduce((s, x) => s + x.investment, 0)
  const current      = stocks.reduce((s, x) => s + (x.presentValue ?? x.investment), 0)
  const gl           = current - invested
  const profit       = gl >= 0

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(n))

  return (
    <div className="border border-[#1a1a1a] rounded-2xl overflow-hidden mb-3">

      <div
        className="flex items-center justify-between px-5 py-4 bg-[#0f0f0f] cursor-pointer hover:bg-[#111] transition-colors select-none"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="text-[#333]">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <div className={`w-2 h-2 rounded-full ${c.dot}`} />
          <span className={`font-semibold text-[13px] ${c.text}`}>{sectorName}</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${c.badge} ${c.badgeText}`}>
            {stocks.length} stocks
          </span>
        </div>

        <div className="flex items-center gap-7">
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-[#444] mb-0.5">Invested</p>
            <p className="text-[12px] text-[#aaa]">₹{fmt(invested)}</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-[#444] mb-0.5">Current</p>
            <p className="text-[12px] text-[#aaa]">₹{fmt(current)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#444] mb-0.5">P&amp;L</p>
            <p className={`text-[12px] font-semibold ${profit ? 'text-emerald-400' : 'text-red-400'}`}>
              {profit ? '+' : '-'}₹{fmt(gl)}
            </p>
          </div>
        </div>
      </div>

      {open && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0d0d0d] border-b border-[#1a1a1a]">
                {cols.map(col => (
                  <th key={col} className="py-2.5 px-4 text-left text-[10px] text-[#3a3a3a] font-medium uppercase tracking-[0.1em] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <StockRow key={stock.id} stock={stock} totalInvested={totalInvested} />
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}