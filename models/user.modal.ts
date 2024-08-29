import mongoose, { Document, models, Schema } from 'mongoose';

// Define the interface for the User document
export interface IUser extends Document {
    email: string;
    clerkId: string;
    username: string;
    avatar: string;
    createdAt: Date;
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
    avatar: {
        type: String,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },

});

// Create the User model
const User = models?.User ||  mongoose.model<IUser>('User', userSchema);

export default User;
