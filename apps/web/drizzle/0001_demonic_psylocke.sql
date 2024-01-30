ALTER TABLE `rates` MODIFY COLUMN `sourceCurrency` varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE `rates` MODIFY COLUMN `targetCurrency` varchar(5) NOT NULL;