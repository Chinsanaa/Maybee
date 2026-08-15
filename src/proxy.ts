import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { findRedirect } from "./lib/redirects";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const redirect = await findRedirect(request.nextUrl.pathname);
  if (redirect) {
    const destination = redirect.to.startsWith("http")
      ? redirect.to
      : new URL(redirect.to, request.url);
    return NextResponse.redirect(destination, redirect.status as 301 | 302);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|admin|_next|_vercel|.*\\..*).*)",
  ],
};
