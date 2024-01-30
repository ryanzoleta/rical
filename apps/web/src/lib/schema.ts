import { datetime, decimal, mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';

export const rates = mysqlTable(
  'rates',
  {
    sourceCurrency: varchar('sourceCurrency', { length: 3 }),
    targetCurrency: varchar('targetCurrency', { length: 3 }),
    rate: decimal('rate', { scale: 2, precision: 15 }),
    createdAt: datetime('createdAt'),
    updatedAt: datetime('updatedAt'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.sourceCurrency, table.targetCurrency] }),
    };
  },
);
