import { Router } from "express";
import * as wishCtrl from "../controllers/wishlistCtrl.js"; // keep .js so compiled output resolves
import { auth } from "../middlewares/auth.js";           // not used yet, but available

const router = Router();

// Routes for managing wishlists (paths unchanged)
router.route("/createlist").post(wishCtrl.createWishlist);

router.route("/getlists").get(wishCtrl.fetchLists);

router.route("/spec-wishlist/:id").get(wishCtrl.fetchWishlist);

router.route("/editlist/:id").put(wishCtrl.updateList);

router.route("/addtrip/:id").post(wishCtrl.addTripToWishlist);

router
  .route("/:wishlistId/remove-trip/:tripId")
  .delete(wishCtrl.removeTripFromWishlist);

router.route("/removewishlist/:id").delete(wishCtrl.removeWishlist);

export default router;
