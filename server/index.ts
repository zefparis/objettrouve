import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

// DIRECT AUTH ROUTES - HOTFIX
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
      message = "Cet email est déjà utilisé";
    } else if (error.name === 'InvalidPasswordException') {
      message = "Le mot de passe ne respecte pas les critères requis";
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
      message = "Veuillez confirmer votre email avant de vous connecter";
    }
    
    res.status(400).json({ message });
  }
});

(async () => {
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
