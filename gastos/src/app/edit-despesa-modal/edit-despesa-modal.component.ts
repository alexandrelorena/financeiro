import {
  Component,
  EventEmitter,
  Inject,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../service/categoria.service';

/**
 * Componente de modal para editar as despesas.
 */
@Component({
  selector: 'app-edit-despesa-modal',
  templateUrl: './edit-despesa-modal.component.html',
  styleUrls: ['./edit-despesa-modal.component.css'],
  // encapsulation: ViewEncapsulation.None,
  encapsulation: ViewEncapsulation.Emulated,
  standalone: false,
})
export class EditDespesaModalComponent {
  despesa: any;
  categorias: string[] = [];

  @Output() edicaoSalva = new EventEmitter<any>();

  /**
   * Construtor do componente EditDespesaModalComponent.
   * Inicializa a despesa com os dados passados via injeção.
   */
  constructor(
    private dialogRef: MatDialogRef<EditDespesaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.despesa = {
      ...data.despesa,
      vencimento: data.despesa.vencimento || null, // Inclui o vencimento se existir
    };

    this.categorias = new CategoriaService().getCategorias();
  }

  /**
   * Método para salvar a edição da despesa e emitir os dados para o componente pai.
   */
  salvar() {
    const dadosEdicao = {
      ...this.despesa,
      categoria: this.despesa.categoria,
    };
    this.edicaoSalva.emit(dadosEdicao);
  }

  /**
   * Método para salvar a despesa editada e fechar o modal.
   */
  // salvarEdicao() {
  //   this.dialogRef.close(this.despesa);
  // }

  salvarEdicao() {
    this.edicaoSalva.emit(this.despesa); // Emite o evento com os dados editados
    this.dialogRef.close(this.despesa); // Fecha o modal passando os dados
  }

  /**
   * Método para fechar o modal sem salvar alterações.
   */
  fechar() {
    this.dialogRef.close();
  }

  /**
   * Formata o valor digitado no campo de entrada, permitindo apenas números e ponto.
   * Limita o número de casas decimais para 2.
   */
  formatarValor(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let valor = inputElement.value;

    // Remove caracteres não numéricos, permitindo apenas números e ponto
    valor = valor.replace(/[^0-9.]/g, '');

    // Garante que o valor tenha no máximo um ponto
    const partes = valor.split('.');
    if (partes.length > 2) {
      valor = `${partes[0]}.${partes.slice(1).join('')}`;
    }

    // Limita o número de casas decimais para 2
    if (valor.includes('.')) {
      const [inteiro, decimal] = valor.split('.');
      valor = `${inteiro}.${decimal.substring(0, 2)}`;
    }

    // Atualiza o valor do campo de entrada e do modelo de dados
    inputElement.value = valor;
    this.despesa.valor = valor;
  }
}
