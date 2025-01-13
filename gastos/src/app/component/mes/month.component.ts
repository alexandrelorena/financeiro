import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { DateService } from '../../service/date.service';
import { GastoService } from '../../service/gasto.service';
import { Gasto } from '../../models/gasto.model';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalService } from '../../service/local.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MonthService } from '../../service/month.service';
import { EventService } from '../../service/event.service';
import { EditDespesaModalComponent } from '../../edit-despesa-modal/edit-despesa-modal.component';

@Component({
  selector: 'app-month',
  templateUrl: '../mes/month.component.html',
  styleUrls: ['../mes/month.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class MonthComponent implements OnInit, OnDestroy {
  objectKeys = Object.keys;

  hoje: Date = new Date();
  @Input() selectedMonth: string = '';
  despesas: Gasto[] = [];
  totalDespesas: number = 0;
  totalDespesasPagas: number = 0;
  totalDespesasNaoPagas: number = 0;
  despesaEditando: Gasto | null = null;
  despesasFiltradas: Gasto[] = [];
  statusSelecionado: string = 'Todos';
  totalDespesasFiltradas: number = 0;

  // Map de meses com os nomes e números
  monthNames: { [key: string]: [string, number] } = {
    jan: ['Janeiro', 1],
    fev: ['Fevereiro', 2],
    mar: ['Março', 3],
    abr: ['Abril', 4],
    mai: ['Maio', 5],
    jun: ['Junho', 6],
    jul: ['Julho', 7],
    ago: ['Agosto', 8],
    set: ['Setembro', 9],
    out: ['Outubro', 10],
    nov: ['Novembro', 11],
    dez: ['Dezembro', 12],
  };

  private subscription = new Subscription();
  atualizarDespesa: any;
  carregarDespesas: any;

  /**
   * Construtor do componente
   */
  constructor(
    private dateService: DateService,
    private gastoService: GastoService,
    private datePipe: DatePipe,
    private localService: LocalService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private monthService: MonthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.subscribeToDateChanges();
    this.subscribeToDespesaUpdates();
    this.totalDespesas = this.calculateTotalDespesas();

    this.gastoService.despesaAdicionada$.subscribe(() => {
      // Recarrega as despesas quando uma nova despesa for adicionada
      const monthNumber = this.getMonthNumber(this.selectedMonth);
      if (monthNumber !== -1) {
        this.recarregarMes(monthNumber);
      }

      this.cdr.detectChanges();
    });

    this.sendDespesasToHeader();

    // Inscrição para o evento de mudança de status
    this.eventService.onStatusChange().subscribe(() => {
      this.onStatusChange();
      const monthNumber = this.getMonthNumber(this.selectedMonth);
      if (monthNumber !== -1) {
        this.recarregarMes(monthNumber);
      }
    });

    this.subscription.add(
      this.eventService.onStatusChange$.subscribe(() => {
        this.recarregarMes(new Date().getMonth() + 1);
      })
    );
  }

  loadDespesas(): void {
    const monthNumber = this.getMonthNumber(this.selectedMonth);
    this.gastoService.getDespesas(monthNumber).subscribe((despesas) => {
      this.despesas = despesas;
      this.monthService.calculateDespesas(despesas);
    });
  }

  private subscribeToDespesaUpdates(): void {
    this.subscription.add(
      this.localService.despesas$.subscribe((despesas) => {
        this.despesas = despesas;
        this.calcularTotalDespesas();
        this.filtrarDespesas();
        this.cdr.detectChanges();
      })
    );
  }

  recarregarMes(month: number): void {
    this.gastoService.getDespesas(month).subscribe(
      (despesas) => {
        this.despesas = despesas;
        this.calcularTotalDespesas();
        this.filtrarDespesas();
        this.cdr.detectChanges();
      },
      (erro) => {
        console.error('Erro ao recarregar informações do mês:', erro);
      }
    );
  }

  filtrarDespesas(): void {
    if (this.statusSelecionado === 'Todos') {
      this.despesasFiltradas = [...this.despesas];
    } else {
      this.despesasFiltradas = this.despesas.filter(
        (despesa) => despesa.status === this.statusSelecionado
      );
    }

    this.calcularTotalDespesasFiltradas();

    this.monthService.updateDespesasFiltradasTotal(this.totalDespesasFiltradas);
  }

  alterarFiltro(status: string): void {
    this.statusSelecionado = status;
    this.filtrarDespesas();
    this.calcularTotalDespesasFiltradas();
  }

  public formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  atualizarDespesas(novasDespesas: Gasto[]): void {
    this.despesas = [...novasDespesas];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

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

  sendDespesasToHeader(): void {
    const total = this.totalDespesas - this.totalDespesasPagas;
    this.monthService.setDespesasTotal(total, this.selectedMonth);
  }

  getMonthNumber(month: string): number {
    const sanitizedMonth = month.trim().toLowerCase();
    return this.monthNames[sanitizedMonth]?.[1] ?? -1;
  }

  getFullMonthName(): string {
    return this.monthNames[this.selectedMonth]?.[0] ?? this.selectedMonth;
  }

  getDespesas(month: number): void {
    if (month === -1) return;

    this.gastoService.getDespesas(month).subscribe((despesas: Gasto[]) => {
      console.log('Despesas carregadas:', despesas);
      this.despesas = despesas;
      this.calcularTotalDespesas();

      this.despesas.forEach((despesa) => {
        if (despesa.status === 'pago') {
          despesa.disableButtons = true;
        }
      });
      this.filtrarDespesas();
    });
  }

  onStatusChange(): void {
    this.filtrarDespesas();
    this.calcularTotalDespesasPorStatus();
  }

  calculateTotalDespesas(): number {
    return this.despesas.reduce((total, despesa) => total + despesa.valor, 0);
  }

  calculateDespesas(despesas: any[]): {} {
    let totalDespesas = 0;
    let totalDespesasPagas = 0;
    let totalDespesasNaoPagas = 0;

    despesas.forEach((despesa) => {
      totalDespesas += despesa.valor;

      if (despesa.status === 'pago') {
        totalDespesasPagas += despesa.valor;
      } else {
        totalDespesasNaoPagas += despesa.valor;
      }
    });
    this.filtrarDespesas();
    this.calcularTotalDespesasPorStatus();
    this.sendDespesasToHeader();
    return { totalDespesas, totalDespesasPagas, totalDespesasNaoPagas };
  }

  private calcularTotalDespesas(): void {
    this.totalDespesas = this.despesas.reduce((acc, despesa) => {
      const valor = isNaN(despesa.valor) ? 0 : despesa.valor;
      return acc + valor;
    }, 0);

    this.totalDespesasPagas = this.despesas.reduce((acc, despesa) => {
      console.log(
        `Despesa: ${despesa.nome}, Valor: ${despesa.valor}, Status: ${despesa.status}`
      );

      if (despesa.status && despesa.status.toLowerCase() === 'pago') {
        return acc + (isNaN(despesa.valor) ? 0 : despesa.valor);
      }
      return acc;
    }, 0);

    const totalComDesconto = this.totalDespesas - this.totalDespesasPagas;
    this.filtrarDespesas();
    this.calcularTotalDespesasPorStatus();
    this.sendDespesasToHeader();

    console.log('Total Despesas Pagas:', this.totalDespesasPagas);
    console.log('Total após desconto (não pagas):', totalComDesconto);

    this.monthService.setDespesasTotal(totalComDesconto, this.selectedMonth);
  }

  calcularTotalDespesasPorStatus() {
    if (
      this.statusSelecionado === 'Status' ||
      this.statusSelecionado === 'Todos'
    ) {
      const totalNaoPagas = this.despesas
        .filter((despesa) => despesa.status !== 'pago')
        .reduce((acc, despesa) => acc + despesa.valor, 0);

      this.totalDespesas = totalNaoPagas;
    } else {
      const totalFiltrado = this.despesas
        .filter((despesa) => despesa.status === this.statusSelecionado)
        .reduce((acc, despesa) => acc + despesa.valor, 0);

      this.totalDespesas = totalFiltrado;
    }
  }

  private calcularTotalDespesasFiltradas(): void {
    this.totalDespesasFiltradas = this.despesasFiltradas.reduce(
      (acc, despesa) => {
        const valor = despesa.valor;
        return acc + (isNaN(valor) ? 0 : valor);
      },
      0
    );
  }

  pagarDespesa(id: number): void {
    const despesa = this.despesas.find((d) => d.id === id);
    if (!despesa) return;

    despesa.tipo = 1;
    despesa.status = 'pago';
    despesa.cssClass = 'status-pago';
    despesa.disableButtons = true;

    this.gastoService.pagarDespesa(id).subscribe({
      next: () => {
        this.calcularTotalDespesas();
        this.onStatusChange();
        this.cdr.detectChanges();
      },
      error: (error) => {
        // Se falhar, reverte para o estado anterior
        despesa.tipo = 0;
        despesa.status = 'pendente';
        despesa.cssClass = 'status-pendente';
        despesa.disableButtons = false;
        console.error('Erro ao pagar despesa:', error);
      },
    });
  }

  editarDespesa(despesa: Gasto): void {
    const despesaParaEdicao = {
      ...despesa,
      vencimento:
        despesa.vencimento instanceof Date
          ? despesa.vencimento.toISOString().split('T')[0]
          : new Date(despesa.vencimento).toISOString().split('T')[0],
    };

    const dialogRef = this.dialog.open(EditDespesaModalComponent, {
      width: '400px',
      data: { despesa: despesaParaEdicao },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.categoria !== despesa.categoria) {
          despesa.categoria = result.categoria;
        }

        this.gastoService
          .updateDespesa(result.id!, result)
          .pipe(take(1))
          .subscribe({
            next: (updatedDespesa) => {
              this.onStatusChange();
              const infoDespesa = this.getStatus(updatedDespesa);
              updatedDespesa.status = infoDespesa.status;
              updatedDespesa.cssClass = infoDespesa.cssClass;
              updatedDespesa.disableButtons = infoDespesa.disableButtons;

              const index = this.despesas.findIndex(
                (d) => d.id === updatedDespesa.id
              );
              if (index !== -1) {
                this.despesas[index] = updatedDespesa;
                this.calcularTotalDespesas();
                this.onStatusChange();
              }
            },
            error: (error) =>
              console.error('Erro ao salvar edição:', error.message || error),
          });
      }
    });
  }

  salvarEdicao(): void {
    if (!this.despesaEditando) return;

    this.gastoService
      .updateDespesa(this.despesaEditando.id!, this.despesaEditando)
      .pipe(take(1))
      .subscribe({
        next: (updatedDespesa) => {
          const infoDespesa = this.getStatus(updatedDespesa);

          updatedDespesa.status = infoDespesa.status;
          updatedDespesa.cssClass = infoDespesa.cssClass;
          updatedDespesa.disableButtons = infoDespesa.disableButtons;

          const index = this.despesas.findIndex(
            (d) => d.id === updatedDespesa.id
          );
          if (index !== -1) {
            this.despesas[index] = updatedDespesa;
            this.calcularTotalDespesas();
            this.onStatusChange();
            this.cdr.detectChanges();
          }
          this.despesaEditando = null;
        },
        error: (error) =>
          console.error('Erro ao salvar edição:', error.message || error),
      });
  }

  cancelarEdicao(): void {
    this.despesaEditando = null;
  }

  removerDespesa(despesa: Gasto): void {
    const vencimentoFormatado = this.datePipe.transform(
      despesa.vencimento,
      'dd/MM'
    );

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Deseja apagar esta despesa?',
        message: `despesa: <strong>${despesa.nome}</strong><br>
        valor: <strong>${despesa.valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}</strong><br>
        vencimento: <strong>${vencimentoFormatado}</strong>`,
        type: 'confirmation',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.gastoService
          .deleteDespesa(despesa.id!)
          .pipe(take(1))
          .subscribe({
            next: () => {
              this.despesas = this.despesas.filter((d) => d.id !== despesa.id);
              this.calcularTotalDespesas();
              this.onStatusChange();
            },
            error: (error) =>
              console.error('Erro ao excluir despesa:', error.message || error),
          });
      }
    });
  }

  apagarDespesasDoMes(monthKey: string): void {
    const monthData = this.monthNames[monthKey];

    if (!monthData) {
      console.error('Mês inválido:', monthKey);
      this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: 'Erro!',
          message: 'Mês inválido. Por favor, tente novamente.',
          type: 'info',
        },
      });
      return;
    }

    if (!this.totalDespesas) {
      this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: `Não há despesas registradas para ${monthData[0].toLowerCase()}.`,
          type: 'info',
        },
      });
    } else {
      const monthNumber = monthData[1];
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: `Deseja excluir as despesas de ${monthData[0]}?`,
          type: 'confirmation',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'confirm') {
          this.gastoService
            .apagarDespesasDoMes(monthNumber)
            .pipe(take(1))
            .subscribe(
              () => {
                this.despesas = [];
                this.despesasFiltradas = [];
                this.calcularTotalDespesas();
                this.dialog.open(ConfirmationDialogComponent, {
                  width: '500px',
                  data: {
                    title: 'Sucesso!',
                    message: `As despesas de ${monthData[0].toLowerCase()} foram excluídas!`,
                    type: 'info',
                  },
                });
              },
              (erro) => {
                console.error('Erro ao excluir despesas:', erro);
                this.dialog.open(ConfirmationDialogComponent, {
                  width: '500px',
                  data: {
                    title: 'Erro!',
                    message:
                      'Não foi possível excluir as despesas. Por favor, tente novamente.',
                    type: 'info',
                  },
                });
              }
            );
        } else {
          console.log('Ação de exclusão cancelada.');
        }
      });
    }
  }

  getStatus(despesa: Gasto): {
    status: string;
    cssClass: string;
    disableButtons: boolean;
  } {
    const hoje = new Date();
    let vencimento: Date;

    if (typeof despesa.vencimento === 'string') {
      vencimento = new Date(despesa.vencimento);
    } else {
      vencimento = despesa.vencimento;
    }

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

    if (despesa.tipo === 1) {
      return { status: 'pago', cssClass: 'status-pago', disableButtons: true };
    }

    if (vencimentoSemHora.getTime() === hojeSemHora.getTime()) {
      return {
        status: 'vencendo',
        cssClass: 'status-hoje',
        disableButtons: true,
      };
    }

    if (vencimentoSemHora < hojeSemHora) {
      return {
        status: 'vencido',
        cssClass: 'status-vencido',
        disableButtons: true,
      };
    }

    return {
      status: 'pendente',
      cssClass: 'status-pendente',
      disableButtons: true,
    };
  }
}
