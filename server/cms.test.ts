import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("CMS API - Categories", () => {
  it("lists all categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.categories.list();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    const cat = categories[0];
    expect(cat).toHaveProperty("key");
    expect(cat).toHaveProperty("slug");
    expect(cat).toHaveProperty("nameZh");
    expect(cat).toHaveProperty("nameEn");
    expect(cat).toHaveProperty("color");
  });

  it("fetches a category by slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const category = await caller.categories.bySlug({ slug: "ai-daily" });

    expect(category).not.toBeNull();
    expect(category).not.toBeUndefined();
    if (category) {
      expect(category.key).toBe("aiDaily");
      expect(category.slug).toBe("ai-daily");
    }
  });

  it("returns undefined for non-existent slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const category = await caller.categories.bySlug({ slug: "non-existent-slug" });
    expect(category).toBeUndefined();
  });
});

describe("CMS API - Articles", () => {
  it("lists published articles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const articles = await caller.articles.list();

    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);

    const article = articles[0];
    expect(article).toHaveProperty("id");
    expect(article).toHaveProperty("titleZh");
    expect(article).toHaveProperty("titleEn");
    expect(article).toHaveProperty("author");
    expect(article).toHaveProperty("categoryKey");
  });

  it("lists featured articles", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const featured = await caller.articles.featured({ limit: 3 });

    expect(Array.isArray(featured)).toBe(true);
    expect(featured.length).toBeGreaterThanOrEqual(1);
    expect(featured.length).toBeLessThanOrEqual(3);
  });

  it("fetches article by ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const articles = await caller.articles.list();
    expect(articles.length).toBeGreaterThan(0);
    const firstId = articles[0].id;

    const article = await caller.articles.byId({ id: firstId });

    expect(article).not.toBeNull();
    if (article) {
      expect(article.id).toBe(firstId);
      expect(article.titleZh).toBeTruthy();
      expect(article.titleEn).toBeTruthy();
    }
  });

  it("returns null for non-existent article ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const article = await caller.articles.byId({ id: 99999 });
    expect(article).toBeNull();
  });

  it("fetches articles by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const articles = await caller.articles.byCategory({ categoryKey: "aiDaily" });

    expect(Array.isArray(articles)).toBe(true);
    for (const a of articles) {
      expect(a.categoryKey).toBe("aiDaily");
    }
  });

  it("searches articles by keyword", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.articles.search({ query: "Claude" });

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty array for empty search query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.articles.search({ query: "" });
    expect(results).toEqual([]);
  });
});

describe("Newsletter API", () => {
  const testEmail = `test-${Date.now()}@example.com`;

  it("subscribes a new email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({ email: testEmail, language: "en" });

    expect(result).toHaveProperty("success");
    expect(result.success).toBe(true);
  });

  it("returns alreadySubscribed for duplicate email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({ email: testEmail, language: "en" });

    expect(result).toHaveProperty("alreadySubscribed");
    expect(result.alreadySubscribed).toBe(true);
  });

  it("unsubscribes an email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.unsubscribe({ email: testEmail });

    expect(result).toEqual({ success: true });
  });

  it("reactivates a previously unsubscribed email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.newsletter.subscribe({ email: testEmail, language: "zh" });

    expect(result).toHaveProperty("reactivated");
    expect(result.reactivated).toBe(true);
  });
});
