import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const salaId = searchParams.get("salaId");

  if (!salaId || !["inter", "rooftop"].includes(salaId)) {
    return NextResponse.json({ error: "salaId inválido" }, { status: 400 });
  }

  const config = await prisma.salaConfig.upsert({
    where: { salaId },
    update: {},
    create: {
      salaId,
      mensagemBoasVindas: "BEM-VINDO!",
      mostrarInfoEvento: true,
    },
  });

  return NextResponse.json(config);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { salaId, mensagemBoasVindas, logoCliente, nomeCliente, mostrarInfoEvento, videoUrl, mostrarVideo, orientacao } = body;

  if (!salaId || !["inter", "rooftop"].includes(salaId)) {
    return NextResponse.json({ error: "salaId inválido" }, { status: 400 });
  }

  const [config] = await Promise.all([
    prisma.salaConfig.upsert({
      where: { salaId },
      update: { mensagemBoasVindas, logoCliente, nomeCliente, mostrarInfoEvento, videoUrl, mostrarVideo, orientacao },
      create: { salaId, mensagemBoasVindas, logoCliente, nomeCliente, mostrarInfoEvento, videoUrl, mostrarVideo, orientacao },
    }),
    // Auto-salva logo na biblioteca sempre que salvar com logo + nome preenchidos
    logoCliente && nomeCliente
      ? prisma.logoLibrary.findFirst({ where: { url: logoCliente } }).then((existing) =>
          existing
            ? prisma.logoLibrary.update({ where: { id: existing.id }, data: { nome: nomeCliente } })
            : prisma.logoLibrary.create({ data: { nome: nomeCliente, url: logoCliente } })
        )
      : Promise.resolve(null),
  ]);

  return NextResponse.json(config);
}
