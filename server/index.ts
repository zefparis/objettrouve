import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

declare module 'express-session' {
  interface SessionData {
    user?: any;
    tokens?: any;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // DIRECT AUTH ROUTES - PRIORITY SETUP BEFORE OTHER ROUTES
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { signUp } = await import("./auth");
      const { email, password, firstName, lastName, phone } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const result = await signUp({ email, password, firstName, lastName, phone });
      
      res.json({
        message: "Inscription réussie. Vérifiez votre email pour le code de confirmation.",
        userSub: result.userSub,
        codeDeliveryDetails: result.codeDeliveryDetails,
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      let message = "Erreur lors de l'inscription";
      if (error.name === 'UsernameExistsException') {
        message = "Cet email est déjà utilisé. Essayez de vous connecter ou de réinitialiser votre mot de passe.";
      } else if (error.name === 'InvalidPasswordException') {
        message = "Le mot de passe ne respecte pas les critères requis";
      }
      
      res.status(400).json({ message });
    }
  });

  // Route pour renvoyer le code de confirmation
  app.post('/api/auth/resend-code', async (req, res) => {
    try {
      const { resendConfirmationCode } = await import("./auth");
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email requis" });
      }

      const result = await resendConfirmationCode(email);
      
      res.json({
        message: "Code de confirmation renvoyé. Vérifiez votre email.",
        codeDeliveryDetails: result,
      });
    } catch (error: any) {
      console.error("Resend code error:", error);
      
      let message = "Erreur lors de l'envoi du code";
      if (error.name === 'UserNotFoundException') {
        message = "Utilisateur non trouvé";
      } else if (error.name === 'InvalidParameterException') {
        message = "Utilisateur déjà confirmé";
      }
      
      res.status(400).json({ message });
    }
  });

  // Route pour confirmer l'inscription
  app.post('/api/auth/confirm-signup', async (req, res) => {
    try {
      const { confirmSignUp } = await import("./auth");
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ message: "Email et code requis" });
      }

      await confirmSignUp(email, code);
      
      res.json({
        message: "Compte confirmé avec succès. Vous pouvez maintenant vous connecter.",
      });
    } catch (error: any) {
      console.error("Confirm signup error:", error);
      
      let message = "Erreur lors de la confirmation";
      if (error.name === 'CodeMismatchException') {
        message = "Code de confirmation invalide";
      } else if (error.name === 'ExpiredCodeException') {
        message = "Code de confirmation expiré";
      }
      
      res.status(400).json({ message });
    }
  });

  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { signIn } = await import("./auth");
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const result = await signIn(email, password);
      
      // Store user in session for authentication
      req.session = req.session || {};
      req.session.user = result.user;
      req.session.tokens = result.tokens;
      
      res.json({
        message: "Connexion réussie",
        user: result.user,
        tokens: result.tokens,
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      let message = "Erreur lors de la connexion";
      if (error.name === 'NotAuthorizedException') {
        message = "Email ou mot de passe incorrect";
      } else if (error.name === 'UserNotConfirmedException') {
        message = "Votre compte n'est pas encore confirmé. Vérifiez votre email pour le code de confirmation.";
      }
      
      res.status(400).json({ message });
    }
  });

  // Route pour récupérer l'utilisateur authentifié
  app.get('/api/auth/user', async (req, res) => {
    try {
      if (!req.session?.user) {
        return res.status(401).json({ error: "Non authentifié" });
      }
      
      res.json(req.session.user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Route pour déconnexion
  app.post('/api/auth/signout', async (req, res) => {
    try {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destruction error:", err);
            return res.status(500).json({ error: "Erreur lors de la déconnexion" });
          }
          res.json({ message: "Déconnexion réussie" });
        });
      } else {
        res.json({ message: "Déconnexion réussie" });
      }
    } catch (error) {
      console.error("Signout error:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Setup API routes after direct auth routes
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
