import { Request, Response } from "express";
import Users from "../models/userModels.js"; // keep .js (compiled output)
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// ---- Types
type TokenPayload = { id: string };
type JWTPayload = JwtPayload & TokenPayload;

// augment Request.user if your auth middleware sets it
declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload | JWTPayload;
  }
}

// ---- Helpers to create tokens
const createAccessToken = (user: TokenPayload) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "1d" } as SignOptions);

const createRefreshToken = (user: TokenPayload) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" } as SignOptions);

// POST /api/user/register
export const register = async (req: Request, res: Response) => {
  try {
    const { fname, lname, email, password, birthday, city, state, zip } = req.body as {
      fname: string;
      lname: string;
      email: string;
      password: string;
      birthday?: string;
      city?: string;
      state?: string;
      zip?: string;
    };

    const existing = await Users.findOne({ email });
    if (existing) return res.status(400).json({ msg: "This email already exists" });

    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new Users({
      fname,
      lname,
      email,
      password: passwordHash,
      birthday,
      city,
      state,
      zip,
    });

    await newUser.save();

    const accesstoken = createAccessToken({ id: String(newUser._id) });
    const refreshtoken = createRefreshToken({ id: String(newUser._id) });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/api/user/refresh_token",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      // maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accesstoken });
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// POST /api/user/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await Users.findOne({ email }).lean();
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    // user.password is hashed
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

    const accesstoken = createAccessToken({ id: String(user._id) });
    const refreshtoken = createRefreshToken({ id: String(user._id) });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/api/user/refresh_token",
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      // maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accesstoken });
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// GET /api/user/logout
export const logout = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/user/refresh_token" });
    return res.json({ msg: "Logged out" });
  } catch (error: any) {
    return res.status(500).json({ msg: error.message });
  }
};

// GET /api/user/refresh_token
export const refreshToken = (req: Request, res: Response) => {
  try {
    const rf_token = req.cookies?.refreshtoken as string | undefined;
    if (!rf_token) return res.status(400).json({ msg: "No Cookies Saved" });

    jwt.verify(
      rf_token,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err, user) => {
        if (err) return res.status(400).json({ msg: "Verify error" });
        const payload = user as JWTPayload;
        const accesstoken = createAccessToken({ id: String(payload.id ?? payload.sub) });
        res.json({ accesstoken });
      }
    );
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// GET /api/user/infor   (protected; needs auth to set req.user.id)
export const getUser = async (req: Request, res: Response) => {
  try {
    const uid = (req.user as TokenPayload | undefined)?.id;
    if (!uid) return res.status(401).json({ msg: "Unauthorized" });

    const user = await Users.findById(uid).select("-password");
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ msg: error.message });
  }
};

// GET /api/user/profile/:id
export const getLoggedUser = async (req: Request, res: Response) => {
  try {
    const detailedUser = await Users.findById(req.params.id);
    res.json(detailedUser);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// PUT /api/user/profile/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { fname, lname, birthday, city, state, zip } = req.body as {
      fname?: string;
      lname?: string;
      birthday?: string;
      city?: string;
      state?: string;
      zip?: string;
    };

    await Users.findOneAndUpdate(
      { _id: req.params.id },
      { fname, lname, birthday, city, state, zip },
      { new: true }
    );

    res.json({ msg: "Updated User" });
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};
