"use client";

import { useState } from "react";
import { supabase } from "../src/supabase";
import Logo from "./Logo";
import type { ClienteData } from "../types";
import { CiLock } from "react-icons/ci";
import { PiPhoneThin } from "react-icons/pi";
import { GoQuestion } from "react-icons/go";
import ScreenBackground from './ScreenBackground';
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
    console.log("clicou")
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
    <ScreenBackground>
      <div className="mx-auto max-w-sm flex flex-col items-center">
        <div className="bg-black/40 rounded-[3em] shadow-xl w-full flex flex-col items-center border border-orange-500/80">
          <div className="w-full overflow-hidden">
            <Logo />
          </div>

          <div className="w-full p-8 px-4 flex flex-col items-center gap-6">
            <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
              <div className="px-3 flex items-center justify-center">
                <PiPhoneThin className="text-orange-500 w-5 h-5 shrink-0" />
              </div>
              <input
                type="text"
                placeholder="Telefone"
                className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
              <div className="px-3 flex items-center justify-center">
                <CiLock className="text-orange-500 w-5 h-5 shrink-0" />
              </div>
              <input
                type="password"
                placeholder="Senha"
                className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button
              onClick={fazerLogin}
              className="w-full h-16 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-2xl font-extrabold shadow-xl hover:opacity-90 transition-opacity"
            >
              Entrar
            </button>

            {mensagem && (
              <p className="text-red-400 text-sm font-semibold">{mensagem}</p>
            )}

            <div className="flex justify-between gap-8 w-full text-orange-500 text-sm font-semibold">
              <div className="flex items-center gap-1 shrink-0">
                <GoQuestion className="text-orange-500 w-8 h-8 shrink-0" />
                <button className="hover:text-orange-400 cursor-pointer whitespace-nowrap">
                  Esqueceu a senha?
                </button>
              </div>

              <div className="flex items-center gap-1">
                <MdPersonOutline className="text-orange-500 w-8 h-8 shrink-0" />
                <button
                  onClick={onIrParaCadastro}
                  className="hover:text-orange-400 cursor-pointer text-left leading-tight"
                >
                  Não tem uma conta? Registre-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenBackground>
  );
}
