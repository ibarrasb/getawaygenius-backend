import mongoose, { Document, Schema } from "mongoose";

// 1. Define a TypeScript interface for User
export interface IUser extends Document {
  fname: string;
  lname: string;
  email: string;
  password: string;
  role: number;
  birthday: Date;
  city: string;
  state: string;
  zip: string; // string to avoid dropping leading 0s
}

// 2. Define schema
const userSchema = new Schema<IUser>(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    birthday: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String, // switched from Number to String
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Create model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
