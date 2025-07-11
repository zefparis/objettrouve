import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  location: varchar("location"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Items table for lost/found objects
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // 'lost' or 'found'
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  location: varchar("location").notNull(),
  locationLat: varchar("location_lat"),
  locationLng: varchar("location_lng"),
  dateOccurred: timestamp("date_occurred").notNull(),
  imageUrl: varchar("image_url"),
  contactPhone: varchar("contact_phone"),
  contactEmail: varchar("contact_email"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table for chat functionality
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => items.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  user: one(users, {
    fields: [items.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  item: one(items, {
    fields: [messages.itemId],
    references: [items.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

// Zod schemas
export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Categories
export const CATEGORIES = [
  { id: "phones", name: "Téléphones", icon: "fas fa-mobile-alt" },
  { id: "keys", name: "Clés", icon: "fas fa-key" },
  { id: "wallets", name: "Portefeuilles", icon: "fas fa-wallet" },
  { id: "glasses", name: "Lunettes", icon: "fas fa-glasses" },
  { id: "computers", name: "Ordinateurs", icon: "fas fa-laptop" },
  { id: "jewelry", name: "Bijoux", icon: "fas fa-gem" },
  { id: "clothing", name: "Vêtements", icon: "fas fa-tshirt" },
  { id: "bags", name: "Sacs", icon: "fas fa-shopping-bag" },
  { id: "documents", name: "Documents", icon: "fas fa-file-alt" },
  { id: "other", name: "Autres", icon: "fas fa-question" },
];
