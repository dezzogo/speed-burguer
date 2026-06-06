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
    <main className="min-h-screen bg-orange-500 flex justify-center items-center font-sans text-black p-4">
      <div className="w-full max-w-sm relative">

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

      </div>
    </main>
  );
}
