import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories table for CMS
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 64 }).notNull().unique(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  nameZh: varchar("nameZh", { length: 256 }).notNull(),
  nameEn: varchar("nameEn", { length: 256 }).notNull(),
  descZh: text("descZh"),
  descEn: text("descEn"),
  color: varchar("color", { length: 16 }).notNull().default("#2563EB"),
  image: text("image"),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Articles table for CMS
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  categoryKey: varchar("categoryKey", { length: 64 }).notNull(),
  titleZh: text("titleZh").notNull(),
  titleEn: text("titleEn").notNull(),
  excerptZh: text("excerptZh").notNull(),
  excerptEn: text("excerptEn").notNull(),
  contentZh: text("contentZh"),
  contentEn: text("contentEn"),
  author: varchar("author", { length: 256 }).notNull(),
  image: text("image"),
  readTime: int("readTime").notNull().default(5),
  views: int("views").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Newsletter subscribers table
 */
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  language: varchar("language", { length: 10 }).notNull().default("zh"),
  active: boolean("active").notNull().default(true),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;
