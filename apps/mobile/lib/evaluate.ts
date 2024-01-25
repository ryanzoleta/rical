import { getLocales } from 'expo-localization';
import { tokenize, shuntingYard, evaluateRpn } from './arithmetic';
import { FormatType, Result, Variable } from './types';

export const RE_ASSIGN = /^([A-Za-z0-9]+)( *)=(.*)$/m;
const RE_CURRENCY_CONVERSION =
  /^(((?<amount>[0-9]+)( *)(?<currency1>usd|php))|((?<currency1>\$|\₱)(?<amount>[0-9]+)))( *)(in)( *)(?<currency2>usd|php)$/gm;

const locales = getLocales();
const locale = locales.slice(-1)[0].regionCode ?? 'US';

export function evaluate(input: string, variables: Variable[]) {
  let formatType: FormatType = determineOutputFormat(input);
  let tokens = tokenize(input, variables);
  let rpn = shuntingYard(tokens);
  let result = 0;

  try {
    result = evaluateRpn(rpn);
  } catch (e) {
    console.log('error', e);
  }

  return { raw: result, formatted: format(result, formatType) } as Result;
}

function determineOutputFormat(input: string): FormatType {
  return 'regular-number';
}

function format(result: string | number, format: FormatType) {
  if (!result) {
    return;
  }

  switch (format) {
    case 'regular-number':
      if (typeof result === 'number') {
        if (result % 1 === 0) {
          return result;
        }
        console.log('locale', locale);
        // return Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(result);
        return Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(result);
      }
  }
}

export function isAssignment(input: string) {
  return RE_ASSIGN.test(input);
}
