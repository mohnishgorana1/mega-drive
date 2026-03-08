import mongoose, { Document, models, Schema } from "mongoose";

// Define the interface for the File document
export interface IFile extends Document {
  fileName: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  folderId: mongoose.Schema.Types.ObjectId | null;
  isFileAtHome: boolean;
  userId: mongoose.Schema.Types.ObjectId;
  isFavourite: boolean;
  isTrashed: boolean;
  fileSize: number;
  isPublic: boolean;
  shareToken?: string;
  databaseLocations: {
    public_id: string;
    secure_url: string;
    download_url: string;
  };
}

// Define the File schema
const fileSchema = new Schema<IFile>({
  fileName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  folderId: {
    type: Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  isFileAtHome: {
    type: Boolean,
    default: true,
  },
  fileSize: {
    type: Number,
    default: 0,
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
    default: false, // Default mein private rahega
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true, // Sparse isliye taaki null values unique constraint ko na todein
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  databaseLocations: {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    download_url: {
      type: String,
      required: true,
    },
  },
});

// Create the File model
const File = models?.File || mongoose.model<IFile>("File", fileSchema);

export default File;
