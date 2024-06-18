import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXT_AUTH_SECRET,
    });
    const { pathname, origin } = new URL(request.url);
    // Uncommented section for redirecting to /dashboard based on conditions
    if (
      token &&
      (pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up") ||
        pathname === "/" ||
        pathname.startsWith("/verify"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", origin).toString());
    }

    // Uncommented section for redirecting to /sign-in if trying to access /dashboard without token
    if (!token && pathname.startsWith("/dashboard")) {
      console.log("Redirecting to /sign-in");
      return NextResponse.redirect(new URL("/sign-in", origin).toString());
    }

    // Fallback to NextResponse.next() if no redirection conditions are met
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.error();
  }
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
    "/dashboard",
  ],
};
