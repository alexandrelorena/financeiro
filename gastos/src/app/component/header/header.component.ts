import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonthService } from '../../service/month.service';
import { combineLatest } from 'rxjs';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false,
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  totalDespesas = 0;
  totalPagas = 0;
  totalNaoPagas = 0;
  selectedMonthFullName = '';

  private subscription = new Subscription();

  readonly monthNames: Record<string, [string, number]> = {
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

  constructor(
    private renderer: Renderer2,
    public monthService: MonthService,
    private themeService: ThemeService
  ) {
    // obtém o tema salvo no localStorage
    const savedTheme = this.getThemeFromLocalStorage();
    this.isDarkMode = savedTheme;
  }

  ngOnInit(): void {
    // Aplica o tema salvo ao carregar a página
    this.themeService.setTheme(this.isDarkMode ? 'dark' : 'light');
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }

    // Obtém mês atual
    const currentMonthKey =
      Object.keys(this.monthNames)[new Date().getMonth()] || 'defaultMonthKey';
    if (currentMonthKey) {
      this.updateSelectedMonth(currentMonthKey);
    } else {
      console.error('Não foi possível determinar o mês atual.');
    }

    // Inscrição para pegar os valores de despesas e atualizar o header
    this.subscription.add(
      combineLatest([
        this.monthService.despesasTotal$,
        this.monthService.despesasPagasTotalSource,
        this.monthService.despesasNaoPagasTotalSource,
        this.monthService.selectedMonth$,
      ]).subscribe(
        ([
          totalDespesas = 0,
          totalPagas = 0,
          totalNaoPagas = 0,
          month = '',
        ]) => {
          console.log('Valores recebidos:', {
            totalDespesas,
            totalPagas,
            totalNaoPagas,
            month,
          });

          this.totalDespesas = totalDespesas;
          this.totalPagas = totalPagas;
          this.totalNaoPagas = totalNaoPagas;
          this.updateSelectedMonth(month);
        }
      )
    );
  }

  toggleMode() {
    const currentTheme = this.themeService.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    this.themeService.setTheme(newTheme);
    this.isDarkMode = newTheme === 'dark';
    localStorage.setItem('isDarkTheme', String(this.isDarkMode));

    // Ativação da classe no body
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  private getThemeFromLocalStorage(): boolean {
    return localStorage.getItem('isDarkTheme') === 'true';
  }

  updateSelectedMonth(monthKey: string): void {
    const monthData = this.monthNames[monthKey];
    if (!monthData) {
      console.error(`Chave do mês inválida: ${monthKey}`);
      return;
    }

    const [fullName] = monthData;
    this.selectedMonthFullName = fullName;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
