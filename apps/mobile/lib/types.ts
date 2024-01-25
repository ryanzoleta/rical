export type Variable = {
  name: string;
  value: number | string;
  isCurrency: boolean;
};

export type Result = {
  raw: number | string;
  formatted: string;
  formatType: FormatType;
};

export type FormatType = 'regular-number' | 'currency' | 'comment';
