import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Busca logos da biblioteca + logos ativos nas salas (migração automática)
  const [logos, salas] = await Promise.all([
    prisma.logoLibrary.findMany({ orderBy: { nome: "asc" } }),
    prisma.salaConfig.findMany({
      where: { logoCliente: { not: null }, nomeCliente: { not: null } },
    }),
  ]);

  const logoUrls = new Set(logos.map((l) => l.url));
  const novos = salas.filter((s) => s.logoCliente && !logoUrls.has(s.logoCliente!));

  if (novos.length > 0) {
    await Promise.all(
      novos.map((s) =>
        prisma.logoLibrary.upsert({
          where: { url: s.logoCliente! },
          update: { nome: s.nomeCliente! },
          create: { nome: s.nomeCliente!, url: s.logoCliente! },
        })
      )
    );
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

  const logo = await prisma.logoLibrary.upsert({
    where: { url },
    update: { nome },
    create: { nome, url },
  });

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
