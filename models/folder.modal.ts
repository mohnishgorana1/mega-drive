import mongoose, { Document, models, Schema } from "mongoose";
import File, { IFile } from "./file.modal"; // Import File schema

// Define the interface for the Folder document
export interface IFolder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  folderName: string;
  folderSize: number;
  parentFolderId: mongoose.Schema.Types.ObjectId | null;
  isFavourite: boolean;
  isTrashed: boolean;
  isPublic: boolean;
  shareToken?: string;
  createdAt: Date;
  updatedAt: Date;
  files: IFile[];
  folders: IFolder[];
}

// Define the Folder schema
const folderSchema = new Schema<IFolder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  folderName: {
    type: String,
    required: true,
  },
  parentFolderId: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  }, // Reference to parent folder
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  isTrashed: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  folderSize: {
    type: Number,
    default: 0,
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
  ], // Assuming File schema is embedded here
  folders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
  ], // Assuming subfolders are embedded here
});

// Create the Folder model
const Folder =
  models?.Folder || mongoose.model<IFolder>("Folder", folderSchema);

export default Folder;
