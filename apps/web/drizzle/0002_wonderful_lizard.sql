ALTER TABLE `rates` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `rates` MODIFY COLUMN `rate` decimal(30,20);--> statement-breakpoint
ALTER TABLE `rates` ADD PRIMARY KEY(`currency`);--> statement-breakpoint
ALTER TABLE `rates` ADD `currency` varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE `rates` DROP COLUMN `sourceCurrency`;--> statement-breakpoint
ALTER TABLE `rates` DROP COLUMN `targetCurrency`;