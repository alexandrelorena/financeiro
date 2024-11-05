import { Component, Input, OnInit } from '@angular/core';
import { DateService } from '../../service/date.service';
import { GastoService } from '../../service/gasto.service';
import { Gasto } from '../../models/gasto.model';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-mes',
  templateUrl: './mes.component.html',
  styleUrls: ['./mes.component.css'],
  providers: [DatePipe],
})
export class MesComponent implements OnInit {
  @Input() selectedMonth: string = '';
  despesas: Gasto[] = [];
  totalDespesas: number = 0;
  despesaEditando: Gasto | null = null;

  monthNames: { [key: string]: string } = {
    jan: 'janeiro',
    fev: 'fevereiro',
    mar: 'março',
    abr: 'abril',
    mai: 'maio',
    jun: 'junho',
    jul: 'julho',
    ago: 'agosto',
    set: 'setembro',
    out: 'outubro',
    nov: 'novembro',
    dez: 'dezembro',
  };

  constructor(
    private dateService: DateService,
    private despesaService: GastoService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.dateService.selectedMonth$.subscribe((month) => {
      this.selectedMonth = month;
      this.getDespesas(month);
    });
  }

  mudarMes(novoMes: string) {
    this.selectedMonth = novoMes;
    this.getDespesas(novoMes);
  }

  getFullMonthName(): string {
    return this.monthNames[this.selectedMonth] || this.selectedMonth;
  }

  getDespesas(month: string) {
    this.despesaService
      .getDespesas(month)
      .pipe(take(1))
      .subscribe({
        next: (despesas: Gasto[]) => {
          this.despesas = despesas;
          this.calcularTotalDespesas();
        },
        error: (error: any) => {
          console.error('Erro ao buscar despesas:', error);
        },
        complete: () => {
          console.log('Requisição concluída');
        },
      });
  }

  calcularTotalDespesas() {
    this.totalDespesas = this.despesas.reduce(
      (acc, despesa) => acc + despesa.valor,
      0
    );
  }

  iniciarEdicao(despesa: Gasto) {
    this.despesaEditando = { ...despesa };
  }

  salvarEdicao() {
    if (this.despesaEditando) {
      const despesaAtualizada: Gasto = {
        ...this.despesaEditando,
        vencimento: this.despesaEditando.vencimento || null, // Manter como null se vazio
      };

      this.despesaService
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
            this.despesaEditando = null; // Sai do modo de edição
          },
          error: (error: any) => console.error('Erro ao salvar edição:', error),
        });
    }
  }

  removerDespesa(despesa: Gasto) {
    this.despesaService
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

  cancelarEdicao() {
    this.despesaEditando = null; // Sai do modo de edição sem salvar
  }

  getStatus(despesa: Gasto): string {
    const hoje = new Date();
    const dataVencimento = new Date(despesa.vencimento || ''); // Corrigido para considerar null

    if (dataVencimento < hoje) {
      return 'pago';
    } else if (dataVencimento > hoje) {
      return 'vencido';
    } else {
      return 'pendente';
    }
  }

  getStatusClass(despesa: Gasto): string {
    const status = this.getStatus(despesa);
    switch (status) {
      case 'pago':
        return 'status-paid';
      case 'vencido':
        return 'status-unpaid';
      case 'pendente':
        return 'status-pending';
      default:
        return '';
    }
  }
}
