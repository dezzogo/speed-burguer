"use client";

import { useState } from "react";
import { supabase } from "../src/supabase";
import Logo from "./Logo";
import type { ClienteData } from "../types";
import { CiLock } from "react-icons/ci";
import { PiPhoneThin } from "react-icons/pi";
import { GoQuestion } from "react-icons/go";
import { MdPersonOutline } from "react-icons/md";

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
    <div className="min-h-dvh w-full flex flex-col items-center justify-center py-6 bg-black/40 md:bg-gradient-to-br from-zinc-700 via-zinc-900 to-black">
      {/* Noise */}
      <div
        className="fixed inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="bg-black/40 rounded-[3em] shadow-xl relative w-full max-w-sm flex flex-col items-center border border-orange-500/80">
        <div className="relative w-full overflow-hidden">
          <Logo />
        </div>

        <div className="w-full p-8 px-4 flex flex-col items-center gap-6">
          <label className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
            <div className="px-3 flex items-center justify-center">
              <PiPhoneThin className="text-orange-500 w-5 h-5 shrink-0" />
            </div>
            <input
              type="text"
              placeholder="Telefone"
              className="h-14 pl-2 grow text-zinc-300 placeholder:text-zinc-400 shadow-lg outline-none"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </label>

          <label className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
            <div className="px-3 flex items-center justify-center">
              <CiLock className="text-orange-500 font-bold w-5 h-5 shrink-0" />
            </div>
            <input
              type="password"
              placeholder="Senha"
              className="h-14 pl-2 grow text-zinc-300 placeholder:text-zinc-400 shadow-lg outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </label>

          <button
            onClick={fazerLogin}
            className="w-full h-16 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-2xl font-extrabold shadow-xl hover:bg-orange-100 transition-colors"
          >
            Entrar
          </button>

          {mensagem && (
            <p className="text-red-400 text-sm font-semibold">
              {mensagem}
            </p>
          )}

          <div className="flex justify-between gap-8 w-full text-orange-500 text-sm font-semibold">
            <label className="flex items-center gap-1 shrink-0">
              <GoQuestion className="text-orange-500 font-bold w-8 h-8 shrink-0 cursor-pointer" />
              <button className="hover:text-orange-400 cursor-pointer whitespace-nowrap">
                Esqueceu a senha?
              </button>
            </label>

            <label className="flex items-center gap-1">
              <MdPersonOutline className="text-orange-500 font-bold w-8 h-8 shrink-0 cursor-pointer" />
              <button
                onClick={onIrParaCadastro}
                className="hover:text-orange-400 cursor-pointer text-left leading-tight"
              >
                Não tem uma conta? Registre-se
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
