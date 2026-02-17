import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Government of Pakistan - Ministry of Interior | Visa",
  description: "Official visa application portal for Pakistan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-800 antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
