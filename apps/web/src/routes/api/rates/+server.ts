import { db } from '$lib/db';
import { rates, type Rates } from '$lib/schema';

export async function GET() {
  const results = await db.select().from(rates);

  return Response.json(minifyRates(results));
}

function minifyRates(results: Rates[]) {
  const minifiedRates: ExchangeRate = {};

  for (const rate of results) {
    minifiedRates[rate.currency] = parseFloat(rate.rate ?? '1');
  }

  return minifiedRates;
}

export type ExchangeRate = {
  [currency: string]: number;
};
