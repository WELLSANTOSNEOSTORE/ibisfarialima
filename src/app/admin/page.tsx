"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type SalaId = "inter" | "rooftop";

interface SalaConfig {
  salaId: SalaId;
  mensagemBoasVindas: string;
  logoCliente: string | null;
  nomeCliente: string | null;
  mostrarInfoEvento: boolean;
}

const defaultConfig = (salaId: SalaId): SalaConfig => ({
  salaId,
  mensagemBoasVindas: "BEM-VINDO!",
  logoCliente: null,
  nomeCliente: null,
  mostrarInfoEvento: true,
});

export default function AdminPage() {
  const [sala, setSala] = useState<SalaId>("inter");
  const [config, setConfig] = useState<SalaConfig>(defaultConfig("inter"));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [buscarLogoSistema, setBuscarLogoSistema] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConfig(sala);
  }, [sala]);

  async function fetchConfig(salaId: SalaId) {
    setLoading(true);
    try {
      const res = await fetch(`/api/sala?salaId=${salaId}`);
      const data: SalaConfig = await res.json();
      setConfig(data);
      setLogoPreview(data.logoCliente ?? null);
    } catch {
      setConfig(defaultConfig(salaId));
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    if (data.url) {
      setLogoPreview(data.url);
      setConfig((prev) => ({ ...prev, logoCliente: data.url }));
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/sala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function openTela() {
    window.open(`/tela/${sala}`, "_blank");
  }

  const nomeSala = sala === "inter" ? "Sala Inter" : "Sala Rooftop";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo Ibis Styles — placeholder com texto estilizado */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#E8440A] flex items-center justify-center">
                <span className="text-white font-black text-xs leading-none text-center">
                  ibis
                </span>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest leading-none">
                  Hotel
                </p>
                <p className="text-lg font-black text-gray-800 leading-tight">
                  ibis Styles
                </p>
                <p className="text-[10px] text-gray-500 tracking-wider leading-none">
                  FARIA LIMA
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Painel de</p>
            <p className="text-sm font-bold text-gray-700">Sinalização Digital</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            OLÁ, IBIS FARIA LIMA
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Configure as informações exibidas na tela de cada sala.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          {/* Seleção de sala */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Sala
            </label>
            <select
              value={sala}
              onChange={(e) => setSala(e.target.value as SalaId)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#E8440A] focus:border-transparent transition"
            >
              <option value="inter">Sala Inter</option>
              <option value="rooftop">Sala Rooftop</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E8440A]" />
            </div>
          ) : (
            <>
              {/* Mensagem de boas-vindas */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Mensagem de boas-vindas
                </label>
                <input
                  type="text"
                  value={config.mensagemBoasVindas}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, mensagemBoasVindas: e.target.value }))
                  }
                  placeholder="BEM-VINDO!"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8440A] focus:border-transparent transition"
                />
              </div>

              {/* Nome do cliente */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Nome do cliente / evento
                </label>
                <input
                  type="text"
                  value={config.nomeCliente ?? ""}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, nomeCliente: e.target.value }))
                  }
                  placeholder="Ex: Empresa XPTO"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8440A] focus:border-transparent transition"
                />
              </div>

              {/* Checkbox buscar logo */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="buscarLogo"
                  checked={buscarLogoSistema}
                  onChange={(e) => setBuscarLogoSistema(e.target.checked)}
                  className="w-5 h-5 accent-[#E8440A] cursor-pointer"
                />
                <label
                  htmlFor="buscarLogo"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Procurar logo no sistema?{" "}
                  <span className="text-gray-400">(caso seja cliente recorrente)</span>
                </label>
              </div>

              {/* Upload de logo */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Logo do cliente
                </label>
                <div
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#E8440A] transition group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        width={180}
                        height={90}
                        className="object-contain max-h-24"
                        unoptimized
                      />
                      <p className="text-xs text-gray-400 group-hover:text-[#E8440A] transition">
                        Clique para trocar
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-50 transition">
                        <svg
                          className="w-7 h-7 text-gray-400 group-hover:text-[#E8440A] transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-600 group-hover:text-[#E8440A] transition">
                          Clique para fazer upload
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG até 5MB</p>
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {logoPreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null);
                      setConfig((prev) => ({ ...prev, logoCliente: null }));
                    }}
                    className="mt-2 text-xs text-red-400 hover:text-red-600 transition"
                  >
                    Remover logo
                  </button>
                )}
              </div>

              {/* Toggle mostrar info */}
              <div className="flex items-center justify-between py-4 border-t border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Mostrar informações do evento?
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Exibe logo e nome do cliente no slide 3
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      mostrarInfoEvento: !prev.mostrarInfoEvento,
                    }))
                  }
                  className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    config.mostrarInfoEvento ? "bg-[#E8440A]" : "bg-gray-200"
                  }`}
                  style={{ width: "52px" }}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      config.mostrarInfoEvento ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : saved ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Salvo!
                    </>
                  ) : (
                    "Salvar"
                  )}
                </button>

                <button
                  onClick={openTela}
                  className="flex-1 bg-[#1a2e4a] hover:bg-[#243d61] text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Ver Tela — {nomeSala}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
