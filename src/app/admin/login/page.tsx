"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        setErro(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#E8440A] flex items-center justify-center">
              <span className="text-white font-black text-sm">ibis</span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">Hotel</p>
              <p className="text-xl font-black text-gray-800 leading-tight">ibis Styles</p>
              <p className="text-[10px] text-gray-500 tracking-wider leading-none">FARIA LIMA</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-black text-gray-800 mb-1">Entrar</h1>
          <p className="text-sm text-gray-400 mb-6">Painel de Sinalização Digital</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Login
              </label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8440A] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8440A] focus:border-transparent transition"
              />
            </div>

            {erro && (
              <p className="text-sm text-red-500 font-medium">Login ou senha incorretos.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8440A] hover:bg-[#c93a08] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
