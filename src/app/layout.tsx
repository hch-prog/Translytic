import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Translytic",
  description: "Created By Harsh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        {children}
        <Script src="/node_modules/preline/dist/preline.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
