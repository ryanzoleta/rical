import { datetime, decimal, mysqlTable, varchar } from 'drizzle-orm/mysql-core';

export const rates = mysqlTable('rates', {
  currency: varchar('currency', { length: 5 }).primaryKey(),
  rate: decimal('rate', { scale: 20, precision: 30 }),
  updatedAt: datetime('updatedAt'),
});

export type Rates = typeof rates.$inferSelect;
