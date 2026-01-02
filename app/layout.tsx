import type { Metadata } from "next";
import "./globals.css";

const geistSans = null;

const geistMono = null;

export const metadata: Metadata = {
  title: "REFLEX - Monochrome Game",
  description: "A minimalist reflex-based timing game in black and white",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
