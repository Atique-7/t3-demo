import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { listAllUsers } from "./lib/appwrite";
import { setCookie } from "cookies-next";

export async function middleware(request: NextRequest) {
  //   console.log("THIS IS THE REQUEST -", request);
  const path = request.nextUrl.pathname;
  console.log("THIS IS THE CURRENT PATH - ", path);

  const isPublicPath = path === "/";
  // console.log(isPublicPath);

  const token = (await request.cookies.get("user")?.value) || "";
  let redirectURL = "/";

  if (token) {
    console.log("USER TOKEN EXISTS");
    const parsedToken = JSON.parse(token);
    const userAccess = parsedToken.labels[0];
    console.log("LABEL FROM TOKEN - ", userAccess);
    

    switch (userAccess) {
      case "parts":
        redirectURL = "/parts";
        break;
      case "biller":
        redirectURL = "/biller";
        break;

      case "security":
        redirectURL = "/security";
        break;
      case "service":
        redirectURL = "/service";
        break;
      case "admin":
        
        redirectURL = "/admin";
        break;

      default:
        break;
    }

    console.log("REDIRECTING TO - ", redirectURL);
    console.log(path.startsWith(redirectURL));

    if (!path.startsWith(redirectURL)) {
      return NextResponse.redirect(new URL(redirectURL, request.nextUrl));
    }
  } else {
    console.log("USER TOKEN DOES NOT EXIST");
    if (!(path == redirectURL)) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    "/parts/:path*",
    "/biller/:path*",
    "/security/:path*",
    "/admin/:path*",
    "/service/:path*",
    "/",
  ],
};
