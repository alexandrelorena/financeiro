export interface Gasto {
  id?: number; // O ID pode ser opcional na criação
  nome: string;
  valor: number;
  vencimento?: string | null; // Pode ser uma string ou nulo
}
