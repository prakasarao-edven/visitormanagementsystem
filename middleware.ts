import {
  NextRequest,
  NextResponse
} from "next/server";

import { jwtVerify } from "jose";

export async function middleware(
  request: NextRequest
) {

  const pathname =
    request.nextUrl.pathname;

  const token =
    request.cookies.get(
      "token"
    )?.value;

  if (

    pathname.startsWith(
      "/_next"
    )

    ||

    pathname.includes(".")

    ||

    pathname.startsWith(
      "/api/auth"
    )

  ) {

    return NextResponse.next();

  }

  if (!token) {

    if (
      pathname === "/login"
    ) {

      return NextResponse.next();

    }

    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )

    );

  }

  try {

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET!
    );

    const decoded =
      await jwtVerify(

        token,

        secret

      );

    const role =
      (decoded.payload as any).role;

    console.log(
      "ROLE:",
      role
    );

    if (

      pathname.startsWith(
        "/admin"
      )

    ) {

      if (
        role !==
        "ADMIN" &&
        role !==
        "SUPER_ADMIN"
      ) {

        return NextResponse.redirect(

          new URL(
            "/login",
            request.url
          )

        );

      }

    }

    if (

      pathname.startsWith(
        "/dashboard"
      )

    ) {

      if (
        role !==
        "SECURITY"
      ) {

        return NextResponse.redirect(

          new URL(
            "/login",
            request.url
          )

        );

      }

    }

    return NextResponse.next();

  }

  catch (error) {

    console.log(
      "JWT ERROR:",
      error
    );

    return NextResponse.redirect(

      new URL(
        "/login",
        request.url
      )

    );

  }

}

export const config = {

  matcher: [

    "/admin/:path*",

    "/dashboard/:path*"

  ]

};