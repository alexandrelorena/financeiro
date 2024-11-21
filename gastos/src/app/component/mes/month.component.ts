import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { DateService } from '../../service/date.service';
import { GastoService } from '../../service/gasto.service';
import { Gasto } from '../../models/gasto.model';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { DespesaService } from '../../service/despesas.service';

@Component({
  selector: 'app-month',
  templateUrl: '../mes/month.component.html',
  styleUrls: ['../mes/month.component.css'],
  providers: [DatePipe],
})
export class MonthComponent implements OnInit, OnDestroy {
  hoje: Date = new Date();
  @Input() selectedMonth: string = '';
  despesas: Gasto[] = [];
  totalDespesas: number = 0;
  despesaEditando: Gasto | null = null;

  // Map de meses com os nomes e números
  monthNames: { [key: string]: [string, number] } = {
    jan: ['January', 1],
    fev: ['February', 2],
    mar: ['March', 3],
    abr: ['April', 4],
    mai: ['May', 5],
    jun: ['June', 6],
    jul: ['July', 7],
    ago: ['August', 8],
    set: ['September', 9],
    out: ['October', 10],
    nov: ['November', 11],
    dez: ['December', 12],
  };

  private subscription = new Subscription();

  constructor(
    private dateService: DateService,
    private gastoService: GastoService,
    private datePipe: DatePipe,
    private despesaService: DespesaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribeToDateChanges();
    this.subscribeToDespesaUpdates();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Inscreve-se para atualizações do mês selecionado
  private subscribeToDateChanges(): void {
    this.subscription.add(
      this.dateService.selectedMonth$.subscribe((month) => {
        this.selectedMonth = month;
        const monthNumber = this.getMonthNumber(month);
        if (monthNumber !== -1) {
          this.getDespesas(monthNumber);
        }
      })
    );
  }

  // Inscreve-se para atualizações de despesas
  private subscribeToDespesaUpdates(): void {
    this.subscription.add(
      this.despesaService.despesas$.subscribe((despesas) => {
        this.despesas = despesas;
        this.calcularTotalDespesas();
        this.cdr.detectChanges(); // Detectar mudanças após a atualização das despesas
      })
    );
  }

  // Obtém o número do mês baseado no nome
  getMonthNumber(month: string): number {
    const sanitizedMonth = month.trim().toLowerCase();
    return this.monthNames[sanitizedMonth]?.[1] ?? -1;
  }

  // Método para obter o nome completo do mês
  getFullMonthName(): string {
    return this.monthNames[this.selectedMonth]?.[0] ?? this.selectedMonth;
  }

  getDespesas(month: number): void {
    if (month === -1) return;

    this.gastoService.getDespesas(month).subscribe((despesas: Gasto[]) => {
      this.despesas = despesas; // Não recalcula o status no frontend
    });
  }

  // Calcula o total de despesas
  private calcularTotalDespesas(): void {
    this.totalDespesas = this.despesas.reduce(
      (acc, despesa) => acc + despesa.valor,
      0
    );
  }

  // Marca uma despesa como paga
  pagarDespesa(id: number): void {
    const despesa = this.despesas.find((d) => d.id === id);
    if (!despesa) return;

    // Atualiza o tipo e status da despesa para "Pago"
    despesa.tipo = 1; // Tipo 1 indica que a despesa está paga
    despesa.status = 'Pago';
    despesa.cssClass = 'status-pago'; // Atualiza a classe para "status-pago"

    this.gastoService.pagarDespesa(id).subscribe({
      next: () => {
        this.calcularTotalDespesas(); // Atualiza o total de despesas
      },
      error: (error) => {
        // Se falhar, reverte para o estado anterior
        despesa.tipo = 0; // Tipo 0 para "Pendente"
        despesa.status = 'Pendente';
        despesa.cssClass = 'status-pendente'; // Retorna para a classe "status-pendente"
        console.error('Erro ao pagar despesa:', error);
      },
    });
  }

  // Inicia a edição de uma despesa
  iniciarEdicao(despesa: Gasto): void {
    // Certifique-se de que a data de vencimento esteja no formato correto
    if (typeof despesa.vencimento === 'string') {
      // Se a data de vencimento for uma string, converta-a para Date
      this.despesaEditando = {
        ...despesa,
        vencimento: new Date(despesa.vencimento), // Converte a string para um objeto Date
      };
    } else {
      // Caso já seja um objeto Date, apenas copie
      this.despesaEditando = { ...despesa };
    }
  }

  // Função para formatar a data no formato 'yyyy-MM-dd'
  formatDate(date: string | Date): string {
    const validDate = typeof date === 'string' ? new Date(date) : date; // Garantir que a entrada seja um Date
    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, '0');
    const day = String(validDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Salva a edição de uma despesa
  salvarEdicao(): void {
    if (!this.despesaEditando) return;

    this.gastoService
      .updateDespesa(this.despesaEditando.id!, this.despesaEditando)
      .pipe(take(1))
      .subscribe({
        next: (updatedDespesa) => {
          // Atualiza o status e a classe CSS após a edição
          const infoDespesa = this.getStatus(updatedDespesa);

          // Atribui o status e a classe CSS ao objeto da despesa
          updatedDespesa.status = infoDespesa.status;
          updatedDespesa.cssClass = infoDespesa.cssClass;

          const index = this.despesas.findIndex(
            (d) => d.id === updatedDespesa.id
          );
          if (index !== -1) {
            // Atualiza a lista de despesas
            this.despesas[index] = updatedDespesa;
            this.calcularTotalDespesas();
          }

          this.despesaEditando = null;
        },
        error: (error) =>
          console.error('Erro ao salvar edição:', error.message || error),
      });
  }

  // Cancela a edição da despesa
  cancelarEdicao(): void {
    this.despesaEditando = null;
  }

  // Remove uma despesa
  removerDespesa(despesa: Gasto): void {
    this.gastoService
      .deleteDespesa(despesa.id!)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.despesas = this.despesas.filter((d) => d.id !== despesa.id);
          this.calcularTotalDespesas();
        },
        error: (error) =>
          console.error('Erro ao remover despesa:', error.message || error),
      });
  }

  getStatus(despesa: Gasto): { status: string; cssClass: string } {
    const hoje = new Date();
    let vencimento: Date;

    // Verifica e converte o vencimento se necessário
    if (typeof despesa.vencimento === 'string') {
      vencimento = new Date(despesa.vencimento);
    } else {
      vencimento = despesa.vencimento;
    }

    // Normaliza as datas para comparar apenas ano, mês e dia
    const hojeSemHora = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );
    const vencimentoSemHora = new Date(
      vencimento.getFullYear(),
      vencimento.getMonth(),
      vencimento.getDate()
    );

    // Se o tipo for 1 (Pago)
    if (despesa.tipo === 1) {
      return { status: 'Pago', cssClass: 'status-pago' };
    }

    // Se o vencimento for hoje
    if (vencimentoSemHora.getTime() === hojeSemHora.getTime()) {
      return { status: 'Vencendo', cssClass: 'status-hoje' };
    }

    // Se o vencimento passou
    if (vencimentoSemHora < hojeSemHora) {
      return { status: 'Vencido', cssClass: 'status-vencido' };
    }

    // Caso contrário, está pendente (vencimento futuro)
    return { status: 'Pendente', cssClass: 'status-pendente' };
  }
}
