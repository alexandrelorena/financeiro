import { Component, OnInit } from '@angular/core';
import { Gasto } from '../../models/gasto.model'; // Importe a interface Gasto
import { GastoService } from '../../service/gasto.service';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css'],
})
export class DespesasComponent implements OnInit {
  despesas: Gasto[] = []; // Usando 'Gasto' diretamente para as despesas
  mesSelecionado: string = 'nov'; // Valor padrão, pode ser alterado com o clique

  constructor(private gastoService: GastoService) {}

  ngOnInit(): void {
    this.carregarDespesas();
  }

  // Função para carregar as despesas com base no mês selecionado
  carregarDespesas(): void {
    // Mapeia o mês selecionado para o número correspondente
    const mes = this.mapMesParaNumero(this.mesSelecionado);

    // Chama o serviço para buscar as despesas daquele mês
    this.gastoService.getDespesas(mes).subscribe(
      (response: Gasto[]) => {
        this.despesas = response; // Atualiza a lista de despesas com a resposta
      },
      (error) => {
        console.error('Erro ao buscar despesas', error);
      }
    );
  }

  // Função para mapear o nome do mês para o número do mês
  mapMesParaNumero(mes: string): number {
    const meses: { [key: string]: number } = {
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

    return meses[mes] || 0; // Retorna 0 se o mês não for encontrado
  }

  // Função para alterar o mês e recarregar as despesas
  alterarMes(mes: string): void {
    this.mesSelecionado = mes; // Atualiza o mês selecionado
    this.carregarDespesas(); // Carrega as despesas do novo mês
  }
}
