'use client'; 

import { supabase } from '../src/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetSenha(){
  const router = useRouter();
  const [telefoneReset, setTelefoneReset] = useState('');
  const [clienteReset, setClienteReset] = useState<any>(null);
  const [respostaReset, setRespostaReset] = useState('');
  const [mensagemReset, setMensagemReset] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mensagemNovaSenha, setMensagemNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

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
      router.push('/login');
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
      router.push('/login');
      setTelefoneReset('');
      setClienteReset(null);
      setRespostaReset('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
      setMensagem('✅ Senha alterada! Faça login com a nova senha.');
    }
   }
}