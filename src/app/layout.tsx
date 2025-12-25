
import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import Script from "next/script";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Crypto Ice",
  description: "Enter your key to access Crypto Ice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          {children}
        </FirebaseClientProvider>
        <Toaster />
        <Script src="https://pl25926239.effectivegatecpm.com/d2/20/43/d22043fbad386d7312181659070a47e0.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
