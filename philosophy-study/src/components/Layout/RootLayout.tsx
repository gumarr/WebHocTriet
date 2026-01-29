"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "@/src/lib/context/AppContext";
import Navigation from "./Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted] = useState(true);

  if (!isMounted) {
    return null;
  }

  return (
    <html lang="vi">
      <head>
        <title>The Agora</title>
        <meta
          name="description"
          content="Hệ thống ôn tập triết học Mác - Lênin"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
        <AppProvider>
          <div className="philosophy-theme min-h-screen">
            <Navigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#fff",
                  color: "#333",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
