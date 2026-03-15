# Portfolio Dashboard

Built this for a take-home assignment from 8byte. It's a real-time stock portfolio tracker for an investor named Priyanshu who holds 29 stocks across NSE and BSE.

The idea is simple — Priyanshu already knows what he bought and at what price. What he doesn't know in real time is what those stocks are worth *right now* and whether he's in profit or loss. This dashboard answers that.

## What it shows

- Current market price for every stock, refreshing every 15 seconds
- Profit or loss per stock and per sector
- P/E ratio scraped from Google Finance
- EPS derived from CMP and P/E
- Everything grouped by sector so it's easy to see which part of the portfolio is performing

## Tech used

- Next.js 15 with TypeScript
- Tailwind CSS v4
- Yahoo Finance v8 API for live prices
- Google Finance scraping for P/E ratio
- Lucide React for icons

## How to run it

Make sure you have Node.js 18 or above installed.
```bash
git clone https://github.com/your-username/portfolio-dashboard.git
cd portfolio-dashboard
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## How the data works

The portfolio data — stock names, purchase prices, quantities, sectors — is hardcoded in `data/portfolio.ts`. This came directly from the Excel sheet provided in the assignment.

The live data — CMP, P/E, EPS — is fetched at runtime through a Next.js API route (`/api/stocks`) which acts as the backend. This keeps all the scraping logic on the server side so nothing sensitive is exposed to the browser.

**Yahoo Finance** doesn't have an official public API. I hit their internal v8 chart endpoint directly with a browser-like User-Agent header. It returns JSON with the current market price.

**Google Finance** also has no official API. I fetch the HTML page for each stock and parse the P/E ratio from a specific div class (`P6K39c`) that Google uses to render key stats. The HTML comes back unicode-escaped so I decode it before parsing.

**EPS** is calculated as `CMP / P/E ratio` since Google Finance doesn't show EPS directly in the key stats section for most Indian stocks.

**Caching** — Google Finance is only scraped once every 5 minutes per stock. Yahoo Finance refreshes every 15 seconds since that's the live price data.

## Project structure
```
app/
  api/stocks/route.ts     backend — fetches from Yahoo and Google
  page.tsx                entry point
components/
  PortfolioDashboard      main component, manages state and data fetching
  SectorGroup             collapsible sector row with summary
  StockRow                individual stock with all columns
  SummaryBar              top cards showing totals
data/
  portfolio.ts            all 29 stocks hardcoded from the Excel sheet
types/
  index.ts                TypeScript types shared across components
```

## Notes

Prices are only live during NSE market hours which are 9:15am to 3:30pm IST on weekdays. Outside those hours the last closing price is shown, which is why some numbers look different at night.

Some stocks show N/A for CMP if Yahoo Finance doesn't recognize the ticker. This happens for smaller stocks like Savani Financials that may not be listed on Yahoo.