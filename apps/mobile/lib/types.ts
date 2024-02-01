export type Variable = {
  name: string;
  value: Result;
};

export type Result = {
  raw: number | string;
  formatType: FormatType;
  unit?: string;
};

export type FormatType = 'number' | 'currency' | 'measurement' | 'none';

export type ExchangeRate = {
  [currency: string]: number;
};

export type CurrencyConversionApiResponse = {
  value: number;
  sourceCurrency: string;
  targetCurrency: string;
  result: number;
};

export type ConversionTokens = {
  num: number;
  src: string;
  dest: string;
};

export type StoredRates = {
  updatedAt: Date;
  rates: ExchangeRate;
};
