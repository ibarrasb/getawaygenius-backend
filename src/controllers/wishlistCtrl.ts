import { Request, Response } from "express";
import Wishlist from "../models/wishlistModels.js"; // keep .js (compiled output)

// Create a new wishlist
export const createWishlist = async (req: Request, res: Response) => {
  try {
    const { list_name, trips, email } = req.body as {
      list_name: string;
      trips?: any[];   // TODO: replace `any` with your Trip type if you have one
      email: string;
    };

    const wishlist = new Wishlist({ list_name, trips, email });
    await wishlist.save();
    res.json({ msg: "Created a wishlist" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

// Fetch all wishlists
export const fetchLists = async (req: Request, res: Response) => {
  try {
    const user_email = req.query.email as string | undefined;
    const wishlists = await Wishlist.find({ email: user_email });
    res.status(200).json(wishlists);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// Update an existing wishlist
export const updateList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { list_name, trips } = req.body as {
      list_name?: string;
      trips?: any[]; // TODO: replace with your Trip type
    };

    const wishlist = await Wishlist.findByIdAndUpdate(
      id,
      { list_name, trips },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// Add a trip to an existing wishlist
export const addTripToWishlist = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }; // Wishlist ID
  const trip = req.body as Record<string, unknown>; // Trip object (replace with typed Trip if available)

  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      id,
      { $push: { trips: trip } },
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({
      message: "Trip added to wishlist successfully",
      wishlist: updatedWishlist,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error adding trip to wishlist", error: error.message });
  }
};

// Remove a trip from an existing wishlist
export const removeTripFromWishlist = async (req: Request, res: Response) => {
  const { wishlistId, tripId } = req.params as { wishlistId: string; tripId: string };

  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      wishlistId,
      { $pull: { trips: { _id: tripId } } },
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({ message: "Wishlist or trip not found" });
    }

    res
      .status(200)
      .json({ message: "Trip removed from wishlist successfully", updatedWishlist });
  } catch (error: any) {
    res.status(500).json({ message: "Error removing trip from wishlist", error: error.message });
  }
};

// Remove an entire wishlist
export const removeWishlist = async (req: Request, res: Response) => {
  try {
    await Wishlist.findByIdAndDelete((req.params as { id: string }).id);
    res.json({ msg: "Deleted a Wishlist" });
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

// Fetch one wishlist by ID
export const fetchWishlist = async (req: Request, res: Response) => {
  try {
    const detailedWishlist = await Wishlist.findById((req.params as { id: string }).id);
    res.json(detailedWishlist);
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};
