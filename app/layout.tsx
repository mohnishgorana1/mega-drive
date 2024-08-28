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
  title: "Mega Drive",
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
          colorPrimary: "#3371ff",
          fontSize: "16px"
        },
      }}>

      <html lang="en">
        <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
          >
              {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
