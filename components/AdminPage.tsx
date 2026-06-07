'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../src/supabase';
import type { ClienteData } from '../types';
import ScreenBackground from './ScreenBackground';

export default function AdminPage() {
  const router = useRouter();
  const [adminNome, setAdminNome] = useState('');
  const [codigoGerado, setCodigoGerado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('cliente');
    
    if (!stored) {
      router.replace('/login');
      return;
    }

    const cliente: ClienteData = JSON.parse(stored);
    
    if (cliente.admin !== true) {
      router.push('/principal');
    } else {
      setAdminNome(cliente.nome_cliente);
    }
  }, [router]);

  const gerarCodigoResgate = async () => {
    setCarregando(true);
    setMensagem('Gerando...');
    setCodigoGerado('');

    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let novoCodigo = '';
    for (let i = 0; i < 6; i++) {
      novoCodigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    const { error } = await supabase
      .from('codigos_resgate')
      .insert([
        { 
          codigo: novoCodigo, 
          usado: false 
        }
      ]);

    if (error) {
      setMensagem('Erro ao conectar com o banco. Tente novamente.');
    } else {
      setCodigoGerado(novoCodigo);
      setMensagem('Código gerado com sucesso!');
    }
    
    setCarregando(false);
  };

  const handleSair = () => {
    sessionStorage.removeItem('cliente');
    router.push('/login');
  };

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-sm flex flex-col items-center px-4">
        
        <div className="flex justify-between w-full items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Painel Admin</h2>
          <button
            onClick={handleSair}
            className="bg-orange-500/20 border border-orange-500/60 text-orange-400 text-xs px-3 py-1 rounded-full hover:bg-orange-500/40 transition-colors"
          >
            Sair
          </button>
        </div>

        <p className="text-white text-center mb-8 w-full">
          Olá, <span className="font-bold">{adminNome}</span>!
        </p>

        <div className="bg-zinc-200 w-full rounded-3xl p-6 flex flex-col items-center shadow-lg">
          
          <div className="w-full bg-white h-14 rounded-full flex items-center justify-center mb-4 shadow-inner">
            {codigoGerado ? (
              <span className="text-2xl font-mono font-extrabold text-zinc-800 tracking-widest">
                {codigoGerado}
              </span>
            ) : (
              <span className="text-zinc-400 font-mono text-xl tracking-widest">
                ------
              </span>
            )}
          </div>

          <button
            onClick={gerarCodigoResgate}
            disabled={carregando}
            className={`w-full h-14 rounded-full text-white font-bold shadow-md transition-colors ${
              carregando 
              ? 'bg-zinc-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 cursor-pointer'
            }`}
          >
            {carregando ? 'Aguarde...' : 'Gerar Código'}
          </button>
        </div>

        {mensagem && (
          <p className={`text-sm font-semibold mt-4 text-center ${mensagem.includes('Erro') ? 'text-red-400' : 'text-white'}`}>
            {mensagem}
          </p>
        )}

      </div>
    </ScreenBackground>
  );
}