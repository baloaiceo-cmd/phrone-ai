import { eq, desc, like, or, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, categories, subscribers, InsertArticle, InsertCategory, InsertSubscriber } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  if (!_db && !process.env.DATABASE_URL) {
    console.error("[Database] DATABASE_URL environment variable is not set");
  }
  return _db;
}

// ─── User helpers ───
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Category helpers ───
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCategory(cat: InsertCategory) {
  const db = await getDb();
  if (!db) return;
  await db.insert(categories).values(cat).onDuplicateKeyUpdate({
    set: {
      nameZh: cat.nameZh,
      nameEn: cat.nameEn,
      descZh: cat.descZh,
      descEn: cat.descEn,
      color: cat.color,
      image: cat.image,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
    },
  });
}

// ─── Article helpers ───
export async function getPublishedArticles(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getFeaturedArticles(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.published, true), eq(articles.featured, true)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getArticlesByCategory(categoryKey: string, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articles)
    .where(and(eq(articles.published, true), eq(articles.categoryKey, categoryKey)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Escape special LIKE pattern characters so user input is treated as literals.
 */
function escapeLikePattern(input: string): string {
  return input.replace(/[%_\\]/g, (ch) => `\\${ch}`);
}

export async function searchArticles(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const pattern = `%${escapeLikePattern(query)}%`;
  return db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.published, true),
        or(
          like(articles.titleZh, pattern),
          like(articles.titleEn, pattern),
          like(articles.excerptZh, pattern),
          like(articles.excerptEn, pattern),
          like(articles.author, pattern)
        )
      )
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function createArticle(article: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(articles).values(article);
  return result;
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(articles).set(data).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(articles).where(eq(articles.id, id));
}

export async function incrementViews(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(articles).set({ views: sql`${articles.views} + 1` }).where(eq(articles.id, id));
}

// ─── Subscriber helpers ───
export async function addSubscriber(email: string, language: string = "zh") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Try to reactivate if already exists
  const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
  if (existing.length > 0) {
    if (existing[0].active) {
      return { alreadySubscribed: true };
    }
    // Reactivate
    await db.update(subscribers).set({ active: true, language, unsubscribedAt: null }).where(eq(subscribers.email, email));
    return { reactivated: true };
  }
  await db.insert(subscribers).values({ email, language });
  return { success: true };
}

export async function removeSubscriber(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subscribers).set({ active: false, unsubscribedAt: new Date() }).where(eq(subscribers.email, email));
}

export async function getAllSubscribers(activeOnly = true) {
  const db = await getDb();
  if (!db) return [];
  if (activeOnly) {
    return db.select().from(subscribers).where(eq(subscribers.active, true)).orderBy(desc(subscribers.subscribedAt));
  }
  return db.select().from(subscribers).orderBy(desc(subscribers.subscribedAt));
}

export async function getSubscriberCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(subscribers).where(eq(subscribers.active, true));
  return result[0]?.count ?? 0;
}
