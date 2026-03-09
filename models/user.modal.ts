import mongoose, { Document, models, Schema } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  email: string;
  clerkId: string;
  username: string;
  avatar: string;
  storageUsed: number;
  storageLimit: number;
  createdAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  storageUsed: {
    type: Number,
    default: 0, // Start with 0 bytes used
  },
  storageLimit: {
    type: Number,
    default: 524288000, // 500 MB limit in bytes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = models?.User || mongoose.model<IUser>("User", userSchema);

export default User;
