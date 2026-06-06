'use client';

import CartaoSelos from './CartaoSelos';
import CodigoCarimbo from './CodigoCarimbo';
import Instrucoes from './Instrucoes';
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
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-4 px-2">
        <h2 className="text-2xl font-bold text-black">Selos</h2>
        <button
          onClick={onSair}
          className="bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800"
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
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Resgatar
      </button>

      <CodigoCarimbo cliente={cliente} onCarimboAdicionado={onClienteAtualizado} />

      <Instrucoes />
    </div>
  );
}
