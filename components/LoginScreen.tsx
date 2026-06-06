"use client";

import { useState } from "react";
import { supabase } from "../src/supabase";
import Logo from "./Logo";
import type { ClienteData } from "../types";

interface LoginScreenProps {
  onLoginSuccess: (cliente: ClienteData) => void;
  onIrParaCadastro: () => void;
}

export default function LoginScreen({
  onLoginSuccess,
  onIrParaCadastro,
}: LoginScreenProps) {
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const fazerLogin = async () => {
    if (!telefone || !senha) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    setMensagem("Entrando...");

    const { data, error } = await supabase
      .from("cartoes_fidelidade")
      .select("*")
      .eq("telefone", telefone)
      .eq("senha", senha)
      .single();

    if (error || !data) {
      setMensagem("Telefone ou senha incorretos.");
    } else {
      setMensagem("");
      onLoginSuccess(data as ClienteData);
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black">
      {/* Noise */}
      <div
        className="fixed inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative w-full max-w-sm flex flex-col items-center">
        <Logo />

        <div className="bg-black w-full rounded-[3rem] p-8 shadow-xl flex flex-col items-center">
          <input
            type="text"
            placeholder="Telefone"
            className="w-full h-14 mb-6 pl-4 rounded-full bg-white text-zinc-800 placeholder:text-zinc-400 shadow-lg outline-none"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full h-14 mb-6 pl-4 rounded-full bg-white text-zinc-800 placeholder:text-zinc-400 shadow-lg outline-none"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            onClick={fazerLogin}
            className="w-full h-16 rounded-full bg-orange-500 text-white text-2xl font-extrabold shadow-xl hover:bg-orange-600 transition-colors"
          >
            Entrar
          </button>

          {mensagem && (
            <p className="text-red-400 mt-4 text-sm font-semibold">
              {mensagem}
            </p>
          )}

          <div className="flex justify-between w-full mt-6 text-orange-500 text-sm font-semibold">
            <button className="hover:text-orange-400 cursor-pointer">
              Esqueceu a senha?
            </button>

            <button
              onClick={onIrParaCadastro}
              className="hover:text-orange-400 cursor-pointer"
            >
              Não tem uma conta? Registre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}