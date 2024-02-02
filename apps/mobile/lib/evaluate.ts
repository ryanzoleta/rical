import { tokenizeArithmetic, shuntingYard, evaluateRpn } from './arithmetic';
import {
  RE_CONVERSION,
  areCurrencies,
  evalConversion,
  evalCurrencyConcersion,
  isCurrency,
  tokenizeConversion,
} from './conversions';
import { ExchangeRate, Result, Variable } from './types';

export const RE_ASSIGN = /^([A-Za-z0-9_]+)( *)=(.*)$/m;
export const RE_COMMENT = /^#(.*)$/m;

export function evaluate(input: string, variables: Variable[], rates: ExchangeRate) {
  if (isConversion(input)) {
    RE_CONVERSION.lastIndex = 0;
    const tokens = tokenizeConversion(input, variables);
    console.log('conversion tokens', tokens);

    if (tokens) {
      if (areCurrencies(tokens.src, tokens.dest)) {
        const result = evalCurrencyConcersion(tokens, rates);
        return {
          raw: result[0],
          unit: tokens?.dest,
          formatType: 'currency',
        } as Result;
      }
      const result = evalConversion(tokens);
      return {
        raw: result[0],
        unit: tokens?.dest.toLowerCase(),
        formatType: 'measurement',
      } as Result;
    }

    return { raw: 0, formatType: 'number' } as Result;
  }

  const [tokens, variablesFound] = tokenizeArithmetic(input, variables);
  const rpn = shuntingYard(tokens);
  let result = 0;

  try {
    result = evaluateRpn(rpn);
  } catch (e) {
    console.log('error', e);
  }

  const lastToken = tokens.slice(-1)[0];
  const lastVariableFound = variablesFound.slice(-1)[0];
  if (lastToken && isCurrency(lastToken.toString())) {
    return {
      raw: result,
      unit: lastToken.toString(),
      formatType: 'measurement',
    } as Result;
  } else if (
    lastVariableFound &&
    lastVariableFound.value &&
    (lastVariableFound.value.formatType === 'currency' ||
      lastVariableFound.value.formatType === 'measurement')
  ) {
    return {
      raw: result,
      formatType: variablesFound.slice(-1)[0].value.formatType,
      unit: variablesFound.slice(-1)[0].value.unit,
    };
  }

  return { raw: result, formatType: 'number' } as Result;
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

export function format(result: Result, precision: number, locale: string) {
  if (result.formatType === 'number') {
    return Intl.NumberFormat(locale, { maximumFractionDigits: precision }).format(
      result.raw as number,
    );
  } else if (result.formatType === 'currency') {
    return (
      Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(result.raw as number) +
      ' ' +
      result.unit?.toUpperCase()
    );
  } else if (result.formatType === 'measurement') {
    return (
      Intl.NumberFormat(locale, {
        maximumFractionDigits: precision,
      }).format(result.raw as number) +
      ' ' +
      result.unit
    );
  } else if (result.formatType === 'none') {
    return ' ';
  }
}
