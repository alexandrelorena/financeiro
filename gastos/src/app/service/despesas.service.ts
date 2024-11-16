import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Gasto } from '../models/gasto.model';

@Injectable({
  providedIn: 'root',
})
export class DespesaService {
  private despesasSubject = new BehaviorSubject<Gasto[]>([]); // Estado inicial
  despesas$ = this.despesasSubject.asObservable(); // Expondo como Observable

  constructor() {
    // Inicialização do BehaviorSubject com valores já existentes (se houver)
    // Se você tiver um serviço para obter as despesas inicialmente, você pode fazer isso aqui
  }

  // Método para adicionar uma nova despesa
  adicionarDespesa(despesa: Gasto) {
    const despesasAtuais = this.despesasSubject.value;
    this.despesasSubject.next([...despesasAtuais, despesa]); // Atualiza a lista de despesas
  }

  // Método para obter as despesas (caso precise)
  getDespesas(): Observable<Gasto[]> {
    return this.despesas$;
  }
}
