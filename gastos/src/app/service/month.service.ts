import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonthService {
  public despesasTotalSource = new BehaviorSubject<number>(0);
  private selectedMonthSource = new BehaviorSubject<string>(
    this.getCurrentMonthKey()
  );

  private despesasFiltradasTotal$ = new BehaviorSubject<number>(0);
  public despesasPagasTotalSource = new BehaviorSubject<number>(0);
  public despesasNaoPagasTotalSource = new BehaviorSubject<number>(0);

  despesasTotal$ = this.despesasTotalSource.asObservable();
  selectedMonth$ = this.selectedMonthSource.asObservable();
  totalComDesconto = new BehaviorSubject<number>(0);
  // private despesasFiltradasTotalSubject = new BehaviorSubject<number>(0);

  // Observable para o total das despesas filtradas
  getDespesasFiltradasTotal() {
    return this.despesasFiltradasTotal$.asObservable();
  }

  // Atualiza o total das despesas filtradas
  updateDespesasFiltradasTotal(total: number): void {
    this.despesasFiltradasTotal$.next(total);
  }

  totalDespesas: number = 0;
  totalDespesasPagas: number = 0;
  totalDespesasNaoPagas: number = 0;

  constructor() {}

  // Método para atualizar o total de despesas e o mês
  setDespesasTotal(total: number, month: string): void {
    this.despesasTotalSource.next(total);
    if (month) {
      this.selectedMonthSource.next(month);
    } else {
      console.error('Tentativa de definir um mês inválido.');
    }
  }

  private getCurrentMonthKey(): string {
    const monthKeys = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez',
    ];
    const currentMonthIndex = new Date().getMonth(); // Índice do mês (0 a 11)
    return monthKeys[currentMonthIndex];
  }

  calculateDespesas(despesas: any[]): void {
    console.log('Despesas carregadas:', despesas);

    // Somando todas as despesas
    this.totalDespesas = despesas.reduce(
      (total, despesa) => total + parseFloat(despesa.valor || 0),
      0
    );

    // Calculando o total de despesas pagas
    this.totalDespesasPagas = despesas
      .filter(
        (despesa) => despesa.status && despesa.status.toLowerCase() === 'pago'
      ) // Ajuste para comparar corretamente o status
      .reduce((total, despesa) => total + parseFloat(despesa.valor || 0), 0);
    console.log('Total Despesas Pagas:', this.totalDespesasPagas);

    // Calculando o total de despesas não pagas (vencendo ou pendente)
    this.totalDespesasNaoPagas = despesas
      .filter(
        (despesa) => despesa.status && despesa.status.toLowerCase() !== 'pago'
      ) // Filtra as despesas não pagas
      .reduce((total, despesa) => total + parseFloat(despesa.valor || 0), 0);
    console.log('Total Despesas Não Pagas:', this.totalDespesasNaoPagas);

    // Subtraindo as despesas pagas do total de despesas para obter as não pagas
    const totalDespesasNaoPagasFinal =
      this.totalDespesas - this.totalDespesasPagas;

    // Enviando os resultados para os observables
    this.despesasTotalSource.next(this.totalDespesas);
    this.despesasPagasTotalSource.next(this.totalDespesasPagas);
    this.despesasNaoPagasTotalSource.next(this.totalDespesasNaoPagas);

    console.log('Total Despesas:', this.totalDespesas);
  }
}
