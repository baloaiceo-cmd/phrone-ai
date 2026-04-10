import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllCategories,
  getCategoryBySlug,
  getPublishedArticles,
  getFeaturedArticles,
  getArticlesByCategory,
  getArticleById,
  searchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  incrementViews,
  upsertCategory,
  addSubscriber,
  removeSubscriber,
  getAllSubscribers,
  getSubscriberCount,
} from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Public CMS read routes ───
  categories: router({
    list: publicProcedure.query(async () => {
      return getAllCategories();
    }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getCategoryBySlug(input.slug);
      }),
  }),

  articles: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getPublishedArticles(input?.limit ?? 50, input?.offset ?? 0);
      }),
    featured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return getFeaturedArticles(input?.limit ?? 3);
      }),
    byCategory: publicProcedure
      .input(z.object({ categoryKey: z.string(), limit: z.number().optional(), offset: z.number().optional() }))
      .query(async ({ input }) => {
        return getArticlesByCategory(input.categoryKey, input.limit ?? 20, input.offset ?? 0);
      }),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const article = await getArticleById(input.id);
        if (article) {
          // Increment views asynchronously
          incrementViews(input.id).catch(() => {});
        }
        return article ?? null;
      }),
    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        if (!input.query.trim()) return [];
        return searchArticles(input.query, input.limit ?? 20);
      }),
  }),

  // ─── Admin CMS management routes ───
  admin: router({
    createArticle: adminProcedure
      .input(z.object({
        categoryKey: z.string(),
        titleZh: z.string(),
        titleEn: z.string(),
        excerptZh: z.string(),
        excerptEn: z.string(),
        contentZh: z.string().optional(),
        contentEn: z.string().optional(),
        author: z.string(),
        image: z.string().optional(),
        readTime: z.number().optional(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        await createArticle({
          ...input,
          readTime: input.readTime ?? 5,
          featured: input.featured ?? false,
          published: input.published ?? true,
        });
        return { success: true };
      }),
    updateArticle: adminProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          categoryKey: z.string().optional(),
          titleZh: z.string().optional(),
          titleEn: z.string().optional(),
          excerptZh: z.string().optional(),
          excerptEn: z.string().optional(),
          contentZh: z.string().optional(),
          contentEn: z.string().optional(),
          author: z.string().optional(),
          image: z.string().optional(),
          readTime: z.number().optional(),
          featured: z.boolean().optional(),
          published: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await updateArticle(input.id, input.data);
        return { success: true };
      }),
    deleteArticle: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteArticle(input.id);
        return { success: true };
      }),
    upsertCategory: adminProcedure
      .input(z.object({
        key: z.string(),
        slug: z.string(),
        nameZh: z.string(),
        nameEn: z.string(),
        descZh: z.string().optional(),
        descEn: z.string().optional(),
        color: z.string().optional(),
        image: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await upsertCategory({
          ...input,
          color: input.color ?? "#2563EB",
          sortOrder: input.sortOrder ?? 0,
        });
        return { success: true };
      }),
    // Subscriber management
    subscribers: adminProcedure.query(async () => {
      return getAllSubscribers(false);
    }),
    subscriberCount: adminProcedure.query(async () => {
      return getSubscriberCount();
    }),
  }),

  // ─── Newsletter subscription (public) ───
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email(), language: z.string().optional() }))
      .mutation(async ({ input }) => {
        const result = await addSubscriber(input.email, input.language ?? "zh");
        // Notify owner of new subscriber
        if (result.success) {
          notifyOwner({
            title: "New Newsletter Subscriber",
            content: `New subscriber: ${input.email} (language: ${input.language ?? "zh"})`,
          }).catch(() => {});
        }
        return result;
      }),
    unsubscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await removeSubscriber(input.email);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
