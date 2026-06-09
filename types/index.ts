export type Tela = 'login' | 'cadastro' | 'principal' | 'admin';

export interface ClienteData {
  id: number;
  nome_cliente: string;
  telefone: string;
  senha: string;
  quantidade_carimbos: number;
  admin: boolean;
  resgates_disponiveis: number;
}
