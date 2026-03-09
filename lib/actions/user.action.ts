'use server'

import User from "@/models/user.modal";
import File from "@/models/file.modal";    
import Folder from "@/models/folder.modal";
import dbConnect from "../dbConnect";

export const createUser = async (user: {
    email: string;
    clerkId: string;
    username: string;
    avatar: string;
}) => {
    try {
        await dbConnect();
        
        // 🚀 Mongoose default limits (storageUsed: 0) khud set kar dega
        const newUser = await User.create(user);
        console.log("✅ Action :: NEW User created", newUser._id);

        return { success: true, data: JSON.parse(JSON.stringify(newUser)) };
    } catch (error: any) {
        console.error("❌ Error creating User in database", error.message);
        return { success: false, error: error.message };
    }
}

export const deleteUser = async (clerkId: string) => {
    try {
        await dbConnect();
        
        // 1. Pehle user dhoondo aur delete karo
        const deletedUser = await User.findOneAndDelete({ clerkId: clerkId });

        if (!deletedUser) {
            console.log(`⚠️ User with Clerk ID ${clerkId} not found`);
            return { success: false, message: "User not found in database" };
        }

        // 2. 🧹 SAF SAFAYI: Us user ki saari files aur folders uda do
        await Promise.all([
            File.deleteMany({ userId: deletedUser._id }),
            Folder.deleteMany({ userId: deletedUser._id })
        ]);

        console.log(`🗑️ User ${clerkId} and their files/folders deleted permanently`);

        return { success: true, message: "User and related data deleted from database" };
    } catch (error: any) {
        console.error("❌ Error deleting User from database", error.message);
        return { success: false, message: error.message };
    }
}