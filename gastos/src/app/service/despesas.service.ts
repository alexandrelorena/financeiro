// src/app/services/despesas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Despesas } from '../models/despesas.model';

@Injectable({
  providedIn: 'root',
})
export class DespesasService {
  private apiUrl = 'http://localhost:8080/api/despesas'; // URL base da API

  //  Quando for fazer o deploy, lembre-se de alterar essa URL para a URL de produção.

  constructor(private http: HttpClient) {}

  getDespesas(month: string): Observable<Despesas[]> {
    return this.http.get<Despesas[]>(`${this.apiUrl}/mes?month=${month}`);
  }

  // // Obtém despesas filtradas por mês
  // getDespesasByMonth(month: string): Observable<Despesas[]> {
  //   return this.http.get<Despesas[]>(`${this.apiUrl}?month=${month}`);
  // }
  // Obtém todas as despesas
  getAllDespesas(): Observable<Despesas[]> {
    return this.http.get<Despesas[]>(this.apiUrl);
  }

  // Obtém uma despesa pelo ID
  getDespesaById(id: number): Observable<Despesas> {
    return this.http.get<Despesas>(`${this.apiUrl}/${id}`);
  }

  // Cria uma nova despesa
  createDespesa(despesa: Despesas): Observable<Despesas> {
    return this.http.post<Despesas>(this.apiUrl, despesa);
  }

  // Atualiza uma despesa existente
  updateDespesa(id: number, despesa: Despesas): Observable<Despesas> {
    return this.http.put<Despesas>(`${this.apiUrl}/${id}`, despesa);
  }

  // Deleta uma despesa pelo ID
  deleteDespesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
