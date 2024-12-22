import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Gasto } from '../models/gasto.model';
import { DateService } from '../service/date.service';

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private apiUrl = 'http://localhost:8080/api/gastos';
  private despesasSubject = new BehaviorSubject<Gasto[]>([]);
  private statusSelecionadoSubject = new BehaviorSubject<string>('Todos');
  private statusChange = new Subject<void>();

  despesas$ = this.despesasSubject.asObservable();
  statusSelecionado$ = this.statusSelecionadoSubject.asObservable();
  onStatusChange$ = this.statusChange.asObservable();

  constructor(private http: HttpClient, private dateService: DateService) {}

  getDetalhes(input: string): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/${input}`)
      .pipe(catchError(this.handleError));
  }

  // Função unificada de tratamento de erro
  private handleError(
    message: string,
    error: HttpErrorResponse | any
  ): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      // Trata erros HTTP
      if (error.status === 400) {
        alert('Entrada inválida: ' + error.error); // Exibe o alert com a mensagem de erro
      } else {
        alert(`Erro ao processar a requisição. Status: ${error.status}`);
      }
    } else {
      // Trata erros não-HTTP
      alert('Erro inesperado: ' + error.message);
    }

    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error('Erro no processamento da requisição'));
  }

  // Métodos de atualização de estado local
  atualizarDespesas(despesas: Gasto[]): void {
    this.despesasSubject.next(despesas);
    this.emitStatusChange();
  }

  obterDespesas(): Gasto[] {
    return this.despesasSubject.getValue();
  }

  atualizarStatusSelecionado(novoStatus: string): void {
    this.statusSelecionadoSubject.next(novoStatus);
    this.emitStatusChange();
  }

  obterStatusSelecionado(): string {
    return this.statusSelecionadoSubject.getValue();
  }

  emitStatusChange(): void {
    this.statusChange.next();
  }

  // Obtém as despesas para um determinado mês
  getDespesas(month: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}/mes?month=${month}`);
  }

  // Métodos relacionados ao backend
  getAllDespesas(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl).pipe(
      tap((despesas) => this.atualizarDespesas(despesas)),
      catchError((error) => this.handleError('Erro ao obter despesas', error))
    );
  }

  getDespesasByMonth(month: number): Observable<Gasto[]> {
    return this.http
      .get<Gasto[]>(`${this.apiUrl}/mes?month=${month}`)
      .pipe(
        catchError((error) =>
          this.handleError('Erro ao obter despesas do mês', error)
        )
      );
  }

  criarGasto(gasto: Gasto): Observable<Gasto> {
    this.formatarDataVencimento(gasto);
    return this.http
      .post<Gasto>(this.apiUrl, gasto)
      .pipe(
        catchError((error) => this.handleError('Erro ao criar gasto', error))
      );
  }

  updateDespesa(id: number, despesa: Gasto): Observable<Gasto> {
    despesa.vencimento = this.dateService.convertToISODate(despesa.vencimento);
    const statusInfo = this.definirStatusDespesa(despesa.vencimento);
    despesa.status = statusInfo.status;

    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, despesa).pipe(
      map((response) => this.normalizeGasto(response)),
      catchError((error) =>
        this.handleError('Erro ao atualizar despesa', error)
      )
    );
  }

  deleteDespesa(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error) =>
          this.handleError('Erro ao deletar despesa', error)
        )
      );
  }

  apagarDespesasDoMes(selectedMonth: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/mes/${selectedMonth}`)
      .pipe(
        catchError((error) =>
          this.handleError('Erro ao apagar despesas', error)
        )
      );
  }

  updateStatus(id: number, status: string): Observable<Gasto> {
    return this.http
      .put<Gasto>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError((error) =>
          this.handleError('Erro ao atualizar status', error)
        )
      );
  }

  pagarDespesa(id: number): Observable<Gasto> {
    return this.http
      .put<Gasto>(`${this.apiUrl}/${id}/pagar`, { pago: true, status: 'pago' })
      .pipe(
        catchError((error) => this.handleError('Erro ao pagar despesa', error))
      );
  }

  // Métodos auxiliares
  definirStatusDespesa(dataVencimento: string | Date): {
    status: string;
    tipo: number;
  } {
    const hoje = new Date();
    const vencimento =
      typeof dataVencimento === 'string'
        ? new Date(dataVencimento)
        : dataVencimento;

    vencimento.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    if (vencimento.getTime() === hoje.getTime()) {
      return { status: 'vencendo', tipo: 3 };
    } else if (vencimento > hoje) {
      return { status: 'pendente', tipo: 0 };
    } else {
      return { status: 'vencido', tipo: 2 };
    }
  }

  formatarDataVencimento(despesa: Gasto): void {
    if (despesa.vencimento instanceof Date) {
      despesa.vencimento = this.dateService.formatDate(despesa.vencimento);
    }
  }

  normalizeGasto(gasto: Gasto): Gasto {
    if (typeof gasto.vencimento === 'string') {
      const parts = gasto.vencimento.split('-');
      gasto.vencimento = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
    }
    return gasto;
  }

  // private handleError(message: string, error: any): Observable<never> {
  //   console.error(`${message}:`, error);
  //   return throwError(() => new Error(message));
  // }
}
