import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/src/lib/context/AppContext";
import { AuthProvider } from "@/src/lib/context/AuthContext";
import Navigation from "@/src/components/Layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Agora",
  description: "Place where philosophy debate",
  icons: {
    icon: "/images/MLNLOGO.jpg",
    shortcut: "/images/MLNLOGO.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AppProvider>
            <Navigation />
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
