import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Biodaat - Create Beautiful Marriage Biodata for Free",
  description: "Create stunning marriage biodatas in minutes. Traditional formats that Indian families trust. 100% free, no signup required. WhatsApp-ready sharing.",
  keywords: ["biodata maker", "marriage biodata", "biodata format", "Indian biodata", "wedding biodata", "matrimonial profile"],
  openGraph: {
    title: "Biodaat - Create Beautiful Marriage Biodata",
    description: "Create stunning marriage biodatas in minutes. Free & family-approved.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
