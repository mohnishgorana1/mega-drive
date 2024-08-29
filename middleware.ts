// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const protectedRoutes = createRouteMatcher([
//     '/',
//     "/favourites",
//     "/trash",
//     "/folder"
// ])
// export default clerkMiddleware((auth, req) => {
//     if (protectedRoutes(req)) {
//         auth().protect();
//     }
// });

// export const config = {
//     matcher: [
//         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//         '/(api|trpc)(.*)',
//     ],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/api/clerk-webhook"
])


export default clerkMiddleware((auth, req) => {
    const {userId} = auth();

    const currentUrl = new URL(req.url)

     const isAccessingDashboard = currentUrl.pathname === "/"
     
    // logged in and your trying to access publicRoute 
    // but not accessingDashboard that means your accessing sign-in or sign-up so go to home page
    if(userId && isPublicRoute(req) && !isAccessingDashboard) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    // not logged in
    if (!userId) {
        // if user is not logged in and trying to access a protected route
        if(!isPublicRoute(req)){
            return NextResponse.redirect(new URL("/sign-up", req.url))
        }
    }

    return NextResponse.next();

})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}