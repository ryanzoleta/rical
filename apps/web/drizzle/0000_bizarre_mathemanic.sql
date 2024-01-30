CREATE TABLE `rates` (
	`sourceCurrency` varchar(3) NOT NULL,
	`targetCurrency` varchar(3) NOT NULL,
	`rate` decimal(15,2),
	`createdAt` datetime,
	`updatedAt` datetime,
	CONSTRAINT `rates_sourceCurrency_targetCurrency_pk` PRIMARY KEY(`sourceCurrency`,`targetCurrency`)
);
