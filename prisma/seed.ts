import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.salaConfig.upsert({
    where: { salaId: "inter" },
    update: {},
    create: {
      salaId: "inter",
      mensagemBoasVindas: "BEM-VINDO!",
      mostrarInfoEvento: true,
    },
  });

  await prisma.salaConfig.upsert({
    where: { salaId: "rooftop" },
    update: {},
    create: {
      salaId: "rooftop",
      mensagemBoasVindas: "BEM-VINDO!",
      mostrarInfoEvento: true,
    },
  });

  console.log("Salas inicializadas: inter, rooftop");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
