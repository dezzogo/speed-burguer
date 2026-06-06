'use client';

import CartaoSelos from './CartaoSelos';
import CodigoCarimbo from './CodigoCarimbo';
import Instrucoes from './Instrucoes';
import ScreenBackground from './ScreenBackground';
import type { ClienteData } from '../types';

interface PrincipalScreenProps {
  cliente: ClienteData;
  onClienteAtualizado: (clienteAtualizado: ClienteData) => void;
  onSair: () => void;
}

export default function PrincipalScreen({
  cliente,
  onClienteAtualizado,
  onSair,
}: PrincipalScreenProps) {
  const cartelaCompleta = cliente.quantidade_carimbos >= 10;

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-sm flex flex-col items-center px-4">
        <div className="flex justify-between w-full items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Selos</h2>
          <button
            onClick={onSair}
            className="bg-orange-500/20 border border-orange-500/60 text-orange-400 text-xs px-3 py-1 rounded-full hover:bg-orange-500/40 transition-colors"
          >
            Sair
          </button>
        </div>

        <CartaoSelos
          nomeCliente={cliente.nome_cliente}
          quantidadeCarimbos={cliente.quantidade_carimbos}
        />

        <button
          disabled={!cartelaCompleta}
          className={`rounded-full font-bold py-2 px-8 mb-6 shadow-md transition-colors ${
            cartelaCompleta
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
          }`}
        >
          Resgatar
        </button>

        <CodigoCarimbo cliente={cliente} onCarimboAdicionado={onClienteAtualizado} />

        <Instrucoes />
      </div>
    </ScreenBackground>
  );
}
