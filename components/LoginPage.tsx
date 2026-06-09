'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../src/supabase';
import { useState } from 'react';
import type { ClienteData } from '../types';
import { CiLock } from 'react-icons/ci';
import { PiPhoneThin } from 'react-icons/pi';
import { GoQuestion, GoEye, GoEyeClosed } from 'react-icons/go';
import { MdPersonOutline } from 'react-icons/md';
import Logo from './Logo';
import ScreenBackground from './ScreenBackground';

export default function LoginPage() {
  const router = useRouter();
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const fazerLogin = async () => {
    // Regex para extrair apenas os números na hora do login também
    const telefoneNumeros = telefone.replace(/\D/g, '');
    const senhaTrimmed = senha.trim();

    if (!telefoneNumeros || !senhaTrimmed) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    setMensagem('Entrando...');

    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .select('*')
      .eq('telefone', telefoneNumeros)
      .eq('senha', senhaTrimmed)
      .single();

    if (error || !data) {
      setMensagem('Telefone ou senha incorretos.');
    } else {
      sessionStorage.setItem('cliente', JSON.stringify(data as ClienteData));
      
      if (data.admin === true) {
        router.push('/admin');
      } else {
        router.push('/principal');
      }
    }
  };

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-sm flex flex-col items-center">
        <div className="bg-black/40 rounded-[3em] shadow-xl w-full flex flex-col items-center border border-orange-500/80">
          <div className="w-full overflow-hidden">
            <Logo />
          </div>

          <div className="w-full p-8 px-4 flex flex-col items-center gap-6">
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

            {/* Input de senha atualizado com o olhinho */}
            <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden pr-3">
              <div className="px-3 flex items-center justify-center">
                <CiLock className="text-orange-500 w-5 h-5 shrink-0" />
              </div>
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="flex items-center justify-center text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer"
              >
                {mostrarSenha ? <GoEye className="w-5 h-5" /> : <GoEyeClosed className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={fazerLogin}
              className="w-full h-16 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-2xl font-extrabold shadow-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              Entrar
            </button>

            {mensagem && (
              <p className="text-red-400 text-sm font-semibold text-center">{mensagem}</p>
            )}

            <div className="flex justify-between gap-8 w-full text-orange-500 text-sm font-semibold">
              <div className="flex items-center gap-1 shrink-0">
                <GoQuestion className="text-orange-500 w-8 h-8 shrink-0" />
                <button
                  onClick={() => router.push('/reset-senha')}
                  className="hover:text-orange-400 cursor-pointer whitespace-nowrap"
                >
                  Esqueceu a senha?
                </button>
              </div>

              <div className="flex items-center gap-1">
                <MdPersonOutline className="text-orange-500 w-8 h-8 shrink-0" />
                <button
                  onClick={() => router.push('/cadastro')}
                  className="hover:text-orange-400 cursor-pointer text-left leading-tight"
                >
                  Não tem uma conta? Registre-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenBackground>
  );
}