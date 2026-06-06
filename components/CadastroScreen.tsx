'use client';

import { useState } from 'react';
import { supabase } from '../src/supabase';
import type { ClienteData } from '../types';

interface CadastroScreenProps {
  onCadastroSuccess: (cliente: ClienteData) => void;
  onVoltarParaLogin: () => void;
}

export default function CadastroScreen({ onCadastroSuccess, onVoltarParaLogin }: CadastroScreenProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const fazerCadastro = async () => {
    if (!nome || !telefone || !senha) {
      setMensagem('Por favor, preencha todos os campos.');
      return;
    }

    setMensagem('Criando conta...');

    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .insert([{ nome_cliente: nome, telefone, senha, quantidade_carimbos: 0 }])
      .select()
      .single();

    if (error) {
      setMensagem('Erro ao criar conta. Verifique os dados ou mude o telefone.');
    } else {
      setMensagem('✅ Conta criada com sucesso!');
      setNome('');
      setTelefone('');
      setSenha('');
      onCadastroSuccess(data as ClienteData);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-200 text-gray-800 text-xl font-bold py-6 px-12 rounded-[3rem] mb-6 text-center shadow-lg w-full">
        Cadastro
      </div>

      <div className="bg-black w-full rounded-[3rem] p-8 shadow-xl flex flex-col items-center">
        <h2 className="text-white text-2xl font-bold mb-6">Criar Conta</h2>

        <input
          type="text"
          placeholder="Nome Completo"
          className="bg-gray-200 rounded-full w-full py-3 px-6 mb-4 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

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
          onClick={fazerCadastro}
          className="bg-orange-500 text-white font-bold rounded-full py-3 px-10 hover:bg-orange-600 transition-colors w-full mb-4"
        >
          Cadastrar e Entrar
        </button>

        {mensagem && <p className="text-red-400 text-sm mb-4">{mensagem}</p>}

        <button
          onClick={onVoltarParaLogin}
          className="text-gray-400 hover:text-white text-sm font-semibold underline"
        >
          Voltar para o Login
        </button>
      </div>
    </div>
  );
}
