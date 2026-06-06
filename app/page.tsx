'use client';

import { useState } from 'react';
import LoginScreen from '../components/LoginScreen';
import CadastroScreen from '../components/CadastroScreen';
import PrincipalScreen from '../components/PrincipalScreen';
import type { Tela, ClienteData } from '../types';

export default function Home() {
  const [tela, setTela] = useState<Tela>('login');
  const [cliente, setCliente] = useState<ClienteData | null>(null);

  const handleLoginSuccess = (dadosCliente: ClienteData) => {
    setCliente(dadosCliente);
    setTela('principal');
  };

  const handleSair = () => {
    setCliente(null);
    setTela('login');
  };

  return (
    <main>
      {tela === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onIrParaCadastro={() => setTela('cadastro')}
        />
      )}

      {tela === 'cadastro' && (
        <CadastroScreen
          onCadastroSuccess={handleLoginSuccess}
          onVoltarParaLogin={() => setTela('login')}
        />
      )}

      {tela === 'principal' && cliente && (
        <PrincipalScreen
          cliente={cliente}
          onClienteAtualizado={setCliente}
          onSair={handleSair}
        />
      )}
    </main>
  );
}
