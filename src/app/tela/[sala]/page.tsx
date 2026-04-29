"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type SalaId = "inter" | "rooftop";

interface SalaConfig {
  salaId: SalaId;
  mensagemBoasVindas: string;
  logoCliente: string | null;
  nomeCliente: string | null;
  mostrarInfoEvento: boolean;
}

const SLIDE_DURATIONS = [6000, 5000, 5000]; // ms por slide

const NOMES_SALA: Record<SalaId, string> = {
  inter: "SALA INTER",
  rooftop: "SALA ROOFTOP",
};

export default function TelaPage() {
  const params = useParams();
  const sala = params.sala as SalaId;

  const [config, setConfig] = useState<SalaConfig | null>(null);
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch(`/api/sala?salaId=${sala}`, { cache: "no-store" });
      const data: SalaConfig = await res.json();
      setConfig(data);
    } catch {
      // mantém config anterior em caso de falha de rede
    }
  }, [sala]);

  // Busca config ao montar e depois a cada 30s
  useEffect(() => {
    fetchConfig();
    const interval = setInterval(fetchConfig, 30000);
    return () => clearInterval(interval);
  }, [fetchConfig]);

  // Loop de slides
  useEffect(() => {
    const duration = SLIDE_DURATIONS[slide];
    const timer = setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        setSlide((prev) => (prev + 1) % 3);
        setAnimating(false);
      }, 500);
    }, duration - 500);

    return () => clearTimeout(timer);
  }, [slide]);

  if (!config) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  const nomeSalaDisplay = NOMES_SALA[sala] ?? "SALA";

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      {/* Slide 1 — Boas-vindas animada */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          slide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Slide1 mensagem={config.mensagemBoasVindas} />
      </div>

      {/* Slide 2 — Sinalização da sala */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          slide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Slide2 nomeSala={nomeSalaDisplay} />
      </div>

      {/* Slide 3 — Identificação do cliente */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          slide === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${!config.mostrarInfoEvento ? "hidden" : ""}`}
      >
        <Slide3
          logoCliente={config.logoCliente}
          nomeCliente={config.nomeCliente}
          nomeSala={nomeSalaDisplay}
        />
      </div>

      {/* Indicadores de slide */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              slide === i ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SLIDE 1 — Boas-vindas com animação P&B → color
────────────────────────────────────────────── */
function Slide1({ mensagem }: { mensagem: string }) {
  const [colored, setColored] = useState(false);

  useEffect(() => {
    setColored(false);
    const t = setTimeout(() => setColored(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-full relative flex items-end">
      {/* Fundo com imagem — usando gradiente artístico como fallback */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mural-bg.jpg')" }}
      />

      {/* Overlay artístico caso não tenha a imagem */}
      <div
        className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out`}
        style={{
          background: colored
            ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)"
            : "linear-gradient(135deg, #000 0%, #1a1a1a 50%, #2a2a2a 100%)",
        }}
      />

      {/* Padrão artístico abstrato */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute transition-all duration-[3000ms] ease-in-out`}
          style={{
            top: "-20%",
            right: "-10%",
            width: "70%",
            height: "70%",
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            background: colored
              ? "radial-gradient(circle, rgba(232,68,10,0.4) 0%, rgba(255,140,0,0.2) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(80,80,80,0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className={`absolute transition-all duration-[3000ms] ease-in-out delay-500`}
          style={{
            bottom: "10%",
            left: "-5%",
            width: "50%",
            height: "50%",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            background: colored
              ? "radial-gradient(circle, rgba(83,52,131,0.5) 0%, rgba(232,68,10,0.2) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(40,40,40,0.3) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        {/* Linhas diagonais decorativas */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={-100 + i * 180}
              y1="0"
              x2={200 + i * 180}
              y2="800"
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* Gradiente inferior para o texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Texto */}
      <div className="relative z-10 px-12 pb-16 w-full">
        <h1
          className="text-7xl font-black text-white leading-none tracking-tight drop-shadow-2xl"
          style={{ textShadow: "0 4px 32px rgba(0,0,0,0.8)" }}
        >
          {mensagem}
        </h1>
        <p
          className="text-xl text-white/80 mt-3 font-light max-w-xl"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}
        >
          Estávamos esperando você chegar e colorir o evento.
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SLIDE 2 — Sinalização da sala (fundo laranja)
────────────────────────────────────────────── */
function Slide2({ nomeSala }: { nomeSala: string }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: "#E8440A" }}
    >
      <div className="w-full px-12 grid grid-cols-3 items-center gap-8">
        {/* Esquerda — Sala */}
        <div className="flex flex-col items-start">
          <span className="text-[#4ade80] text-6xl font-black leading-none tracking-tighter">
            «
          </span>
          <p className="text-white font-black text-4xl leading-tight mt-1 tracking-wide">
            {nomeSala}
          </p>
        </div>

        {/* Centro — Logo Ibis */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-8 py-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3">
                <span className="text-[#E8440A] font-black text-xl">ibis</span>
              </div>
              <p className="text-white font-black text-2xl tracking-widest">
                ibis Styles
              </p>
              <p className="text-white/70 text-sm tracking-[0.3em] uppercase mt-1">
                Faria Lima
              </p>
            </div>
          </div>
        </div>

        {/* Direita — Banheiros */}
        <div className="flex flex-col items-end">
          <span className="text-yellow-300 text-6xl font-black leading-none tracking-tighter">
            »
          </span>
          <p className="text-white font-black text-4xl leading-tight mt-1 tracking-wide text-right">
            BANHEIROS
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SLIDE 3 — Identificação do cliente
────────────────────────────────────────────── */
function Slide3({
  logoCliente,
  nomeCliente,
  nomeSala,
}: {
  logoCliente: string | null;
  nomeCliente: string | null;
  nomeSala: string;
}) {
  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-10 px-12">
      {logoCliente ? (
        <div className="flex items-center justify-center">
          <Image
            src={logoCliente}
            alt={nomeCliente ?? "Logo cliente"}
            width={480}
            height={240}
            className="object-contain max-h-52"
            unoptimized
            priority
          />
        </div>
      ) : (
        <div className="w-64 h-32 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
          <p className="text-gray-400 text-sm font-medium">Logo do cliente</p>
        </div>
      )}

      <div className="text-center">
        {nomeCliente && (
          <p className="text-2xl text-gray-400 font-light mb-2">{nomeCliente}</p>
        )}
        <div className="inline-flex items-center gap-3">
          <div className="h-px w-12 bg-[#E8440A]" />
          <p className="text-3xl font-black text-gray-800 tracking-wide">{nomeSala}</p>
          <div className="h-px w-12 bg-[#E8440A]" />
        </div>
      </div>
    </div>
  );
}
