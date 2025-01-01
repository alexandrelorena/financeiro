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
})
export class MonthComponent implements OnInit, OnDestroy {
  objectKeys = Object.keys;

  hoje: Date = new Date();
  @Input() selectedMonth: string = '';
  despesas: Gasto[] = [];
  totalDespesas: number = 0;
  despesaEditando: Gasto | null = null;
  despesasFiltradas: Gasto[] = []; // Despesas filtradas pelo status
  statusSelecionado: string = 'Todos'; // Status selecionado para o filtro

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

   * @param dialog Serviço Angular Material para gerenciamento de diálogos
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

    // Enviar para o HeaderComponent
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

  // Inscrição para atualizações de despesas
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
  }

  alterarFiltro(status: string): void {
    this.statusSelecionado = status;
    this.filtrarDespesas();
  }

  // Formata o valor como moeda (BRL)
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

  // Inscrição para atualizações do mês selecionado
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

  // Método para enviar o valor de despesas para o serviço
  sendDespesasToHeader(): void {
    const formattedTotal = this.formatCurrency(this.totalDespesas);
    this.monthService.setDespesasTotal(formattedTotal, this.selectedMonth);
  }

  // Obtém o número do mês
  getMonthNumber(month: string): number {
    const sanitizedMonth = month.trim().toLowerCase();
    return this.monthNames[sanitizedMonth]?.[1] ?? -1;
  }

  // Obtêm o nome do mês
  getFullMonthName(): string {
    return this.monthNames[this.selectedMonth]?.[0] ?? this.selectedMonth;
  }

  getDespesas(month: number): void {
    if (month === -1) return;

    this.gastoService.getDespesas(month).subscribe((despesas: Gasto[]) => {
      this.despesas = despesas;
      this.calcularTotalDespesas();

      // Desabilitar botões para despesas pagas
      this.despesas.forEach((despesa) => {
        if (despesa.status === 'pago') {
          despesa.disableButtons = true;
        }
      });
      this.filtrarDespesas();
    });
  }

  // Atualize o método para recalcular despesas ao alterar o status selecionado
  onStatusChange(): void {
    this.filtrarDespesas();
  }

  calculateTotalDespesas(): number {
    return this.despesas.reduce((total, despesa) => total + despesa.valor, 0);
  }

  private calcularTotalDespesas(): void {
    this.totalDespesas = this.despesas.reduce(
      (acc, despesa) => acc + despesa.valor,
      0
    );

    this.sendDespesasToHeader();
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
        // Verifique se a categoria foi editada e atualize-a
        if (result.categoria !== despesa.categoria) {
          despesa.categoria = result.categoria; // Atualiza a categoria
        }

        this.gastoService
          .updateDespesa(result.id!, result)
          .pipe(take(1))
          .subscribe({
            next: (updatedDespesa) => {
              // Atualiza o status e a classe CSS após a edição
              const infoDespesa = this.getStatus(updatedDespesa);
              updatedDespesa.status = infoDespesa.status;
              updatedDespesa.cssClass = infoDespesa.cssClass;
              updatedDespesa.disableButtons = infoDespesa.disableButtons;

              // Atualiza a lista de despesas
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
          // Atualiza o status e a classe CSS após a edição
          const infoDespesa = this.getStatus(updatedDespesa);

          // Atribui o status e a classe CSS ao objeto da despesa
          updatedDespesa.status = infoDespesa.status;
          updatedDespesa.cssClass = infoDespesa.cssClass;
          updatedDespesa.disableButtons = infoDespesa.disableButtons;

          const index = this.despesas.findIndex(
            (d) => d.id === updatedDespesa.id
          );
          if (index !== -1) {
            // Atualiza a lista de despesas
            this.despesas[index] = updatedDespesa;
            this.calcularTotalDespesas();
            this.onStatusChange();
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
    // Abre o diálogo de confirmação
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

    // Confirmar exclusão
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
          type: 'info', // Apenas exibe o botão "Fechar"
        },
      });
      return;
    }

    if (!this.totalDespesas) {
      // Se não houver despesas, abre o diálogo informativo
      this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: `Não há despesas registradas para ${monthData[0].toLowerCase()}.`,
          type: 'info',
        },
      });
    } else {
      // Caso haja despesas, exibe o diálogo de confirmação
      const monthNumber = monthData[1];
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: `Deseja excluir as despesas de ${monthData[0]}?`,
          type: 'confirmation', // Exibe os botões "Sim" e "Não"
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
