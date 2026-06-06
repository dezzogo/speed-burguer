'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../src/supabase';
import { useState } from 'react';
import type { ClienteData } from '../types';
import { CiLock } from 'react-icons/ci';
import { PiPhoneThin } from 'react-icons/pi';
import { MdPersonOutline } from 'react-icons/md';
import { GoArrowLeft } from 'react-icons/go';
import Logo from './Logo';
import ScreenBackground from './ScreenBackground';

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const PERGUNTAS_SECRETAS = [
  'Qual o nome do seu primeiro pet?',
  'Qual a cidade onde você nasceu?',
  'Qual o nome da sua mãe?',
  'Qual era o nome da sua escola primária?',
  'Qual o seu time de futebol favorito?',
];
  const [respostaCadastro, setRespostaCadastro] = useState('');
  const [perguntaCadastro, setPerguntaCadastro] = useState(PERGUNTAS_SECRETAS[0]);

  const fazerCadastro = async () => {
    if (!nome || !telefone || !senha || !respostaCadastro) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    setMensagem('Criando conta...');

    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .insert([{ nome_cliente: nome, telefone, senha, quantidade_carimbos: 0, perguntaCadastro, respostaCadastro}])
      .select()
      .single();

    if (error) {
      setMensagem('Erro ao criar conta. Verifique os dados ou mude o telefone.');
    } else {
      sessionStorage.setItem('cliente', JSON.stringify(data as ClienteData));
      router.push('/principal');
    }
  };

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-sm flex flex-col items-center">
        <div className="bg-black/40 rounded-[3em] shadow-xl w-full flex flex-col items-center border border-orange-500/80">
          <div className="w-full overflow-hidden">
            <Logo />
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h1 className="text-orange-500 font-bold text-3xl">Cadastre-se</h1>
            <p className="text-zinc-300 text-lg px-10">Crie sua conta e obtenha o benefício do seu Cartão Fidelidade!</p>
          </div>

          <div className="w-full p-8 px-4 flex flex-col items-center gap-6">
            <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
              <div className="px-3 flex items-center justify-center">
                <MdPersonOutline className="text-orange-500 w-5 h-5 shrink-0" />
              </div>
              <input
                type="text"
                placeholder="Nome Completo"
                className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

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
              onClick={fazerCadastro}
              className="w-full h-16 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-2xl font-extrabold shadow-xl hover:opacity-90 transition-opacity"
            >
              Cadastrar e Entrar
            </button>

            {mensagem && (
              <p className="text-red-400 text-sm font-semibold">{mensagem}</p>
            )}

            <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
              <GoArrowLeft className="w-5 h-5 shrink-0" />
              <button
                onClick={() => router.push('/login')}
                className="hover:text-orange-400 cursor-pointer"
              >
                Voltar para o Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScreenBackground>
  );
}
