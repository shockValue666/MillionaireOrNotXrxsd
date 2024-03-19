export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import db from '../lib/supabase/db';
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";
db;
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import AppStateProvider from "@/lib/providers/state-provider";
import WalletContextProvider from "@/lib/providers/wallet-context-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "I will become a millionaire",
  description: "I will do it!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AppStateProvider>
          <SupabaseUserProvider>
            {/* <WalletContextProvider> */}
              {children}
            {/* </WalletContextProvider> */}
            <Analytics/>
            <SpeedInsights/>
            <Toaster />
          </SupabaseUserProvider>
        </AppStateProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
