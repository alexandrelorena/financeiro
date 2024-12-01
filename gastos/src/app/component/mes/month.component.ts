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

@Component({
  selector: 'app-month',
  templateUrl: '../mes/month.component.html',
  styleUrls: ['../mes/month.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class MonthComponent implements OnInit, OnDestroy {
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
    mar: ['Masço', 3],
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

    // Enviar para o HeaderComponent após o valor ser calculado
    this.sendDespesasToHeader();
    // this.carregarDespesas();

    // Inscreve-se para o evento de mudança de status
    this.eventService.onStatusChange().subscribe(() => {
      this.onStatusChange(); // Chama o método quando o evento for disparado
    });
  }

  aplicarFiltro(): void {
    if (this.statusSelecionado === 'Todos') {
      this.despesasFiltradas = this.despesas; // Mostra todas as despesas
    } else {
      this.despesasFiltradas = this.despesas.filter(
        (despesa) => despesa.status === this.statusSelecionado
      );
    }
  }

  alterarFiltro(status: string): void {
    this.statusSelecionado = status;
    this.aplicarFiltro();
  }

  // Método auxiliar para formatar o valor como moeda (BRL)
  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
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
      this.localService.despesas$.subscribe((despesas) => {
        this.despesas = despesas;
        this.calcularTotalDespesas();
        this.cdr.detectChanges(); // Detectar mudanças após a atualização das despesas
      })
    );
  }

  // Método para calcular ou obter o valor total de despesas
  calculateTotalDespesas(): number {
    return this.despesas.reduce((total, despesa) => total + despesa.valor, 0);
  }

  // Método para enviar o valor de despesas para o serviço
  sendDespesasToHeader(): void {
    const formattedTotal = this.formatCurrency(this.totalDespesas);
    this.monthService.setDespesasTotal(formattedTotal, this.selectedMonth);
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

  // Adicione este método para filtrar despesas com base no status
  filtrarDespesas(): void {
    if (this.statusSelecionado === 'Todos') {
      this.despesasFiltradas = [...this.despesas];
    } else {
      this.despesasFiltradas = this.despesas.filter(
        (despesa) => despesa.status === this.statusSelecionado
      );
    }
  }
  getDespesas(month: number): void {
    if (month === -1) return;

    this.gastoService.getDespesas(month).subscribe((despesas: Gasto[]) => {
      this.despesas = despesas; // Não recalcula o status no frontend
      this.calcularTotalDespesas();

      // Desabilitar botões para despesas pagas
      this.despesas.forEach((despesa) => {
        if (despesa.status === 'Pago') {
          despesa.disableButtons = true;
        }
      });
      this.filtrarDespesas(); // Aplica o filtro ao carregar as despesas
    });
  }

  // Atualize o método para recalcular despesas ao alterar o status selecionado
  onStatusChange(): void {
    this.filtrarDespesas();
  }
  // Calcula o total de despesas
  private calcularTotalDespesas(): void {
    this.totalDespesas = this.despesas.reduce(
      (acc, despesa) => acc + despesa.valor,
      0
    );
    // Enviar o valor total calculado para o HeaderComponent
    this.sendDespesasToHeader();
  }

  // Marca uma despesa como paga
  pagarDespesa(id: number): void {
    const despesa = this.despesas.find((d) => d.id === id);
    if (!despesa) return;

    // Atualiza o tipo e status da despesa para "Pago"
    despesa.tipo = 1; // Tipo 1 indica que a despesa está paga
    despesa.status = 'Pago';
    despesa.cssClass = 'status-pago'; // Atualiza a classe para "status-pago"
    despesa.disableButtons = true;
    console.log(`Despesa ${id} paga e botões desabilitados`);

    this.gastoService.pagarDespesa(id).subscribe({
      next: () => {
        this.calcularTotalDespesas(); // Atualiza o total de despesas
        this.cdr.detectChanges(); // Força a detecção de mudanças
      },
      error: (error) => {
        // Se falhar, reverte para o estado anterior
        despesa.tipo = 0; // Tipo 0 para "Pendente"
        despesa.status = 'Pendente';
        despesa.cssClass = 'status-pendente'; // Retorna para a classe "status-pendente"
        despesa.disableButtons = false; // Reabilita os botões
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

  // Cancela a edição da despesa
  cancelarEdicao(): void {
    this.despesaEditando = null;
  }

  // Remove uma despesa
  removerDespesa(despesa: Gasto): void {
    // Abre o diálogo de confirmação

    const vencimentoFormatado = new Date(despesa.vencimento).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '390px',
      data: {
        message: `despesa: <strong>${despesa.nome}</strong><br>
        valor: <strong>R$ ${despesa.valor},00</strong><br>
        vencimento: <strong>${despesa.vencimento}</strong>`,
      },
    });

    // Quando o usuário clicar em confirmar, executa a exclusão
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
              console.error('Erro ao remover despesa:', error.message || error),
          });
      }
    });
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

    // Se o tipo for 1 (Pago)
    if (despesa.tipo === 1) {
      return { status: 'Pago', cssClass: 'status-pago', disableButtons: true };
    }

    // Se o vencimento for hoje
    if (vencimentoSemHora.getTime() === hojeSemHora.getTime()) {
      return {
        status: 'Vencendo',
        cssClass: 'status-hoje',
        disableButtons: true,
      };
    }

    // Se o vencimento passou
    if (vencimentoSemHora < hojeSemHora) {
      return {
        status: 'Vencido',
        cssClass: 'status-vencido',
        disableButtons: true,
      };
    }

    // Caso contrário, está pendente (vencimento futuro)
    return {
      status: 'Pendente',
      cssClass: 'status-pendente',
      disableButtons: true,
    };
  }
}
