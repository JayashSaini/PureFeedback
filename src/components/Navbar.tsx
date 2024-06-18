"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="w-full flex justify-between items-center p-5  bg-[#be3144] text-white shadow-xl">
      <h2 className="md:text-2xl text-xl font-bold">Pure Feedback</h2>
      <div>
        {session ? (
          <Button
            onClick={() => signOut()}
            className="py-1 px-5 bg-white rounded-xl text-[#be3144] hover:bg-white shadow-lg hover:scale-105 ease-in-out "
          >
            Logout
          </Button>
        ) : (
          <Link href="/sign-in">
            <Button className="py-1 px-5 bg-white rounded-xl text-[#be3144] hover:bg-white shadow-lg hover:scale-105 ease-in-out ">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
