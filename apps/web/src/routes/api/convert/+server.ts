import { error, type RequestEvent } from '@sveltejs/kit';

export function GET(event: RequestEvent) {
  const paramValue = event.url.searchParams.get('value');
  const paramFrom = event.url.searchParams.get('from');
  const paramTo = event.url.searchParams.get('to');

  if (paramValue && paramFrom && paramTo) {
    const value = parseFloat(paramValue);
    const sourceCurrency = paramFrom.toUpperCase();
    const targetCurrency = paramTo.toUpperCase();

    return Response.json({ value, sourceCurrency, targetCurrency });
  }

  throw error(
    400,
    'Specify a value, source unit, and destination unit in the query parameters. E.g., /api/convert?value=1&from=USD&to=EUR',
  );
}
