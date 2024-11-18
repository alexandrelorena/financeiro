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

    // Obtenha a data atual
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0); // Definindo a hora como 00:00:00

    const vencimento = new Date(this.despesaForm.value.vencimento);
    vencimento.setHours(0, 0, 0, 0); // Definindo a hora como 00:00:00

    // Formatar as datas para 'YYYY-MM-DD'
    const dataAtualFormatada = dataAtual.toISOString().slice(0, 10);
    const vencimentoFormatado = vencimento.toISOString().slice(0, 10);

    let status = ''; // Status default
    let tipoGasto: 0 | 1 | 2 = 0; // Valor inicial como Pendente (0)

    // Definir um tipo literal para TIPO_GASTO
    type TipoGasto = 0 | 1 | 2;

    // const TIPO_GASTO = {
    //   PENDENTE: 0,
    //   PAGO: 1,
    //   VENCIDO: 2,
    // };

    // Definindo o tipo de gasto com base na data
    if (vencimentoFormatado < dataAtualFormatada) {
      status = 'vencido';
      tipoGasto = 2; // Vencido
    } else if (vencimentoFormatado === dataAtualFormatada) {
      status = 'vence hoje';
      tipoGasto = 1; // Pago
    } else {
      status = 'pendente';
      tipoGasto = 0; // Pendente
    }

    // Criação do objeto despesa com o status calculado
    const despesa: Gasto = {
      nome: this.despesaForm.value.nome,
      valor: +this.despesaForm.value.valor,
      vencimento: this.despesaForm.value.vencimento,
      tipo: tipoGasto, // 0 indica que a despesa está pendente
      status: status, // Status já atribuído
      id: 0,
    };

    // Chama o serviço para criar a despesa
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
