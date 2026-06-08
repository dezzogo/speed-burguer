import { LuClipboardList } from "react-icons/lu";
import { FaTrophy } from "react-icons/fa";

export default function Instrucoes() {
  return (
    <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-orange-500/50 via-zinc-700 to-orange-500/20 shadow-2xl">
      <div className="bg-black rounded-[2rem] p-5 text-white">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <LuClipboardList className="text-orange-500 text-2xl" />
          </div>

          <h3 className="text-3xl font-bold">Instruções</h3>
        </div>

        {/* Lista */}
        <div>
          {[
            "Compre um hambúrguer no Speed Burguer",
            "Peça seu código ao atendente",
            "Resgate seu código acima",
          ].map((texto, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-5 h-5 m-[0.150em] rounded-full border border-orange-500 text-orange-500 text-sm flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <p className="text-sm text-zinc-200">{texto}</p>
            </div>
          ))}
        </div>

        {/* Divisor */}
        <div className="h-px bg-zinc-800 my-4" />

        {/* Lista */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <FaTrophy className="text-orange-500 text-2xl" />
          </div>

          <div>
            <p className="text-xl font-bold text-zinc-200">
              Troque 8 carimbos por um
            </p>

            <p className="text-2xl font-bold text-orange-500">
              Combo Speed Master!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
