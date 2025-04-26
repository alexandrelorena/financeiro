import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DateService } from '../../service/date.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: false,
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
    this.setCurrentMonth();
  }

  // Define o mês atual como selecionado
  setCurrentMonth() {
    const currentMonthIndex = new Date().getMonth();
    const currentMonth = this.months[currentMonthIndex];
    this.selectMonth(currentMonth);
  }

  // Seleciona o mês
  selectMonth(month: string) {
    this.selectedMonth = month;
    this.dateService.selectMonth(month);
    this.monthSelected.emit(month);
    console.log('Mês selecionado:', month);
  }
}
