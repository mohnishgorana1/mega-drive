import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the File document
export interface IFile extends Document {
    fileName: string;
    format: string;
    createdAt: Date;
    updatedAt: Date;
    databaseLocations: {
        public_URL: string;
        secure_URL: string;
    };
}

// Define the File schema
const fileSchema = new Schema<IFile>({
    fileName: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    databaseLocations: {
        public_URL: {
            type: String,
            required: true
        },
        secure_URL: {
            type: String,
            required: true
        }

    }
});

// Create the File model
const File = mongoose.model<IFile>('File', fileSchema);

export default File;
