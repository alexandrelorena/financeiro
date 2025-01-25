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
   */
  selectMonth(month: string): void {
    this.selectedMonthSubject.next(month);
  }

  /**
   * Retorna a data atual como um objeto Date.
   */
  getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Converte uma data para o formato ISO (yyyy-MM-dd).
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
   */

  formatDateFromDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDateFromStringOrDate(date: string | Date): string {
    // Garantir que a entrada seja um Date
    const validDate = typeof date === 'string' ? new Date(date) : date;
    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, '0');
    const day = String(validDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
