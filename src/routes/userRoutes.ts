import { Router } from "express";
import * as userCtrl from "../controllers/userCtrl.js";  // keep .js so emitted JS resolves
import { auth } from "../middlewares/auth.js";            // if your middleware is a default export, use: `import auth from "../middleware/auth.js"`

const router = Router();

// Register a new user
router.route("/register").post(userCtrl.register);

// Login a user
router.route("/login").post(userCtrl.login);

// Logout a user
router.route("/logout").get(userCtrl.logout);

// Refresh token
router.route("/refresh_token").get(userCtrl.refreshToken);

// Get user information (protected route)
router.route("/infor").get(auth, userCtrl.getUser);

// Get/Update profile
router
  .route("/profile/:id")
  .get(userCtrl.getLoggedUser)
  .put(userCtrl.updateUser);

export default router;
