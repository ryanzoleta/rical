import { env } from '$env/dynamic/private';
import moment from 'moment';
import axios from 'axios';
import { db } from '$lib/db';
import { rates } from '$lib/schema';

export async function POST() {
  const response = await axios.get<OpenExhangeRatesApiResponse>(
    'https://openexchangerates.org/api/latest.json',
    {
      params: {
        app_id: env.OPEN_EXCHANGE_RATES_APP_ID,
      },
    },
  );

  if (response.status === 200) {
    const rows = Object.entries(response.data.rates).map(([currency, value]) => ({
      currency: currency,
      rate: value.toString(),
      updatedAt: moment().toDate(),
    }));

    await db.delete(rates);
    await db.insert(rates).values(rows);

    return Response.json(await db.select().from(rates));
  }
}

type OpenExhangeRatesApiResponse = {
  rates: {
    [currency: string]: number;
  };
};
