'use client';

import { useState } from 'react';
import { supabase } from '../src/supabase';

export default function Home() {
  // Estado para controlar qual tela mostrar: 'login', 'cadastro' ou 'principal'
  const [tela, setTela] = useState<'login' | 'cadastro' | 'principal'>('login');

  // Estados para a tela de Login
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemLogin, setMensagemLogin] = useState('');

  // Estados para a tela de Cadastro
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [telefoneCadastro, setTelefoneCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [mensagemCadastro, setMensagemCadastro] = useState('');

  // Estados para a Tela Principal (Dados do Cliente Logado)
  const [dadosCliente, setDadosCliente] = useState<any>(null);

  // Estados para controlar os Carimbos
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [mensagemCarimbo, setMensagemCarimbo] = useState('');

  // Código de resgate fixo para o MVP acadêmico
  const CODIGO_SECRETO_ATENDENTE = 'SPEED2024';

  // --- FUNÇÃO DE LOGIN ---
  const fazerLogin = async () => {
    if (!telefone || !senha) {
      setMensagemLogin('Por favor, preencha todos os campos.');
      return;
    }

    setMensagemLogin('Entrando...');
    
    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .select('*')
      .eq('telefone', telefone)
      .eq('senha', senha)
      .single();

    if (error || !data) {
      setMensagemLogin('Telefone ou senha incorretos.');
    } else {
      setDadosCliente(data);
      setTela('principal');
      setMensagemLogin('');
    }
  };

  // --- FUNÇÃO DE CADASTRO ---
  const fazerCadastro = async () => {
    if (!nomeCadastro || !telefoneCadastro || !senhaCadastro) {
      setMensagemCadastro('Por favor, preencha todos os campos.');
      return;
    }

    setMensagemCadastro('Criando conta...');

    // Insere o novo cliente diretamente na tabela do Supabase
    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .insert([
        {
          nome_cliente: nomeCadastro,
          telefone: telefoneCadastro,
          senha: senhaCadastro,
          quantidade_carimbos: 0 // Novo usuário começa com 0 carimbos
        }
      ])
      .select()
      .single();

    if (error) {
      setMensagemCadastro('Erro ao criar conta. Verifique os dados ou mude o telefone.');
    } else {
      setMensagemCadastro('✅ Conta criada com sucesso!');
      // Faz o login automático salvando os dados e mudando de tela
      setDadosCliente(data);
      setTela('principal');
      
      // Limpa os campos do formulário
      setNomeCadastro('');
      setTelefoneCadastro('');
      setSenhaCadastro('');
    }
  };

  // --- FUNÇÃO DE ADICIONAR CARIMBO ---
  const resgatarCarimbo = async () => {
    if (codigoDigitado !== CODIGO_SECRETO_ATENDENTE) {
      setMensagemCarimbo('Código inválido!');
      return;
    }

    if (dadosCliente.quantidade_carimbos >= 10) {
      setMensagemCarimbo('Você já completou a cartela!');
      return;
    }

    setMensagemCarimbo('Adicionando...');

    const novaQuantidade = dadosCliente.quantidade_carimbos + 1;

    const { error } = await supabase
      .from('cartoes_fidelidade')
      .update({ quantidade_carimbos: novaQuantidade })
      .eq('id', dadosCliente.id);

    if (error) {
      setMensagemCarimbo('Erro ao adicionar carimbo.');
    } else {
      setDadosCliente({ ...dadosCliente, quantidade_carimbos: novaQuantidade });
      setMensagemCarimbo('✅ Selo adicionado com sucesso!');
      setCodigoDigitado('');
    }
  };

  const totalSelos = Array.from({ length: 10 });

  return (
    <main className="min-h-screen bg-orange-500 flex justify-center items-center font-sans text-black p-4">
      <div className="w-full max-w-sm relative">
        
        {/* TELA DE LOGIN */}
        {tela === 'login' && (
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 text-gray-800 text-xl font-bold py-10 px-12 rounded-[3rem] mb-8 text-center shadow-lg w-full">
              Speed Burger Logo
            </div>

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

              {mensagemLogin && <p className="text-red-400 mt-4 text-sm">{mensagemLogin}</p>}

              <div className="flex justify-between w-full mt-6 text-orange-500 text-sm font-semibold">
                <button 
                  onClick={() => setTela('cadastro')} 
                  className="hover:text-orange-400 cursor-pointer"
                >
                  Criar minha conta
                </button>
                <button className="hover:text-orange-400 cursor-pointer">Esqueceu a senha?</button>
              </div>
            </div>
          </div>
        )}

        {/* TELA DE CADASTRO */}
        {tela === 'cadastro' && (
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
                value={nomeCadastro}
                onChange={(e) => setNomeCadastro(e.target.value)}
              />

              <input
                type="text"
                placeholder="Telefone"
                className="bg-gray-200 rounded-full w-full py-3 px-6 mb-4 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
                value={telefoneCadastro}
                onChange={(e) => setTelefoneCadastro(e.target.value)}
              />
              
              <input
                type="password"
                placeholder="Senha"
                className="bg-gray-200 rounded-full w-full py-3 px-6 mb-6 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
                value={senhaCadastro}
                onChange={(e) => setSenhaCadastro(e.target.value)}
              />
              
              <button
                onClick={fazerCadastro}
                className="bg-orange-500 text-white font-bold rounded-full py-3 px-10 hover:bg-orange-600 transition-colors w-full mb-4"
              >
                Cadastrar e Entrar
              </button>

              {mensagemCadastro && <p className="text-red-400 text-sm mb-4">{mensagemCadastro}</p>}

              <button 
                onClick={() => setTela('login')} 
                className="text-gray-400 hover:text-white text-sm font-semibold underline"
              >
                Voltar para o Login
              </button>
            </div>
          </div>
        )}

        {/* TELA PRINCIPAL (LOGADO) */}
        {tela === 'principal' && (
          <div className="flex flex-col items-center">
            
            <div className="flex justify-between w-full items-center mb-4 px-2">
              <h2 className="text-2xl font-bold text-black">Selos</h2>
              {/* Botão Sair adicionado para facilitar os testes acadêmicos */}
              <button 
                onClick={() => { setTela('login'); setDadosCliente(null); }} 
                className="bg-black text-white text-xs px-3 py-1 rounded-full hover:bg-gray-800"
              >
                Sair
              </button>
            </div>

            <div className="bg-black w-full rounded-3xl p-6 mb-6 shadow-xl">
              <p className="text-white text-sm mb-3 text-center font-medium">Olá, {dadosCliente?.nome_cliente}!</p>
              <div className="grid grid-cols-5 gap-3">
                {totalSelos.map((_, index) => {
                  const temSelo = index < dadosCliente?.quantidade_carimbos;
                  return (
                    <div 
                      key={index} 
                      className={`h-12 flex items-center justify-center rounded-xl text-2xl ${temSelo ? 'bg-orange-500' : 'bg-gray-200 opacity-50'}`}
                    >
                      🍔
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              disabled={dadosCliente?.quantidade_carimbos < 10}
              className={`rounded-full font-bold py-2 px-8 mb-6 shadow-md transition-colors ${dadosCliente?.quantidade_carimbos >= 10 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Resgatar
            </button>

            <div className="bg-gray-200 w-full rounded-3xl p-6 shadow-md flex flex-col items-center mb-8">
              <input
                type="text"
                placeholder="Digite o código"
                className="bg-white rounded-full w-full py-3 px-6 mb-4 text-center text-black font-semibold outline-none focus:ring-2 focus:ring-orange-500"
                value={codigoDigitado}
                onChange={(e) => setCodigoDigitado(e.target.value.toUpperCase())}
              />
              <button
                onClick={resgatarCarimbo}
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full py-3 px-8 w-full transition-colors"
              >
                Adicionar
              </button>
              {mensagemCarimbo && <p className="text-black font-bold mt-3 text-sm text-center">{mensagemCarimbo}</p>}
            </div>

            <div className="text-black w-full px-2">
              <h3 className="font-bold text-xl text-center mb-4">Instruções</h3>
              <ol className="list-decimal list-inside space-y-2 font-medium text-lg">
                <li>Compre um hambúrguer no Speed Burguer</li>
                <li>Peça seu código ao atendente</li>
                <li>Resgate seu código acima</li>
              </ol>
              <p className="mt-8 text-center font-bold text-xl leading-tight">
                Troque 10 carimbos por um<br/>Combo Speed Master!
              </p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}