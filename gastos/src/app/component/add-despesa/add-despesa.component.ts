import { Component } from '@angular/core';
import { Gasto } from '../../models/gasto.model'; // ajuste conforme o caminho do seu modelo
import { GastoService } from '../../service/gasto.service'; // ajuste conforme o caminho do seu serviço

@Component({
  selector: 'app-add-despesa',
  templateUrl: './add-despesa.component.html',
  styleUrls: ['./add-despesa.component.css'],
})
export class AddDespesaComponent {
  novaDespesa: Gasto = { nome: '', valor: 0, vencimento: null }; // ajuste conforme a estrutura do seu modelo

  constructor(private gastoService: GastoService) {}

  adicionarDespesa() {
    this.gastoService.criarGasto(this.novaDespesa).subscribe({
      next: (despesaCriada) => {
        console.log('Despesa criada com sucesso:', despesaCriada);
        this.resetForm();
      },
      error: (error) => {
        console.error('Erro ao criar despesa:', error);
      },
    });
  }

  resetForm() {
    this.novaDespesa = { nome: '', valor: 0, vencimento: null };
  }
}
