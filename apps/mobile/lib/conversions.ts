import { ConversionTokens, ExchangeRate, Variable } from './types';
import { ALL_CURRENCIES } from './data/currencies';
import { conversionFactors, units } from './data/measurements';

export const RE_CONVERSION =
  /^((?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)) +)?(?<src>[a-zA-Z]+) +(to|in) (?<dest>[a-zA-Z]+)$/gm;

export function tokenizeConversion(input: string, variables: Variable[]) {
  const groups = RE_CONVERSION.exec(input)?.groups;
  const struct: { num: number; src: string; dest: string } = { num: 0, src: '', dest: '' };

  if (!groups) return null;

  if (variables.find((v) => v.name === groups?.src)) {
    struct.num = variables.find((v) => v.name === groups?.src)?.value as number;
  }

  struct.dest = groups.dest;
  struct.src = groups.src;
  struct.num = typeof groups.num === 'string' ? parseFloat(groups.num.replace(',', '')) : 0;

  return struct as ConversionTokens;
}

export function evalConversion(tokens: ConversionTokens, rates: ExchangeRate) {
  const { num, src, dest } = tokens;

  if (areCurrencies(src, dest)) {
    // const response = await axios.get<CurrencyConversionApiResponse>(
    //   `http://localhost:5173/api/convert?value=${num}&from=${src}&to=${dest}`,
    // );
    const currencyPair = `${src.toUpperCase()}${dest.toUpperCase()}`;
    const reverseCurrencyPair = `${dest.toUpperCase()}${src.toUpperCase()}`;
    let result = 0;
    if (rates[currencyPair]) {
      result = rates[currencyPair] * num;
    } else if (rates[reverseCurrencyPair]) {
      result = num / rates[reverseCurrencyPair];
    } else {
      return [num, src.toUpperCase()];
    }

    return [result, dest.toUpperCase()];
  }

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

function areCurrencies(str1: string, str2: string) {
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
