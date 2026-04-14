import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL || "postgres://a6678b51cad5a20a279533bddba4240bdd6e8fba85b07bcc207dbe86db87eaec:sk_VXFwy9hS4XTn91QemZ7KL@db.prisma.io:5432/postgres?sslmode=require";
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
