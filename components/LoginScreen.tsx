'use client';

import { useState } from 'react';
import { supabase } from '../src/supabase';
import Logo from './Logo';
import type { ClienteData } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (cliente: ClienteData) => void;
  onIrParaCadastro: () => void;
}

export default function LoginScreen({ onLoginSuccess, onIrParaCadastro }: LoginScreenProps) {
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const fazerLogin = async () => {
    if (!telefone || !senha) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    setMensagem('Entrando...');

    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .select('*')
      .eq('telefone', telefone)
      .eq('senha', senha)
      .single();

    if (error || !data) {
      setMensagem('Telefone ou senha incorretos.');
    } else {
      setMensagem('');
      onLoginSuccess(data as ClienteData);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Logo />

      <div className="bg-black w-full rounded-[3rem] p-8 shadow-xl flex flex-col items-center">
        <h2 className="text-white text-2xl font-bold mb-6">Login</h2>

        <input
          type="text"
          placeholder="Telefone"
          className="bg-gray-200 rounded-full w-full py-3 px-6 mb-4 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="bg-gray-200 rounded-full w-full py-3 px-6 mb-6 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={fazerLogin}
          className="bg-gray-200 text-black font-bold rounded-full py-3 px-10 hover:bg-white transition-colors"
        >
          Entrar
        </button>

        {mensagem && <p className="text-red-400 mt-4 text-sm">{mensagem}</p>}

        <div className="flex justify-between w-full mt-6 text-orange-500 text-sm font-semibold">
          <button
            onClick={onIrParaCadastro}
            className="hover:text-orange-400 cursor-pointer"
          >
            Criar minha conta
          </button>
          <button className="hover:text-orange-400 cursor-pointer">Esqueceu a senha?</button>
        </div>
      </div>
    </div>
  );
}
