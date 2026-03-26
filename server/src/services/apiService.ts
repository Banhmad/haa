import https from 'https';
import http from 'http';
import { ALPHA_VANTAGE_API_KEY, FINNHUB_API_KEY } from '../config/constants';
import logger from '../utils/logger';

const COINGECKO_BASE = 'api.coingecko.com';
const ALPHA_VANTAGE_BASE = 'www.alphavantage.co';
const FINNHUB_BASE = 'finnhub.io';

function httpGet(options: https.RequestOptions): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'http:' ? http : https;
    const req = protocol.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Failed to parse API response'));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

export const getStockData = async (symbol: string): Promise<unknown> => {
  if (!ALPHA_VANTAGE_API_KEY) {
    logger.warn('ALPHA_VANTAGE_API_KEY not set, returning mock data');
    return getMockStockData(symbol);
  }
  try {
    const data = await httpGet({
      hostname: ALPHA_VANTAGE_BASE,
      path: `/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_VANTAGE_API_KEY}`,
      method: 'GET',
    });
    return data;
  } catch (error) {
    logger.error(`Alpha Vantage API error for ${symbol}:`, error);
    return getMockStockData(symbol);
  }
};

export const getCompanyProfile = async (symbol: string): Promise<unknown> => {
  if (!FINNHUB_API_KEY) {
    logger.warn('FINNHUB_API_KEY not set, returning mock data');
    return getMockCompanyProfile(symbol);
  }
  try {
    const data = await httpGet({
      hostname: FINNHUB_BASE,
      path: `/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`,
      method: 'GET',
    });
    return data;
  } catch (error) {
    logger.error(`Finnhub API error for ${symbol}:`, error);
    return getMockCompanyProfile(symbol);
  }
};

export const getCryptoPrice = async (coinId: string): Promise<unknown> => {
  try {
    const data = await httpGet({
      hostname: COINGECKO_BASE,
      path: `/api/v3/simple/price?ids=${encodeURIComponent(coinId)}&vs_currencies=usd&include_24hr_change=true`,
      method: 'GET',
    });
    return data;
  } catch (error) {
    logger.error(`CoinGecko API error for ${coinId}:`, error);
    return getMockCryptoPrice(coinId);
  }
};

function getMockStockData(symbol: string) {
  const price = parseFloat((100 + Math.random() * 400).toFixed(2));
  return {
    'Global Quote': {
      '01. symbol': symbol.toUpperCase(),
      '05. price': price.toString(),
      '09. change': ((Math.random() - 0.5) * 10).toFixed(2),
      '10. change percent': `${((Math.random() - 0.5) * 3).toFixed(2)}%`,
      '06. volume': Math.floor(Math.random() * 10_000_000).toString(),
    },
  };
}

function getMockCompanyProfile(symbol: string) {
  return {
    name: `${symbol.toUpperCase()} Corporation`,
    ticker: symbol.toUpperCase(),
    exchange: 'NASDAQ',
    ipo: '2000-01-01',
    marketCapitalization: Math.floor(Math.random() * 1_000_000),
    shareOutstanding: Math.floor(Math.random() * 1_000_000),
    currency: 'USD',
    country: 'US',
    finnhubIndustry: 'Technology',
  };
}

function getMockCryptoPrice(coinId: string) {
  return {
    [coinId]: {
      usd: parseFloat((Math.random() * 50000).toFixed(2)),
      usd_24h_change: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
    },
  };
}
