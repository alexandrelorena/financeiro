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

  constructor(
    private http: HttpClient,
    private dateService: DateService // Injete o DateService no construtor
  ) {}

  // Cria uma nova despesa
  criarGasto(gasto: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto);
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

  // Atualiza uma despesa existente
  updateDespesa(id: number, despesa: Gasto): Observable<Gasto> {
    // Antes de enviar para a API, a data pode ser convertida para ISO 8601 (string)
    despesa.vencimento = this.dateService.convertToISODate(
      despesa.vencimento.toString()
    );

    // Se a despesa foi marcada como paga, também atualiza o status
    if (despesa.pago) {
      despesa.status = 'Pago';
    }

    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, despesa).pipe(
      map((response: Gasto) => {
        console.log('Resposta recebida:', response);

        // Se a resposta tiver a data como string, converta para Date
        if (typeof response.vencimento === 'string') {
          response.vencimento = new Date(response.vencimento); // Converter para Date
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
    return this.http.put<Gasto>(`${this.apiUrl}/${id}/status`, novoStatus);
  }
}
