"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">Sign in</h1>
          <button
            className="bg-orange-500 py-1 px-3  rounded-md mt-1"
            onClick={() => signIn()}
          >
            Sign in
          </button>
          <p className="text-gray-600">Please sign in to continue to the app</p>
        </div>
      </div>
    </div>
  );
}
