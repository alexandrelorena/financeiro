import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Componente de diálogo de confirmação.
 * Exibe uma mensagem e oferece as opções de confirmar ou cancelar.
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  /**
   * Construtor do componente de diálogo de confirmação.
   * Inicializa o diálogo com os dados injetados.
   *
   * @param dialogRef Referência para o diálogo, usado para fechar o modal.
   * @param data Dados injetados no diálogo, contendo a mensagem a ser exibida.
   * @param title
   */
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: any;
      message: string;
    }
  ) {}

  /**
   * Método para cancelar a ação, fechando o diálogo com a resposta 'cancel'.
   */
  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  /**
   * Método para confirmar a ação, fechando o diálogo com a resposta 'confirm'.
   */
  onConfirm(): void {
    this.dialogRef.close('confirm');
  }
}
