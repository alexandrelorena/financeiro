import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonthService } from '../../service/month.service';

/**
 * HeaderComponent
 * Responsável por gerenciar o cabeçalho da aplicação, incluindo a alternância entre os temas (claro/escuro)
 * e as interações relacionadas aos meses e despesas.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** Indica se o tema escuro está ativado */
  isDarkMode = false;

  /** Total de despesas como string obtido do serviço */
  despesasTotal: string = '';

  /** Total de despesas como número */
  totalDespesas: number = 0;

  /** Abreviação do mês selecionado (ex.: "jan", "fev") */
  selectedMonthAbbreviation: string = '';

  /** Nome completo do mês selecionado (ex.: "Janeiro") */
  selectedMonthFullName: string = '';

  /** Número do mês selecionado (1 a 12) */
  selectedMonthNumber: number = 0;

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
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    this.isDarkMode = isDarkTheme;
    this.applyTheme(this.isDarkMode);

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

    this.subscription.add(
      this.monthService.despesasTotal$.subscribe((total) => {
        this.despesasTotal = total;
        this.totalDespesas = parseFloat(total) || 0;
      })
    );

    this.subscription.add(
      this.monthService.selectedMonth$.subscribe((monthKey) => {
        this.updateSelectedMonth(monthKey);
      })
    );
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

  /**
   * Alterna o tema entre claro e escuro
   */
  toggleMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkTheme', String(this.isDarkMode));
    this.applyTheme(this.isDarkMode);
  }

  /**
   * Aplica o tema selecionado ao corpo do documento
   * @param isDark Indica se o tema escuro deve ser aplicado
   */
  private applyTheme(isDark: boolean): void {
    if (isDark) {
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
