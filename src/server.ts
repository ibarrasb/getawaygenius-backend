// Load .env only in development (Heroku/Render use config vars)
if (process.env.NODE_ENV !== "production") {
    const { default: dotenv } = await import("dotenv");
    dotenv.config();
  }
  
  import mongoose from "mongoose";
  import { createApp } from "./app.js";
  
  const PORT = Number(process.env.PORT) || 5001;
  const MONGO_URI = process.env.MONGODB_URL as string;
  
  (async () => {
    try {
      if (!MONGO_URI) throw new Error("MONGODB_URL not set");
  
      await mongoose.connect(MONGO_URI);
      console.log("Connected to MongoDB");
  
      const app = await createApp();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Startup error:", msg);
      process.exit(1);
    }
  })();
  