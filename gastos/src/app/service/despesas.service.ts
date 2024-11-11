// despesas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gasto } from '../models/gasto.model';

interface Despesa {
  id: number;
  valor: number;
  descricao: string;
  // Adicione outras propriedades conforme necessário
}

@Injectable({
  providedIn: 'root',
})
export class DespesasService {
  private apiUrl = 'http://localhost:8080/api/gastos';

  constructor(private http: HttpClient) {}

  // Busca as despesas de um mês específico
  getDespesasByMonth(month: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}/mes?month=${month}`);
  }

  // Corrigido: método sem redundância na URL
  getDespesas(month: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}?month=${month}`);
  }

  // Obtém todas as despesas
  getAllDespesas(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.apiUrl);
  }

  // Obtém uma despesa pelo ID
  getDespesaById(id: number): Observable<Gasto> {
    return this.http.get<Gasto>(`${this.apiUrl}/${id}`);
  }

  // Cria uma nova despesa
  createDespesa(despesa: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, despesa);
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
