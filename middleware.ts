import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  jwtVerify
} from "jose";

export async function middleware(
  request: NextRequest
) {

  console.log(
    "MIDDLEWARE RUNNING"
  );

  const pathname =
    request.nextUrl.pathname;

  const token =
    request.cookies.get("token")
      ?.value;

  if (

    pathname === "/login" ||

    pathname.startsWith(
      "/_next"
    ) ||

    pathname.includes(".")
  ) {

    return NextResponse.next();

  }

  if (!token) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );

  }

  try {

    const secret =
      new TextEncoder().encode(

        process.env.JWT_SECRET ||

        "secret"

      );

    const {
      payload
    } = await jwtVerify(
      token,
      secret
    );

    const role =
      payload.role;

    if (

      pathname.startsWith(
        "/admin"
      ) &&

      role !== "ADMIN"

    ) {

      return NextResponse.redirect(
        new URL(
          "/dashboard",
          request.url
        )
      );

    }

    if (

      pathname.startsWith(
        "/dashboard"
      ) &&

      role !== "SECURITY"

    ) {

      return NextResponse.redirect(
        new URL(
          "/admin",
          request.url
        )
      );

    }

    return NextResponse.next();

  }

  catch (error) {

    console.log(
      "TOKEN ERROR"
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