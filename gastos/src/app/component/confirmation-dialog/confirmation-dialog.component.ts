import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ElementRef, OnInit } from '@angular/core';
/**
 * Componente de diálogo de confirmação.
 * Exibe uma mensagem e oferece as opções de confirmar ou cancelar.
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  // encapsulation: ViewEncapsulation.None,
  encapsulation: ViewEncapsulation.Emulated,
  standalone: false,
})
export class ConfirmationDialogComponent implements OnInit {
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
      expense: any;
      type: any;
      title: any;
      message: string;
      theme?: 'dark' | 'light';
    },
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    const hostElement = this.elRef.nativeElement;
    hostElement.classList.remove('dark-theme', 'light-theme');

    if (this.data.theme === 'dark') {
      hostElement.classList.add('dark-theme');
    } else {
      hostElement.classList.add('light-theme');
    }
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onClose(): void {
    this.dialogRef.close('confirm');
  }
}
