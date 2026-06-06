'use client';

import { useState } from 'react';
import { supabase } from '../src/supabase';

const PERGUNTAS_SECRETAS = [
  'Qual o nome do seu primeiro pet?',
  'Qual a cidade onde você nasceu?',
  'Qual o nome da sua mãe?',
  'Qual era o nome da sua escola primária?',
  'Qual o seu time de futebol favorito?',
];

export default function Home() {
  // Estado para controlar qual tela mostrar: 'login', 'cadastro' ou 'principal'
  const [tela, setTela] = useState<'login' | 'cadastro' | 'principal' | 'resetSenha' | 'novaSenha'>('login');

  // Estados para a tela de Login
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemLogin, setMensagemLogin] = useState('');

  // Estados para a tela de Cadastro
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [telefoneCadastro, setTelefoneCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [perguntaCadastro, setPerguntaCadastro] = useState(PERGUNTAS_SECRETAS[0]);
  const [respostaCadastro, setRespostaCadastro] = useState('');
  const [mensagemCadastro, setMensagemCadastro] = useState('');

  // Estados para a Tela Principal (Dados do Cliente Logado)
  const [dadosCliente, setDadosCliente] = useState<any>(null);

  // Estados para controlar os Carimbos
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [mensagemCarimbo, setMensagemCarimbo] = useState('');

  // Reset de senha
  const [telefoneReset, setTelefoneReset] = useState('');
  const [clienteReset, setClienteReset] = useState<any>(null);
  const [respostaReset, setRespostaReset] = useState('');
  const [mensagemReset, setMensagemReset] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mensagemNovaSenha, setMensagemNovaSenha] = useState('');

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
      setTelefone('');
      setSenha('');
    }
  };

  // --- FUNÇÃO DE CADASTRO ---
  const fazerCadastro = async () => {
    if (!nomeCadastro || !telefoneCadastro || !senhaCadastro || !respostaCadastro) {
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
          quantidade_carimbos: 0, // Novo usuário começa com 0 carimbos
          pergunta_secreta: perguntaCadastro,
          resposta_secreta: respostaCadastro.toLowerCase().trim()
          
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

   // --- RESET: — buscar cliente pelo telefone ---
  const buscarCliente = async() =>{
    if (!telefoneReset){
      setMensagemReset("Digite o seu telefone");
      return
    } 
    setMensagemReset("Buscando conta...");
    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .select('*')
      .eq('telefone', telefoneReset)
      .single();

    if (error || !data) {
      setMensagemReset('Telefone não encontrado.');
    } else {
      setClienteReset(data);
      setMensagemReset('');
    }
  }
  // --- RESET: — validar resposta secreta ---
  const validarResposta = () => {
    if (!respostaReset){
      setMensagemReset("Insira a sua resposta")
      return
    }
    if (respostaReset.toLowerCase().trim() === clienteReset.resposta_secreta) {
      setMensagemReset('');
      setTela('novaSenha');
    }else{
      setMensagemReset("Não foi possivel concluir. Tente novamente")
    }
  }
   // --- RESET: — salvar nova senha ---
   const salvarNovaSenha = async() =>{
    if (!novaSenha || !confirmarNovaSenha){
      setMensagemNovaSenha("Preencha todos os campos");
      return
    }
    if (novaSenha != confirmarNovaSenha){
      setMensagemNovaSenha("As senhas não coincidem");
      return
    }
    if (novaSenha.length < 4){
      setMensagemNovaSenha("A senha deve ter no minimo 4 caracteres");
      return;
    }
    setMensagemNovaSenha('Salvando...');
    const { error } = await supabase
      .from('cartoes_fidelidade')
      .update({ senha: novaSenha })
      .eq('id', clienteReset.id);

     if (error) {
      setMensagemNovaSenha('Erro ao salvar. Tente novamente.');
    } else {
      setTela('login');
      setTelefoneReset('');
      setClienteReset(null);
      setRespostaReset('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setMensagemLogin('✅ Senha alterada! Faça login com a nova senha.');
    }
   }

  // --- FUNÇÃO DE ADICIONAR CARIMBO ---
  const resgatarCarimbo = async () => {
    if (codigoDigitado !== CODIGO_SECRETO_ATENDENTE) {
      setMensagemCarimbo('Código inválido!');
      return;
    }

    if (dadosCliente.quantidade_carimbos >= 10) {
      setMensagemCarimbo('Você já completou a cartela! Resgate o seu prêmio');
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
         {/* ── TELA RESET — ETAPA 1 e 2 ── */}
        {tela === 'resetSenha' && (
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 text-gray-800 text-xl font-bold py-6 px-12 rounded-[3rem] mb-6 text-center shadow-lg w-full">
              Recuperar Senha
            </div>
            <div className="bg-black w-full rounded-[3rem] p-8 shadow-xl flex flex-col items-center">
              <h2 className="text-white text-2xl font-bold mb-2">Esqueceu a senha?</h2>
              <p className="text-gray-400 text-sm mb-6 text-center">Informe seu telefone e responda a pergunta secreta</p>
              <input type="text" placeholder="Telefone cadastrado"
                className="bg-gray-200 rounded-full w-full py-3 px-6 mb-4 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
                value={telefoneReset} onChange={(e) => setTelefoneReset(e.target.value)}
                disabled={!!clienteReset} />
              {!clienteReset && (
                <button onClick={buscarCliente}
                  className="bg-orange-500 text-white font-bold rounded-full py-3 px-10 hover:bg-orange-600 transition-colors w-full mb-4">
                  Continuar
                </button>
              )}
              {clienteReset && (
                <>
                  <div className="bg-gray-800 rounded-2xl w-full p-4 mb-4 text-center">
                    <p className="text-gray-400 text-xs mb-1 uppercase tracking-widest">Pergunta secreta</p>
                    <p className="text-white text-sm font-semibold">{clienteReset.pergunta_secreta}</p>
                  </div>
                  <input type="text" placeholder="Sua resposta"
                    className="bg-gray-200 rounded-full w-full py-3 px-6 mb-6 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
                    value={respostaReset} onChange={(e) => setRespostaReset(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && validarResposta()} />
                  <button onClick={validarResposta}
                    className="bg-orange-500 text-white font-bold rounded-full py-3 px-10 hover:bg-orange-600 transition-colors w-full mb-4">
                    Validar
                  </button>
                </>
              )}
              {mensagemReset && <p className="text-red-400 text-sm mb-4 text-center">{mensagemReset}</p>}
              <button onClick={() => setTela('login')}
                className="text-gray-400 hover:text-white text-sm font-semibold underline">
                Voltar para o Login
              </button>
            </div>
          </div>
        )}

        {/* ── TELA NOVA SENHA — ETAPA 3 ── */}
        {tela === 'novaSenha' && (
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 text-gray-800 text-xl font-bold py-6 px-12 rounded-[3rem] mb-6 text-center shadow-lg w-full">
              Nova Senha
            </div>
            <div className="bg-black w-full rounded-[3rem] p-8 shadow-xl flex flex-col items-center">
              <h2 className="text-white text-2xl font-bold mb-2">Criar nova senha</h2>
              <p className="text-gray-400 text-sm mb-6 text-center">Olá, {clienteReset?.nome_cliente}! Defina sua nova senha.</p>
              <input type="password" placeholder="Nova senha"
                className="bg-gray-200 rounded-full w-full py-3 px-6 mb-4 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
                value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
              <input type="password" placeholder="Confirmar nova senha"
                className="bg-gray-200 rounded-full w-full py-3 px-6 mb-6 text-center text-black outline-none focus:ring-2 focus:ring-orange-500"
                value={confirmarNovaSenha} onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && salvarNovaSenha()} />
              <button onClick={salvarNovaSenha}
                className="bg-green-600 text-white font-bold rounded-full py-3 px-10 hover:bg-green-700 transition-colors w-full mb-4">
                Salvar Nova Senha
              </button>
              {mensagemNovaSenha && <p className="text-red-400 text-sm text-center">{mensagemNovaSenha}</p>}
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