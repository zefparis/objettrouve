import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { signUp, signIn, type AuthResult } from "./simple-auth";
import { insertItemSchema, insertMessageSchema, insertOrderSchema } from "@shared/schema";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import { getClientToken, createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { nanoid } from "nanoid";
import fs from "fs";
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

// Session management is now handled by express-session middleware

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple Authentication routes
  
  // Sign up new user
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const result = await signUp(email, password, firstName, lastName);
      
      // Check if signup was successful
      if (!result.success || !result.user) {
        return res.status(400).json({ message: result.message });
      }
      
      // Store user ID in session
      req.session.userId = result.user.id;
      req.session.user = result.user;
      
      res.json({
        message: result.message,
        user: result.user,
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Sign in
  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const result = await signIn(email, password);
      
      // Check if signin was successful
      if (!result.success || !result.user) {
        return res.status(400).json({ message: result.message });
      }
      
      // Store user ID in session
      req.session.userId = result.user.id;
      req.session.user = result.user;

      res.json({
        message: result.message,
        user: result.user,
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Get current user
  app.get('/api/auth/user', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const user = await storage.getAuthUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" });
      }
      
      res.json(user);
    } catch (error: any) {
      console.error("Get user error:", error);
      res.status(401).json({ error: "Session invalide" });
    }
  });

  // Sign out
  app.post('/api/auth/signout', async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
        }
      });
      
      res.json({ message: "Déconnexion réussie" });
    } catch (error: any) {
      console.error("Sign out error:", error);
      res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
  });

  // User profile routes
  app.get('/api/profile', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const user = await storage.getAuthUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
  });

  app.put('/api/profile', upload.single('profileImage'), async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const { firstName, lastName, phone, location, bio } = req.body;
      const userId = req.session.userId;

      const updates: any = {
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        location: location || null,
        bio: bio || null,
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

      // Update user profile using direct update instead of upsert
      const updateResult = await storage.updateAuthUser(userId, updates);
      
      if (!updateResult) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      res.json(updateResult);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du profil" });
    }
  });

  // Items routes
  app.post('/api/items', upload.single('image'), async (req: any, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const userId = req.session.userId;
      
      const itemData = {
        ...req.body,
        userId,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        dateOccurred: req.body.dateOccurred ? new Date(req.body.dateOccurred) : new Date(),
        isActive: true,
      };

      // Remove any undefined or null values that might cause validation issues
      Object.keys(itemData).forEach(key => {
        if (itemData[key] === undefined || itemData[key] === '') {
          delete itemData[key];
        }
      });
      
      // Ensure required fields are present
      if (!itemData.type || !itemData.title || !itemData.description || !itemData.category || !itemData.location) {
        return res.status(400).json({ 
          message: "Champs obligatoires manquants: type, titre, description, catégorie, et lieu sont requis" 
        });
      }

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

  app.put('/api/items/:id', upload.single('image'), async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const id = parseInt(req.params.id);
      const userId = req.session.userId;
      
      const updates: any = {
        ...req.body,
        dateOccurred: req.body.dateOccurred ? new Date(req.body.dateOccurred) : undefined,
      };

      if (req.file) {
        updates.imageUrl = `/uploads/${req.file.filename}`;
      }

      // Remove undefined values
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });

      const updatedItem = await storage.updateItem(id, updates);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Annonce non trouvée" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'annonce" });
    }
  });

  app.delete('/api/items/:id', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const id = parseInt(req.params.id);
      const userId = req.session.userId;
      
      const deleted = await storage.deleteItem(id, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Annonce non trouvée ou non autorisée" });
      }
      
      res.json({ message: "Annonce supprimée avec succès" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'annonce" });
    }
  });

  // User-specific routes
  app.get('/api/user/items', async (req: any, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const userId = req.session.userId;
      const items = await storage.getItems({ userId });
      res.json(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des annonces" });
    }
  });

  // Conversations routes
  app.get('/api/conversations', async (req: any, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      const userId = req.session.userId;
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

  // PayPal routes
  app.post('/api/paypal/create-order', createPaypalOrder);
  app.post('/api/paypal/capture-order', capturePaypalOrder);
  app.get('/api/paypal/client-token', async (req, res) => {
    try {
      const clientToken = await getClientToken();
      res.json({ client_token: clientToken });
    } catch (error) {
      console.error('Error generating PayPal client token:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du token PayPal' });
    }
  });

  // Stripe routes
  app.post('/api/stripe/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency = 'eur' } = req.body;
      
      if (!amount || amount < 50) {
        return res.status(400).json({ error: 'Le montant minimum est de 0.50€' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Amount in cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Erreur lors de la création du paiement' });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const stats = await storage.getStats();
      const orders = await storage.getOrders();
      const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
      
      res.json({
        totalUsers: stats.users,
        totalItems: stats.totalItems,
        totalOrders: orders.length,
        totalRevenue: totalRevenue / 100, // Convert from cents to euros
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  app.post('/api/admin/users/:id/toggle', async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      const user = await storage.updateAuthUser(id, { isActive });
      res.json(user);
    } catch (error) {
      console.error("Error toggling user status:", error);
      res.status(500).json({ message: "Erreur lors de la modification du statut utilisateur" });
    }
  });

  app.get('/api/admin/items', async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching admin items:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des objets" });
    }
  });

  app.post('/api/admin/items/:id/toggle', async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      const item = await storage.updateItem(parseInt(id), { isActive });
      res.json(item);
    } catch (error) {
      console.error("Error toggling item status:", error);
      res.status(500).json({ message: "Erreur lors de la modification du statut de l'objet" });
    }
  });

  app.delete('/api/admin/items/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      const success = await storage.deleteItem(parseInt(id), "admin");
      if (success) {
        res.json({ message: "Objet supprimé avec succès" });
      } else {
        res.status(404).json({ message: "Objet non trouvé" });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'objet" });
    }
  });

  app.get('/api/admin/orders', async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
    }
  });

  app.post('/api/admin/orders/:id/refund', async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;
      
      const success = await storage.processRefund(parseInt(id), amount, reason);
      if (success) {
        res.json({ message: "Remboursement traité avec succès" });
      } else {
        res.status(404).json({ message: "Commande non trouvée" });
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      res.status(500).json({ message: "Erreur lors du traitement du remboursement" });
    }
  });

  app.get('/api/admin/revenue', async (req, res) => {
    try {
      const { period = '30d' } = req.query;
      const revenueData = await storage.getRevenueStats(period as string);
      res.json(revenueData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des revenus" });
    }
  });

  app.get('/api/admin/paying-users', async (req, res) => {
    try {
      const payingUsers = await storage.getPayingUsers();
      res.json(payingUsers);
    } catch (error) {
      console.error("Error fetching paying users:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs payants" });
    }
  });

  app.get('/api/admin/analytics', async (req, res) => {
    try {
      const { period = '30d' } = req.query;
      
      const stats = await storage.getStats();
      const categoryStats = await storage.getCategoryStats();
      
      // Mock analytics data - in real app, this would come from database
      const analytics = {
        activeUsers: stats.users,
        newUsers: Math.floor(stats.users * 0.2), // 20% new users
        newItems: Math.floor(stats.totalItems * 0.3), // 30% new items
        successRate: 85, // 85% success rate
        topCategories: categoryStats.slice(0, 5).map(cat => ({
          name: cat.category,
          count: cat.count
        })),
        recentActivity: [
          { type: 'user', description: 'Nouvel utilisateur inscrit', timestamp: '2 minutes ago' },
          { type: 'item', description: 'Objet publié: Téléphone perdu', timestamp: '5 minutes ago' },
          { type: 'message', description: 'Message envoyé sur un objet', timestamp: '10 minutes ago' },
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des analyses" });
    }
  });

  app.get('/api/admin/settings', async (req, res) => {
    try {
      // Mock settings - in real app, this would come from database
      const settings = {
        siteName: "Objets Perdus",
        siteDescription: "Plateforme communautaire pour retrouver les objets perdus",
        adminEmail: "congo.gaming.rdc@gmail.com",
        maintenanceMode: false,
        userRegistration: true,
        emailNotifications: true,
        maxFileSize: 5,
        autoDeleteDays: 90,
        moderationEnabled: true,
        contactEmail: "contact@ia-solution.fr",
        supportPhone: "+33 620478241",
        privacyPolicy: "Politique de confidentialité...",
        termsOfService: "Conditions d'utilisation...",
        backupEnabled: true,
        backupFrequency: "daily",
      };
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des paramètres" });
    }
  });

  app.put('/api/admin/settings', async (req, res) => {
    try {
      const settings = req.body;
      
      // Mock update - in real app, this would update database
      console.log("Updating settings:", settings);
      
      res.json({ message: "Paramètres mis à jour avec succès" });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}