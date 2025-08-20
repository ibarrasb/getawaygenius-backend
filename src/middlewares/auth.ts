import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// augment Express Request type to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: string | JwtPayload;
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(400).json({ msg: "Invalid Authentication" });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err, user) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        }
        req.user = user;
        next();
      }
    );
  } catch (error: any) {
    return res.status(500).json({ msg: error.message });
  }
}
