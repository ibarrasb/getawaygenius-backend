import mongoose, { Schema, Types, Document } from "mongoose";

export interface IWishlist extends Document {
  list_name: string;
  trips: Types.ObjectId[];           // refs to Trip
  email: string;                     // owner
  createdAt?: Date;
  updatedAt?: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    list_name: { type: String, required: true, trim: true },
    trips: [{ type: Schema.Types.ObjectId, ref: "Trip", default: [] }],
    email: { type: String, required: true, index: true }
  },
  { timestamps: true }
);

// Optional: prevent duplicate list names per user
wishlistSchema.index({ email: 1, list_name: 1 }, { unique: true });

export default mongoose.model<IWishlist>("Wishlist", wishlistSchema);
