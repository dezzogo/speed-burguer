"use client";

import { LuClipboardList } from "react-icons/lu";
import { FaTrophy } from "react-icons/fa";

interface InstrucoesProps {
  totalCarimbos: number;
  premio: string;
}

export default function Instrucoes({
  totalCarimbos,
  premio,
}: InstrucoesProps) {
  console.log(totalCarimbos, premio)
  return (
    <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-orange-500/50 via-zinc-700 to-orange-500/20 shadow-2xl">
      <div className="bg-black rounded-[2rem] p-6 text-white">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <LuClipboardList className="text-orange-500 text-2xl" />
          </div>

          <h3 className="text-3xl font-bold">
            Instruções
          </h3>
        </div>

        {/* Lista */}
        <div className="space-y-4">
          {[
            "Compre um hambúrguer no Speed Burger",
            "Peça seu código ao atendente",
            "Resgate seu código acima",
          ].map((texto, index) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <div className="w-7 h-7 rounded-full border border-orange-500 text-orange-500 text-sm flex items-center justify-center font-bold shrink-0">
                {index + 1}
              </div>

              <p className="text-lg text-zinc-200">
                {texto}
              </p>
            </div>
          ))}
        </div>

        {/* Divisor */}
        <div className="h-px bg-zinc-800 my-6" />

        {/* Recompensa dinâmica */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
            <FaTrophy className="text-orange-500 text-2xl" />
          </div>

          <div>
            <p className="text-xl font-bold text-zinc-200">
              Troque {totalCarimbos} carimbos por um
            </p>

            <p className="text-2xl font-bold text-orange-500">
              {premio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}