interface CartaoSelosProps {
  nomeCliente: string;
  quantidadeCarimbos: number;
}

const TOTAL_SELOS = 8;

export default function CartaoSelos({
  nomeCliente,
  quantidadeCarimbos,
}: CartaoSelosProps) {
  return (
    <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-br from-orange-500/40 via-zinc-700 to-orange-500/20 shadow-2xl w-full">
      <div className="bg-black rounded-[2.5rem] p-8 py-4">
        <p className="text-white text-3xl font-semibold mb-3 text-center">
          Olá, {nomeCliente}!
        </p>
        <div className="grid grid-cols-4 gap-2 place-items-center">
          {Array.from({ length: TOTAL_SELOS }).map((_, index) => {
            const temSelo = index < quantidadeCarimbos;
            return (
              <div
                key={index}
                className={`h-14 w-14 flex items-center justify-center border shadow-lg transition-all duration-300 rounded-2xl text-2xl ${
                  temSelo
                    ? "bg-orange-500 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.35)]"
                    : "bg-zinc-900 border-zinc-700"
                }`}
              >
                {temSelo && <span className="text-4xl">🍔</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
