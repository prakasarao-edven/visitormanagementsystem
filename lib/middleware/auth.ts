import {
  NextRequest
} from "next/server";

import {
  jwtVerify
} from "jose";

export async function verifyAuth(
  request: NextRequest
) {

  try {

    const token =
      request.cookies.get(
        "token"
      )?.value;

    console.log(
      "TOKEN:",
      token
    );

    if (!token) {

      console.log(
        "NO TOKEN FOUND"
      );

      return null;

    }

    const secret =
      new TextEncoder().encode(

        process.env.JWT_SECRET!

      );

    const {
      payload
    } = await jwtVerify(
      token,
      secret
    );

    console.log(
      "PAYLOAD:",
      payload
    );

    return payload;

  }

  catch (error) {

    console.log(
      "AUTH ERROR:",
      error
    );

    return null;

  }

}

export async function requireAdmin(
  request: NextRequest
) {

  const payload =
    await verifyAuth(
      request
    );

  if (

    !payload ||

    payload.role !==
    "ADMIN"

  ) {

    return false;

  }

  return true;

}

export async function requireSecurity(
  request: NextRequest
) {

  const payload =
    await verifyAuth(
      request
    );

  if (

    !payload ||

    payload.role !==
    "SECURITY"

  ) {

    return false;

  }

  return true;

}