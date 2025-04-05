import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mongoose Schema Parser & Dummy Data Generator",
  description:
    "Instantly parse Mongoose schemas and generate realistic dummy data for testing, prototyping, and development. Simplify your backend workflow.",
  keywords: [
    "Mongoose",
    "Schema Parser",
    "Dummy Data Generator",
    "MongoDB",
    "Node.js",
    "Next.js",
    "Backend Tools",
    "API Mocking",
  ],
  authors: [{ name: "Your Name", url: "https://yourdomain.com" }],
  creator: "Your Name or Brand",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    title: "Mongoose Schema Parser & Dummy Data Generator",
    description:
      "Transform Mongoose schemas into realistic mock data effortlessly. Perfect for rapid development and testing.",
    url: "https://yourdomain.com",
    siteName: "Mongoose DummyGen",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mongoose Schema Parser",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mongoose Schema Parser & Dummy Data Generator",
    description:
      "Auto-generate mock data from Mongoose schemas with one click.",
    creator: "@yourhandle",
    images: ["https://yourdomain.com/og-image.png"],
  },
  themeColor: "#ff6b00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-black dark:text-white`}
      >
        <main>
          <Analytics />
          {children}</main>
      </body>
    </html>
  );
}
