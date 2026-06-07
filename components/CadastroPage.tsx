'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../src/supabase';
import { useState } from 'react';
import type { ClienteData } from '../types';
import { CiLock } from 'react-icons/ci';
import { PiPhoneThin } from 'react-icons/pi';
import { MdPersonOutline } from 'react-icons/md';
import { GoArrowLeft, GoShieldCheck } from 'react-icons/go';
import Logo from './Logo';
import ScreenBackground from './ScreenBackground';

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [respostaSecreta, setRespostaSecreta] = useState('');
  const [mensagem, setMensagem] = useState('');

  const PERGUNTAS_SECRETAS = [
    'Qual o nome do seu primeiro pet?',
    'Qual a cidade onde você nasceu?',
    'Qual o nome da sua mãe?',
    'Qual era o nome da sua escola primária?',
    'Qual o seu time de futebol favorito?',
  ];
  const [perguntaSelecionada, setPerguntaSelecionada] = useState(PERGUNTAS_SECRETAS[0]);

  const fazerCadastro = async () => {
    const nomeTrimmed = nome.trim();
    const telefoneTrimmed = telefone.trim();
    const senhaTrimmed = senha.trim();
    const respostaTrimmed = respostaSecreta.trim().toLowerCase();

    if (!nomeTrimmed || !telefoneTrimmed || !senhaTrimmed || !respostaTrimmed) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    setMensagem('Verificando dados...');

    // Verifica se o telefone já está cadastrado
    const { data: existente } = await supabase
      .from('cartoes_fidelidade')
      .select('id')
      .eq('telefone', telefoneTrimmed)
      .maybeSingle();

    if (existente) {
      setMensagem('Este telefone já possui uma conta cadastrada.');
      return;
    }

    setMensagem('Criando conta...');

    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .insert([{
        nome_cliente: nomeTrimmed,
        telefone: telefoneTrimmed,
        senha: senhaTrimmed,
        quantidade_carimbos: 0,
        pergunta_secreta: perguntaSelecionada,
        resposta_secreta: respostaTrimmed,
      }])
      .select()
      .single();

    if (error) {
      setMensagem('Erro ao criar conta. Tente novamente.');
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

            {/* Pergunta secreta */}
            <div className="w-full flex flex-col gap-2">
              <label className="text-zinc-400 text-xs px-1">Pergunta de segurança</label>
              <div className="w-full border border-orange-500 rounded-2xl overflow-hidden">
                <select
                  value={perguntaSelecionada}
                  onChange={(e) => setPerguntaSelecionada(e.target.value)}
                  className="w-full h-14 px-4 bg-transparent text-zinc-300 outline-none appearance-none cursor-pointer"
                >
                  {PERGUNTAS_SECRETAS.map((p) => (
                    <option key={p} value={p} className="bg-zinc-900 text-zinc-300">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resposta secreta */}
            <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
              <div className="px-3 flex items-center justify-center">
                <GoShieldCheck className="text-orange-500 w-5 h-5 shrink-0" />
              </div>
              <input
                type="text"
                placeholder="Sua resposta"
                className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                value={respostaSecreta}
                onChange={(e) => setRespostaSecreta(e.target.value)}
              />
            </div>

            <button
              onClick={fazerCadastro}
              className="w-full h-16 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-2xl font-extrabold shadow-xl hover:opacity-90 transition-opacity cursor-pointer"
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
