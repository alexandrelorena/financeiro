import { Injectable } from '@angular/core'; // Importa o decorador Injectable do Angular
import { BehaviorSubject } from 'rxjs'; // Importa BehaviorSubject da biblioteca RxJS

// O decorador Injectable permite que a classe DateService seja injetada em outros componentes ou serviços
@Injectable({
  providedIn: 'root', // Faz com que o serviço esteja disponível em toda a aplicação
})
export class DateService {
  private selectedMonthSubject = new BehaviorSubject<string>(''); // Inicializa com string vazia
  selectedMonth$ = this.selectedMonthSubject.asObservable(); // Observável para emitir mudanças

  constructor() {} // Construtor vazio

  // Método para atualizar o mês selecionado
  selectMonth(month: string) {
    this.selectedMonthSubject.next(month); // Atualiza o mês selecionado
  }

  // Método que retorna a data atual formatada como uma string no formato dd/MM/yyyy
  getCurrentDate(): string {
    const date = new Date(); // Cria um novo objeto Date com a data e hora atuais

    // Obtém o dia do mês e garante que sempre terá dois dígitos (ex: 01, 02, ... 10, 11)
    const day = String(date.getDate()).padStart(2, '0');

    // Obtém o mês atual (0 a 11) e garante que sempre terá dois dígitos, somando 1 porque os meses começam do 0
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Obtém o ano atual (ex: 2024)
    const year = date.getFullYear();

    // Retorna a data formatada como uma string no formato "dd/MM/yyyy"
    return `${day}/${month}/${year}`;
  }
  // Método para converter uma data no formato "Mon Nov 25 2024 21:00:00 GMT-0300 (Horário Padrão de Brasília)" para yyyy-MM-dd
  convertToISODate(dateString: string): string {
    const date = new Date(dateString); // Cria um objeto Date a partir da string fornecida

    // Retorna a data no formato yyyy-MM-dd
    return date.toISOString().split('T')[0];
  }
}
