import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const redactedFiles = pgTable("redacted_files", {
  id: text("id").primaryKey(),
  originalName: text("original_name").notNull(),
  redactedPath: text("redacted_path").notNull(),
  namesCount: integer("names_count").default(0),
  phonesCount: integer("phones_count").default(0),
  pagesCount: integer("pages_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// RedactedFile schemas
export const insertRedactedFileSchema = createInsertSchema(redactedFiles)
  .extend({
    stats: z.object({
      names: z.number(),
      phones: z.number(),
      pages: z.number(),
    })
  })
  .omit({
    namesCount: true,
    phonesCount: true,
    pagesCount: true,
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRedactedFile = z.infer<typeof insertRedactedFileSchema>;
export type RedactedFile = typeof redactedFiles.$inferSelect;

// Add to storage interface
declare module "./storage" {
  interface IStorage {
    createRedactedFile(file: {
      id: string;
      originalName: string;
      redactedPath: string;
      stats: {
        names: number;
        phones: number;
        pages: number;
      };
      createdAt: Date;
    }): Promise<RedactedFile>;
    getRedactedFile(id: string): Promise<RedactedFile | undefined>;
  }
}
