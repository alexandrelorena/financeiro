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
  statusSelecionado: string = 'à pagar';
  totalDespesasFiltradas: number = 0;

  // Paginação
  currentPage: number = 1;
  itemsPerPage: number = 11;

  get totalPages(): number {
    return Math.ceil(this.despesasFiltradas.length / this.itemsPerPage);
  }

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

  // Remover a propriedade totalPages duplicada

  get despesasPaginadas(): Gasto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.despesasFiltradas.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  irParaPaginaAnterior(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  irParaProximaPagina(): void {
    const totalPages = Math.ceil(
      this.despesasFiltradas.length / this.itemsPerPage
    );
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  ngOnInit(): void {
    this.monthService.getDespesas().subscribe((despesas) => {
      this.monthService.calculateDespesas(despesas);
    });

    this.subscribeToDateChanges();
    this.subscribeToDespesaUpdates();
    this.calcularTotalDespesas();

    this.gastoService.despesaAdicionada$.subscribe(() => {
      // Recarrega as despesas quando uma nova despesa for adicionada
      const monthNumber = this.getMonthNumber(this.selectedMonth);
      if (monthNumber !== -1) {
        this.recarregarMes(monthNumber);
      }

      this.cdr.detectChanges();
    });

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
    if (this.statusSelecionado === 'à pagar') {
      this.despesasFiltradas = [...this.despesas];
    } else {
      this.despesasFiltradas = this.despesas.filter(
        (despesa) => despesa.status === this.statusSelecionado
      );
    }

    this.calcularTotalDespesasFiltradas();

    this.monthService.updateDespesasFiltradasTotal(this.totalDespesasFiltradas);

    // Resetar para a primeira página ao filtrar
    this.currentPage = 1;
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
    this.calcularTotalDespesas();
    this.filtrarDespesas();
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
    const totalGeral = this.totalDespesas;

    // Envia todas as despesas para que o MonthService possa recalcular
    this.monthService.setDespesas(this.despesas);

    this.monthService.setDespesasTotal(totalGeral, this.selectedMonth);
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
      // console.log('Despesas carregadas:', despesas);
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
      const valor = isNaN(despesa.valor) ? 0 : despesa.valor;

      totalDespesas += valor;

      if (despesa.status === 'pago') {
        totalDespesasPagas += valor;
      } else {
        totalDespesasNaoPagas += valor;
      }
    });

    return { totalDespesas, totalDespesasPagas, totalDespesasNaoPagas };
  }

  private calcularTotalDespesas(): void {
    this.totalDespesas = this.despesas.reduce((acc, despesa) => {
      const valor = isNaN(despesa.valor) ? 0 : despesa.valor;
      return acc + valor;
    }, 0);

    this.totalDespesasPagas = this.despesas.reduce((acc, despesa) => {
      if (despesa.status?.trim().toLowerCase() === 'pago') {
        return acc + (isNaN(despesa.valor) ? 0 : despesa.valor);
      }
      return acc;
    }, 0);

    const totalComDesconto = this.totalDespesas - this.totalDespesasPagas;
    this.filtrarDespesas();
    this.calcularTotalDespesasPorStatus();
    this.sendDespesasToHeader();
    this.monthService.setDespesasTotal(this.totalDespesas, this.selectedMonth);
    this.sendDespesasToHeader();
  }

  calcularTotalDespesasPorStatus(): void {
    if (
      this.statusSelecionado === 'Status' ||
      this.statusSelecionado === 'à pagar'
    ) {
      // Soma as despesas NÃO pagas
      this.totalDespesasNaoPagas = this.despesas
        .filter((despesa) => despesa.status?.trim().toLowerCase() !== 'pago')
        .reduce(
          (acc, despesa) => acc + (isNaN(despesa.valor) ? 0 : despesa.valor),
          0
        );
    } else if (this.statusSelecionado === 'pago') {
      // Soma as despesas pagas
      this.totalDespesasPagas = this.despesas
        .filter((despesa) => despesa.status?.trim().toLowerCase() === 'pago')
        .reduce(
          (acc, despesa) => acc + (isNaN(despesa.valor) ? 0 : despesa.valor),
          0
        );
    }
  }

  calcularTotalDespesasFiltradas(): void {
    const statusSelecionado = this.statusSelecionado?.trim().toLowerCase();

    if (statusSelecionado === 'pago') {
      // Soma despesas com status === "pago"
      this.totalDespesasFiltradas = this.despesasFiltradas
        .filter((despesa) => despesa.status?.trim().toLowerCase() === 'pago')
        .reduce(
          (acc, despesa) =>
            acc + (isNaN(Number(despesa.valor)) ? 0 : Number(despesa.valor)),
          0
        );
    } else {
      // Soma todas as despesas com status !== "pago"
      this.totalDespesasFiltradas = this.despesasFiltradas
        .filter((despesa) => despesa.status?.trim().toLowerCase() !== 'pago')
        .reduce(
          (acc, despesa) =>
            acc + (isNaN(Number(despesa.valor)) ? 0 : Number(despesa.valor)),
          0
        );
    }
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
        this.sendDespesasToHeader();
      },
      error: (error) => {
        despesa.tipo = 0;
        despesa.status = 'pendente';
        despesa.cssClass = 'status-pendente';
        despesa.disableButtons = false;
        console.error('Erro ao pagar despesa:', error);
      },
    });

    this.monthService.setDespesas(this.despesas);
    this.monthService.calculateDespesas(this.despesas);
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
                this.sendDespesasToHeader();
              }
              window.location.reload();
            },
            error: (error) =>
              console.error('Erro ao salvar edição:', error.message || error),
          });
      }
    });
    this.monthService.setDespesas(this.despesas);
    this.monthService.calculateDespesas(this.despesas);
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
            this.sendDespesasToHeader();
          }
          this.despesaEditando = null;
        },
        error: (error) =>
          console.error('Erro ao salvar edição:', error.message || error),
      });
    this.monthService.setDespesas(this.despesas);
    this.monthService.calculateDespesas(this.despesas);
  }

  cancelarEdicao(): void {
    this.despesaEditando = null;
  }

  // Função para abrir um dialog
  openDialog(title: string, message: string, width: string = '500px'): void {
    this.dialog.open(ConfirmationDialogComponent, {
      width,
      data: { title, message, type: 'info' },
    });
  }

  // Função para remover uma despesa
  removerDespesa(despesa: Gasto): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        type: 'confirmation',
        title: 'Deseja apagar esta despesa?',
        expense: {
          nome: despesa.nome,
          valor: despesa.valor,
          vencimento: despesa.vencimento,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.excluirDespesa(despesa.id!);
        this.sendDespesasToHeader();
      }
    });
    this.monthService.setDespesas(this.despesas);
    this.monthService.calculateDespesas(this.despesas);
  }

  // Função para excluir despesa
  excluirDespesa(id: number): void {
    this.gastoService
      .deleteDespesa(id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.despesas = this.despesas.filter((d) => d.id !== id);
          this.calcularTotalDespesas();
          this.onStatusChange();
          this.openDialog('Sucesso!', 'Despesa excluída com sucesso!');
          this.sendDespesasToHeader();
        },
        error: (error) => {
          console.error('Erro ao excluir despesa:', error.message || error);
          this.openDialog(
            'Erro!',
            'Não foi possível excluir a despesa. Tente novamente.'
          );
        },
      });
    this.monthService.setDespesas(this.despesas);
    this.monthService.calculateDespesas(this.despesas);
  }

  // Função para apagar as despesas do mês
  apagarDespesasDoMes(monthKey: string): void {
    const monthData = this.monthNames[monthKey];

    if (!monthData) {
      this.openDialog('Erro!', 'Mês inválido. Por favor, tente novamente.');
      return;
    }

    // Se houver qualquer despesa pendente
    if (
      this.totalDespesas !== 0 &&
      this.totalDespesas !== this.totalDespesasPagas
    ) {
      this.openDialog(
        'Não é permitido excluir!',
        `Há despesas pendentes no mês de ${monthData[0].toLowerCase()}.`
      );
      return;
    }

    // Se não houver despesas no mês
    if (this.despesas.length === 0) {
      this.openDialog(
        'Não há despesas!',
        `Não há despesas registradas para o mês de ${monthData[0].toLowerCase()}.`
      );
      return;
    }

    // Abrir o diálogo de confirmação
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      data: {
        title: `Excluir as despesas de ${monthData[0].toLowerCase()}?`,
        type: 'confirmation',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.confirmarExclusao(monthData[1], monthData);
      } else {
        console.log('Ação de exclusão cancelada.');
      }
    });

    this.monthService.setDespesas(this.despesas);
    this.monthService.calculateDespesas(this.despesas);
  }

  // Função para confirmar a exclusão das despesas do mês
  confirmarExclusao(monthNumber: number, monthData: [string, number]): void {
    this.gastoService
      .apagarDespesasDoMes(monthNumber)
      .pipe(take(1))
      .subscribe(
        () => {
          this.despesas = [];
          this.despesasFiltradas = [];
          this.calcularTotalDespesas();
          this.onStatusChange();
          this.openDialog(
            'Sucesso!',
            `As despesas de ${monthData[0].toLowerCase()} foram excluídas!`
          );
        },
        (erro) => {
          console.error('Erro ao excluir despesas:', erro);
          this.openDialog(
            'Erro!',
            `Não foi possível excluir as despesas de ${monthData[0].toLowerCase()}. Por favor, tente novamente.`
          );
        }
      );
    this.monthService.setDespesas(this.despesas);
    this.monthService.calculateDespesas(this.despesas);
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
