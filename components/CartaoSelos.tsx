interface CartaoSelosProps {
  nomeCliente: string;
  quantidadeCarimbos: number;
}

const TOTAL_SELOS = 10;

export default function CartaoSelos({ nomeCliente, quantidadeCarimbos }: CartaoSelosProps) {
  return (
    <div className="bg-black w-full rounded-3xl p-6 mb-6 shadow-xl">
      <p className="text-white text-sm mb-3 text-center font-medium">
        Olá, {nomeCliente}!
      </p>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: TOTAL_SELOS }).map((_, index) => {
          const temSelo = index < quantidadeCarimbos;
          return (
            <div
              key={index}
              className={`h-12 flex items-center justify-center rounded-xl text-2xl ${
                temSelo ? 'bg-orange-500' : 'bg-gray-200 opacity-50'
              }`}
            >
              🍔
            </div>
          );
        })}
      </div>
    </div>
  );
}
