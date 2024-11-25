import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonthService {
  private despesasTotalSource = new BehaviorSubject<string>(''); // Total de despesas
  private selectedMonthSource = new BehaviorSubject<string>(
    this.getCurrentMonthKey()
  ); // Mês selecionado

  despesasTotal$ = this.despesasTotalSource.asObservable();
  selectedMonth$ = this.selectedMonthSource.asObservable();

  constructor() {}

  // Método para atualizar o total de despesas e o mês
  setDespesasTotal(total: string, month: string): void {
    this.despesasTotalSource.next(total);
    if (month) {
      this.selectedMonthSource.next(month);
    } else {
      console.error('Tentativa de definir um mês inválido.');
    }
  }
  // Obtém a chave do mês atual (ex.: "nov" para novembro)
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
}
