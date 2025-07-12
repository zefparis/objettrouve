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
  // SIMPLE AUTH ROUTES - PRIORITY SETUP BEFORE OTHER ROUTES
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { signUp } = await import("./simple-auth");
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const result = await signUp(email, password, firstName, lastName);
      
      if (result.success) {
        req.session = req.session || {};
        req.session.user = result.user;
        res.json({
          message: result.message,
          user: result.user,
        });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });



  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { signIn } = await import("./simple-auth");
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const result = await signIn(email, password);
      
      if (result.success) {
        // Store user in session for authentication
        req.session = req.session || {};
        req.session.user = result.user;
        
        res.json({
          message: result.message,
          user: result.user,
        });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
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

  // Error handler for API routes
  app.use('/api/*', (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // General error handler for non-API routes
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

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
