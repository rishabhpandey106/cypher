import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cypher.itsrishabh.tech'),
  title: {
    default: "Cypher - Send Anonymous Messages",
    template: "%s | Cypher",
  },
  description: "Send and receive anonymous messages with a beautiful brutalist aesthetic.",
  keywords: [
    "scaly url shortener",
    "anonymous messaging",
    "cypher secret messages",
    "scalyui",
    "cypherui",
    "cypher",
    "free ngl alternative",
    "ama anonymous messaging",
    "embed anonymous messages free",
  ],
  authors: [
    {
      name: "Rishabh",
      url: "https://cypher.itsrishabh.tech",
    },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  creator: "Rishabh",
  publisher: "Cypher",
  category: "Technology",
  verification: {
    google: [
      "aFgROXjTSznluBIsgPA92-NGAd3oJX-txnsvHaxRP2U",
    ]
  },
  openGraph: {
    title: "Cypher - Send Anonymous Messages",
    description: "Send and receive anonymous messages with a beautiful brutalist aesthetic.",
    url: "https://cypher.itsrishabh.tech",
    siteName: "Cypher",
    images: [
      {
        url: "/og.png",
        width: 1024,
        height: 1024,
        alt: "Cypher - Send Anonymous Messages",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cypher - Send Anonymous Messages",
    description: "Send and receive anonymous messages with a beautiful brutalist aesthetic.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
