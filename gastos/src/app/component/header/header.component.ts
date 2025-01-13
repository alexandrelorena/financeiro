import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonthService } from '../../service/month.service';
import { combineLatest } from 'rxjs';

/**
 * HeaderComponent
 * Responsável por gerenciar o cabeçalho da aplicação, incluindo a alternância entre os temas (claro/escuro)
 * e as interações relacionadas aos meses e despesas.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode = false;

  despesasTotal: number = 0;

  totalDespesas: number = 0;

  selectedMonthAbbreviation: string = '';

  selectedMonthFullName: string = '';

  selectedMonthNumber: number = 0;

  totalFiltrado: number = 0;

  totalNaoPagas: number = 0;

  /** Assinaturas de observáveis para gerenciamento de memória */
  private subscription: Subscription = new Subscription();

  /** Map de meses com os nomes completos e seus respectivos números */
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

  /**
   * Construtor do componente
   * @param renderer Serviço Angular para manipulação do DOM
   * @param monthService Serviço responsável por gerenciar os meses
   */
  constructor(
    private renderer: Renderer2,
    private monthService: MonthService
  ) {}

  /**
   * Método executado ao inicializar o componente
   * Configura o tema e assina observáveis para obter informações dinâmicas
   */

  ngOnInit(): void {
    // Obtém o estado do tema do localStorage
    this.isDarkMode = this.getThemeFromLocalStorage();

    // Aplica o tema atual
    this.applyTheme();

    // Define a classe do corpo com base no tema
    this.renderer.addClass(
      document.body,
      this.isDarkMode ? 'dark-mode' : 'light-mode'
    );

    const currentMonthIndex = new Date().getMonth();
    const monthKeys = Object.keys(this.monthNames);
    const currentMonthKey = monthKeys[currentMonthIndex];

    if (currentMonthKey) {
      this.updateSelectedMonth(currentMonthKey);
    } else {
      console.error('Não foi possível determinar o mês atual.');
    }

    this.monthService.despesasTotal$.subscribe((total) => {
      this.totalFiltrado = total;
    });

    this.monthService.despesasNaoPagasTotalSource.subscribe((totalNaoPagas) => {
      this.totalNaoPagas = totalNaoPagas;
    });

    this.monthService.selectedMonth$.subscribe((month) => {
      this.selectedMonthFullName = month;
    });

    const combinedSubscription = combineLatest([
      this.monthService.despesasTotal$,
      this.monthService.getDespesasFiltradasTotal(),
      this.monthService.selectedMonth$,
    ]).subscribe(([despesasTotal, despesasFiltradasTotal, selectedMonth]) => {
      this.despesasTotal = despesasTotal;
      this.totalDespesas = despesasTotal;
      this.totalFiltrado = despesasFiltradasTotal;
      this.updateSelectedMonth(selectedMonth);
    });

    this.subscription.add(combinedSubscription);
  }

  /**
   * Atualiza as informações relacionadas ao mês selecionado
   * @param monthKey Abreviação do mês (ex.: "jan", "fev")
   */
  updateSelectedMonth(monthKey: string): void {
    if (!this.monthNames[monthKey]) {
      console.error(`Chave do mês inválida: ${monthKey}`);
      return;
    }

    const [fullName, monthNumber] = this.monthNames[monthKey];
    this.selectedMonthAbbreviation = monthKey;
    this.selectedMonthFullName = fullName;
    this.selectedMonthNumber = monthNumber;
  }

  calculateDespesas(despesas: any[]): {
    totalDespesas: number;
    totalDespesasPagas: number;
    totalDespesasNaoPagas: number;
  } {
    const totalDespesas = despesas.reduce((total, despesa) => {
      const valor = parseFloat(despesa.valor || '0');
      return total + (isNaN(valor) ? 0 : valor);
    }, 0);

    const totalDespesasPagas = despesas
      .filter((despesa) => despesa.status === 'pago')
      .reduce((total, despesa) => {
        const valor = parseFloat(despesa.valor || '0');
        return total + (isNaN(valor) ? 0 : valor);
      }, 0);

    const totalDespesasNaoPagas = totalDespesas - totalDespesasPagas;

    return {
      totalDespesas,
      totalDespesasPagas,
      totalDespesasNaoPagas,
    };
  }

  private getThemeFromLocalStorage(): boolean {
    return localStorage.getItem('isDarkTheme') === 'true';
  }

  toggleMode(): void {
    // Alterna o estado do tema
    this.isDarkMode = !this.isDarkMode;

    // Atualiza o estado no localStorage
    localStorage.setItem('isDarkTheme', String(this.isDarkMode));

    // Aplica o novo tema
    this.applyTheme();
  }

  /**
   * Aplica o tema selecionado ao corpo do documento
   * @param isDark Indica se o tema escuro deve ser aplicado
   */
  private applyTheme(): void {
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }

  /**
   * Método executado ao destruir o componente
   * Cancela assinaturas para evitar vazamentos de memória
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
