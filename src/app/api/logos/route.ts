import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function upsertLogo(nome: string, url: string) {
  const existing = await prisma.logoLibrary.findFirst({ where: { url } });
  if (existing) {
    return prisma.logoLibrary.update({ where: { id: existing.id }, data: { nome } });
  }
  return prisma.logoLibrary.create({ data: { nome, url } });
}

export async function GET() {
  const [logos, salas] = await Promise.all([
    prisma.logoLibrary.findMany({ orderBy: { nome: "asc" } }),
    prisma.salaConfig.findMany({
      where: { logoCliente: { not: null }, nomeCliente: { not: null } },
    }),
  ]);

  const logoUrls = new Set(logos.map((l) => l.url));
  const novos = salas.filter((s) => s.logoCliente && !logoUrls.has(s.logoCliente!));

  if (novos.length > 0) {
    await Promise.all(novos.map((s) => upsertLogo(s.nomeCliente!, s.logoCliente!)));
    const todos = await prisma.logoLibrary.findMany({ orderBy: { nome: "asc" } });
    return NextResponse.json(todos);
  }

  return NextResponse.json(logos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nome, url } = body;

  if (!nome || !url) {
    return NextResponse.json({ error: "nome e url são obrigatórios" }, { status: 400 });
  }

  const logo = await upsertLogo(nome, url);
  return NextResponse.json(logo);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  }

  await prisma.logoLibrary.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
