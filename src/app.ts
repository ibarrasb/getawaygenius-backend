import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

/**
 * Build and return the Express app.
 * Kept async so we can await dynamic route imports.
 */
export async function createApp() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      // In prod, consider setting a specific origin via CLIENT_ORIGIN
      origin: (process.env.CLIENT_ORIGIN as string | boolean) || true,
      credentials: true,
    })
  );

  // Helpful behind proxies (Heroku/Render) for secure cookies, req.ip, etc.
  app.set("trust proxy", 1);

  // Import routes AFTER dotenv has populated process.env
  const externalRoutes = (await import("./routes/externalRoutes.js")).default;
  const tripsRouter    = (await import("./routes/tripsRoutes.js")).default;
  const usersRouter    = (await import("./routes/userRoutes.js")).default;
  const wishlistRoutes = (await import("./routes/wishlistRoutes.js")).default;

  // Routes (API first)
  app.use("/api", externalRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/trips", tripsRouter);
  app.use("/api/user", usersRouter);

  // Healthcheck
  app.get("/health", (_req: Request, res: Response) => res.status(200).send("ok"));

  // ❗Since this repo is backend-only, we’re not serving a client build.
  // If you ever need to serve /client/dist again, add that block here.

  return app;
}
