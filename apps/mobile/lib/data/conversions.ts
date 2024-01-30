import { Variable } from '../types';

export const RE_CONVERSION =
  /^((?<num>(\d+(,\d{3})*(\.\d+)?|\d+(\.\d+)?)) +)?(?<src>[a-zA-Z]+) +(to|in) (?<dest>[a-zA-Z]+)$/gm;

export const meter = ['meter', 'm', 'meters', 'metre', 'metres'];
export const centimeter = ['centimeter', 'cm', 'centimeters', 'centimetre', 'centimetres'];
export const millimeter = ['millimeter', 'mm', 'millimeters', 'millimetre', 'millimetres'];
export const kilometer = ['kilometer', 'km', 'kilometers', 'kilometre', 'kilometres'];
export const inch = ['inch', 'in', 'inches'];
export const foot = ['foot', 'ft', 'feet'];
export const yard = ['yard', 'yd', 'yards'];
export const mile = ['mile', 'mi', 'miles'];

export const milligram = ['milligram', 'mg', 'milligrams', 'milligramme', 'milligrammes'];
export const gram = ['gram', 'g', 'grams'];
export const kilogram = ['kilogram', 'kg', 'kilograms'];
export const ounce = ['ounce', 'oz', 'ounces'];
export const pound = ['pound', 'lb', 'pounds'];

export const conversionFactors = {
  length: {
    meter: 1,
    centimeter: 100,
    millimeter: 1000,
    kilometer: 0.001,
    inch: 39.3700787,
    foot: 3.2808399,
    yard: 1.0936133,
    mile: 0.000621371192,
  },
  mass: {
    milligram: 1000000,
    gram: 1000,
    kilogram: 1,
    ounce: 35.2739619,
    pound: 2.20462262,
  },
};

const units = {
  meter,
  centimeter,
  millimeter,
  kilometer,
  inch,
  foot,
  yard,
  mile,
  milligram,
  gram,
  kilogram,
  ounce,
  pound,
};

function determineUnitType(input: string): keyof typeof conversionFactors | undefined {
  for (const [unitType, values] of Object.entries(conversionFactors)) {
    if (Object.keys(values).includes(input)) {
      return unitType as keyof typeof conversionFactors;
    }
  }
}

function determineUnit(
  input: string,
): keyof typeof conversionFactors.length | keyof typeof conversionFactors.mass | undefined {
  for (const [unit, values] of Object.entries(units)) {
    if (values.includes(input)) {
      return unit as keyof typeof units;
    }
  }
}

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

  return struct;
}

export function evalConversion(tokens: { num: number; src: string; dest: string }) {
  const { num, src, dest } = tokens;
  const sourceUnit = determineUnit(src);
  const destinationUnit = determineUnit(dest);
  const sourceUnitType = determineUnitType(sourceUnit as string);
  const destinationUnitType = determineUnitType(destinationUnit as string);
  if (sourceUnit && destinationUnit && sourceUnitType && sourceUnitType === destinationUnitType) {
    const factor =
      //@ts-ignore
      conversionFactors[sourceUnitType][destinationUnit] /
      //@ts-ignore
      conversionFactors[sourceUnitType][sourceUnit];
    return num * factor;
  } else {
    return 0;
  }
}
