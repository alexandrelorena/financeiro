export interface Gasto {
  id: number;
  nome: string;
  valor: number;
  vencimento: string | Date; // Aceita tanto uma string quanto um Date
  status: string;
  pago: boolean;
  cssClass?: string; // Adicionando a propriedade cssClass
}
