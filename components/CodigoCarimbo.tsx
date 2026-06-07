'use client';

import { useState } from 'react';
import { supabase } from '../src/supabase';
import type { ClienteData } from '../types';

interface CodigoCarimboProps {
  cliente: ClienteData;
  onCarimboAdicionado: (clienteAtualizado: ClienteData) => void;
}

export default function CodigoCarimbo({ cliente, onCarimboAdicionado }: CodigoCarimboProps) {
  const [codigo, setCodigo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const adicionarCarimbo = async () => {
    const codigoTrimmed = codigo.trim();

    if (!codigoTrimmed) {
      setMensagem('Digite um código válido.');
      return;
    }

    if (cliente.quantidade_carimbos >= 10) {
      setMensagem('Você já completou a cartela! Resgate o seu prêmio');
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
      .eq('id', cliente.id);

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
    <div className="bg-gray-200 w-full rounded-3xl p-6 shadow-md flex flex-col items-center mb-8">
      <input
        type="text"
        placeholder="Digite o código"
        className="bg-white rounded-full w-full py-3 px-6 mb-4 text-center text-black font-semibold outline-none focus:ring-2 focus:ring-orange-500"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
      />
      <button
        onClick={adicionarCarimbo}
        className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-3 px-8 w-full transition-colors"
      >
        Adicionar
      </button>
      {mensagem && (
        <p className="text-black font-bold mt-3 text-sm text-center">{mensagem}</p>
      )}
    </div>
  );
}
