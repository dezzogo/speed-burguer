'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClienteData } from '../types';
import ScreenBackground from './ScreenBackground';
import CartaoSelos from './CartaoSelos';
import CodigoCarimbo from './CodigoCarimbo';
import Instrucoes from './Instrucoes';

export default function PrincipalPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('cliente');
    if (!stored) {
      router.replace('/login');
      return;
    }
    setCliente(JSON.parse(stored));
  }, [router]);

  const handleClienteAtualizado = (clienteAtualizado: ClienteData) => {
    setCliente(clienteAtualizado);
    sessionStorage.setItem('cliente', JSON.stringify(clienteAtualizado));
  };

  const handleSair = () => {
    sessionStorage.removeItem('cliente');
    router.push('/login');
  };

  if (!cliente) return null;

  const cartelaCompleta = cliente.quantidade_carimbos >= 10;

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-lg flex flex-col items-center px-6">
        <div className="bg-black/40 rounded-[3em] shadow-xl w-full flex flex-col border border-orange-500/80 p-8 gap-6">

          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Selos</h2>
            <button
              onClick={handleSair}
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
            className={`w-full rounded-full font-bold py-3 shadow-md transition-colors cursor-pointer ${
              cartelaCompleta
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Resgatar
          </button>

          <CodigoCarimbo cliente={cliente} onCarimboAdicionado={handleClienteAtualizado} />

          <Instrucoes />

        </div>
      </div>
    </ScreenBackground>
  );
}
