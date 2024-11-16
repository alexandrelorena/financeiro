import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  today: Date = new Date(); // Data atual
  todayFormatted: string; // Propriedade para armazenar a data formatada

  constructor() {
    // Inicializando a data no construtor
    this.today = new Date();
    this.todayFormatted = this.today.toLocaleDateString('pt-BR'); // Formata a data
  }

  ngOnInit() {
    // Verifica a data no console
    console.log(this.today);
    console.log(this.todayFormatted); // Mostra a data formatada
  }
}
