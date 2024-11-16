import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto } from '../../models/gasto.model';
import { GastoService } from '../../service/gasto.service';
import { DespesaService } from '../../service/despesas.service';

@Component({
  selector: 'app-add-despesa',
  templateUrl: './add-despesa.component.html',
  styleUrls: ['./add-despesa.component.css'],
})
export class AddDespesaComponent implements OnInit {
  despesaForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private gastoService: GastoService,
    private despesaService: DespesaService,
    private cdr: ChangeDetectorRef // Importando ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.despesaForm = this.formBuilder.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
        ],
      ],
      valor: [
        '',
        [Validators.required, Validators.pattern(/^\d+([.,]\d{1,2})?$/)],
      ],
      vencimento: ['', Validators.required],
    });
  }

  adicionarDespesa() {
    if (this.despesaForm.invalid) {
      console.error('Formulário inválido!', this.despesaForm.errors);
      return;
    }

    const despesa: Gasto = {
      nome: this.despesaForm.value.nome,
      valor: +this.despesaForm.value.valor,
      vencimento: this.despesaForm.value.vencimento,
      pago: false,
      status: '',
      id: 0,
    };

    this.gastoService.criarGasto(despesa).subscribe({
      next: (despesaCriada) => {
        console.log('Despesa criada com sucesso:', despesaCriada);
        this.despesaService.adicionarDespesa(despesaCriada); // Atualiza a lista no BehaviorSubject
        this.resetForm();
        this.cdr.detectChanges(); // Força a detecção de mudanças após a atualização
      },
      error: (error) => {
        console.error('Erro ao criar despesa:', error);
      },
    });
  }

  resetForm() {
    this.despesaForm.reset();
  }
}
