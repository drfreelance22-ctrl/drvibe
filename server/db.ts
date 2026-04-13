import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, meditations, subscriptions, InsertMeditation, InsertSubscription, Meditation, Subscription } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

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
      values.role = "admin";
      updateSet.role = "admin";
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

// ============ MEDITATIONS ============

export async function getAllMeditations(): Promise<Meditation[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(meditations).where(eq(meditations.isActive, 1));
}

export async function getMeditationById(id: number): Promise<Meditation | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(meditations).where(eq(meditations.id, id));
  return result[0];
}

export async function createMeditation(data: InsertMeditation): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(meditations).values(data);
  return (result as any).insertId || 0;
}

export async function updateMeditation(id: number, data: Partial<InsertMeditation>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(meditations).set(data).where(eq(meditations.id, id));
}

export async function deleteMeditation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Soft delete - mark as inactive
  await db.update(meditations).set({ isActive: 0 }).where(eq(meditations.id, id));
}

// ============ SUBSCRIPTIONS ============

export async function getUserSubscription(userId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
  return result[0];
}

export async function getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
  return result[0];
}

export async function createSubscription(data: InsertSubscription): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(data);
  return (result as any).insertId || 0;
}

export async function updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set(data).where(eq(subscriptions.id, id));
}

export async function updateSubscriptionByStripeId(
  stripeSubscriptionId: string,
  data: Partial<InsertSubscription>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set(data).where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
}

export async function isUserSubscriptionActive(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active")
      )
    );

  return result.length > 0;
}

export async function deleteSubscription(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set({ status: "canceled" }).where(eq(subscriptions.id, id));
}
