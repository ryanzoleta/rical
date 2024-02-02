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
export const RE_MEASUREMENT =
  /^((?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)) +)(?<unit>[a-zA-Z0-9_]+) *$/m;
export const RE_JUST_PERCENTAGE = /^(?<per>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)%) *$/m;

export function evaluate(input: string, variables: Variable[], rates: ExchangeRate) {
  if (isPercentage(input)) {
    const groups = RE_JUST_PERCENTAGE.exec(input)?.groups;
    const num =
      typeof groups?.per === 'string'
        ? parseFloat(groups.per.replace(',', '').replace('%', ''))
        : 0;
    return { raw: num / 100, formatType: 'percentage' } as Result;
  } else if (isMeasurement(input)) {
    const groups = RE_MEASUREMENT.exec(input)?.groups;
    const num = typeof groups?.num === 'string' ? parseFloat(groups.num.replace(',', '')) : 0;
    const unit = groups?.unit.toLowerCase();
    return { raw: num, unit, formatType: 'measurement' } as Result;
  } else if (isConversion(input)) {
    RE_CONVERSION.lastIndex = 0;
    const tokens = tokenizeConversion(input, variables);

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
      formatType: 'currency',
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

export function isMeasurement(input: string) {
  return RE_MEASUREMENT.test(input);
}

export function isPercentage(input: string) {
  return RE_JUST_PERCENTAGE.test(input);
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
