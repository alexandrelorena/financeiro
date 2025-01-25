import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Gasto } from '../models/gasto.model';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  private despesasSubject = new BehaviorSubject<Gasto[]>([]);
  despesas$ = this.despesasSubject.asObservable();

  constructor() {}

  // Método para adicionar uma nova despesa
  adicionarDespesa(despesa: Gasto) {
    const despesasAtuais = this.despesasSubject.value;
    this.despesasSubject.next([...despesasAtuais, despesa]);
  }

  // Método para atualizar as despesas (antes estava no GastoService)
  atualizarDespesas(despesas: Gasto[]): void {
    this.despesasSubject.next(despesas);
  }

  // Método para obter as despesas
  getDespesas(): Observable<Gasto[]> {
    return this.despesas$;
  }
}
