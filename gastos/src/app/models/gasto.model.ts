export interface Gasto {
  id: number;
  nome: string;
  valor: number;
  vencimento: string | Date; // Aceita tanto uma string quanto um Date
  status: string;
  tipo: 0 | 1 | 2; // Definindo que tipo pode ser 0, 1 ou 2
  cssClass?: string; // Adicionando a propriedade cssClass
}
