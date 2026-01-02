import type { Metadata } from "next";
import "./globals.css";

const geistSans = null;

const geistMono = null;

export const metadata: Metadata = {
  title: "REFLEX - Monochrome Game",
  description: "A minimalist reflex-based timing game in black and white",
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
