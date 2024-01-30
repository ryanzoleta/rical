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

export const square_meter = [
  'square meter',
  'square meters',
  'square metre',
  'square metres',
  'sqm',
];
export const square_kilometer = ['sqkm', 'square kilometer', 'square kilometers', 'sqkm'];
export const hectare = ['hectare', 'hectares', 'ha'];
export const acre = ['acre', 'acres'];
export const square_mile = ['square mile', 'square miles', 'sqmi'];
export const square_yard = ['square yard', 'square yards', 'sqyd'];
export const square_foot = ['square foot', 'square feet', 'sqft'];
export const square_inch = ['square inch', 'square inches', 'sqin'];

export const meters_per_second = ['meters per second', 'meters/second', 'm/s', 'mps'];
export const kilometers_per_hour = ['kilometers per hour', 'kilometers/hour', 'km/h', 'kph'];
export const miles_per_hour = ['miles per hour', 'miles/hour', 'mph'];
export const feet_per_second = ['feet per second', 'feet/second', 'fps'];

export const second = ['second', 'sec', 'seconds', 'secs'];
export const minute = ['minute', 'min', 'minutes', 'mins'];
export const hour = ['hour', 'hr', 'hours', 'hrs'];
export const day = ['day', 'days'];
export const week = ['week', 'weeks', 'wk', 'wks'];
export const month = ['month', 'months', 'mo', 'mos'];
export const year = ['year', 'years', 'yr', 'yrs'];

export const bit = ['bit', 'bits'];
export const byte = ['byte', 'bytes'];
export const kilobyte = ['kilobyte', 'kilobytes', 'kb'];
export const megabyte = ['megabyte', 'megabytes', 'mb'];
export const gigabyte = ['gigabyte', 'gigabytes', 'gb'];
export const terabyte = ['terabyte', 'terabytes', 'tb'];
export const petabyte = ['petabyte', 'petabytes', 'pb'];

export const joule = ['joule', 'joules', 'j'];
export const kilojoule = ['kilojoule', 'kilojoules', 'kj'];
export const calorie = ['calorie', 'calories', 'cal'];
export const kilocalorie = ['kilocalorie', 'kilocalories', 'kcal'];
export const british_thermal_unit = ['british thermal unit', 'british thermal units', 'btu'];
export const watt_hour = ['watt hour', 'watt hours', 'wh'];
export const kilowatt_hour = ['kilowatt hour', 'kilowatt hours', 'kwh'];

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
  area: {
    square_meter: 1,
    square_kilometer: 0.000001,
    hectare: 0.0001,
    acre: 0.000247105,
    square_mile: 0.000000386102,
    square_yard: 1.19599,
    square_foot: 10.7639,
    square_inch: 1550.0031,
  },
  speed: {
    meters_per_second: 1,
    kilometers_per_hour: 3.6,
    miles_per_hour: 2.23694,
    feet_per_second: 3.28084,
  },
  time: {
    second: 1,
    minute: 0.0166667,
    hour: 0.000277778,
    day: 0.0000115741,
    week: 0.00000165344,
    month: 0.000000380517,
    year: 0.0000000317098,
  },
  digitalStorage: {
    bit: 8,
    byte: 1,
    kilobyte: 0.001,
    megabyte: 0.000001,
    gigabyte: 0.000000001,
    terabyte: 0.000000000001,
    petabyte: 0.000000000000001,
  },
  energy: {
    joule: 1,
    kilojoule: 0.001,
    calorie: 0.239006,
    kilocalorie: 0.000239006,
    british_thermal_unit: 0.000947817,
    watt_hour: 0.000277778,
    kilowatt_hour: 0.000000277778,
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
  square_meter,
  square_kilometer,
  hectare,
  acre,
  square_mile,
  square_yard,
  square_foot,
  square_inch,
  meters_per_second,
  kilometers_per_hour,
  miles_per_hour,
  feet_per_second,
  second,
  minute,
  hour,
  day,
  week,
  month,
  year,
  bit,
  byte,
  kilobyte,
  megabyte,
  gigabyte,
  terabyte,
  petabyte,
  joule,
  kilojoule,
  calorie,
  kilocalorie,
  british_thermal_unit,
  watt_hour,
  kilowatt_hour,
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
    return [num * factor, getShortestUnit(units[destinationUnit])];
  } else {
    return [0, ''];
  }
}

export function getShortestUnit(units: string[]) {
  const shortest = units.reduce((a, b) => (a.length <= b.length ? a : b));
  return shortest;
}
