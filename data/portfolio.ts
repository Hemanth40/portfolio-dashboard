import { Stock } from '@/types'

export const portfolioData: { name: string; stocks: Stock[] }[] = [
  {
    name: "Financial",
    stocks: [
      { id: 1,  name: "HDFC Bank",        ticker: "HDFCBANK.NS",   purchasePrice: 1490, qty: 50,   sector: "Financial" },
      { id: 2,  name: "Bajaj Finance",     ticker: "BAJFINANCE.NS", purchasePrice: 6466, qty: 15,   sector: "Financial" },
      { id: 3,  name: "ICICI Bank",        ticker: "ICICIBANK.NS",  purchasePrice: 780,  qty: 84,   sector: "Financial" },
      { id: 4,  name: "Bajaj Housing",     ticker: "BAJAJHFL.NS",   purchasePrice: 130,  qty: 504,  sector: "Financial" },
      { id: 5,  name: "Savani Financials", ticker: "SAVANIFINL.NS", purchasePrice: 24,   qty: 1080, sector: "Financial" },
    ],
  },
  {
    name: "Technology",
    stocks: [
      { id: 6,  name: "Affle India",    ticker: "AFFLE.NS",    purchasePrice: 1151, qty: 50,  sector: "Technology" },
      { id: 7,  name: "LTI Mindtree",   ticker: "LTIM.NS",     purchasePrice: 4775, qty: 16,  sector: "Technology" },
      { id: 8,  name: "KPIT Tech",      ticker: "KPITTECH.NS", purchasePrice: 672,  qty: 61,  sector: "Technology" },
      { id: 9,  name: "Tata Tech",      ticker: "TATATECH.NS", purchasePrice: 1072, qty: 63,  sector: "Technology" },
      { id: 10, name: "BLS E-Services", ticker: "BLSE.NS",     purchasePrice: 232,  qty: 191, sector: "Technology" },
      { id: 11, name: "Tanla",          ticker: "TANLA.NS",    purchasePrice: 1134, qty: 45,  sector: "Technology" },
    ],
  },
  {
    name: "Consumer",
    stocks: [
      { id: 12, name: "DMart",         ticker: "DMART.NS",      purchasePrice: 3777, qty: 27, sector: "Consumer" },
      { id: 13, name: "Tata Consumer", ticker: "TATACONSUM.NS", purchasePrice: 845,  qty: 90, sector: "Consumer" },
      { id: 14, name: "Pidilite",      ticker: "PIDILITIND.NS", purchasePrice: 2376, qty: 36, sector: "Consumer" },
    ],
  },
  {
    name: "Power",
    stocks: [
      { id: 15, name: "Tata Power", ticker: "TATAPOWER.NS", purchasePrice: 224, qty: 225, sector: "Power" },
      { id: 16, name: "KPI Green",  ticker: "KPIGREEN.NS",  purchasePrice: 875, qty: 50,  sector: "Power" },
      { id: 17, name: "Suzlon",     ticker: "SUZLON.NS",    purchasePrice: 44,  qty: 450, sector: "Power" },
      { id: 18, name: "Gensol",     ticker: "GENSOL.NS",    purchasePrice: 998, qty: 45,  sector: "Power" },
    ],
  },
  {
    name: "Pipes",
    stocks: [
      { id: 19, name: "Hariom Pipes", ticker: "HARIOMPIPE.NS", purchasePrice: 580,  qty: 60, sector: "Pipes" },
      { id: 20, name: "Astral",       ticker: "ASTRAL.NS",     purchasePrice: 1517, qty: 56, sector: "Pipes" },
      { id: 21, name: "Polycab",      ticker: "POLYCAB.NS",    purchasePrice: 2818, qty: 28, sector: "Pipes" },
    ],
  },
  {
    name: "Others",
    stocks: [
      { id: 22, name: "Clean Science",  ticker: "CLEAN.NS",      purchasePrice: 1610, qty: 32,   sector: "Others" },
      { id: 23, name: "Deepak Nitrite", ticker: "DEEPAKNTR.NS",  purchasePrice: 2248, qty: 27,   sector: "Others" },
      { id: 24, name: "Fine Organic",   ticker: "FINEORG.NS",    purchasePrice: 4284, qty: 16,   sector: "Others" },
      { id: 25, name: "Gravita",        ticker: "GRAVITA.NS",    purchasePrice: 2037, qty: 8,    sector: "Others" },
      { id: 26, name: "SBI Life",       ticker: "SBILIFE.NS",    purchasePrice: 1197, qty: 49,   sector: "Others" },
      { id: 27, name: "Infosys",        ticker: "INFY.NS",       purchasePrice: 1647, qty: 36,   sector: "Others" },
      { id: 28, name: "Happiest Mind",  ticker: "HAPPSTMNDS.NS", purchasePrice: 1103, qty: 45,   sector: "Others" },
      { id: 29, name: "Easemytrip",     ticker: "EASEMYTRIP.NS", purchasePrice: 20,   qty: 1332, sector: "Others" },
    ],
  },
]