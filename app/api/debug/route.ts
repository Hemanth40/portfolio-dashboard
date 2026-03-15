import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker') ?? 'HDFCBANK'

  const url = `https://www.google.com/finance/quote/${ticker}:NSE`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    cache: 'no-store'
  })

  const raw = await res.text()
  const html = raw
    .replace(/\\u003C/g, '<')
    .replace(/\\u003E/g, '>')
    .replace(/\\u0026/g, '&')

  // get a bigger chunk after P/E ratio to see what comes next
  const peIndex = html.indexOf('P/E ratio')
  const bigChunk = peIndex !== -1 ? html.slice(peIndex, peIndex + 1000) : 'NOT FOUND'

  return NextResponse.json({ bigChunk })
}