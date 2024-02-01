import { ConversionTokens, ExchangeRate, Variable } from './types';
import { ALL_CURRENCIES } from './data/currencies';
import { conversionFactors, units } from './data/measurements';

export const RE_CONVERSION =
  /^((?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)) +)?(?<src>[a-zA-Z0-9_]+) +(to|in) (?<dest>[a-zA-Z]+)$/gm;

export function tokenizeConversion(input: string, variables: Variable[]) {
  const groups = RE_CONVERSION.exec(input)?.groups;
  const struct: { num: number; src: string; dest: string } = { num: 0, src: '', dest: '' };

  if (!groups) return null;

  let variable;

  if ((variable = variables.find((v) => v.name === groups?.src))) {
    struct.num = variable.value.raw as number;
    struct.src = variable.value.unit?.toUpperCase() as string;
  } else {
    struct.num = typeof groups.num === 'string' ? parseFloat(groups.num.replace(',', '')) : 0;
    struct.src = groups.src.toUpperCase();
  }

  struct.dest = groups.dest.toUpperCase();

  return struct as ConversionTokens;
}

export function evalConversion(tokens: ConversionTokens) {
  const { num, src, dest } = tokens;

  const sourceUnit = determineUnit(src);
  const destinationUnit = determineUnit(dest);
  const sourceUnitType = determineUnitType(sourceUnit as string);
  const destinationUnitType = determineUnitType(destinationUnit as string);
  if (sourceUnit && destinationUnit && sourceUnitType && sourceUnitType === destinationUnitType) {
    const factor =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      conversionFactors[sourceUnitType][destinationUnit] /
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      conversionFactors[sourceUnitType][sourceUnit];
    return [num * factor, getShortestUnit(units[destinationUnit])];
  } else {
    return [0, ''];
  }
}

export function evalCurrencyConcersion(tokens: ConversionTokens, rates: ExchangeRate) {
  const { num, src, dest } = tokens;

  if (src === 'USD') {
    const result = rates[dest.toUpperCase()] * num;
    return [result, dest.toUpperCase()];
  } else if (dest === 'USD') {
    const result = num / rates[src.toUpperCase()];
    return [result, dest.toUpperCase()];
  }

  const usdAmount = num / rates[src.toUpperCase()];
  const targetAmount = usdAmount * rates[dest.toUpperCase()];

  return [targetAmount, dest.toUpperCase()];
}

function determineUnitType(input: string): keyof typeof conversionFactors | undefined {
  for (const [unitType, values] of Object.entries(conversionFactors)) {
    if (Object.keys(values).includes(input)) {
      return unitType as keyof typeof conversionFactors;
    }
  }
}

function determineUnit(input: string): keyof typeof units | undefined {
  for (const [unit, values] of Object.entries(units)) {
    if (values.includes(input)) {
      return unit as keyof typeof units;
    }
  }
}

export function isCurrency(str: string) {
  return (
    ALL_CURRENCIES.map((c) => c.code).includes(str.toUpperCase()) ||
    ALL_CURRENCIES.map((c) => c.symbol).includes(str.toUpperCase())
  );
}

export function areCurrencies(str1: string, str2: string) {
  return (
    (ALL_CURRENCIES.map((c) => c.code).includes(str1.toUpperCase()) ||
      ALL_CURRENCIES.map((c) => c.symbol).includes(str1.toUpperCase())) &&
    (ALL_CURRENCIES.map((c) => c.code).includes(str2.toUpperCase()) ||
      ALL_CURRENCIES.map((c) => c.symbol).includes(str2.toUpperCase()))
  );
}

function getShortestUnit(units: string[]) {
  const shortest = units.reduce((a, b) => (a.length <= b.length ? a : b));
  return shortest;
}
