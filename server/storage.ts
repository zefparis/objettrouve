import {
  users,
  items,
  messages,
  type User,
  type UpsertUser,
  type Item,
  type InsertItem,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Item operations
  createItem(item: InsertItem): Promise<Item>;
  getItems(filters?: {
    type?: 'lost' | 'found';
    category?: string;
    search?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  updateItem(id: number, updates: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: number, userId: string): Promise<boolean>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getConversation(itemId: number, userId: string): Promise<Message[]>;
  getConversations(userId: string): Promise<{ itemId: number; lastMessage: Message; item: Item }[]>;
  
  // Statistics
  getStats(): Promise<{
    totalItems: number;
    lostItems: number;
    foundItems: number;
    users: number;
  }>;
  
  getCategoryStats(): Promise<{ category: string; count: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Item operations
  async createItem(item: InsertItem): Promise<Item> {
    const [newItem] = await db.insert(items).values(item).returning();
    return newItem;
  }

  async getItems(filters?: {
    type?: 'lost' | 'found';
    category?: string;
    search?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Item[]> {
    const conditions = [eq(items.isActive, true)];

    if (filters?.type) {
      conditions.push(eq(items.type, filters.type));
    }

    if (filters?.category) {
      conditions.push(eq(items.category, filters.category));
    }

    if (filters?.search) {
      conditions.push(
        or(
          ilike(items.title, `%${filters.search}%`),
          ilike(items.description, `%${filters.search}%`),
          ilike(items.location, `%${filters.search}%`)
        )!
      );
    }

    if (filters?.userId) {
      conditions.push(eq(items.userId, filters.userId));
    }

    const baseQuery = db.select().from(items).where(and(...conditions)).orderBy(desc(items.createdAt));

    if (filters?.limit && filters?.offset) {
      return await baseQuery.limit(filters.limit).offset(filters.offset);
    } else if (filters?.limit) {
      return await baseQuery.limit(filters.limit);
    } else if (filters?.offset) {
      return await baseQuery.offset(filters.offset);
    }

    return await baseQuery;
  }

  async getItem(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }

  async updateItem(id: number, updates: Partial<InsertItem>): Promise<Item | undefined> {
    const [updatedItem] = await db
      .update(items)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return updatedItem;
  }

  async deleteItem(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(items)
      .where(and(eq(items.id, id), eq(items.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getConversation(itemId: number, userId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.itemId, itemId),
          or(
            eq(messages.senderId, userId),
            eq(messages.receiverId, userId)
          )
        )
      )
      .orderBy(messages.createdAt);
  }

  async getConversations(userId: string): Promise<{ itemId: number; lastMessage: Message; item: Item }[]> {
    const conversations = await db
      .select({
        itemId: messages.itemId,
        lastMessage: messages,
        item: items,
      })
      .from(messages)
      .innerJoin(items, eq(messages.itemId, items.id))
      .where(
        or(
          eq(messages.senderId, userId),
          eq(messages.receiverId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));

    // Group by itemId and get the latest message for each conversation
    const conversationMap = new Map();
    conversations.forEach(conv => {
      if (!conversationMap.has(conv.itemId)) {
        conversationMap.set(conv.itemId, conv);
      }
    });

    return Array.from(conversationMap.values());
  }

  // Statistics
  async getStats(): Promise<{
    totalItems: number;
    lostItems: number;
    foundItems: number;
    users: number;
  }> {
    const [stats] = await db
      .select({
        totalItems: sql<number>`COUNT(CASE WHEN ${items.isActive} = true THEN 1 END)`,
        lostItems: sql<number>`COUNT(CASE WHEN ${items.type} = 'lost' AND ${items.isActive} = true THEN 1 END)`,
        foundItems: sql<number>`COUNT(CASE WHEN ${items.type} = 'found' AND ${items.isActive} = true THEN 1 END)`,
        users: sql<number>`(SELECT COUNT(*) FROM ${users})`,
      })
      .from(items);

    return {
      totalItems: Number(stats.totalItems),
      lostItems: Number(stats.lostItems),
      foundItems: Number(stats.foundItems),
      users: Number(stats.users),
    };
  }

  async getCategoryStats(): Promise<{ category: string; count: number }[]> {
    const stats = await db
      .select({
        category: items.category,
        count: sql<number>`COUNT(*)`,
      })
      .from(items)
      .where(eq(items.isActive, true))
      .groupBy(items.category);

    return stats.map(stat => ({
      category: stat.category,
      count: Number(stat.count),
    }));
  }
}

export const storage = new DatabaseStorage();
