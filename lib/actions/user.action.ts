'use server'

import User, { IUser } from "@/models/user.modal"
import dbConnect from "../dbConnect"


export const createUser = async (user: {
    email: string;
    clerkId: string;
    username: string;
    avatar: string;
    createdAt: Date;
}) => {
    try {
        // console.log("Creating User");

        await dbConnect();
        // console.log("DB CONNECTED now create user");


        const newUser = await User.create(user)
        console.log("Action ::NEW  User created", newUser);

        return JSON.parse(JSON.stringify(newUser))

    } catch (error) {
        console.log("Error creating User to database", error);
    }
}

export const deleteUser = async (clerkId: string) => {
    try {
        await dbConnect();
        const result = await User.findOneAndDelete({ clerkId: clerkId });

        if (!result) {
            console.log(`User with Clerk ID ${clerkId} not found in database`);
            return { success: false, message: "User not found in database" };
        }

        console.log(`User with Clerk ID ${clerkId} deleted from database`);

        return { success: true, message: "User Deleted from database" };
    } catch (error) {
        console.log("Error deleting User from database", error);

    }
}