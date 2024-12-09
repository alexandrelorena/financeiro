// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map, Observable, tap, throwError } from 'rxjs';
// import { Gasto } from '../models/gasto.model';

// import { DateService } from '../service/date.service'; // Importe o DateService

// @Injectable({
//   providedIn: 'root',
// })
// export class GastoService {
//   private apiUrl = 'http://localhost:8080/api/gastos'; // URL da API backend
//   public hoje: Date = new Date();

//   constructor(
//     private http: HttpClient,
//     private dateService: DateService // Injete o DateService no construtor
//   ) {}

//   // Método para filtrar as despesas por status
//   filtrarPorStatus(status: string): Observable<Gasto[]> {
//     return this.http.get<Gasto[]>(`${this.apiUrl}/status/${status}`).pipe(
//       catchError((error) => {
//         console.error('Erro ao filtrar por status:', error);
//         return throwError(() => new Error('Erro aconteceu')); // Retorna o erro para o componente
//       })
//     );
//   }

//   formatarDataVencimento(despesa: Gasto): void {
//     if (despesa.vencimento instanceof Date) {
//       // Usando o DateService para a formatação
//       despesa.vencimento = this.dateService.formatDate(despesa.vencimento); // Método centralizado
//     }
//   }

//   // Cria uma nova despesa
//   criarGasto(gasto: Gasto): Observable<Gasto> {
//     this.formatarDataVencimento(gasto);
//     return this.http.post<Gasto>(this.apiUrl, gasto).pipe(
//       catchError((error) => {
//         console.error('Erro ao criar gasto:', error);
//         return throwError(() => new Error('Erro aconteceu')); // Retorna o erro para o componente
//       })
//     );
//   }

//   addDespesa(despesa: Gasto): Observable<Gasto> {
//     return this.http.post<Gasto>(`${this.apiUrl}/despesas`, despesa);
//   }

//   // Obtém as despesas para um determinado mês
//   getDespesas(month: number): Observable<Gasto[]> {
//     return this.http.get<Gasto[]>(`${this.apiUrl}/mes?month=${month}`);
//   }

//   // Obtém todas as despesas
//   getAllDespesas(): Observable<Gasto[]> {
//     return this.http.get<Gasto[]>(this.apiUrl);
//   }

//   // Obtém uma despesa pelo ID
//   getDespesaById(id: number): Observable<Gasto> {
//     return this.http.get<Gasto>(`${this.apiUrl}/${id}`);
//   }

//   // Método para definir o status da despesa
//   definirStatusDespesa(dataVencimento: string | Date): {
//     status: string;
//     tipo: number;
//   } {
//     const hoje = new Date();
//     let vencimento: Date;

//     // Verifica se dataVencimento é uma string e converte para Date
//     if (typeof dataVencimento === 'string') {
//       vencimento = new Date(dataVencimento); // Converte a string para Date
//     } else {
//       vencimento = dataVencimento; // Se já for Date, usa diretamente
//     }

//     // Ajusta a hora para 00:00:00 para comparação
//     vencimento.setHours(0, 0, 0, 0);
//     hoje.setHours(0, 0, 0, 0); // Ajusta a hora de hoje também

//     // Determina o status
//     let status: string;
//     let tipo: number;

//     if (vencimento.getTime() === hoje.getTime()) {
//       status = 'Vencendo';
//       tipo = 3; // Tipo 3 quando a despesa está "Vencendo"
//     } else if (vencimento > hoje) {
//       status = 'Pendente';
//       tipo = 0; // Tipo 0 quando a despesa está "Pendente"
//     } else {
//       status = 'Vencido';
//       tipo = 2; // Tipo 2 quando a despesa está "Vencido"
//     }

//     return { status, tipo };
//   }

//   // Atualiza uma despesa existente
//   updateDespesa(id: number, despesa: Gasto): Observable<Gasto> {
//     // Convertendo a data para o formato ISO 8601 antes de enviar
//     despesa.vencimento = this.dateService.convertToISODate(despesa.vencimento);
//     console.log('Data formatada para envio:', despesa.vencimento);

//     // Atualizando o status com base na data de vencimento
//     const statusInfo = this.definirStatusDespesa(despesa.vencimento);
//     despesa.status = statusInfo.status; // Atribui apenas o status

//     return this.http.put<Gasto>(`${this.apiUrl}/${id}`, despesa).pipe(
//       map((response: Gasto) => {
//         console.log('Resposta recebida:', response);

//         // Se a resposta tiver a data como string, converta para o formato correto
//         if (typeof response.vencimento === 'string') {
//           const parts = response.vencimento.split('-'); // Quebra no formato yyyy-MM-dd
//           response.vencimento = new Date(
//             parseInt(parts[0], 10), // Ano
//             parseInt(parts[1], 10) - 1, // Mês (0 indexado)
//             parseInt(parts[2], 10) // Dia
//           );
//         }
//         return response;
//       })
//     );
//   }

//   pagarDespesa(id: number): Observable<Gasto> {
//     const url = `${this.apiUrl}/${id}/pagar`; // Endpoint para marcar como pago
//     return this.http.put<Gasto>(url, { pago: true, status: 'Pago' }).pipe(
//       tap((response) => console.log('Despesa paga:', response)),
//       catchError((error) => {
//         console.error('Erro ao pagar a despesa:', error);
//         return throwError(() => new Error('Erro aconteceu'));
//       })
//     );
//   }

//   // Deleta uma despesa pelo ID
//   deleteDespesa(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }

//   // Método para atualizar apenas o status de uma despesa
//   updateStatus(id: number, novoStatus: string): Observable<Gasto> {
//     return this.http
//       .put<Gasto>(`${this.apiUrl}/${id}/status`, { status: novoStatus })
//       .pipe(
//         tap((response) => console.log('Status atualizado:', response)),
//         catchError((error) => {
//           console.error('Erro ao atualizar o status:', error);
//           return throwError(() => new Error('Erro aconteceu'));
//         })
//       );
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Gasto } from '../models/gasto.model';
import { DateService } from '../service/date.service';

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  private apiUrl = 'http://localhost:8080/api/gastos'; // URL da API backend
  private despesasSubject = new BehaviorSubject<Gasto[]>([]);
  private statusSelecionadoSubject = new BehaviorSubject<string>('Todos');
  private statusChange = new Subject<void>();

  despesas$ = this.despesasSubject.asObservable();
  statusSelecionado$ = this.statusSelecionadoSubject.asObservable();
  onStatusChange$ = this.statusChange.asObservable();

  constructor(private http: HttpClient, private dateService: DateService) {}

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
      .put<Gasto>(`${this.apiUrl}/${id}/pagar`, { pago: true, status: 'Pago' })
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
      return { status: 'Vencendo', tipo: 3 };
    } else if (vencimento > hoje) {
      return { status: 'Pendente', tipo: 0 };
    } else {
      return { status: 'Vencido', tipo: 2 };
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

  private handleError(message: string, error: any): Observable<never> {
    console.error(`${message}:`, error);
    return throwError(() => new Error(message));
  }
}
