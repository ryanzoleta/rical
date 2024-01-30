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

export const milliliter = ['milliliter', 'ml', 'milliliters', 'millilitre', 'millilitres'];
export const deciliter = ['deciliter', 'dl', 'deciliters', 'decilitre', 'decilitres'];
export const liter = ['liter', 'l', 'liters', 'litre', 'litres'];
export const gallon = ['gallon', 'gal', 'gallons'];
export const quart = ['quart', 'qt', 'quarts'];
export const pint = ['pint', 'pt', 'pints'];
export const cup = ['cup', 'cups'];
export const fluidOunce = ['fluid ounce', 'fl oz', 'fluid ounces'];
export const tablespoon = ['tablespoon', 'tbsp', 'tablespoons'];
export const teaspoon = ['teaspoon', 'tsp', 'teaspoons'];

export const celsius = ['celsius', 'c'];
export const fahrenheit = ['fahrenheit', 'f'];
export const kelvin = ['kelvin', 'k'];

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
  volume: {
    milliliter: 1000000,
    deciliter: 100000,
    liter: 1000,
    gallon: 0.264172052,
    quart: 1.05668821,
    pint: 2.11337642,
    cup: 4.22675284,
    fluidOunce: 33.8140227,
    tablespoon: 67.6280454,
    teaspoon: 202.884136,
  },
  temperature: {
    celsius: 1,
    fahrenheit: 33.8,
    kelvin: 274.15,
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
  milliliter,
  deciliter,
  liter,
  gallon,
  quart,
  pint,
  cup,
  fluidOunce,
  tablespoon,
  teaspoon,
  celsius,
  fahrenheit,
  kelvin,
};

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      conversionFactors[sourceUnitType][destinationUnit] /
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      conversionFactors[sourceUnitType][sourceUnit];
    return num * factor;
  } else {
    return 0;
  }
}
