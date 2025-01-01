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
  private despesas: any[] = [];

  private despesaAdicionadaSource = new Subject<void>();
  despesaAdicionada$ = this.despesaAdicionadaSource.asObservable();

  /**
   * Construtor da classe EventService.
   * @param {HttpClient} http Serviço para chamadas HTTP.
   */
  constructor(private http: HttpClient) {}

  // Método para emitir mudanças
  // emitStatusChange(): void {
  //   this.statusChange.next();
  // }

  emitirDespesaAdicionada(): void {
    console.log('Emitindo evento de despesa adicionada...');
    this.despesaAdicionadaSource.next();
  }

  /**
   * Atualiza a lista de despesas.
   * @param {any[]} novasDespesas - Nova lista de despesas.
   */
  atualizarDespesas(novasDespesas: any[]): void {
    this.despesasSubject.next(novasDespesas);
    this.emitirDespesaAdicionada();
    this.notifyStatusChange();
  }

  adicionarDespesa(despesa: any): void {
    this.despesas.push(despesa); // Adiciona a despesa diretamente
    this.despesas = [...this.despesas]; // Garante que o Angular detecte a mudança
    this.despesaAdicionadaSource.next(); // Dispara o evento
  }

  /**
   * Atualiza o status selecionado.
   * @param {string} novoStatus - Novo status selecionado.
   */
  // atualizarStatusSelecionado(novoStatus: string): void {
  //   this.statusSelecionadoSubject.next(novoStatus);
  //   this.notifyStatusChange();
  // }

  /**
   * Retorna o status atual selecionado.
   * @returns {string} Status atual.
   */
  // obterStatusSelecionado(): string {
  //   return this.statusSelecionadoSubject.getValue();
  // }

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
}
