export type Variable = {
  name: string;
  value: number | string;
};

export type Result = {
  raw: number | string;
  formatted: string;
};

export type FormatType = 'regular-number' | 'currency' | 'comment';
