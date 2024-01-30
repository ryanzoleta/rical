export const meter = ['meter', 'm', 'meters', 'metre', 'metres'];
export const centimeter = ['centimeter', 'cm', 'centimeters', 'centimetre', 'centimetres'];
export const millimeter = ['millimeter', 'mm', 'millimeters', 'millimetre', 'millimetres'];
export const kilometer = ['kilometer', 'km', 'kilometers', 'kilometre', 'kilometres'];
export const inch = ['inch', 'in', 'inches'];
export const foot = ['foot', 'ft', 'feet'];
export const yard = ['yard', 'yd', 'yards'];
export const mile = ['mile', 'mi', 'miles'];
export const length = [
  ...meter,
  ...centimeter,
  ...millimeter,
  ...kilometer,
  ...inch,
  ...foot,
  ...yard,
  ...mile,
];
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
};

export function determineUnitType(input: string): keyof typeof conversionFactors | undefined {
  for (const [unitType, values] of Object.entries(conversionFactors)) {
    if (Object.keys(values).includes(input)) {
      return unitType as keyof typeof conversionFactors;
    }
  }
}

export function determineUnit(input: string): keyof typeof units | undefined {
  for (const [unit, values] of Object.entries(units)) {
    if (values.includes(input)) {
      return unit as keyof typeof units;
    }
  }
}
