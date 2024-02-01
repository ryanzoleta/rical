import { getLocales } from 'expo-localization';
import { tokenizeArithmetic, shuntingYard, evaluateRpn } from './arithmetic';
import { RE_CONVERSION, evalConversion, isCurrency, tokenizeConversion } from './conversions';
import { ExchangeRate, Result, Variable } from './types';

export const RE_ASSIGN = /^([A-Za-z0-9]+)( *)=(.*)$/m;
export const RE_COMMENT = /^#(.*)$/m;

const locales = getLocales();
const locale = locales.slice(-1)[0].regionCode ?? 'US';

export function evaluate(
  input: string,
  variables: Variable[],
  rates: ExchangeRate,
  precision: number,
) {
  if (isConversion(input)) {
    RE_CONVERSION.lastIndex = 0;
    const tokens = tokenizeConversion(input, variables);
    console.log('conversion tokens', tokens);
    if (tokens) {
      const result = evalConversion(tokens, rates);
      return {
        raw: result[0],
        formatted: formatNumber(result[0] as number, precision) + ' ' + result[1],
      } as Result;
    }

    return { raw: 0, formatted: '0' } as Result;
  }

  const tokens = tokenizeArithmetic(input, variables);
  const rpn = shuntingYard(tokens);
  let result = 0;

  try {
    result = evaluateRpn(rpn);
  } catch (e) {
    console.log('error', e);
  }

  const lastToken = tokens.slice(-1)[0];
  if (lastToken && isCurrency(lastToken.toString())) {
    return {
      raw: result,
      formatted: formatNumber(result, precision) + ' ' + lastToken,
    } as Result;
  }

  return { raw: result, formatted: formatNumber(result, precision) } as Result;
}

export function isAssignment(input: string) {
  return RE_ASSIGN.test(input);
}

export function isComment(input: string) {
  return RE_COMMENT.test(input);
}

export function isConversion(input: string) {
  RE_CONVERSION.lastIndex = 0;
  return RE_CONVERSION.test(input);
}

function formatNumber(value: number, precision: number) {
  return Intl.NumberFormat(locale, { maximumFractionDigits: precision }).format(value);
}
