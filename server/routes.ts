import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertItemSchema, insertMessageSchema, insertOrderSchema } from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import { cognitoService, type AuthResult } from "./cognitoService";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // AWS Cognito Auth routes
  app.post('/api/cognito/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const attributes: Record<string, string> = {};
      if (firstName) attributes['given_name'] = firstName;
      if (lastName) attributes['family_name'] = lastName;
      
      await cognitoService.signUp(email, password, attributes);
      res.json({ message: 'User created successfully' });
    } catch (error: any) {
      console.error("Cognito signup error:", error);
      res.status(400).json({ error: error.code || 'SignUpError', message: error.message });
    }
  });

  app.post('/api/cognito/confirm-signup', async (req, res) => {
    try {
      const { email, code } = req.body;
      await cognitoService.confirmSignUp(email, code);
      res.json({ message: 'User confirmed successfully' });
    } catch (error: any) {
      console.error("Cognito confirm signup error:", error);
      res.status(400).json({ error: error.code || 'ConfirmSignUpError', message: error.message });
    }
  });

  app.post('/api/cognito/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await cognitoService.signIn(email, password);
      res.json(result);
    } catch (error: any) {
      console.error("Cognito signin error:", error);
      res.status(400).json({ error: error.code || 'SignInError', message: error.message });
    }
  });

  app.post('/api/cognito/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      await cognitoService.forgotPassword(email);
      res.json({ message: 'Password reset code sent' });
    } catch (error: any) {
      console.error("Cognito forgot password error:", error);
      res.status(400).json({ error: error.code || 'ForgotPasswordError', message: error.message });
    }
  });

  app.post('/api/cognito/confirm-password', async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      await cognitoService.confirmPassword(email, code, newPassword);
      res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
      console.error("Cognito confirm password error:", error);
      res.status(400).json({ error: error.code || 'ConfirmPasswordError', message: error.message });
    }
  });

  app.post('/api/cognito/resend-signup', async (req, res) => {
    try {
      const { email } = req.body;
      await cognitoService.resendSignUp(email);
      res.json({ message: 'Confirmation code resent' });
    } catch (error: any) {
      console.error("Cognito resend signup error:", error);
      res.status(400).json({ error: error.code || 'ResendSignUpError', message: error.message });
    }
  });

  app.post('/api/cognito/complete-new-password', async (req, res) => {
    try {
      const { email, temporaryPassword, newPassword } = req.body;
      const result = await cognitoService.completeNewPassword(email, temporaryPassword, newPassword);
      res.json(result);
    } catch (error: any) {
      console.error("Cognito complete new password error:", error);
      res.status(400).json({ error: error.code || 'CompleteNewPasswordError', message: error.message });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.put('/api/profile', upload.single('profileImage'), async (req: any, res) => {
    try {
      // In development, use a mock user ID if not authenticated
      const userId = req.user?.claims?.sub || 'dev-user-123';
      const { firstName, lastName, email, phone, location, bio } = req.body;
      
      // Get existing user data to preserve photo if no new one is uploaded
      const existingUser = await storage.getUser(userId);
      
      const updates = {
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
        updatedAt: new Date(),
      };

      // Only update profile image if a new one is uploaded
      if (req.file) {
        updates.profileImageUrl = `/uploads/${req.file.filename}`;
      }

      // Remove undefined values
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });

      const updatedUser = await storage.upsertUser({ id: userId, ...updates });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
    }
  });

  // Items routes
  app.post('/api/items', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = {
        ...req.body,
        userId,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        dateOccurred: new Date(req.body.dateOccurred),
      };

      const validatedData = insertItemSchema.parse(itemData);
      const item = await storage.createItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ message: "Erreur lors de la création de l'annonce" });
    }
  });

  app.get('/api/items', async (req, res) => {
    try {
      const {
        type,
        category,
        search,
        limit = '20',
        offset = '0',
      } = req.query;

      const filters = {
        type: type as 'lost' | 'found' | undefined,
        category: category as string | undefined,
        search: search as string | undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      const items = await storage.getItems(filters);
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des annonces" });
    }
  });

  app.get('/api/items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getItem(id);
      
      if (!item) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'annonce" });
    }
  });

  app.put('/api/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const item = await storage.getItem(id);
      if (!item) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      
      if (item.userId !== userId) {
        return res.status(403).json({ message: "Non autorisé" });
      }
      
      const updates = req.body;
      if (updates.dateOccurred) {
        updates.dateOccurred = new Date(updates.dateOccurred);
      }
      
      const updatedItem = await storage.updateItem(id, updates);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'annonce" });
    }
  });

  app.delete('/api/items/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const success = await storage.deleteItem(id, userId);
      if (!success) {
        return res.status(404).json({ message: "Annonce non trouvée ou non autorisée" });
      }
      
      res.json({ message: "Annonce supprimée avec succès" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'annonce" });
    }
  });

  // User items
  app.get('/api/user/items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getItems({ userId });
      res.json(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de vos annonces" });
    }
  });

  // Messages routes
  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = {
        ...req.body,
        senderId: userId,
      };

      const validatedData = insertMessageSchema.parse(messageData);
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Erreur lors de l'envoi du message" });
    }
  });

  app.get('/api/conversations/:itemId', isAuthenticated, async (req: any, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const userId = req.user.claims.sub;
      
      const messages = await storage.getConversation(itemId, userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de la conversation" });
    }
  });

  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des conversations" });
    }
  });

  // Statistics routes
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  app.get('/api/categories/stats', async (req, res) => {
    try {
      const stats = await storage.getCategoryStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques par catégorie" });
    }
  });

  // Test route for AWS Cognito configuration
  app.get("/api/cognito/config", async (req, res) => {
    try {
      const config = {
        region: process.env.VITE_AWS_REGION,
        userPoolId: process.env.VITE_COGNITO_USER_POOL_ID,
        clientId: process.env.VITE_COGNITO_CLIENT_ID,
      };
      
      const hasAllSecrets = config.region && config.userPoolId && config.clientId;
      
      res.json({
        message: "AWS Cognito Configuration Test",
        configured: hasAllSecrets,
        config: {
          region: config.region ? "✓ Set" : "✗ Missing",
          userPoolId: config.userPoolId ? "✓ Set" : "✗ Missing",
          clientId: config.clientId ? "✓ Set" : "✗ Missing",
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Configuration test failed" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // PayPal payment routes
  app.get("/api/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/api/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Stripe payment routes
  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd" } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: {
          userId: req.user?.claims?.sub || "anonymous",
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Checkout initialization
  app.post("/api/checkout/initialize", isAuthenticated, async (req, res) => {
    try {
      const { planId, paymentMethod } = req.body;
      
      const plans = {
        boost_listing: {
          id: "boost_listing",
          name: "Boost Listing",
          description: "Boost your listing to the top",
          price: 9.99,
          type: "premium_service",
          features: ["Priority placement", "Highlighted display", "7-day duration"]
        },
        premium_search: {
          id: "premium_search",
          name: "Premium Search",
          description: "Advanced search capabilities",
          price: 4.99,
          type: "premium_service",
          features: ["Smart alerts", "Extended radius", "Priority support"]
        },
        verification: {
          id: "verification",
          name: "Profile Verification",
          description: "Verify your profile",
          price: 14.99,
          type: "premium_service",
          features: ["Verified badge", "Increased trust", "Priority listing"]
        },
        pro: {
          id: "pro",
          name: "Pro Plan",
          description: "Perfect for regular users",
          price: 29.99,
          type: "subscription",
          features: ["Unlimited listings", "Priority support", "Analytics", "Customer support"]
        },
        advanced: {
          id: "advanced",
          name: "Advanced Plan",
          description: "For teams and businesses",
          price: 59.99,
          type: "subscription",
          features: ["Team management", "API access", "Custom branding", "Advanced analytics"]
        },
        premium: {
          id: "premium",
          name: "Premium Plan",
          description: "Full-featured enterprise solution",
          price: 99.99,
          type: "subscription",
          features: ["Unlimited everything", "Dedicated support", "White-label", "Training"]
        }
      };

      const plan = plans[planId as keyof typeof plans];
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      let clientSecret = null;
      
      if (paymentMethod === 'stripe') {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(plan.price * 100),
          currency: "usd",
          metadata: {
            planId: plan.id,
            userId: req.user?.claims?.sub || "",
            planType: plan.type,
          },
        });
        clientSecret = paymentIntent.client_secret;
      }

      res.json({
        plan,
        clientSecret,
        paymentMethod
      });
    } catch (error: any) {
      console.error("Checkout initialization error:", error);
      res.status(500).json({ error: "Failed to initialize checkout" });
    }
  });

  // Payment verification
  app.get("/api/payment/verify", isAuthenticated, async (req, res) => {
    try {
      const { payment_intent } = req.query;
      
      if (!payment_intent) {
        return res.status(400).json({ error: "Missing payment intent" });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent as string);
      
      if (paymentIntent.status === 'succeeded') {
        await storage.createOrder({
          userId: req.user?.claims?.sub || "",
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: "completed",
          paymentMethod: "stripe",
          productType: paymentIntent.metadata.planType || "unknown",
          productId: paymentIntent.metadata.planId || "unknown",
          metadata: paymentIntent.metadata,
        });

        res.json({
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          product: paymentIntent.metadata.planId || "Unknown"
        });
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Admin routes
  app.get("/api/admin/revenue", isAuthenticated, async (req, res) => {
    try {
      const period = req.query.period as string || "30d";
      const stats = await storage.getRevenueStats(period);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching revenue stats:", error);
      res.status(500).json({ error: "Failed to fetch revenue stats" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getPayingUsers();
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  app.get("/api/admin/orders", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getOrdersStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching order stats:", error);
      res.status(500).json({ error: "Failed to fetch order stats" });
    }
  });

  app.get("/api/admin/translations", isAuthenticated, async (req, res) => {
    try {
      const translationsData = {
        completionRate: 95,
        missingTranslations: 12,
        languages: [
          { code: "fr", name: "Français", completionRate: 100, missingKeys: 0, lastUpdate: new Date() },
          { code: "en", name: "English", completionRate: 100, missingKeys: 0, lastUpdate: new Date() },
          { code: "es", name: "Español", completionRate: 98, missingKeys: 3, lastUpdate: new Date() },
          { code: "pt", name: "Português", completionRate: 96, missingKeys: 5, lastUpdate: new Date() },
          { code: "it", name: "Italiano", completionRate: 94, missingKeys: 8, lastUpdate: new Date() },
          { code: "de", name: "Deutsch", completionRate: 92, missingKeys: 12, lastUpdate: new Date() },
          { code: "nl", name: "Nederlands", completionRate: 90, missingKeys: 15, lastUpdate: new Date() },
          { code: "zh", name: "中文", completionRate: 85, missingKeys: 25, lastUpdate: new Date() },
          { code: "ja", name: "日本語", completionRate: 80, missingKeys: 35, lastUpdate: new Date() },
          { code: "ko", name: "한국어", completionRate: 75, missingKeys: 45, lastUpdate: new Date() },
        ]
      };
      
      res.json(translationsData);
    } catch (error: any) {
      console.error("Error fetching translation stats:", error);
      res.status(500).json({ error: "Failed to fetch translation stats" });
    }
  });

  app.post("/api/admin/refund", isAuthenticated, async (req, res) => {
    try {
      const { orderId, amount, reason } = req.body;
      
      if (!orderId || !amount || !reason) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const success = await storage.processRefund(orderId, amount, reason);
      
      if (success) {
        res.json({ message: "Refund processed successfully" });
      } else {
        res.status(500).json({ error: "Failed to process refund" });
      }
    } catch (error: any) {
      console.error("Error processing refund:", error);
      res.status(500).json({ error: "Failed to process refund" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
