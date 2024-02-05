import { tokenizeArithmetic, shuntingYard, evaluateRpn } from './arithmetic';
import {
  areCurrencies,
  evalConversion,
  evalCurrencyConcersion,
  isCurrency,
  tokenizeConversion,
  tokenizeConversionShort,
} from './conversions';
import {
  RE_JUST_PERCENTAGE,
  RE_MEASUREMENT,
  RE_ASSIGN,
  RE_COMMENT,
  RE_CONVERSION,
  RE_CONVERSION_SHORT,
  RE_CONVERSION_EXPRESSION,
} from './regexes';
import { ConversionTokens, ExchangeRate, Result, Variable } from './types';

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

    if (tokens && tokens.src && tokens.dest) {
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
  } else if (isConversionShort(input)) {
    RE_CONVERSION_SHORT.lastIndex = 0;
    const tokens = tokenizeConversionShort(input);

    if (tokens) {
      if (areCurrencies(tokens.src, tokens.dest)) {
        const result = evalCurrencyConcersion(tokens, rates);
        return {
          raw: result[0],
          unit: tokens?.dest,
          formatType: 'currency',
        } as Result;
      }
    }
  } else if (isConversionExpression(input)) {
    const [expressionString, destinationUnit] = input.split(/to|in/);

    if (isCurrency(destinationUnit.trim().toUpperCase())) {
      const [expressionTokens, variablesFound, unitsFound] = tokenizeArithmetic(
        expressionString.trim(),
        variables,
      );

      const rpn = shuntingYard(expressionTokens);
      let result = 0;

      try {
        result = evaluateRpn(rpn);
      } catch (e) {
        console.log('error', e);
      }

      let sourceUnit = destinationUnit.trim().toUpperCase();
      const lastUnit = unitsFound?.slice(-1)[0];
      const lastVariableFound = variablesFound.slice(-1)[0];
      if (lastUnit && isCurrency(lastUnit.toString())) {
        sourceUnit = lastUnit;
      } else if (
        lastVariableFound &&
        lastVariableFound.value &&
        (lastVariableFound.value.formatType === 'currency' ||
          lastVariableFound.value.formatType === 'measurement') &&
        variablesFound.slice(-1)[0].value.unit
      ) {
        sourceUnit = variablesFound.slice(-1)[0].value.unit ?? ' ';
      }

      const conversionResult = evalCurrencyConcersion(
        {
          src: sourceUnit.toUpperCase(),
          dest: destinationUnit.trim().toUpperCase(),
          num: result,
        } as ConversionTokens,
        rates,
      );

      return {
        raw: conversionResult[0],
        formatType: 'currency',
        unit: destinationUnit.trim().toUpperCase(),
      } as Result;
    }
  }

  const [tokens, variablesFound, unitsFound] = tokenizeArithmetic(input, variables);
  const rpn = shuntingYard(tokens);
  let result = 0;

  try {
    result = evaluateRpn(rpn);
  } catch (e) {
    console.log('error', e);
  }

  const lastUnit = unitsFound?.slice(-1)[0];
  const lastVariableFound = variablesFound.slice(-1)[0];
  if (lastUnit && isCurrency(lastUnit.toString())) {
    return {
      raw: result,
      unit: lastUnit.toString(),
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

export function isConversionShort(input: string) {
  RE_CONVERSION_SHORT.lastIndex = 0;
  return RE_CONVERSION_SHORT.test(input);
}

export function isConversionExpression(input: string) {
  return RE_CONVERSION_EXPRESSION.test(input);
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
