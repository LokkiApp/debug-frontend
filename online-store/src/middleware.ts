import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const host = req.headers.get("host");

  console.log("IN MIDDLEWARE", host);

  // handle local dev
  if (
    process.env.NODE_ENV === "development" || // exclude when in development mode
    url.pathname.startsWith("/_next") || // exclude Next.js internals
    url.pathname.startsWith("/api") || //  exclude all API routes
    url.pathname.startsWith("/static") || // exclude static files
    PUBLIC_FILE.test(url.pathname) // exclude all files in the public folder
  )
    return NextResponse.next();


  // Get the custom domain/subdomain value by removing the root URL
  // (in the case of "test.vercel.app", "vercel.app" is the root URL)
  const tokens = host?.split(".");
  if (!tokens) {
    throw new Error("No host provided");
  }
  const slug = tokens[0];

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/hosts`)) {
    url.pathname = `/404`;
  } else {
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/hosts/${slug}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}
