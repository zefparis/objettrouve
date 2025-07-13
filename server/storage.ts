import {
  users,
  authUsers,
  items,
  messages,
  orders,
  premiumServices,
  type User,
  type UpsertUser,
  type AuthUser,
  type UpsertAuthUser,
  type Item,
  type InsertItem,
  type Message,
  type InsertMessage,
  type Order,
  type InsertOrder,
  type PremiumService,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, sql, count, sum, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Auth user operations
  getAuthUser(id: string): Promise<AuthUser | undefined>;
  getAuthUserByEmail(email: string): Promise<AuthUser | undefined>;
  upsertAuthUser(user: UpsertAuthUser): Promise<AuthUser>;
  updateAuthUser(id: string, updates: Partial<UpsertAuthUser>): Promise<AuthUser | undefined>;
  
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
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  
  // Premium services
  getPremiumServices(): Promise<PremiumService[]>;
  getPremiumService(id: string): Promise<PremiumService | undefined>;
  
  // Admin operations
  getRevenueStats(period: string): Promise<{
    totalRevenue: number;
    revenueGrowth: number;
    dailyRevenue: Array<{ date: string; revenue: number }>;
  }>;
  getPayingUsers(): Promise<{
    users: User[];
    payingUsers: number;
    userGrowth: number;
  }>;
  getOrdersStats(): Promise<{
    orders: Order[];
    monthlyOrders: number;
    orderGrowth: number;
  }>;
  processRefund(orderId: number, amount: number, reason: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  // Auth user operations
  async getAuthUser(id: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.id, id));
    return user;
  }

  async getAuthUserByEmail(email: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email));
    return user;
  }

  async upsertAuthUser(userData: UpsertAuthUser): Promise<AuthUser> {
    const [user] = await db
      .insert(authUsers)
      .values(userData)
      .onConflictDoUpdate({
        target: authUsers.id,
        set: {
          // Only update non-null fields to preserve existing data
          ...(userData.email && { email: userData.email }),
          ...(userData.firstName !== undefined && { firstName: userData.firstName }),
          ...(userData.lastName !== undefined && { lastName: userData.lastName }),
          ...(userData.phone !== undefined && { phone: userData.phone }),
          ...(userData.location !== undefined && { location: userData.location }),
          ...(userData.bio !== undefined && { bio: userData.bio }),
          ...(userData.profileImageUrl !== undefined && { profileImageUrl: userData.profileImageUrl }),
          ...(userData.passwordHash && { passwordHash: userData.passwordHash }),
          ...(userData.emailVerified !== undefined && { emailVerified: userData.emailVerified }),
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateAuthUser(id: string, updates: Partial<UpsertAuthUser>): Promise<AuthUser | undefined> {
    const [user] = await db
      .update(authUsers)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(authUsers.id, id))
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

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async getOrders(userId?: string): Promise<Order[]> {
    const query = db.select().from(orders);
    
    if (userId) {
      query.where(eq(orders.userId, userId));
    }
    
    const result = await query.orderBy(desc(orders.createdAt));
    return result;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Premium services
  async getPremiumServices(): Promise<PremiumService[]> {
    const services = await db
      .select()
      .from(premiumServices)
      .where(eq(premiumServices.isActive, true))
      .orderBy(premiumServices.price);
    return services;
  }

  async getPremiumService(id: string): Promise<PremiumService | undefined> {
    const [service] = await db
      .select()
      .from(premiumServices)
      .where(eq(premiumServices.id, id));
    return service;
  }

  // Admin operations
  async getRevenueStats(period: string): Promise<{
    totalRevenue: number;
    revenueGrowth: number;
    dailyRevenue: Array<{ date: string; revenue: number }>;
  }> {
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    const totalResult = await db
      .select({
        revenue: sql<number>`sum(amount)`.as('revenue'),
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startDate)
        )
      );

    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(previousPeriodStart.getTime() - (now.getTime() - startDate.getTime()));

    const previousResult = await db
      .select({
        revenue: sql<number>`sum(amount)`.as('revenue'),
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, previousPeriodStart),
          lte(orders.createdAt, startDate)
        )
      );

    const totalRevenue = totalResult[0]?.revenue || 0;
    const previousRevenue = previousResult[0]?.revenue || 0;
    const revenueGrowth = previousRevenue > 0 ? 
      ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    // Daily revenue for the period
    const dailyRevenue = await db
      .select({
        date: sql<string>`date(created_at)`.as('date'),
        revenue: sql<number>`sum(amount)`.as('revenue'),
      })
      .from(orders)
      .where(
        and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startDate)
        )
      )
      .groupBy(sql`date(created_at)`)
      .orderBy(sql`date(created_at)`);

    return {
      totalRevenue: totalRevenue / 100, // Convert from cents
      revenueGrowth,
      dailyRevenue: dailyRevenue.map(d => ({
        date: d.date,
        revenue: d.revenue / 100
      }))
    };
  }

  async getPayingUsers(): Promise<{
    users: User[];
    payingUsers: number;
    userGrowth: number;
  }> {
    const payingUsers = await db
      .select()
      .from(users)
      .where(
        and(
          sql`subscription_status = 'active'`,
          sql`total_spent > 0`
        )
      )
      .orderBy(desc(users.totalSpent));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newPayingUsers = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(users)
      .where(
        and(
          sql`subscription_status = 'active'`,
          sql`total_spent > 0`,
          gte(users.createdAt, thirtyDaysAgo)
        )
      );

    const previousPayingUsers = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(users)
      .where(
        and(
          sql`subscription_status = 'active'`,
          sql`total_spent > 0`,
          lte(users.createdAt, thirtyDaysAgo)
        )
      );

    const currentCount = payingUsers.length;
    const newCount = newPayingUsers[0]?.count || 0;
    const previousCount = previousPayingUsers[0]?.count || 0;
    const userGrowth = previousCount > 0 ? (newCount / previousCount) * 100 : 0;

    return {
      users: payingUsers,
      payingUsers: currentCount,
      userGrowth
    };
  }

  async getOrdersStats(): Promise<{
    orders: Order[];
    monthlyOrders: number;
    orderGrowth: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(100);

    const monthlyOrders = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(orders)
      .where(gte(orders.createdAt, thirtyDaysAgo));

    const previousMonthStart = new Date(thirtyDaysAgo);
    previousMonthStart.setDate(previousMonthStart.getDate() - 30);

    const previousMonthOrders = await db
      .select({ count: sql<number>`count(*)`.as('count') })
      .from(orders)
      .where(
        and(
          gte(orders.createdAt, previousMonthStart),
          lte(orders.createdAt, thirtyDaysAgo)
        )
      );

    const currentCount = monthlyOrders[0]?.count || 0;
    const previousCount = previousMonthOrders[0]?.count || 0;
    const orderGrowth = previousCount > 0 ? 
      ((currentCount - previousCount) / previousCount) * 100 : 0;

    return {
      orders: recentOrders,
      monthlyOrders: currentCount,
      orderGrowth
    };
  }

  async processRefund(orderId: number, amount: number, reason: string): Promise<boolean> {
    try {
      // Update order status to refunded
      await db
        .update(orders)
        .set({ 
          status: 'refunded',
          metadata: sql`jsonb_set(coalesce(metadata, '{}'), '{refund_reason}', '"${reason}"')`,
          updatedAt: new Date()
        })
        .where(eq(orders.id, orderId));

      // Here you would also call Stripe/PayPal API to process actual refund
      // For now, we'll just update the database

      return true;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
