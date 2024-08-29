import mongoose from 'mongoose';
import User, { IUser } from '../../../models/user.modal'; // Path to your User model
import dbConnect from '@/lib/dbConnect';
import { clerkClient } from '@clerk/nextjs/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix'
import { headers } from 'next/headers';
import { createUser, deleteUser } from '@/lib/actions/user.action';

export const POST = async (req: Request) => {
    console.log("WEBHOOK INIT");

    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
            status: 400,
        })
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt.data
    const eventType = evt.type

    // create user in mongoDB
    if (eventType === "user.created") {
        console.log("creating user");

        const { id, email_addresses, image_url, first_name, last_name } = evt.data


        console.log("Creating user details", id, email_addresses[0].email_address, image_url, first_name, last_name);

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: `${first_name} ${last_name}`,
            createdAt: new Date(),
            avatar: image_url
        }
        console.log("USER", user);

        const newUser = await createUser(user);

        if (newUser) {
            await clerkClient().users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser._id
                }
            })
        }
        console.log("User created success");
        return NextResponse.json({ message: "New User Created", user: newUser })
    }
    if (eventType == "user.deleted") {
        console.log("deleting user");

        const { id } = evt.data;
        const data = await deleteUser(id!)

        if (data?.success) {
            return NextResponse.json({ message: data.message, success: true });
        } else {
            return NextResponse.json({ message: data?.message, success: false }, { status: 500 });
        }

    }

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
    console.log('Webhook body:', body)

    return new Response('', { status: 200 })
}