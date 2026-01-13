import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { baseUrl } from "@/lib/contants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BESEPA | Eco-Culture & Tourism Hub Ghana",
  description:
    "Discover authentic cultural tours, heritage journeys, and eco-tourism experiences in Ghana with BESEPA. Book unforgettable adventures exploring Cape Coast Castle, Kakum National Park, Ashanti Kingdom, and more.",
  keywords:
    "Ghana tourism, cultural tours Ghana, Cape Coast Castle, Kakum National Park, Ashanti Kingdom, eco-tourism Ghana, heritage tours, West Africa travel, Ghana safari, cultural experiences",
  authors: [{ url: baseUrl }],
  metadataBase: new URL(`${baseUrl}`),
  alternates: {
    canonical: `/`,
  },
  openGraph: {
    title: "BESEPA | Eco-Culture & Tourism Hub Ghana",
    description:
      "Authentic cultural tours and eco-tourism experiences in Ghana",
    siteName: "BESEPA",
    url: baseUrl,
    locale: "en_us",
    type: "website",
    images: [
      {
        url: "https://i.postimg.cc/rp6pXw1q/logo.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BESEPA | Eco-Culture & Tourism Hub Ghana",
    description:
      "Authentic cultural tours and eco-tourism experiences in Ghana",
    site: "@besepa",
    images: ["https://i.postimg.cc/rp6pXw1q/logo.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
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
