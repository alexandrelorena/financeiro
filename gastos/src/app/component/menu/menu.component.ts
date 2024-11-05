import { Component, EventEmitter, Output } from '@angular/core';
import { DateService } from '../../service/date.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  months: string[] = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ];

  // months: string[] = [
  //   'Janeiro',
  //   'Fevereiro',
  //   'Março',
  //   'Abril',
  //   'Maio',
  //   'Junho',
  //   'Julho',
  //   'Agosto',
  //   'Setembro',
  //   'Outubro',
  //   'Novembro',
  //   'Dezembro',
  // ];

  @Output() monthSelected = new EventEmitter<string>();
  selectedMonth: string = '';
  despesas: any;
  totalDespesas: string | number = '';

  constructor(private dateService: DateService) {} // Injeta o DateService

  ngOnInit() {
    this.setCurrentMonth(); // Chama o método para definir o mês atual
  }

  setCurrentMonth() {
    const currentMonthIndex = new Date().getMonth(); // Obtém o índice do mês atual (0-11)
    const currentMonth = this.months[currentMonthIndex]; // Obtém o nome do mês correspondente
    this.selectMonth(currentMonth); // Chama o método para selecionar o mês atual
  }
  selectMonth(month: string) {
    this.selectedMonth = month; // Atualiza o mês selecionado
    this.dateService.selectMonth(month); // Atualiza o mês no serviço
    this.monthSelected.emit(month); // Emite o mês selecionado
  }
}
