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

// User storage table (keep original for backward compatibility)
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
  // Monetization fields
  stripeCustomerId: varchar("stripe_customer_id"),
  subscriptionTier: varchar("subscription_tier").default("free"), // free, pro, advanced, premium
  subscriptionStatus: varchar("subscription_status").default("inactive"), // active, inactive, cancelled
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  totalSpent: integer("total_spent").default(0), // in cents
});

// Simple auth users table (new)
export const authUsers = pgTable("auth_users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  passwordHash: varchar("password_hash").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  emailVerified: boolean("email_verified").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Items table for lost/found objects
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => authUsers.id),
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
  senderId: varchar("sender_id").notNull().references(() => authUsers.id),
  receiverId: varchar("receiver_id").notNull().references(() => authUsers.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table for purchases
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => authUsers.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  paypalOrderId: varchar("paypal_order_id"),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency").default("usd"),
  status: varchar("status").default("pending"), // pending, completed, failed, refunded
  paymentMethod: varchar("payment_method").notNull(), // stripe, paypal
  productType: varchar("product_type").notNull(), // subscription, premium_service
  productId: varchar("product_id").notNull(), // pro, advanced, premium, boost_listing, etc.
  metadata: jsonb("metadata"), // additional data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Premium services table
export const premiumServices = pgTable("premium_services", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  currency: varchar("currency").default("usd"),
  duration: integer("duration"), // in days (null for one-time services)
  features: jsonb("features"), // list of features
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  orders: many(orders),
}));

export const authUsersRelations = relations(authUsers, ({ many }) => ({
  items: many(items),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  orders: many(orders),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [items.userId],
    references: [authUsers.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  item: one(items, {
    fields: [messages.itemId],
    references: [items.id],
  }),
  sender: one(authUsers, {
    fields: [messages.senderId],
    references: [authUsers.id],
    relationName: "sender",
  }),
  receiver: one(authUsers, {
    fields: [messages.receiverId],
    references: [authUsers.id],
    relationName: "receiver",
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(authUsers, {
    fields: [orders.userId],
    references: [authUsers.id],
  }),
}));

// Zod schemas
export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Make optional fields truly optional
  locationLat: z.string().optional(),
  locationLng: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  isActive: z.boolean().default(true).optional(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type AuthUser = typeof authUsers.$inferSelect;
export type UpsertAuthUser = typeof authUsers.$inferInsert;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type PremiumService = typeof premiumServices.$inferSelect;

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
