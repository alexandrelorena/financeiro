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
   */
  despesas$ = this.despesasSubject.asObservable();

  /**
   * Status atual selecionado.
   */
  private statusSelecionadoSubject = new BehaviorSubject<string>('Todos');

  /**
   * Observable do status atual.
   */
  statusSelecionado$ = this.statusSelecionadoSubject.asObservable();

  /**
   * Notificação de mudanças de status.
   */
  private statusChange = new Subject<void>();

  /**
   * Observable para escutar mudanças de status.
   */
  onStatusChange$ = this.statusChange.asObservable();

  /**
   * Lista local de despesas.
   */
  private despesas: any[] = [];

  private despesaAdicionadaSource = new Subject<void>();
  despesaAdicionada$ = this.despesaAdicionadaSource.asObservable();

  /**
   * Construtor da classe EventService.
   */
  constructor(private http: HttpClient) {}

  emitirDespesaAdicionada(): void {
    console.log('Emitindo evento de despesa adicionada...');
    this.despesaAdicionadaSource.next();
  }

  /**
   * Atualiza a lista de despesas.
   */
  atualizarDespesas(novasDespesas: any[]): void {
    this.despesasSubject.next(novasDespesas);
    this.emitirDespesaAdicionada();
    this.notifyStatusChange();
  }

  adicionarDespesa(despesa: any): void {
    this.despesas.push(despesa);
    this.despesas = [...this.despesas];
    this.despesaAdicionadaSource.next();
  }

  /**
   * Atualiza o status selecionado.
   */
  // atualizarStatusSelecionado(novoStatus: string): void {
  //   this.statusSelecionadoSubject.next(novoStatus);
  //   this.notifyStatusChange();
  // }

  /**
   * Retorna o status atual selecionado.
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
   */
  onStatusChange(): Observable<void> {
    return this.statusChange.asObservable();
  }
}
