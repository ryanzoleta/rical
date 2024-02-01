import { env } from '$env/dynamic/private';
import moment from 'moment';
import axios, { AxiosError } from 'axios';
import { db } from '$lib/db';
import { rates } from '$lib/schema';
import { error } from '@sveltejs/kit';

export async function POST() {
  let response;

  try {
    response = await axios.get<OpenExhangeRatesApiResponse>(
      'https://openexchangerates.org/api/latest.json',
      {
        params: {
          app_id: env.OPEN_EXCHANGE_RATES_APP_ID + ':(',
        },
      },
    );
  } catch (e) {
    if (e instanceof AxiosError) {
      throw error(501, e?.response?.data.message ?? 'Unknown error');
    }
    console.error(e);
    throw error(501, 'Unknown error');
  }

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

  throw error(501, response.statusText);
}

type OpenExhangeRatesApiResponse = {
  rates: {
    [currency: string]: number;
  };
};
