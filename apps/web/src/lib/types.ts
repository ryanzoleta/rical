export type CurrencyApiLatestResponse = {
  meta: {
    last_updated_at: string;
  };
  data: {
    [currency: string]: {
      code: string;
      value: number;
    };
  };
};
