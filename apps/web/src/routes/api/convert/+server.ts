import { db } from '$lib/db';
import { rates } from '$lib/schema';
import { env } from '$env/dynamic/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import moment from 'moment';
import axios from 'axios';

export async function GET(event: RequestEvent) {
  const paramValue = event.url.searchParams.get('value');
  const paramFrom = event.url.searchParams.get('from');
  const paramTo = event.url.searchParams.get('to');

  if (paramValue && paramFrom && paramTo) {
    const value = parseFloat(paramValue);
    const sourceCurrency = paramFrom.toUpperCase();
    const targetCurrency = paramTo.toUpperCase();

    let results = await db
      .select()
      .from(rates)
      .where(
        and(eq(rates.sourceCurrency, sourceCurrency), eq(rates.targetCurrency, targetCurrency)),
      );

    if (
      results.length === 0 ||
      moment().diff(moment(results[0].updatedAt), 'days') > parseInt(env.MAX_RATES_AGE)
    ) {
      await db.delete(rates).where(eq(rates.sourceCurrency, sourceCurrency));
      await insertAll(await retrieveLatestRates(sourceCurrency));

      results = await db
        .select()
        .from(rates)
        .where(
          and(eq(rates.sourceCurrency, sourceCurrency), eq(rates.targetCurrency, targetCurrency)),
        );

      if (results.length === 0) {
        throw error(
          500,
          `Still no results after inserting all rates for base currency ${sourceCurrency} and target currency ${targetCurrency}`,
        );
      }
    }

    const rate = parseFloat(results[0].rate ?? '1');
    const result = rate * value;

    return Response.json({
      value,
      sourceCurrency,
      targetCurrency,
      result: parseFloat(result.toFixed(2)),
    });
  }

  throw error(
    400,
    'Specify a value, source unit, and destination unit in the query parameters. E.g., /api/convert?value=1&from=USD&to=EUR',
  );
}

async function retrieveLatestRates(baseCurrency: string) {
  console.log('Retrieving latest rates from Currency API, base currency:', baseCurrency);

  const response = await axios.get(
    `https://api.currencyapi.com/v3/latest?apikey=${env.CURRENCY_API_KEY}&base_currency=${baseCurrency}`,
  );

  return response.data as CurrencyApiLatestResponse;
}

async function insertAll(data: CurrencyApiLatestResponse) {
  const rows = Object.entries(data.data).map(([targetCurrency, { value }]) => ({
    sourceCurrency: data.data.USD.code,
    targetCurrency,
    rate: value.toFixed(2),
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
  }));

  return await db.insert(rates).values(rows);
}

type CurrencyApiLatestResponse = {
  meta: {
    last_updated_at: string;
  };
  data: {
    [currency: string]: {
      code: string;
      value: number;
    };
  };
};
