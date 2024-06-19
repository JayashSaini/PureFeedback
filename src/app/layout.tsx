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
          <footer className="w-full text-center mb-8 text-sm  text-[#283618] px-10">
            Created By Jayash |{" "}
            <a
              target="_blank"
              className="text-blue-600"
              href="https://www.linkedin.com/in/jayash-saini-371bb0267/"
            >
              Linked in
            </a>{" "}
            |{" "}
            <a
              target="_blank"
              className="text-blue-600"
              href="https://github.com/JayashSaini/"
            >
              Github
            </a>{" "}
            |{" "}
            <a
              target="_blank"
              className="text-blue-600"
              href="mailto:Jayash%20Saini%20%3cjayashysaini7361@gmail.com%3e"
            >
              Mail
            </a>{" "}
            | June-19-2024
          </footer>
          <Toaster position="top-center" />
        </body>
      </AuthProvider>
    </html>
  );
}
