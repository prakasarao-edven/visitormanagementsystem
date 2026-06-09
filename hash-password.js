import { NextRequest, NextResponse } from "next/server";

export function middleware(
  request: NextRequest
) {

  const userCookie =
    request.cookies.get("user");

  const pathname =
    request.nextUrl.pathname;

  // Public Routes

  if (

    pathname === "/login"

    ||

    pathname === "/"

    ||

    pathname === "/visitor-registration"

  ) {

    return NextResponse.next();

  }

  // No Login

  if (!userCookie) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );

  }

  const user =
    JSON.parse(
      userCookie.value
    );

  // ADMIN ROUTE PROTECTION

  if (

    pathname.startsWith(
      "/admin"
    )

    &&

    user.role !== "ADMIN"

  ) {

    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    );

  }

  // SECURITY ROUTE PROTECTION

  if (

    pathname.startsWith(
      "/dashboard"
    )

    &&

    user.role !== "SECURITY"

    &&

    user.role !== "ADMIN"

  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );

  }

  return NextResponse.next();

}

export const config = {

  matcher: [

    "/admin/:path*",

    "/dashboard/:path*"

  ]

};