import { env } from '$env/dynamic/private';
import { db } from '$lib/db';
import { rates } from '$lib/schema';
import type { CurrencyApiLatestResponse } from '$lib/types';
import axios from 'axios';
import moment from 'moment';

export async function retrieveLatestRates(baseCurrency: string) {
  console.log('Retrieving latest rates from Currency API, base currency:', baseCurrency);

  const response = await axios.get(
    `https://api.currencyapi.com/v3/latest?apikey=${env.CURRENCY_API_KEY}&base_currency=${baseCurrency}`,
  );

  console.log(
    `https://api.currencyapi.com/v3/latest?apikey=CURRENCY_API_KEY&base_currency=${baseCurrency}`,
  );

  return response.data as CurrencyApiLatestResponse;
}

export async function insertAll(data: CurrencyApiLatestResponse, sourceCurrency: string) {
  const rows = Object.entries(data.data).map(([targetCurrency, { value }]) => ({
    sourceCurrency: sourceCurrency,
    targetCurrency,
    rate: value.toFixed(2),
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  }));

  return await db.insert(rates).values(rows);
}
