import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Para chamadas HTTP

@Injectable({
  providedIn: 'root',
})
export class EventService {
  // Suporte para despesas
  private despesasSubject = new BehaviorSubject<any[]>([]); // Lista de despesas
  despesas$ = this.despesasSubject.asObservable();

  private statusSelecionadoSubject = new BehaviorSubject<string>('Todos'); // Status atual
  statusSelecionado$ = this.statusSelecionadoSubject.asObservable();

  private statusChange = new Subject<void>(); // Notificação de mudanças

  private despesas = [];

  // Observable para escutar mudanças
  onStatusChange$ = this.statusChange.asObservable();

  // Método para emitir mudanças
  emitStatusChange(): void {
    this.statusChange.next();
  }

  constructor(private http: HttpClient) {}

  // Métodos para gerenciar despesas
  atualizarDespesas(novasDespesas: any[]) {
    this.despesasSubject.next(novasDespesas); // Atualiza a lista de despesas
    this.notifyStatusChange(); // Notifica a mudança
  }

  obterDespesas() {
    return this.despesasSubject.getValue(); // Retorna a lista atual de despesas
  }

  // Métodos para gerenciar status
  atualizarStatusSelecionado(novoStatus: string) {
    this.statusSelecionadoSubject.next(novoStatus);
    this.notifyStatusChange(); // Notifica a mudança
  }

  obterStatusSelecionado() {
    return this.statusSelecionadoSubject.getValue();
  }

  // Métodos para disparar e escutar mudanças de status
  notifyStatusChange() {
    this.statusChange.next();
  }

  onStatusChange() {
    return this.statusChange.asObservable();
  }

  // Método para apagar despesas do mês selecionado
  apagarDespesasDoMes(selectedMonthNumber: number): Observable<any> {
    const url = `http://localhost:8080/api/gastos/mes/${selectedMonthNumber}`;
    console.log(`Requisição DELETE para: ${url}`); // Verifique a URL no console
    this.notifyStatusChange();

    return this.http.delete(url);
  }
}
