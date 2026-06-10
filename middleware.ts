import {
  NextRequest,
  NextResponse
} from "next/server";

import jwt from "jsonwebtoken";

export function middleware(
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

    const decoded: any =
      jwt.verify(

        token,

        process.env.JWT_SECRET!

      );

    console.log(
      "ROLE:",
      decoded.role
    );

    if (

      pathname.startsWith(
        "/admin"
      )

    ) {

      if (
        decoded.role !==
        "ADMIN"
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
        decoded.role !==
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