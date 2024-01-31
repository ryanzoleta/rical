import { db } from '$lib/db';
import { rates, type Rates } from '$lib/schema';
import moment from 'moment';
import { insertAll, retrieveLatestRates } from '../utils';
import { env } from '$env/dynamic/private';

export async function GET() {
  let results = await db.select().from(rates);

  if (
    results.length === 0 ||
    moment().diff(moment(results[0].updatedAt), 'days') > parseInt(env.MAX_RATES_AGE)
  ) {
    const defaultCurrencies = ['USD', 'PHP', 'EUR', 'CAD', 'GBP', 'JPY', 'CNY', 'KRW', 'SGD'];

    await db.delete(rates);

    for (const currency of defaultCurrencies) {
      await insertAll(await retrieveLatestRates(currency), currency);
    }

    results = await db.select().from(rates);
  }

  return Response.json(minifyRates(results));
}

function minifyRates(results: Rates[]) {
  const minifiedRates: ExchangeRate = {};

  for (const rate of results) {
    const currencyPair = `${rate.sourceCurrency}${rate.targetCurrency}`;
    minifiedRates[currencyPair] = parseFloat(rate.rate ?? '1');
  }

  return minifiedRates;
}

export type ExchangeRate = {
  [currency: string]: number;
};
