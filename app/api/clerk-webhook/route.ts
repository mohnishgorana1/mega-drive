import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  console.log("⚡ WEBHOOK INIT");

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing Clerk Webhook Secret");
    return new NextResponse("Missing Clerk Webhook Secret", { status: 500 });
  }

  try {
    const payload = await req.text();
    const headerPayload = headers();

    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new NextResponse("Missing svix headers", { status: 400 });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("❌ Error verifying webhook:", err);
      return new NextResponse("Error verifying webhook", { status: 400 });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    // ✅ HANDLE user.created
    if (eventType === "user.created") {
      console.log("Creating new user in MongoDB...");

      const { email_addresses, image_url, first_name, last_name } = evt.data;

      // 🧠 SMART FALLBACK: Agar first_name null hai, toh email ka pehla hissa use karo
      const email = email_addresses[0]?.email_address;
      const fallbackName = email ? email.split("@")[0] : "Drive User";
      const username =
        `${first_name || ""} ${last_name || ""}`.trim() || fallbackName;

      const user = {
        email: email,
        clerkId: id!,
        username: username,
        avatar: image_url || "",
      };

      const result = await createUser(user);

      if (result.success && result.data) {
        // 🚀 SUPER IMPORTANT: Metadata update
        await clerkClient.users.updateUser(id as string, {
          publicMetadata: {
            userMongoId: result.data._id,
          },
        });

        console.log("✅ Clerk Metadata Updated for:", result.data._id);
        return NextResponse.json(
          { message: "New User Created", user: result.data },
          { status: 201 },
        );
      }

      return new NextResponse("Failed to create user in DB", { status: 500 });
    }

    // 🗑️ HANDLE user.deleted
    if (eventType === "user.deleted") {
      console.log("Deleting user from MongoDB...");

      if (!id) return new NextResponse("Missing Clerk ID", { status: 400 });

      const data = await deleteUser(id);

      if (data?.success) {
        return NextResponse.json(
          { message: data.message, success: true },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { message: data?.message, success: false },
          { status: 500 },
        );
      }
    }

    // 🚫 Ignore other events
    return new NextResponse(`Webhook received for event: ${eventType}`, {
      status: 200,
    });
  } catch (err: any) {
    console.error("❌ Webhook processing error:", err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 500 });
  }
}

// * OLD
// import { clerkClient } from '@clerk/nextjs/server';
// import { WebhookEvent } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';
// import { Webhook } from 'svix'
// import { headers } from 'next/headers';
// import { createUser, deleteUser } from '@/lib/actions/user.action';

// export const POST = async (req: Request) => {
//     console.log("WEBHOOK INIT");

//     const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

//     if (!WEBHOOK_SECRET) {
//         throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
//     }

//     // Get the headers
//     const headerPayload = headers()
//     const svix_id = headerPayload.get('svix-id')
//     const svix_timestamp = headerPayload.get('svix-timestamp')
//     const svix_signature = headerPayload.get('svix-signature')

//     // If there are no headers, error out
//     if (!svix_id || !svix_timestamp || !svix_signature) {
//         return new Response('Error occured -- no svix headers', {
//             status: 400,
//         })
//     }

//     // Get the body
//     const payload = await req.json()
//     const body = JSON.stringify(payload)

//     // Create a new Svix instance with your secret.
//     const wh = new Webhook(WEBHOOK_SECRET)

//     let evt: WebhookEvent

//     // Verify the payload with the headers
//     try {
//         evt = wh.verify(body, {
//             'svix-id': svix_id,
//             'svix-timestamp': svix_timestamp,
//             'svix-signature': svix_signature,
//         }) as WebhookEvent
//     } catch (err) {
//         console.error('Error verifying webhook:', err)
//         return new Response('Error occured', {
//             status: 400,
//         })
//     }

//     // Do something with the payload
//     // For this guide, you simply log the payload to the console
//     const { id } = evt.data
//     const eventType = evt.type

//     // create user in mongoDB
//     if (eventType === "user.created") {
//         console.log("creating user");

//         const { id, email_addresses, image_url, first_name, last_name } = evt.data

//         // console.log("Creating user details", id, email_addresses[0].email_address, image_url, first_name, last_name);

//         const user = {
//             clerkId: id,
//             email: email_addresses[0].email_address,
//             username: `${first_name} ${last_name}`,
//             createdAt: new Date(),
//             avatar: image_url
//         }
//         // console.log("USER", user);

//         const newUser = await createUser(user);

//         if (newUser) {
//             await clerkClient.users.updateUser(id, {
//                 publicMetadata: {
//                     userMongoId: newUser._id.toString()
//                 }
//             })
//         }
//         console.log("User created success", newUser);
//         return NextResponse.json({ message: "New User Created", user: newUser })
//     }
//     if (eventType == "user.deleted") {
//         console.log("deleting user");

//         const { id } = evt.data;
//         const data = await deleteUser(id!)

//         if (data?.success) {
//             return NextResponse.json({ message: data.message, success: true });
//         } else {
//             return NextResponse.json({ message: data?.message, success: false }, { status: 500 });
//         }

//     }

//     console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
//     console.log('Webhook body:', body)

//     return new Response('', { status: 200 })
// }
