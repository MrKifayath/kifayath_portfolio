// Stripped @vercel/analytics per AI Studio platform requirements
const Analytics = () => null;
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { portfolioData } from "@/src/data/portfolio";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: portfolioData.meta.title,
  description: portfolioData.meta.description,
  authors: [{ name: portfolioData.identity.name }],
  openGraph: {
    title: portfolioData.meta.title,
    description: portfolioData.meta.description,
    siteName: portfolioData.identity.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: portfolioData.meta.title,
    description: portfolioData.meta.description,
  },
  icons: {
    icon: [
      {
        url: "/logo/kifayat_favicon_512.png",
      },
    ],
    apple: "/logo/kifayat_favicon_512.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0D1712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${plusJakartaSans.variable} ${dmSans.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
