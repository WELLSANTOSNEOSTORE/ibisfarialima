import { NextRequest, NextResponse } from "next/server";

const LOGIN = "neostore";
const SENHA = "ibisEventos";

export async function POST(req: NextRequest) {
  const { login, senha } = await req.json();

  if (login !== LOGIN || senha !== SENHA) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ibis_auth", "ok", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
    sameSite: "lax",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ibis_auth", "", { maxAge: 0, path: "/" });
  return res;
}
