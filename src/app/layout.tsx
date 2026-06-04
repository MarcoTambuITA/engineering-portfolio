import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Marco Tamburini — Electrical Engineering Portfolio",
    template: "%s | Marco Tamburini",
  },
  description:
    "Personal engineering portfolio of Marco Tamburini, Electrical Engineering student at the University of South Florida. Specializing in RF Systems, Power Electronics, FPGAs, and Embedded Design.",
  keywords: [
    "Marco Tamburini",
    "Electrical Engineering",
    "USF",
    "Portfolio",
    "Embedded Systems",
    "RF",
    "Power Electronics",
    "FPGA",
  ],
  authors: [{ name: "Marco Tamburini" }],
  creator: "Marco Tamburini",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Marco Tamburini — Engineering Portfolio",
    title: "Marco Tamburini — Electrical Engineering Portfolio",
    description:
      "Personal engineering portfolio of Marco Tamburini, EE student at USF. RF Systems, Power Electronics, FPGAs, and Embedded Design.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marco Tamburini — Electrical Engineering Portfolio",
    description:
      "Personal engineering portfolio of Marco Tamburini, EE student at USF.",
  },
  metadataBase: new URL("https://marcotambu.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased bg-navy-900 text-gray-200`}
      >
        {children}
      </body>
    </html>
  );
}
