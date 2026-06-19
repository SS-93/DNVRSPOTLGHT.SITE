import type { Metadata } from "next";
import { Inter, Cinzel, Anton } from "next/font/google";
import { org } from "@/config/organization";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});
const anton = Anton({ subsets: ["latin"], variable: "--font-anton", weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(`https://${org.domain}`),
  title: {
    default: `${org.name} — ${org.tagline}`,
    template: `%s · ${org.name}`,
  },
  description: org.description,
  openGraph: {
    title: `${org.name} — ${org.tagline}`,
    description: org.description,
    url: `https://${org.domain}`,
    siteName: org.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-white">{children}</body>
    </html>
  );
}
