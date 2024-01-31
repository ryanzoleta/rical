export type Variable = {
  name: string;
  value: number | string;
};

export type Result = {
  raw: number | string;
  formatted: string;
};

export type FormatType = 'regular-number' | 'currency' | 'comment';

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
