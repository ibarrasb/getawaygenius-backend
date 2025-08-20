import { Router } from "express";
import * as tripCtrl from "../controllers/tripCtrl.js"; // keep .js so compiled output resolves
import { auth } from "../middlewares/auth.js";           // if middleware is still default-exported, use `import auth from ...`

const router = Router();

// Get all trips / Create a new trip
router
  .route("/getaway-trip")
  .get(tripCtrl.getTrips)
  .post(auth, tripCtrl.createTrips);

// Get favorite trips
router.route("/favorites").get(tripCtrl.getFavoriteTrips);

// Get / Update / Delete a specific trip
router
  .route("/getaway/:id")
  .get(tripCtrl.getSpecificTrip)
  .put(auth, tripCtrl.updateTrip)   // protected update
  .delete(auth, tripCtrl.deleteTrip);

export default router;
