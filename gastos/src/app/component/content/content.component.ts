import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MonthComponent } from '../mes/month.component';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css'],
    standalone: false
})
export class ContentComponent implements AfterViewInit {
  @ViewChild('monthComponent') monthComponent!: MonthComponent;
  selectedMonth: string = '';

  // O ViewChild estará disponível após a inicialização da view
  ngAfterViewInit() {
    if (this.monthComponent) {
      console.log('monthComponent foi inicializado com sucesso');
    }
  }

  // Método para receber o mês selecionado do MenuComponent
  onMonthSelected(month: string): void {
    if (!month) {
      console.error('Mês selecionado está vazio');
      return;
    }

    this.selectedMonth = month;
    console.log('Mês selecionado:', this.selectedMonth);

    // Mapeamento dos meses para números
    const monthMap: { [key: string]: number } = {
      jan: 1,
      fev: 2,
      mar: 3,
      abr: 4,
      mai: 5,
      jun: 6,
      jul: 7,
      ago: 8,
      set: 9,
      out: 10,
      nov: 11,
      dez: 12,
    };

    // Verifica se o mês existe no mapeamento
    const monthNumber = monthMap[this.selectedMonth];

    if (!monthNumber) {
      console.error('Mês inválido:', this.selectedMonth);
      return;
    }

    // Verifique se o monthComponent foi inicializado corretamente
    if (this.monthComponent) {
      this.monthComponent.getDespesas(monthNumber); // Passando o mês como número
    } else {
      // Atrasar a chamada até que o monthComponent seja inicializado
      setTimeout(() => {
        if (this.monthComponent) {
          this.monthComponent.getDespesas(monthNumber);
        } else {
          console.error('monthComponent não foi inicializado!');
        }
      }, 100); // Ajuste o tempo se necessário
    }
  }
}
