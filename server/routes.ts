import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertItemSchema, insertMessageSchema } from "@shared/schema";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import { cognitoService, type AuthResult } from "./cognitoService";

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

  const httpServer = createServer(app);
  return httpServer;
}
