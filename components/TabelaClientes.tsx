"use client";

import { useRef, useState } from "react";
import { supabase } from "../src/supabase";
import type { ClienteData } from "../types";

type ModalTipo = "editar" | "excluir" | "consumir" | null;

interface ModalState {
  tipo: ModalTipo;
  cliente: ClienteData | null;
}

interface TabelaClientesProps {
  clientes: ClienteData[];
  totalCartela: number;
  onClientesChange: (clientes: ClienteData[]) => void;
}

export default function TabelaClientes({ clientes, totalCartela, onClientesChange }: TabelaClientesProps) {
  const [busca, setBusca] = useState("");
  const [menuAbertoId, setMenuAbertoId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [modal, setModal] = useState<ModalState>({ tipo: null, cliente: null });
  const [editNome, setEditNome] = useState("");
  const [editTelefone, setEditTelefone] = useState("");
  const [editCarimbos, setEditCarimbos] = useState(0);
  const [editResgates, setEditResgates] = useState(0);
  const [modalMensagem, setModalMensagem] = useState("");

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome_cliente.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca)
  );

  const abrirEditar = (cliente: ClienteData) => {
    setEditNome(cliente.nome_cliente);
    setEditTelefone(cliente.telefone);
    setEditCarimbos(cliente.quantidade_carimbos);
    setEditResgates(cliente.resgates_disponiveis || 0);
    setModalMensagem("");
    setModal({ tipo: "editar", cliente });
    setMenuAbertoId(null);
  };

  const abrirExcluir = (cliente: ClienteData) => {
    setModalMensagem("");
    setModal({ tipo: "excluir", cliente });
    setMenuAbertoId(null);
  };

  const abrirConsumir = (cliente: ClienteData) => {
    setModalMensagem("");
    setModal({ tipo: "consumir", cliente });
    setMenuAbertoId(null);
  };

  const fecharModal = () => setModal({ tipo: null, cliente: null });

  const salvarEdicao = async () => {
    if (!modal.cliente) return;
    const nomeTrimmed = editNome.trim();
    const telTrimmed = editTelefone.trim();
    if (!nomeTrimmed || !telTrimmed) {
      setModalMensagem("Preencha todos os campos.");
      return;
    }
    const { error } = await supabase
      .from("cartoes_fidelidade")
      .update({ 
        nome_cliente: nomeTrimmed, 
        telefone: telTrimmed, 
        quantidade_carimbos: editCarimbos,
        resgates_disponiveis: editResgates
      })
      .eq("id", modal.cliente.id);
    
    if (error) { setModalMensagem("Erro ao salvar."); return; }
    
    onClientesChange(
      clientes.map((c) =>
        c.id === modal.cliente!.id
          ? { ...c, nome_cliente: nomeTrimmed, telefone: telTrimmed, quantidade_carimbos: editCarimbos, resgates_disponiveis: editResgates }
          : c
      )
    );
    fecharModal();
  };

  const excluirCliente = async () => {
    if (!modal.cliente) return;
    const { error } = await supabase
      .from("cartoes_fidelidade")
      .delete()
      .eq("id", modal.cliente.id);
    if (error) { setModalMensagem("Erro ao excluir."); return; }
    onClientesChange(clientes.filter((c) => c.id !== modal.cliente!.id));
    fecharModal();
  };

  const consumirPrêmio = async () => {
    if (!modal.cliente) return;
    const atualResgates = modal.cliente.resgates_disponiveis || 0;
    
    if (atualResgates < 1) {
      setModalMensagem("O cliente não possui prêmios disponíveis no momento.");
      return;
    }
    
    const novaQtdResgates = atualResgates - 1;
    
    const { error } = await supabase
      .from("cartoes_fidelidade")
      .update({ resgates_disponiveis: novaQtdResgates })
      .eq("id", modal.cliente.id);
      
    if (error) { setModalMensagem("Erro ao dar baixa no prêmio."); return; }
    
    onClientesChange(
      clientes.map((c) =>
        c.id === modal.cliente!.id ? { ...c, resgates_disponiveis: novaQtdResgates } : c
      )
    );
    fecharModal();
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Clientes</h3>
        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      <div className="rounded-[2rem] border border-zinc-800 bg-black overflow-clip" ref={menuRef}>
        <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1.5fr_40px] px-6 py-4 border-b border-zinc-800">
          <span className="text-orange-500 font-bold text-sm">NOME</span>
          <span className="text-orange-500 font-bold text-sm">CARIMBOS</span>
          <span className="text-orange-500 font-bold text-sm">PRÊMIOS</span>
          <span className="text-orange-500 font-bold text-sm">TELEFONE</span>
          <span />
        </div>

        {clientesFiltrados.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-8">
            Nenhum cliente encontrado.
          </p>
        )}

        {clientesFiltrados.map((cliente, index) => {
          const abrirParaCima = index >= clientesFiltrados.length - 2;
          return (
          <div key={cliente.id} className="border-b border-zinc-900 last:border-0 relative">

            <div className="md:hidden px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-orange-500 font-bold text-sm shrink-0">
                {cliente.nome_cliente.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white text-sm font-medium truncate">{cliente.nome_cliente}</span>
                <span className="text-zinc-400 text-xs">{cliente.telefone}</span>
              </div>
              <div className="ml-auto flex flex-col items-end gap-1 shrink-0">
                <span className="text-zinc-300 text-xs">🍔 {cliente.quantidade_carimbos}</span>
                <span className="text-green-400 text-xs font-bold">🎁 {cliente.resgates_disponiveis || 0}</span>
              </div>
              <MenuBotao
                clienteId={cliente.id}
                aberto={menuAbertoId === cliente.id}
                abrirParaCima={abrirParaCima}
                onToggle={() => setMenuAbertoId(menuAbertoId === cliente.id ? null : cliente.id)}
                onEditar={() => abrirEditar(cliente)}
                onExcluir={() => abrirExcluir(cliente)}
                onConsumir={() => abrirConsumir(cliente)}
              />
            </div>

            <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1.5fr_40px] px-6 py-5 items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-orange-500 font-bold text-sm shrink-0">
                  {cliente.nome_cliente.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-white text-sm truncate">{cliente.nome_cliente}</span>
              </div>
              <span className="text-zinc-300 text-sm">🍔 {cliente.quantidade_carimbos}</span>
              <span className="text-green-400 font-bold text-sm">🎁 {cliente.resgates_disponiveis || 0}</span>
              <span className="text-zinc-300 text-sm">{cliente.telefone}</span>
              <MenuBotao
                clienteId={cliente.id}
                aberto={menuAbertoId === cliente.id}
                abrirParaCima={abrirParaCima}
                onToggle={() => setMenuAbertoId(menuAbertoId === cliente.id ? null : cliente.id)}
                onEditar={() => abrirEditar(cliente)}
                onExcluir={() => abrirExcluir(cliente)}
                onConsumir={() => abrirConsumir(cliente)}
              />
            </div>

          </div>
          );
        })}
      </div>

      {modal.tipo === "editar" && modal.cliente && (
        <Modal titulo="Editar cliente" onFechar={fecharModal}>
          <label className="text-zinc-400 text-xs mb-1">Nome</label>
          <input value={editNome} onChange={(e) => setEditNome(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 mb-3" />
          <label className="text-zinc-400 text-xs mb-1">Telefone</label>
          <input value={editTelefone} onChange={(e) => setEditTelefone(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 mb-3" />
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="text-zinc-400 text-xs mb-1">Carimbos 🍔</label>
              <input type="number" min={0} max={99} value={editCarimbos} onChange={(e) => setEditCarimbos(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500" />
            </div>
            <div className="flex-1">
              <label className="text-green-400 font-bold text-xs mb-1">Prêmios 🎁</label>
              <input type="number" min={0} max={99} value={editResgates} onChange={(e) => setEditResgates(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-green-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-green-500" />
            </div>
          </div>

          {modalMensagem && <p className="text-red-400 text-xs mb-3">{modalMensagem}</p>}
          <div className="flex gap-3">
            <button onClick={fecharModal} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors text-sm">Cancelar</button>
            <button onClick={salvarEdicao} className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-colors">Salvar</button>
          </div>
        </Modal>
      )}

      {modal.tipo === "excluir" && modal.cliente && (
        <Modal titulo="Excluir cliente" onFechar={fecharModal}>
          <p className="text-zinc-300 text-sm mb-6">
            Tem certeza que deseja excluir{" "}
            <span className="text-white font-semibold">{modal.cliente.nome_cliente}</span>?
            Esta ação não pode ser desfeita.
          </p>
          {modalMensagem && <p className="text-red-400 text-xs mb-3">{modalMensagem}</p>}
          <div className="flex gap-3">
            <button onClick={fecharModal} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors text-sm">Cancelar</button>
            <button onClick={excluirCliente} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors">Excluir</button>
          </div>
        </Modal>
      )}

      {modal.tipo === "consumir" && modal.cliente && (
        <Modal titulo="Entregar Prêmio" onFechar={fecharModal}>
          <p className="text-zinc-300 text-sm mb-2">
            Cliente: <span className="text-white font-semibold">{modal.cliente.nome_cliente}</span>
          </p>
          <p className="text-zinc-300 text-sm mb-6">
            Prêmios disponíveis:{" "}
            <span className="text-green-400 font-bold">{modal.cliente.resgates_disponiveis || 0}</span>
            {(modal.cliente.resgates_disponiveis || 0) > 0 && (
              <span className="text-zinc-400">
                {" "}→ após entrega:{" "}
                <span className="text-orange-400 font-semibold">
                  {(modal.cliente.resgates_disponiveis || 0) - 1}
                </span>
              </span>
            )}
          </p>
          {modalMensagem && <p className="text-red-400 text-xs mb-3">{modalMensagem}</p>}
          <div className="flex gap-3">
            <button onClick={fecharModal} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors text-sm">Cancelar</button>
            <button onClick={consumirPrêmio} className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors">Entregar Lanche</button>
          </div>
        </Modal>
      )}
    </>
  );
}

interface MenuBotaoProps {
  clienteId: number;
  aberto: boolean;
  abrirParaCima?: boolean;
  onToggle: () => void;
  onEditar: () => void;
  onExcluir: () => void;
  onConsumir: () => void;
}

function MenuBotao({ aberto, abrirParaCima, onToggle, onEditar, onExcluir, onConsumir }: MenuBotaoProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-lg"
      >
        ⋮
      </button>
      {aberto && (
        <div
          className="absolute right-0 z-50 w-48 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl overflow-hidden"
          style={abrirParaCima ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }}
        >
          <button onClick={onEditar} className="w-full px-4 py-3 text-left text-sm text-zinc-200 hover:bg-zinc-800 transition-colors flex items-center gap-2">
            ✏️ Editar dados
          </button>
          <button onClick={onConsumir} className="w-full px-4 py-3 text-left text-sm text-green-400 hover:bg-zinc-800 transition-colors flex items-center gap-2">
            🎁 Dar baixa em prêmio
          </button>
          <button onClick={onExcluir} className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-zinc-800 transition-colors flex items-center gap-2">
            🗑️ Excluir
          </button>
        </div>
      )}
    </div>
  );
}

interface ModalProps {
  titulo: string;
  onFechar: () => void;
  children: React.ReactNode;
}

function Modal({ titulo, onFechar, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative z-10 w-full max-w-sm bg-zinc-950 border border-orange-500/60 rounded-[2rem] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold text-lg">{titulo}</h3>
          <button onClick={onFechar} className="text-zinc-500 hover:text-white text-xl leading-none">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}