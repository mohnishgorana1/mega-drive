import mongoose, { Document, models, Schema } from 'mongoose';
import File, { IFile } from './file.modal'; // Import File schema

// Define the interface for the Folder document
export interface IFolder extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    folderName: string;
    parentFolderId: mongoose.Schema.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
    files: IFile[];
    folders: IFolder[];
}

// Define the Folder schema
const folderSchema = new Schema<IFolder>({
    userId: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    folderName: {
        type: String,
        required: true
    },
    parentFolderId: {
        type: Schema.Types.ObjectId,
        ref: 'Folder',
        default: null
    }, // Reference to parent folder
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    files: [
        {
            type: Schema.Types.Mixed
        }
    ], // Assuming File schema is embedded here
    folders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Folder"
        }
    ] // Assuming subfolders are embedded here
});

// Create the Folder model
const Folder = models?.Folder || mongoose.model<IFolder>('Folder', folderSchema);

export default Folder;
