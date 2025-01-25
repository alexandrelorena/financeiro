import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Gasto, TipoGasto } from '../models/gasto.model';
import { DateService } from '../service/date.service';

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private apiUrl = 'http://localhost:8080/api/gastos';

  private despesasSubject = new BehaviorSubject<Gasto[]>([]);
  private statusSelecionadoSubject = new BehaviorSubject<string>('Todos');
  private statusChange = new Subject<void>();
  private despesaAdicionadaSubject = new Subject<void>();

  despesas$ = this.despesasSubject.asObservable();
  statusSelecionado$ = this.statusSelecionadoSubject.asObservable();
  onStatusChange$ = this.statusChange.asObservable();
  despesaAdicionada$ = this.despesaAdicionadaSubject.asObservable();

  constructor(private http: HttpClient, private dateService: DateService) {}

  /**
   * Atualiza as despesas localmente e emite um evento de mudança de status.
   * @param despesas Lista de despesas a ser atualizada.
   */
  atualizarDespesas(despesas: Gasto[]): void {
    this.despesasSubject.next(despesas);
    this.emitStatusChange();
  }

  /**
   * Obtém as despesas de um mês específico.
   * @param month Número do mês para buscar despesas.
   * @returns Observable com a lista de despesas do mês.
   */
  getDespesas(month: number): Observable<Gasto[]> {
    return this.http
      .get<Gasto[]>(`${this.apiUrl}/mes?month=${month}`)
      .pipe(
        catchError(
          this.handleError('Erro ao obter despesas do mês', 'getDespesas')
        )
      );
  }

  /**
   * Cria uma nova despesa no sistema.
   */
  criarGasto(gasto: Gasto): Observable<Gasto> {
    this.formatarDataVencimento(gasto);
    return this.http.post<Gasto>(this.apiUrl, gasto).pipe(
      tap(() => this.emitirDespesaAdicionada()),
      catchError(this.handleError('Erro ao criar despesa', 'criarGasto'))
    );
  }

  /**
   * Atualiza uma despesa existente.
   */
  updateDespesa(id: number, despesa: Gasto): Observable<Gasto> {
    despesa.vencimento = this.dateService.convertToISODate(despesa.vencimento);
    despesa.status = this.definirStatusDespesa(
      despesa.vencimento,
      despesa.status
    ).status;

    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, despesa).pipe(
      map((response) => this.normalizeGasto(response)),
      catchError(this.handleError('Erro ao atualizar despesa', 'updateDespesa'))
    );
  }

  /**
   * Deleta uma despesa pelo ID.
   */
  deleteDespesa(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError('Erro ao deletar despesa', 'deleteDespesa'))
      );
  }

  /**
   * Apaga todas as despesas de um mês específico.
   */
  apagarDespesasDoMes(selectedMonth: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/mes/${selectedMonth}`)
      .pipe(
        catchError(
          this.handleError(
            'Erro ao apagar despesas do mês',
            'apagarDespesasDoMes'
          )
        )
      );
  }

  /**
   * Atualiza o status de uma despesa.
   * @returns Observable com o gasto atualizado.
   */
  updateStatus(id: number, status: string): Observable<Gasto> {
    return this.http
      .put<Gasto>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError(
          this.handleError(
            'Erro ao atualizar status da despesa',
            'updateStatus'
          )
        )
      );
  }

  /**
   * Marca uma despesa como paga.
   */
  pagarDespesa(id: number): Observable<Gasto> {
    return this.http
      .put<Gasto>(`${this.apiUrl}/${id}/pagar`, { pago: true, status: 'pago' })
      .pipe(
        catchError(this.handleError('Erro ao pagar despesa', 'pagarDespesa'))
      );
  }

  /**
   * Define o status de uma despesa com base em sua data de vencimento e status atual.
   */
  definirStatusDespesa(
    dataVencimento: string | Date,
    statusAtual: string
  ): { status: string; tipo: number } {
    const hoje = new Date();
    const vencimento =
      typeof dataVencimento === 'string'
        ? new Date(dataVencimento)
        : dataVencimento;

    vencimento.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    if (statusAtual === 'pago') return { status: 'pago', tipo: 1 };
    if (vencimento.getTime() === hoje.getTime() && statusAtual === 'pendente')
      return { status: 'vencendo', tipo: 2 };
    if (vencimento < hoje && statusAtual !== 'pago')
      return { status: 'vencido', tipo: 3 };
    if (vencimento > hoje && statusAtual === 'pendente')
      return { status: 'pendente', tipo: 0 };

    return { status: statusAtual, tipo: this.mapStatusToTipo(statusAtual) };
  }

  /**
   * Mapeia o status de uma despesa para um tipo numérico.
   */
  mapStatusToTipo(status: string): TipoGasto {
    switch (status) {
      case 'pendente':
        return 0;
      case 'pago':
        return 1;
      case 'vencendo':
        return 2;
      case 'vencido':
        return 3;
      default:
        throw new Error(`Status desconhecido: ${status}`);
    }
  }

  /**
   * Formata a data de vencimento de uma despesa.
   */
  formatarDataVencimento(despesa: Gasto): void {
    if (despesa.vencimento instanceof Date) {
      despesa.vencimento = this.dateService.formatDateFromDate(
        despesa.vencimento
      );
    }
  }

  /**
   * Normaliza o formato da data de vencimento de um gasto.
   */
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

  /**
   * Trata erros ocorridos em requisições HTTP.
   */
  private handleError(
    userMessage: string,
    method: string
  ): (error: HttpErrorResponse | any) => Observable<never> {
    return (error) => {
      let errorMessage = `${userMessage}: ${error.message || error}`;
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400) {
          errorMessage = `Entrada inválida: ${error.error}`;
        } else {
          errorMessage = `Erro ao processar a requisição no método ${method}. Status: ${error.status}`;
        }
      }
      console.error(errorMessage);
      alert(errorMessage);
      return throwError(() => new Error(userMessage));
    };
  }

  /**
   * Emite um evento para notificar que uma despesa foi adicionada.
   */
  emitirDespesaAdicionada(): void {
    this.despesaAdicionadaSubject.next();
  }

  /**
   * Emite um evento de mudança de status.
   */
  emitStatusChange(): void {
    this.statusChange.next();
  }
}
