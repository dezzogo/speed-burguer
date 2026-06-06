export type Tela = 'login' | 'cadastro' | 'principal';

export interface ClienteData {
  id: number;
  nome_cliente: string;
  telefone: string;
  senha: string;
  quantidade_carimbos: number;
}
