"use client";

import { useState } from "react";
import { supabase } from "../src/supabase";
import type { ClienteData } from "../types";

interface CodigoCarimboProps {
  cliente: ClienteData;
  onCarimboAdicionado: (clienteAtualizado: ClienteData) => void;
}

export default function CodigoCarimbo({
  cliente,
  onCarimboAdicionado,
}: CodigoCarimboProps) {
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");

  const adicionarCarimbo = async () => {
    const codigoTrimmed = codigo.trim();

    if (!codigoTrimmed) {
      setMensagem('Digite um código válido.');
      return;
    }

    if (cliente.quantidade_carimbos >= 10) {
      setMensagem("Você já completou a cartela! Resgate o seu prêmio");
      return;
    }

    setMensagem('Validando código...');

    const { data: codigoData, error: codigoError } = await supabase
      .from('codigos_resgate')
      .select('*')
      .eq('codigo', codigoTrimmed)
      .eq('usado', false)
      .single();

    if (codigoError || !codigoData) {
      setMensagem('Código inválido ou já utilizado!');
      return;
    }

    setMensagem('Adicionando selo...');

    const novaQuantidade = cliente.quantidade_carimbos + 1;

    const { error: carimboError } = await supabase
      .from('cartoes_fidelidade')
      .update({ quantidade_carimbos: novaQuantidade })
      .eq("id", cliente.id);

    if (carimboError) {
      setMensagem('Erro ao adicionar carimbo.');
      return;
    }

    await supabase
      .from('codigos_resgate')
      .update({ usado: true })
      .eq('id', codigoData.id);

    setCodigo('');
    setMensagem('✅ Selo adicionado com sucesso!');
    onCarimboAdicionado({ ...cliente, quantidade_carimbos: novaQuantidade });
  };

  return (
    <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-orange-500/60 via-zinc-700 to-orange-500/20 w-full">
      <div className="w-full rounded-[2rem] bg-zinc-950 p-6">
        <input
          type="text"
          placeholder="Digite o código"
          className="w-full h-16 mb-6 rounded-full bg-zinc-950 border border-zinc-700 text-white text-center text-xl placeholder:text-zinc-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
        />
        <button
          onClick={adicionarCarimbo}
          className="w-full h-16 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 text-white text-2xl font-bold shadow-[0_8px_25px_rgba(249,115,22,0.45)] cursor-pointer"
        >
          Adicionar
        </button>
        {mensagem && (
          <p className="mt-4 text-sm text-orange-300 font-bold text-center">
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}
