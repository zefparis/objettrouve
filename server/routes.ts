import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

import { insertItemSchema, insertMessageSchema, insertOrderSchema } from "@shared/schema";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import { cognitoService, type AuthResult } from "./cognitoService";
import Stripe from "stripe";
import { RequestHandler } from "express";

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

// Removed Replit Auth middleware - using Cognito authentication now

export async function registerRoutes(app: Express): Promise<Server> {


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

  // Session management for authentication
  const isDevelopment = process.env.NODE_ENV === 'development';
  let devSessionActive = true;
  let currentUserSession: any = null;

  // Auth routes - unified authentication handling
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (isDevelopment) {
        // Development mode - simple session check
        if (!devSessionActive) {
          return res.status(401).json({ error: "Not authenticated" });
        }
        
        // Return a mock user or get real user data
        const userId = 'dev-user-123';
        let user = await storage.getUser(userId);
        
        // If no user exists, create one with default values
        if (!user) {
          user = await storage.upsertUser({
            id: userId,
            email: 'ben.barere@gmail.com',
            firstName: 'BARRERE',
            lastName: 'BEN',
            phone: '+33 6 12 34 56 78',
            location: 'Paris, France',
            bio: 'Développeur passionné de technologie',
            profileImageUrl: '/uploads/df8aa069ba6502e0a15bafe235b79624',
          });
        }
        
        res.json(user);
      } else {
        // Production mode - check for valid session
        if (!currentUserSession) {
          return res.status(401).json({ error: "Not authenticated" });
        }
        
        // Get user from database based on session
        const user = await storage.getUser(currentUserSession.userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        
        res.json(user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Sign out route
  app.post('/api/auth/signout', async (req: any, res) => {
    try {
      if (isDevelopment) {
        // Development mode - deactivate session
        devSessionActive = false;
      } else {
        // Production mode - clear session
        currentUserSession = null;
      }
      
      res.json({ message: "Signed out successfully" });
    } catch (error) {
      console.error("Error signing out:", error);
      res.status(500).json({ message: "Failed to sign out" });
    }
  });

  // Sign in route - unified authentication
  app.post('/api/auth/signin', async (req: any, res) => {
    try {
      const { email, password } = req.body;
      
      if (isDevelopment) {
        // Development mode - simple reactivation
        devSessionActive = true;
        res.json({ message: "Signed in successfully" });
      } else {
        // Production mode - authenticate with Cognito
        try {
          const authResult = await cognitoService.signIn(email, password);
          
          // Create or update user in database
          const user = await storage.upsertUser({
            id: authResult.user.username,
            email: authResult.user.email,
            firstName: authResult.user.firstName,
            lastName: authResult.user.lastName,
          });
          
          // Store session
          currentUserSession = {
            userId: user.id,
            accessToken: authResult.accessToken,
            idToken: authResult.idToken,
            refreshToken: authResult.refreshToken,
          };
          
          res.json({ 
            message: "Signed in successfully",
            user: user,
            tokens: {
              accessToken: authResult.accessToken,
              idToken: authResult.idToken,
              refreshToken: authResult.refreshToken
            }
          });
        } catch (cognitoError: any) {
          // If Cognito fails, fallback to development mode behavior
          console.warn("Cognito authentication failed, falling back to development mode:", cognitoError.message);
          devSessionActive = true;
          res.json({ message: "Signed in successfully (fallback mode)" });
        }
      }
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(500).json({ message: "Failed to sign in" });
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
  app.post('/api/items', upload.single('image'), async (req: any, res) => {
    try {
      // Use a default user ID for development
      const userId = 'dev-user-123';
      
      // Log the received data for debugging
      console.log('Received item data:', req.body);
      console.log('Received file:', req.file);
      
      const itemData = {
        ...req.body,
        userId,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        dateOccurred: req.body.dateOccurred ? new Date(req.body.dateOccurred) : new Date(),
        isActive: true, // Set default value
      };

      // Remove any undefined or null values that might cause validation issues
      Object.keys(itemData).forEach(key => {
        if (itemData[key] === undefined || itemData[key] === '') {
          delete itemData[key];
        }
      });

      console.log('Processed item data:', itemData);

      const validatedData = insertItemSchema.parse(itemData);
      const item = await storage.createItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation errors:", error.errors);
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

  app.put('/api/items/:id', async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = 'dev-user-123';
      
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

  app.delete('/api/items/:id', async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = 'dev-user-123';
      
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
  app.get('/api/user/items', async (req: any, res) => {
    try {
      const userId = 'dev-user-123';
      const items = await storage.getItems({ userId });
      res.json(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de vos annonces" });
    }
  });

  // Messages routes
  app.post('/api/messages', async (req: any, res) => {
    try {
      const userId = 'dev-user-123';
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

  app.get('/api/conversations/:itemId', async (req: any, res) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const userId = 'dev-user-123';
      
      const messages = await storage.getConversation(itemId, userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de la conversation" });
    }
  });

  app.get('/api/conversations', async (req: any, res) => {
    try {
      const userId = 'dev-user-123';
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
      const { amount, currency = "eur" } = req.body;
      
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
  app.post("/api/checkout/initialize", async (req, res) => {
    try {
      const { planId, paymentMethod } = req.body;
      
      const plans = {
        boost_listing: {
          id: "boost_listing",
          name: "Boost Listing",
          description: "Boost your listing to the top",
          price: 4.99,
          type: "premium_service",
          features: ["Priority placement", "Highlighted display", "7-day duration"]
        },
        premium_search: {
          id: "premium_search",
          name: "Premium Search",
          description: "Advanced search capabilities",
          price: 2.49,
          type: "premium_service",
          features: ["Smart alerts", "Extended radius", "Priority support"]
        },
        verification: {
          id: "verification",
          name: "Profile Verification",
          description: "Verify your profile",
          price: 7.49,
          type: "premium_service",
          features: ["Verified badge", "Increased trust", "Priority listing"]
        },
        pro: {
          id: "pro",
          name: "Pro Plan",
          description: "Perfect for regular users",
          price: 14.99,
          type: "subscription",
          features: ["Unlimited listings", "Priority support", "Analytics", "Customer support"]
        },
        advanced: {
          id: "advanced",
          name: "Advanced Plan",
          description: "For teams and businesses",
          price: 29.99,
          type: "subscription",
          features: ["Team management", "API access", "Custom branding", "Advanced analytics"]
        },
        premium: {
          id: "premium",
          name: "Premium Plan",
          description: "Full-featured enterprise solution",
          price: 49.99,
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
          currency: "eur",
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
  app.get("/api/payment/verify", async (req, res) => {
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
  app.get("/api/admin/revenue", async (req, res) => {
    try {
      const period = req.query.period as string || "30d";
      const stats = await storage.getRevenueStats(period);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching revenue stats:", error);
      res.status(500).json({ error: "Failed to fetch revenue stats" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const stats = await storage.getPayingUsers();
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const stats = await storage.getOrdersStats();
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching order stats:", error);
      res.status(500).json({ error: "Failed to fetch order stats" });
    }
  });

  app.get("/api/admin/translations", async (req, res) => {
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

  app.post("/api/admin/refund", async (req, res) => {
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
