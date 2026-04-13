import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import * as stripeService from "./stripe";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  meditations: router({
    list: publicProcedure.query(() => db.getAllMeditations()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => db.getMeditationById(input.id)),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          duration: z.number().int().positive(),
          type: z.enum(["audio", "video"]),
          fileUrl: z.string().url(),
          thumbnailUrl: z.string().url().optional(),
          chakra: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: Only admins can create meditations");
        }
        return db.createMeditation(input);
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          duration: z.number().int().positive().optional(),
          type: z.enum(["audio", "video"]).optional(),
          fileUrl: z.string().url().optional(),
          thumbnailUrl: z.string().url().optional(),
          chakra: z.string().optional(),
          isActive: z.number().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: Only admins can update meditations");
        }
        const { id, ...data } = input;
        return db.updateMeditation(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: Only admins can delete meditations");
        }
        return db.deleteMeditation(input.id);
      }),
  }),

  subscriptions: router({
    getStatus: protectedProcedure.query(({ ctx }) => db.getUserSubscription(ctx.user.id)),
    isActive: protectedProcedure.query(({ ctx }) => db.isUserSubscriptionActive(ctx.user.id)),
    create: protectedProcedure
      .input(
        z.object({
          stripeCustomerId: z.string(),
          stripeSubscriptionId: z.string(),
          status: z.enum(["active", "canceled", "past_due", "trialing"]),
          currentPeriodStart: z.date(),
          currentPeriodEnd: z.date(),
          trialStart: z.date().optional(),
          trialEnd: z.date().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        return db.createSubscription({
          userId: ctx.user.id,
          ...input,
        });
      }),
    updateStatus: protectedProcedure
      .input(
        z.object({
          stripeSubscriptionId: z.string(),
          status: z.enum(["active", "canceled", "past_due", "trialing"]),
        })
      )
      .mutation(({ input }) => {
        return db.updateSubscriptionByStripeId(input.stripeSubscriptionId, { status: input.status });
      }),
    createCheckoutSession: protectedProcedure
      .input(
        z.object({
          successUrl: z.string().url(),
          cancelUrl: z.string().url(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.email) {
          throw new Error("User email required");
        }
        const customer = await stripeService.getOrCreateCustomer(ctx.user.id, ctx.user.email, ctx.user.name || undefined);
        const session = await stripeService.createCheckoutSession(customer.id, ctx.user.email, input.successUrl, input.cancelUrl);
        return {
          sessionId: session.id,
          url: session.url,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
