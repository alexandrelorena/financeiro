export enum TipoGasto {
  pendente = 0,
  pago = 1,
  vencendo = 2,
  vencido = 3,
}

export interface Gasto {
  disableButtons?: boolean;
  id: number;
  nome: string;
  categoria: string;
  valor: number;
  vencimento: string | Date;
  status: string;
  tipo: TipoGasto;
  cssClass?: string;
  repeticoes: number;
  origem: string;
}
