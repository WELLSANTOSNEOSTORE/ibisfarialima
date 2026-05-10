import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Admin: protegido por cookie próprio (neostore)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const ibisAuth = req.cookies.get("ibis_auth")?.value;
    if (ibisAuth !== "ok") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Painel: protegido por sessão Google
  if (pathname.startsWith("/painel")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/entrar", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/painel/:path*"],
};
