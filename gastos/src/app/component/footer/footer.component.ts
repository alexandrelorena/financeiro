import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: false,
})
export class FooterComponent implements OnInit {
  today: Date = new Date();
  todayFormatted: string;

  constructor() {
    // Inicializando a data no construtor
    this.today = new Date();
    this.todayFormatted = this.today.toLocaleDateString('pt-BR');
  }

  ngOnInit() {
    // Verifica a data no console
    console.log(this.today);
    console.log(this.todayFormatted);
  }
}
