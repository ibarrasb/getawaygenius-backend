import mongoose, { Document, Schema } from "mongoose";

// 1. Define the TypeScript interface
export interface ITrip extends Document {
  user_email: string;
  location_address: string;
  image_url: string;
  isFavorite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define the schema
const tripSchema = new Schema<ITrip>(
  {
    user_email: { type: String, required: true },
    location_address: { type: String, required: true },
    image_url: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// 3. Export the model
const Trip = mongoose.model<ITrip>("Trip", tripSchema);
export default Trip;
