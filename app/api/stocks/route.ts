import { NextResponse } from 'next/server'

// some stocks have different ticker names on Google Finance vs Yahoo Finance
const googleTickerMap: Record<string, string> = {
  'LTIM':        'LTIMindtree',
  'HAPPSTMNDS':  'HAPPSTMNDS',
  'BLSE':        'BLSE',
  'SAVANIFINL':  'SAVANIFINL',
  'BAJAJHFL':    'BAJAJHOUSINGFIN',
  'KPIGREEN':    'KPIGREEN',
  'HARIOMPIPE':  'HARIOMPIPES',
  'FINEORG':     'FINEORGANICS',
  'DEEPAKNTR':   'DEEPAKNITRITE',
  'TATACONSUM':  'TATACONSUMER',
  'PIDILITIND':  'PIDILITE',
  'EASEMYTRIP':  'EASEMYTRIP',
}

async function getYahooData(ticker: string) {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        next: { revalidate: 15 }
      }
    )
    if (!res.ok) return { cmp: null }
    const json = await res.json()
    const meta = json?.chart?.result?.[0]?.meta
    return { cmp: meta?.regularMarketPrice ?? null }
  } catch {
    return { cmp: null }
  }
}

async function getGoogleFinanceData(ticker: string) {
  try {
    const rawSymbol = ticker.replace('.NS', '')
    const symbol = googleTickerMap[rawSymbol] ?? rawSymbol
    const url = `https://www.google.com/finance/quote/${symbol}:NSE`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 60 }
    })

    if (!res.ok) return { peRatio: null }

    const raw = await res.text()
    const html = raw
      .replace(/\\u003C/g, '<')
      .replace(/\\u003E/g, '>')
      .replace(/\\u0026/g, '&')

    let peRatio: number | null = null

    const peIndex = html.indexOf('P/E ratio')
    if (peIndex !== -1) {
      const chunk = html.slice(peIndex, peIndex + 300)
      const match = chunk.match(/class="P6K39c">([\d,.]+)</)
      if (match) {
        const val = parseFloat(match[1].replace(/,/g, ''))
        if (!isNaN(val)) peRatio = val
      }
    }

    return { peRatio }
  } catch {
    return { peRatio: null }
  }
}

const cache: Record<string, {
  data: { peRatio: number | null }
  time: number
}> = {}
const CACHE_DURATION = 5 * 60 * 1000

async function getCachedGoogleData(ticker: string) {
  const now = Date.now()
  if (cache[ticker] && now - cache[ticker].time < CACHE_DURATION) {
    return cache[ticker].data
  }
  const data = await getGoogleFinanceData(ticker)
  cache[ticker] = { data, time: now }
  return data
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tickersParam = searchParams.get('tickers')

  if (!tickersParam) {
    return NextResponse.json({ error: 'No tickers provided' }, { status: 400 })
  }

  const tickers = tickersParam.split(',')

  const results = await Promise.allSettled(
    tickers.map(async (ticker) => {
      try {
        const [yahooData, googleData] = await Promise.all([
          getYahooData(ticker),
          getCachedGoogleData(ticker),
        ])

        const cmp      = yahooData.cmp
        const peRatio  = googleData.peRatio

        // EPS = CMP / P/E ratio
        const latestEarnings = cmp !== null && peRatio !== null
          ? parseFloat((cmp / peRatio).toFixed(2))
          : null

        return {
          ticker,
          cmp,
          peRatio,
          latestEarnings,
          error: null,
        }
      } catch {
        return {
          ticker,
          cmp:            null,
          peRatio:        null,
          latestEarnings: null,
          error:          'Failed to fetch',
        }
      }
    })
  )

  const data = results.map((result) => {
    if (result.status === 'fulfilled') return result.value
    return { ticker: '', cmp: null, peRatio: null, latestEarnings: null, error: 'Failed' }
  })

  return NextResponse.json(data)
}