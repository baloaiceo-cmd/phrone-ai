CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryKey` varchar(64) NOT NULL,
	`titleZh` text NOT NULL,
	`titleEn` text NOT NULL,
	`excerptZh` text NOT NULL,
	`excerptEn` text NOT NULL,
	`contentZh` text,
	`contentEn` text,
	`author` varchar(256) NOT NULL,
	`image` text,
	`readTime` int NOT NULL DEFAULT 5,
	`views` int NOT NULL DEFAULT 0,
	`featured` boolean NOT NULL DEFAULT false,
	`published` boolean NOT NULL DEFAULT true,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`slug` varchar(128) NOT NULL,
	`nameZh` varchar(256) NOT NULL,
	`nameEn` varchar(256) NOT NULL,
	`descZh` text,
	`descEn` text,
	`color` varchar(16) NOT NULL DEFAULT '#2563EB',
	`image` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_key_unique` UNIQUE(`key`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
