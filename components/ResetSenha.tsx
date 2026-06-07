'use client';

import { supabase } from '../src/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiPhoneThin } from 'react-icons/pi';
import { CiLock } from 'react-icons/ci';
import { GoArrowLeft, GoShieldCheck } from 'react-icons/go';
import Logo from './Logo';
import ScreenBackground from './ScreenBackground';

type Etapa = 'telefone' | 'resposta' | 'nova-senha';

export default function ResetSenha() {
  const router = useRouter();

  const [etapa, setEtapa] = useState<Etapa>('telefone');

  const [telefoneReset, setTelefoneReset] = useState('');
  const [clienteReset, setClienteReset] = useState<any>(null);
  const [respostaReset, setRespostaReset] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Etapa 1 — buscar cliente pelo telefone
  const buscarCliente = async () => {
    if (!telefoneReset) {
      setMensagem('Digite o seu telefone.');
      return;
    }
    setCarregando(true);
    setMensagem('Buscando conta...');

    const { data, error } = await supabase
      .from('cartoes_fidelidade')
      .select('*')
      .eq('telefone', telefoneReset)
      .single();

    setCarregando(false);

    if (error || !data) {
      setMensagem('Telefone não encontrado.');
    } else {
      setClienteReset(data);
      setMensagem('');
      setEtapa('resposta');
    }
  };

  // Etapa 2 — validar resposta secreta
  const validarResposta = () => {
    if (!respostaReset) {
      setMensagem('Insira a sua resposta.');
      return;
    }
    if (respostaReset.toLowerCase().trim() === clienteReset.resposta_secreta) {
      setMensagem('');
      setEtapa('nova-senha');
    } else {
      setMensagem('Resposta incorreta. Tente novamente.');
    }
  };

  // Etapa 3 — salvar nova senha
  const salvarNovaSenha = async () => {
    if (!novaSenha || !confirmarNovaSenha) {
      setMensagem('Preencha todos os campos.');
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }
    if (novaSenha.length < 4) {
      setMensagem('A senha deve ter no mínimo 4 caracteres.');
      return;
    }

    setCarregando(true);
    setMensagem('Salvando...');

    const { error } = await supabase
      .from('cartoes_fidelidade')
      .update({ senha: novaSenha })
      .eq('id', clienteReset.id);

    setCarregando(false);

    if (error) {
      setMensagem('Erro ao salvar. Tente novamente.');
    } else {
      router.push('/login');
    }
  };

  const etapas: Etapa[] = ['telefone', 'resposta', 'nova-senha'];
  const etapaAtual = etapas.indexOf(etapa) + 1;

  return (
    <ScreenBackground>
      <div className="mx-auto max-w-sm flex flex-col items-center">
        <div className="bg-black/40 rounded-[3em] shadow-xl w-full flex flex-col items-center border border-orange-500/80">
          <div className="w-full overflow-hidden">
            <Logo />
          </div>

          <div className="w-full p-8 px-4 flex flex-col items-center gap-6">

            {/* Stepper */}
            <div className="flex items-center gap-2 w-full justify-center">
              {etapas.map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      i + 1 < etapaAtual
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : i + 1 === etapaAtual
                        ? 'border-orange-500 text-orange-500'
                        : 'border-zinc-600 text-zinc-600'
                    }`}
                  >
                    {i + 1 < etapaAtual ? '✓' : i + 1}
                  </div>
                  {i < etapas.length - 1 && (
                    <div className={`h-px w-8 ${i + 1 < etapaAtual ? 'bg-orange-500' : 'bg-zinc-600'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Etapa 1 — Telefone */}
            {etapa === 'telefone' && (
              <>
                <p className="text-zinc-400 text-sm text-center">
                  Informe o telefone cadastrado na sua conta.
                </p>

                <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
                  <div className="px-3 flex items-center justify-center">
                    <PiPhoneThin className="text-orange-500 w-5 h-5 shrink-0" />
                  </div>
                  <input
                    type="text"
                    placeholder="Telefone"
                    className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                    value={telefoneReset}
                    onChange={(e) => setTelefoneReset(e.target.value)}
                  />
                </div>

                <button
                  onClick={buscarCliente}
                  disabled={carregando}
                  className="w-full h-14 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-lg font-extrabold shadow-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Continuar
                </button>
              </>
            )}

            {/* Etapa 2 — Resposta secreta */}
            {etapa === 'resposta' && (
              <>
                <p className="text-zinc-400 text-sm text-center">
                  Responda à pergunta de segurança da sua conta.
                </p>

                {/* Exibe a pergunta escolhida no cadastro */}
                {clienteReset?.pergunta_secreta && (
                  <div className="w-full bg-zinc-800/60 border border-zinc-700 rounded-2xl px-4 py-3">
                    <p className="text-orange-400 text-sm font-medium text-center">
                      {clienteReset.pergunta_secreta}
                    </p>
                  </div>
                )}

                <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
                  <div className="px-3 flex items-center justify-center">
                    <GoShieldCheck className="text-orange-500 w-5 h-5 shrink-0" />
                  </div>
                  <input
                    type="text"
                    placeholder="Sua resposta"
                    className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                    value={respostaReset}
                    onChange={(e) => setRespostaReset(e.target.value)}
                  />
                </div>

                <button
                  onClick={validarResposta}
                  className="w-full h-14 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-lg font-extrabold shadow-xl hover:opacity-90 transition-opacity"
                >
                  Confirmar
                </button>
              </>
            )}

            {/* Etapa 3 — Nova senha */}
            {etapa === 'nova-senha' && (
              <>
                <p className="text-zinc-400 text-sm text-center">
                  Escolha uma nova senha para a sua conta.
                </p>

                <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
                  <div className="px-3 flex items-center justify-center">
                    <CiLock className="text-orange-500 w-5 h-5 shrink-0" />
                  </div>
                  <input
                    type="password"
                    placeholder="Nova senha"
                    className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                  />
                </div>

                <div className="w-full flex border border-orange-500 rounded-2xl overflow-hidden">
                  <div className="px-3 flex items-center justify-center">
                    <CiLock className="text-orange-500 w-5 h-5 shrink-0" />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    className="h-14 pl-2 grow bg-transparent text-zinc-300 placeholder:text-zinc-400 outline-none"
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  />
                </div>

                <button
                  onClick={salvarNovaSenha}
                  disabled={carregando}
                  className="w-full h-14 rounded-full bg-gradient-to-t from-orange-500 to-orange-800 text-white text-lg font-extrabold shadow-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Salvar nova senha
                </button>
              </>
            )}

            {/* Mensagem de erro/status */}
            {mensagem && (
              <p className="text-red-400 text-sm font-semibold text-center">{mensagem}</p>
            )}

            {/* Voltar */}
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
