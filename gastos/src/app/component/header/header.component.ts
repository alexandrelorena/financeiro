import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { MonthService } from '../../service/month.service'; // Importando o serviço

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode = false; // Controle do tema
  despesasTotal: string = ''; // Total de despesas como string (do serviço)
  totalDespesas: number = 0; // Total de despesas como número
  selectedMonthAbbreviation: string = ''; // Abreviação do mês selecionado (ex.: "jan", "fev")
  selectedMonthFullName: string = ''; // Nome completo do mês selecionado (ex.: "Janeiro")
  selectedMonthNumber: number = 0; // Número do mês selecionado (1 a 12)
  private subscription: Subscription = new Subscription();

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
    nov: ['Novembro', 11], // Verifique este!
    dez: ['Dezembro', 12],
  };

  constructor(
    private renderer: Renderer2,
    private monthService: MonthService
  ) {}

  ngOnInit(): void {
    // Configuração inicial do tema (claro ou escuro)
    const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
    this.isDarkMode = isDarkTheme;
    this.applyTheme(this.isDarkMode);

    // Obter o mês atual
    const currentMonthIndex = new Date().getMonth(); // Índice do mês (0 a 11)
    const monthKeys = Object.keys(this.monthNames); // Array com as chaves dos meses
    const currentMonthKey = monthKeys[currentMonthIndex]; // Garante uma chave válida

    console.log('currentMonthIndex:', currentMonthIndex);
    console.log('monthKeys:', monthKeys);
    console.log('currentMonthKey:', currentMonthKey);
    if (currentMonthKey) {
      this.updateSelectedMonth(currentMonthKey);
    } else {
      console.error('Não foi possível determinar o mês atual.');
    }

    // Assinar o serviço para obter valores dinâmicos
    this.subscription.add(
      this.monthService.despesasTotal$.subscribe((total) => {
        this.despesasTotal = total;
        this.totalDespesas = parseFloat(total) || 0; // Garantir que seja um número
      })
    );

    this.subscription.add(
      this.monthService.selectedMonth$.subscribe((monthKey) => {
        console.log('Chave recebida do serviço:', monthKey);
        this.updateSelectedMonth(monthKey);
      })
    );
  }

  // Atualiza o mês selecionado com base na chave (abreviação do mês)
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

  toggleMode(): void {
    this.isDarkMode = !this.isDarkMode;
    // Salva o estado do tema no localStorage
    localStorage.setItem('isDarkTheme', String(this.isDarkMode));
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
  ngOnDestroy() {
    // Cancelando a inscrição quando o componente for destruído para evitar vazamentos de memória
    this.subscription.unsubscribe();
  }
}
