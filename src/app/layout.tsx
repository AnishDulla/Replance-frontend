import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PopupWidget } from "@/components/PopupWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RepLance",
  description: "Helping freelancers win work",
  icons: {
    icon: '/logo1.ico', // This points to public/favicon.ico
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-24">
          <div>{children}</div>
        </main>
        <Footer />
        <PopupWidget />
      </body>
    </html>
  );
}
