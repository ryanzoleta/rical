import { pgTable, varchar, decimal, timestamp } from 'drizzle-orm/pg-core';

export const rates = pgTable('rates', {
  currency: varchar('currency', { length: 5 }).primaryKey(),
  rate: decimal('rate', { scale: 20, precision: 30 }),
  updatedAt: timestamp('updatedAt'),
});

export type Rates = typeof rates.$inferSelect;
