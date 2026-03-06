import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: "MDrive",
  description: "Simplify Your Storage."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#0A84FF", // Updated to iOS Blue
          colorBackground: "transparent",
          colorInputBackground: "rgba(255, 255, 255, 0.05)",
          colorInputText: "#ffffff",
          borderRadius: "1rem", // 16px curve for Clerk inputs
          fontSize: "16px"
        },
      }}>
      <html lang="en">
        {/* Changed background to dark-100 (pure black) for maximum contrast with glass panels */}
        <body className={cn('min-h-screen bg-dark-100 font-sans antialiased selection:bg-blue-500/30 text-white', fontSans.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" // Forced to dark as requested
            enableSystem={false}
          >
              {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}