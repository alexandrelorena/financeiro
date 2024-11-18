import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Gasto } from '../models/gasto.model';

import { DateService } from '../service/date.service'; // Importe o DateService

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private apiUrl = 'http://localhost:8080/api/gastos'; // URL da API backend
  public hoje: Date = new Date();

  constructor(
    private http: HttpClient,
    private dateService: DateService // Injete o DateService no construtor
  ) {}

  formatarDataVencimento(despesa: Gasto): void {
    if (despesa.vencimento instanceof Date) {
      // Usando o DateService para a formatação
      despesa.vencimento = this.dateService.formatDate(despesa.vencimento); // Método centralizado
    }
  }

  // Cria uma nova despesa
  criarGasto(gasto: Gasto): Observable<Gasto> {
    this.formatarDataVencimento(gasto); // Formatar a data antes de enviar
    return this.http.post<Gasto>(this.apiUrl, gasto);
  }

  addDespesa(despesa: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(`${this.apiUrl}/despesas`, despesa);
  }

  // Obtém as despesas para um determinado mês
  getDespesas(month: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}/mes?month=${month}`);
  }

  // Obtém todas as despesas
  getAllDespesas(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl);
  }

  // Obtém uma despesa pelo ID
  getDespesaById(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  definirStatusDespesa(despesa: Gasto): string {
    const vencimentoDate = new Date(despesa.vencimento);

    const hoje = new Date(this.hoje);
    hoje.setHours(0, 0, 0, 0); // Definindo a hora como 00:00:00

    const vencimento = new Date(vencimentoDate);
    vencimento.setHours(0, 0, 0, 0); // Definindo a hora como 00:00:00

    // let statusVencimento: string;

    // Verificando o tipo para determinar o status
    // if (despesa.tipo === 1) {
    //   statusVencimento = 'pago'; // Tipo 1 significa "Pago"
    // } else if (vencimento.getTime() === hoje.getTime()) {
    //   statusVencimento = 'venceHoje'; // Exatamente hoje
    // } else if (vencimento.getTime() > hoje.getTime()) {
    //   statusVencimento = 'pendente'; // Data futura
    // } else {
    //   statusVencimento = 'vencido'; // Data passada
    // }

    if (despesa.tipo === 1) {
      return 'pago';
    } else if (vencimentoDate < hoje) {
      return 'vencido';
    } else if (vencimentoDate.getTime() === hoje.getTime()) {
      return 'vence hoje';
    } else {
      return 'pendente';
    }

    // if (despesa.tipo === 1) {
    //   statusVencimento = 'pago'; // Tipo 1 significa "Pago"
    // } else if (vencimentoDate < hoje) {
    //   statusVencimento = 'vencido'; // Vencido
    // } else if (vencimentoDate.toDateString() === hoje.toDateString()) {
    //   statusVencimento = 'vence hoje'; // Vence hoje
    // } else {
    //   statusVencimento = 'pendente'; // Pendente
    // }

    // Usando switch para retornar o status
    // switch (statusVencimento) {
    //   case 'pago':
    //     return 'pago';
    //   case 'venceHoje':
    //     return 'vence hoje';
    //   case 'pendente':
    //     return 'pendente';
    //   case 'vencido':
    //     return 'vencido';
    //   default:
    //     return ''; // Caso nenhuma condição seja atendida
    // }
  }

  // Atualiza uma despesa existente
  updateDespesa(id: number, despesa: Gasto): Observable<Gasto> {
    // Antes de enviar para a API, a data pode ser convertida para ISO 8601 (string)
    // despesa.vencimento = this.dateService.convertToISODate(despesa.vencimento);
    despesa.vencimento = this.dateService.convertToISODate(despesa.vencimento);
    console.log('Data formatada para envio:', despesa.vencimento);

    // Atualizar status
    despesa.status = this.definirStatusDespesa(despesa);

    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, despesa).pipe(
      map((response: Gasto) => {
        console.log('Resposta recebida:', response);

        // Se a resposta tiver a data como string, converta para o formato correto
        if (typeof response.vencimento === 'string') {
          const parts = response.vencimento.split('-'); // Quebra no formato yyyy-MM-dd
          response.vencimento = new Date(
            parseInt(parts[0], 10), // Ano
            parseInt(parts[1], 10) - 1, // Mês (0 indexado)
            parseInt(parts[2], 10) // Dia
          );
        }
        return response;
      })
    );
  }

  pagarDespesa(id: number): Observable<Gasto> {
    const url = `${this.apiUrl}/${id}/pagar`; // Endpoint para marcar como pago
    return this.http.put<Gasto>(url, { pago: true, status: 'Pago' }).pipe(
      tap((response) => console.log('Despesa paga:', response)),
      catchError((error) => {
        console.error('Erro ao pagar a despesa:', error);
        return throwError(error);
      })
    );
  }

  // Deleta uma despesa pelo ID
  deleteDespesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para atualizar apenas o status de uma despesa
  updateStatus(id: number, novoStatus: string): Observable<Gasto> {
    return this.http
      .put<Gasto>(`${this.apiUrl}/${id}/status`, { status: novoStatus })
      .pipe(
        tap((response) => console.log('Status atualizado:', response)),
        catchError((error) => {
          console.error('Erro ao atualizar o status:', error);
          return throwError(error);
        })
      );
  }
}
