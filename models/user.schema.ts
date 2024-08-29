import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the User document
export interface IUser extends Document {
    email: string;
    clerkId: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    clerkId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    username: { 
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
    }
});

// Create the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
