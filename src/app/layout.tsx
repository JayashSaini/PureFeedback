import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import NavBar from "@/components/Navbar";

const archivo = Archivo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pure Feedback",
  description: "Developed By Jayash Saini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={archivo.className}>
          <NavBar />
          {children}
          <Toaster position="top-center" />
        </body>
      </AuthProvider>
    </html>
  );
}
