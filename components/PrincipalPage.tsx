'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClienteData } from '../types';
import ScreenBackground from './ScreenBackground';
import CartaoSelos from './CartaoSelos';
import CodigoCarimbo from './CodigoCarimbo';
import Instrucoes from './Instrucoes';
import { supabase } from '../src/supabase';
import { GoGift } from 'react-icons/go';

const TOTAL_CARTELA = 8;

export default function PrincipalPage() {
  const router = useRouter();
  const [cliente, setCliente] = useState<ClienteData | null>(null);
  const [modalResgatar, setModalResgatar] = useState(false);
  const [mensagemResgate, setMensagemResgate] = useState('');
  const [resgatando, setResgatando] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('cliente');
    if (!stored) {
      router.replace('/login');
      return;
    }
    const clienteStored: ClienteData = JSON.parse(stored);
    supabase
      .from('cartoes_fidelidade')
      .select('*')
      .eq('id', clienteStored.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setCliente(clienteStored);
        } else {
          setCliente(data as ClienteData);
          sessionStorage.setItem('cliente', JSON.stringify(data));
        }
      });
  }, [router]);

  const handleClienteAtualizado = (clienteAtualizado: ClienteData) => {
    setCliente(clienteAtualizado);
    sessionStorage.setItem('cliente', JSON.stringify(clienteAtualizado));
  };

  const handleSair = () => {
    sessionStorage.removeItem('cliente');
    router.push('/login');
  };

  const confirmarResgate = async () => {
    if (!cliente) return;
    setResgatando(true);
    setMensagemResgate('Processando...');

    const novaQtd = cliente.quantidade_carimbos - TOTAL_CARTELA;
    const novosResgates = (cliente.resgates_disponiveis || 0) + 1;

    const { error } = await supabase
      .from('cartoes_fidelidade')
      .update({ 
        quantidade_carimbos: novaQtd,
        resgates_disponiveis: novosResgates 
      })
      .eq('id', cliente.id);

    if (error) {
      setMensagemResgate('Erro ao resgatar. Tente novamente.');
      setResgatando(false);
      return;
    }

    const clienteAtualizado = { 
      ...cliente, 
      quantidade_carimbos: novaQtd,
      resgates_disponiveis: novosResgates
    };
    
    setCliente(clienteAtualizado);
    sessionStorage.setItem('cliente', JSON.stringify(clienteAtualizado));
    setModalResgatar(false);
    setMensagemResgate('');
    setResgatando(false);
  };

  if (!cliente) return null;

  const cartelaCompleta = cliente.quantidade_carimbos >= TOTAL_CARTELA;
  const temResgatePendente = cliente.resgates_disponiveis > 0;

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-lg flex flex-col items-center px-6">
        <div className="bg-black/40 rounded-[3em] shadow-xl w-full flex flex-col border border-orange-500/80 p-8 gap-6">

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Selos</h2>
            <button
              onClick={handleSair}
              className="bg-orange-500/20 border border-orange-500/60 text-orange-400 text-xs px-3 py-1 rounded-full hover:bg-orange-500/40 transition-colors"
            >
              Sair
            </button>
          </div>

          {temResgatePendente && (
            <div className="w-full bg-green-500/20 border border-green-500/50 rounded-2xl p-4 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <GoGift className="text-green-400 w-6 h-6 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-green-400 font-bold text-sm">Prêmio Disponível!</span>
                  <span className="text-green-200 text-xs">Mostre esta tela no caixa</span>
                </div>
              </div>
              <div className="bg-green-500 text-black font-extrabold text-xl w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                {cliente.resgates_disponiveis}
              </div>
            </div>
          )}

          <CartaoSelos
            nomeCliente={cliente.nome_cliente}
            quantidadeCarimbos={cliente.quantidade_carimbos}
          />

          <button
            disabled={!cartelaCompleta}
            onClick={() => { setMensagemResgate(''); setModalResgatar(true); }}
            className={`w-full rounded-full font-bold py-3 shadow-md transition-colors ${
              cartelaCompleta
                ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Converter em Prêmio
          </button>

          <CodigoCarimbo cliente={cliente} onCarimboAdicionado={handleClienteAtualizado} />

          <Instrucoes />

        </div>
      </div>

      {modalResgatar && cliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalResgatar(false)} />
          <div className="relative z-10 w-full max-w-sm bg-zinc-950 border border-orange-500/60 rounded-[2rem] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Resgatar prêmio</h3>
              <button onClick={() => setModalResgatar(false)} className="text-zinc-500 hover:text-white text-xl leading-none">✕</button>
            </div>

            <p className="text-zinc-300 text-sm mb-2">
              Você está prestes a converter seus selos em um <span className="text-orange-400 font-semibold">Combo Speed Master</span>!
            </p>
            <p className="text-zinc-300 text-sm mb-6">
              Selos atuais:{' '}
              <span className="text-orange-400 font-semibold">{cliente.quantidade_carimbos}</span>
              {cliente.quantidade_carimbos >= TOTAL_CARTELA && (
                <span className="text-zinc-400">
                  {' '}→ restarão:{' '}
                  <span className="text-green-400 font-semibold">
                    {cliente.quantidade_carimbos - TOTAL_CARTELA}
                  </span>
                </span>
              )}
            </p>

            {mensagemResgate && (
              <p className={`text-xs font-semibold mb-3 ${mensagemResgate.includes('Erro') ? 'text-red-400' : 'text-zinc-400'}`}>
                {mensagemResgate}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setModalResgatar(false)}
                className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarResgate}
                disabled={resgatando}
                className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors disabled:opacity-50"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </ScreenBackground>
  );
}