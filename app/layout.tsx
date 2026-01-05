import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Besepa Eco-Culture & Tourism Hub | Authentic Asanteman Experiences",
  description:
    "Curated eco-cultural experiences rooted in the heritage of Asanteman. Reconnect with history, living culture, and sacred landscapes.",
  openGraph: {
    images: [
      {
        url: "/assets/images/logo.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/assets/images/logo.jpg",
      },
    ],
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
        <Toaster position="top-right" />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
