import {
  // ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DateService } from '../../service/date.service';
import { GastoService } from '../../service/gasto.service';
import { Gasto } from '../../models/gasto.model';
import { DatePipe } from '@angular/common';
import { take, Subscription } from 'rxjs';

@Component({
  selector: 'app-month',
  templateUrl: '../mes/month.component.html',
  styleUrls: ['../mes/month.component.css'],
  providers: [DatePipe],
})
export class MonthComponent implements OnInit, OnDestroy {
  @Input() selectedMonth: string = '';
  despesas: Gasto[] = [];
  totalDespesas: number = 0;
  despesaEditando: Gasto | null = null;

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

  private subscription: Subscription = new Subscription();

  constructor(
    private dateService: DateService,
    private gastoService: GastoService,
    private datePipe: DatePipe // private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
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

  ngOnDestroy() {
    // Desinscreve-se de qualquer observable para evitar vazamentos de memória
    this.subscription.unsubscribe();
  }

  mudarMes(novoMes: string) {
    if (novoMes === this.selectedMonth) return; // Se o mês for o mesmo, saia
    this.selectedMonth = novoMes;
    this.getDespesas(this.getMonthNumber(novoMes));
  }

  getFullMonthName(): string {
    const fullMonthName = this.monthNames[this.selectedMonth]?.[0];
    if (!fullMonthName) {
      console.warn(`Mês ${this.selectedMonth} não encontrado no mapeamento.`);
    }
    return fullMonthName || this.selectedMonth;
  }

  onMonthSelected(month: string): void {
    console.log('Mês selecionado em onMonthSelected:', month); // Verifique a string aqui
    const monthNumber = this.getMonthNumber(month);
    console.log('Número do mês em onMonthSelected:', monthNumber); // Verifique o número do mês

    if (monthNumber !== -1) {
      this.getDespesas(monthNumber);
    } else {
      console.error('Mês inválido, não é possível carregar as despesas');
    }
  }

  getMonthNumber(month: string): number {
    // Limpa e converte a string para minúsculas
    month = month.trim();

    console.log('Mês recebido em getMonthNumber:', month); // Verifique a string

    if (this.monthNames[month]) {
      console.log('Número do mês:', this.monthNames[month][1]); // Verifique o número do mês
      return this.monthNames[month][1]; // Retorna o número do mês
    } else {
      console.error(`Mês inválido: ${month}`); // Verifique se o mês é inválido
      return -1;
    }
  }

  getDespesas(month: number): void {
    if (month === -1) {
      console.error('Mês inválido, não é possível carregar as despesas');
      return;
    }
    console.log('Mês recebido em getDespesas:', month);
    this.gastoService.getDespesas(month).subscribe(
      (response: Gasto[]) => {
        console.log('Despesas recebidas:', response);
        this.despesas = response;
        this.calcularTotalDespesas();
      },
      (error: any) => {
        console.error('Erro ao buscar despesas:', error.message || error);
        alert('Falha ao carregar despesas. Tente novamente mais tarde.');
      }
    );
  }

  calcularTotalDespesas() {
    this.totalDespesas = this.despesas.reduce(
      (acc, despesa) => acc + despesa.valor,
      0
    );
  }

  pagarDespesa(id: number): void {
    const despesa = this.despesas.find((d) => d.id === id);
    if (despesa) {
      // Atualizar o status da despesa imediatamente no frontend
      despesa.pago = true;
      despesa.status = 'Pago';

      // Atualizar o status no servidor via API
      this.gastoService.pagarDespesa(id).subscribe(
        (resposta) => {
          console.log('Resposta da API:', resposta);
          // Realiza a atualização do frontend
          const index = this.despesas.findIndex((d) => d.id === id);
          if (index !== -1) {
            this.despesas[index] = { ...despesa }; // Atualiza a despesa com o novo status
            this.calcularTotalDespesas();
          }
        },
        (erro) => {
          console.error('Erro ao pagar a despesa:', erro);
          // Em caso de erro, pode restaurar o estado anterior
          despesa.pago = false;
          despesa.status = 'Pendente';
        }
      );
    } else {
      console.error('Despesa não encontrada');
    }
  }

  getStatus(despesa: Gasto): string {
    const hoje = new Date();
    const dataVencimento = new Date(despesa.vencimento);

    if (despesa.pago) {
      return 'Pago';
    } else if (dataVencimento < hoje) {
      return 'Vencido';
    } else {
      return 'Pendente';
    }
  }

  getStatusClass(despesa: Gasto): string {
    if (despesa.pago) {
      return 'Pago';
    } else {
      const hoje = new Date();
      const dataVencimento = new Date(despesa.vencimento);
      return dataVencimento < hoje ? 'status-vencido' : 'status-pendente';
    }
  }

  updateStatus(id: number, novoStatus: string): void {
    this.gastoService
      .updateStatus(id, novoStatus)
      .pipe(take(1))
      .subscribe({
        next: (despesaAtualizada: Gasto) => {
          const index = this.despesas.findIndex(
            (d) => d.id === despesaAtualizada.id
          );
          if (index !== -1) {
            this.despesas[index] = despesaAtualizada;
            this.despesas = [...this.despesas];
            this.calcularTotalDespesas();
          }
        },
        error: (error: any) => {
          console.error('Erro ao atualizar o status da despesa:', error);
        },
      });
  }

  iniciarEdicao(despesa: Gasto) {
    this.despesaEditando = { ...despesa };
  }

  salvarEdicao() {
    if (this.despesaEditando) {
      const despesaAtualizada: Gasto = {
        ...this.despesaEditando,
        vencimento: this.despesaEditando.vencimento,
      };

      this.gastoService
        .updateDespesa(despesaAtualizada.id!, despesaAtualizada)
        .pipe(take(1))
        .subscribe({
          next: (despesaAtualizada: Gasto) => {
            const index = this.despesas.findIndex(
              (d) => d.id === despesaAtualizada.id
            );
            if (index !== -1) {
              this.despesas[index] = despesaAtualizada;
              this.calcularTotalDespesas();
            }
            this.despesaEditando = null;
          },
          error: (error: any) => console.error('Erro ao salvar edição:', error),
        });
    }
  }

  cancelarEdicao() {
    this.despesaEditando = null;
  }

  removerDespesa(despesa: Gasto) {
    this.gastoService
      .deleteDespesa(despesa.id!)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.despesas = this.despesas.filter((d) => d.id !== despesa.id);
          this.calcularTotalDespesas();
        },
        error: (error: any) => console.error('Erro ao remover despesa:', error),
      });
  }
}
