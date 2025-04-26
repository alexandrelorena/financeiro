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

  // Observable para o array de despesas
  public despesas$ = new BehaviorSubject<any[]>([]);

  getDespesas() {
    // Retorna um Observable com o array de despesas
    return this.despesas$.asObservable();
  }

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

  setDespesas(despesas: any[]) {
    this.despesas$.next(despesas);
    this.calculateDespesas(despesas);
  }

  // Método para obter o total das despesas
  getDespesasTotal(): number {
    return this.totalDespesas;
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
    console.log('CALCULATE DESPESAS', despesas);
    this.totalDespesas = despesas.reduce(
      (total, despesa) => total + parseFloat(despesa.valor || 0),
      0
    );

    this.totalDespesasPagas = despesas
      .filter((despesa) => despesa.status?.toLowerCase() === 'pago')
      .reduce((total, despesa) => total + parseFloat(despesa.valor || 0), 0);

    this.totalDespesasNaoPagas = despesas
      .filter((despesa) => despesa.status?.toLowerCase() !== 'pago')
      .reduce((total, despesa) => total + parseFloat(despesa.valor || 0), 0);

    this.despesasTotalSource.next(this.totalDespesas);
    this.despesasPagasTotalSource.next(this.totalDespesasPagas);
    this.despesasNaoPagasTotalSource.next(this.totalDespesasNaoPagas);

    console.log('TOTAL:', this.totalDespesas);
    console.log('TOTAL PAGAS:', this.totalDespesasPagas);
    console.log('TOTAL NÃO PAGAS:', this.totalDespesasNaoPagas);
  }
}
