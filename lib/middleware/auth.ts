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

    if (!token) {

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

    return payload;

  }

  catch {

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
    payload.role !== "ADMIN"
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
    payload.role !== "SECURITY"
  ) {

    return false;

  }

  return true;

}
