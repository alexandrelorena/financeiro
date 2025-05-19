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
    this.despesa = { ...data.despesa };

    this.categorias = new CategoriaService().getCategorias();
  }
  parseDate(dateString: string): Date | null {
    return dateString ? new Date(dateString + 'T00:00:00') : null;
  }

  onDateChange(event: any): void {
    const date: Date = event.value;
    this.despesa.vencimento = date.toISOString().split('T')[0]; // mantém só a parte YYYY-MM-DD
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

  salvarEdicao(): void {
    // Garante que o vencimento é um Date
    if (typeof this.despesa.vencimento === 'string') {
      this.despesa.vencimento = new Date(this.despesa.vencimento + 'T00:00:00');
    }
    this.edicaoSalva.emit(this.despesa);
    this.dialogRef.close(this.despesa);
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
    valor = valor.replace(/[^0-9.,]/g, '');

    // Garante que o valor tenha no máximo um ponto
    const partes = valor.split(/[.,]/);
    if (partes.length > 2) {
      valor = `${partes[0]}.${partes.slice(1).join('')}`;
    }

    // Limita o número de casas decimais para 2
    if (valor.includes('.') || valor.includes(',')) {
      const [inteiro, decimal] = valor.split(/[.,]/);
      valor = `${inteiro}.${decimal.substring(0, 2)}`;
    }

    // Atualiza o valor do campo de entrada e do modelo de dados
    inputElement.value = valor;
    this.despesa.valor = valor;
  }
}
