import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  /**
   * Suporte para despesas.
   * @private
   */
  private despesasSubject = new BehaviorSubject<any[]>([]);

  /**
   * Observable da lista de despesas.
   * @type {Observable<any[]>}
   */
  despesas$ = this.despesasSubject.asObservable();

  /**
   * Status atual selecionado.
   * @private
   */
  private statusSelecionadoSubject = new BehaviorSubject<string>('Todos');

  /**
   * Observable do status atual.
   * @type {Observable<string>}
   */
  statusSelecionado$ = this.statusSelecionadoSubject.asObservable();

  /**
   * Notificação de mudanças de status.
   * @private
   */
  private statusChange = new Subject<void>();

  /**
   * Observable para escutar mudanças de status.
   * @type {Observable<void>}
   */
  onStatusChange$ = this.statusChange.asObservable();

  /**
   * Lista local de despesas.
   * @private
   * @type {any[]}
   */
  private despesas = [];

  /**
   * Construtor da classe EventService.
   * @param {HttpClient} http Serviço para chamadas HTTP.
   */

  // Método para emitir mudanças
  emitStatusChange(): void {
    this.statusChange.next();
  }

  constructor(private http: HttpClient) {}

  /**
   * Atualiza a lista de despesas.
   * @param {any[]} novasDespesas - Nova lista de despesas.
   */
  atualizarDespesas(novasDespesas: any[]): void {
    this.despesasSubject.next(novasDespesas);
    this.notifyStatusChange();
  }

  /**
   * Retorna a lista atual de despesas.
   * @returns {any[]} Lista atual de despesas.
   */
  obterDespesas(): any[] {
    return this.despesasSubject.getValue();
  }

  /**
   * Atualiza o status selecionado.
   * @param {string} novoStatus - Novo status selecionado.
   */
  atualizarStatusSelecionado(novoStatus: string): void {
    this.statusSelecionadoSubject.next(novoStatus);
    this.notifyStatusChange();
  }

  /**
   * Retorna o status atual selecionado.
   * @returns {string} Status atual.
   */
  obterStatusSelecionado(): string {
    return this.statusSelecionadoSubject.getValue();
  }

  /**
   * Notifica mudanças no status.
   */
  notifyStatusChange(): void {
    this.statusChange.next();
  }

  /**
   * Escuta mudanças no status.
   * @returns {Observable<void>} Observable de mudanças de status.
   */
  onStatusChange(): Observable<void> {
    return this.statusChange.asObservable();
  }

  /**
   * Apaga despesas do mês selecionado.
   * @param {number} selectedMonthNumber - Número do mês selecionado.
   * @returns {Observable<any>} Resultado da operação.
   */
  apagarDespesasDoMes(selectedMonthNumber: number): Observable<any> {
    const url = `http://localhost:8080/api/gastos/mes/${selectedMonthNumber}`;
    this.notifyStatusChange();

    return this.http.delete(url);
  }
}
