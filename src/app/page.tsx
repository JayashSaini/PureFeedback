"use client";
import Link from "next/link";
import NavBar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="bg-white w-full h-screen">
      <NavBar />
      <div className="text-red-500">
        <h1>hello brother</h1>
        <Link href="/dashboard">Go to dashboard</Link>
      </div>
    </div>
  );
}
