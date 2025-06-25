import type { Metadata } from "next";
import "../styles/globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import Header from "@/components/Header";
import { Chivo_Mono, Source_Code_Pro, Outfit, Montserrat } from 'next/font/google';

const chivoMono = Chivo_Mono({ subsets: ['latin'],
  display: 'swap', 
  variable: '--font-chivo-mono' });

const sourceCodePro = Source_Code_Pro({ subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro' });

const outfit = Outfit({ subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit' });

const montserrat = Montserrat({ subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: "DCCOMMIT",
  description: "Educational platform for learning coding skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body className={`${montserrat.className} antialiased`} suppressHydrationWarning >

        <ClerkProvider>
          <Header />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
