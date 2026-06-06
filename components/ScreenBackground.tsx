interface ScreenBackgroundProps {
  children: React.ReactNode;
}

/**
 * Fundo compartilhado por todas as telas da aplicação.
 * Gradiente escuro + camada de noise para textura.
 */
export default function ScreenBackground({ children }: ScreenBackgroundProps) {
  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center py-6 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black">
      {/* Noise */}
      <div
        className="fixed inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative w-full">{children}</div>
    </div>
  );
}
