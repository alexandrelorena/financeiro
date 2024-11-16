import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  // BehaviorSubject para armazenar o mês selecionado
  private selectedMonthSubject = new BehaviorSubject<string>('');
  // Observable que emite mudanças no mês selecionado
  selectedMonth$ = this.selectedMonthSubject.asObservable();

  private static readonly INVALID_DATE_ERROR =
    'A data fornecida é inválida. Use um objeto Date ou uma string ISO.';

  private static readonly INVALID_STRING_FORMAT_ERROR =
    'A string fornecida não está no formato esperado.';

  constructor() {}

  /**
   * Atualiza o mês selecionado.
   * @param month - Mês no formato string.
   */
  selectMonth(month: string): void {
    this.selectedMonthSubject.next(month);
  }

  /**
   * Retorna a data atual como um objeto Date.
   * @returns A data atual.
   */
  getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Converte uma data para o formato ISO (yyyy-MM-dd).
   * @param date - Objeto Date ou string representando uma data.
   * @returns A data no formato ISO.
   * @throws Erro caso a data seja inválida.
   */
  convertToISODate(date: Date | string): string {
    if (!date) {
      throw new Error(DateService.INVALID_DATE_ERROR);
    }

    if (typeof date === 'string') {
      if (!/^\d{4}-\d{2}-\d{2}/.test(date)) {
        throw new Error(DateService.INVALID_STRING_FORMAT_ERROR);
      }
      return date.split('T')[0]; // Retorna apenas a parte da data (yyyy-MM-dd)
    }

    // Se for um objeto Date, formata para yyyy-MM-dd
    return date.toISOString().split('T')[0];
  }

  /**
   * Formata uma data no formato dd/MM/yyyy.
   * @param date - Objeto Date a ser formatado.
   * @returns A data formatada como string.
   */
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
