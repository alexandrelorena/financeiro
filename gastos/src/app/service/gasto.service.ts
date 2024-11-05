import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gasto } from '../models/gasto.model';

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private apiUrl = 'http://localhost:8080/api/gastos'; // URL da API backend

  constructor(private http: HttpClient) {}

  // Cria uma nova despesa
  criarGasto(gasto: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto);
  }

  // Obtém as despesas para um determinado mês
  getDespesas(month: string): Observable<Gasto[]> {
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
    return this.http.put<Gasto>(`${this.apiUrl}/${id}`, despesa);
  }

  // Deleta uma despesa pelo ID
  deleteDespesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
