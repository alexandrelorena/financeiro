import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DateService } from '../../service/date.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: false
})
export class MenuComponent implements OnInit {
  // Lista dos meses abreviados
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

  // Emissor de evento para o mês selecionado
  @Output() monthSelected = new EventEmitter<string>();

  // Mês selecionado
  selectedMonth: string = '';

  constructor(private dateService: DateService) {}

  ngOnInit() {
    this.setCurrentMonth(); // Inicializa com o mês atual
  }

  // Define o mês atual como selecionado
  setCurrentMonth() {
    const currentMonthIndex = new Date().getMonth(); // Obtém o mês atual
    const currentMonth = this.months[currentMonthIndex]; // Obtém o nome do mês
    this.selectMonth(currentMonth); // Atualiza o mês selecionado
  }

  // Seleciona o mês
  selectMonth(month: string) {
    this.selectedMonth = month; // Atualiza o mês localmente
    this.dateService.selectMonth(month); // Atualiza o mês no serviço
    this.monthSelected.emit(month); // Emite o mês selecionado para o componente pai
    console.log('Mês selecionado:', month); // Exibe no console o mês selecionado
  }
}
