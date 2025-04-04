import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/", // Home
  "/login", // Login
  "/register", // Sign Up
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if user is authenticated by checking auth-token cookie
  const isAuthenticated = request.cookies.has("auth-token");

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === path) return true;
    if (path.startsWith(`${route}/`)) return true;
    return false;
  });

  // If user is NOT authenticated and tries to access a non-public route, redirect to login
  if (!isAuthenticated && !isPublicRoute) {
    // const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set("redirect", path);
    // return NextResponse.redirect(loginUrl);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user IS authenticated and tries to access login or signup, redirect to home
  if (isAuthenticated && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};