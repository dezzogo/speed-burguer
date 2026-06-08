"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../src/supabase";
import type { ClienteData } from "../types";
import ScreenBackground from "./ScreenBackground";
import TabelaClientes from "./TabelaClientes";

export default function AdminPage() {
  const router = useRouter();
  const [adminNome, setAdminNome] = useState("");
  const [codigoGerado, setCodigoGerado] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [clientes, setClientes] = useState<ClienteData[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("cliente");
    if (!stored) {
      router.replace("/login");
      return;
    }
    const cliente: ClienteData = JSON.parse(stored);
    if (cliente.admin !== true) {
      router.push("/principal");
    } else {
      setAdminNome(cliente.nome_cliente);
      carregarClientes();
    }
  }, [router]);

  const carregarClientes = async () => {
    const { data, error } = await supabase
      .from("cartoes_fidelidade")
      .select("*")
      .order("nome_cliente", { ascending: true });
    if (!error && data) setClientes(data as ClienteData[]);
  };

  const gerarCodigoResgate = async () => {
    setCarregando(true);
    setMensagem("Gerando...");
    setCodigoGerado("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "";
    for (let i = 0; i < 6; i++)
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    const { error } = await supabase
      .from("codigos_resgate")
      .insert([{ codigo, usado: false }]);
    if (error) setMensagem("Erro ao conectar com o banco. Tente novamente.");
    else {
      setCodigoGerado(codigo);
      setMensagem("Código gerado com sucesso!");
    }
    setCarregando(false);
  };

  const handleSair = () => {
    sessionStorage.removeItem("cliente");
    router.push("/login");
  };

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-4xl flex flex-col items-center px-4">
        <div className="bg-black/40 rounded-[3em] shadow-xl w-full flex flex-col border border-orange-500/80 p-8 gap-6">
          {/* Header */}
          <div className="flex justify-between w-full items-center">
            <h2 className="text-2xl font-bold text-white">Olá, {adminNome}</h2>
            <button
              onClick={handleSair}
              className="bg-orange-500/20 border border-orange-500/60 text-orange-400 text-xs px-3 py-1 rounded-full hover:bg-orange-500/40 transition-colors"
            >
              Sair
            </button>
          </div>

          {/* Gerar código */}
          <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-orange-500/40 via-zinc-700 to-orange-500/20">
            <div className="bg-black rounded-[2rem] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-orange-500 font-bold text-2xl uppercase">
                    Gerar Código
                  </h2>
                  <p className="text-zinc-400 mt-2">
                    Gere um novo código para o cliente
                  </p>
                </div>
                <button
                  onClick={gerarCodigoResgate}
                  disabled={carregando}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-b from-orange-400 to-orange-600 text-white font-bold shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:opacity-90 disabled:opacity-50"
                >
                  + Gerar
                </button>
              </div>
              <div className="bg-zinc-950 rounded-2xl h-32 flex items-center justify-center">
                <span className="text-6xl font-bold tracking-[1rem] text-orange-500">
                  {codigoGerado || "------"}
                </span>
              </div>
              {mensagem && (
                <p
                  className={`text-sm font-semibold mt-4 text-center ${mensagem.includes("Erro") ? "text-red-400" : "text-green-400"}`}
                >
                  {mensagem}
                </p>
              )}
            </div>
          </div>

          {/* Tabela de clientes */}
          <TabelaClientes clientes={clientes} onClientesChange={setClientes} />
        </div>
      </div>
    </ScreenBackground>
  );
}
