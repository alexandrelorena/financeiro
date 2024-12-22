import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto } from '../../models/gasto.model';
import { GastoService } from '../../service/gasto.service';
import { LocalService } from '../../service/local.service';
import { EventService } from '../../service/event.service';

@Component({
  selector: 'app-add-despesa',
  templateUrl: './add-despesa.component.html',
  styleUrls: ['./add-despesa.component.css'],
})
export class AddDespesaComponent implements OnInit {
  despesaForm!: FormGroup;
  currentMonth = new Date().getMonth() + 1;

  constructor(
    private formBuilder: FormBuilder,
    private gastoService: GastoService,
    private localService: LocalService,
    private cdr: ChangeDetectorRef, // Importando ChangeDetectorRef
    private eventService: EventService
  ) {}
  categorias: string[] = [
    'Alimentação',
    'Aluguel',
    'Água',
    'Cartão',
    'Celular',
    'Empréstimo',
    'Internet',
    'Lazer',
    'Luz',
    'IPTU',
    'Outros',
    'Pets',
    'Saúde',
    'Transporte',
  ];

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
      categoria: ['', Validators.required],
      valor: [
        '',
        // [Validators.required, Validators.pattern(/^\d+([.,]\d{1,2})?$/)],
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
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
    const hojeSemHora = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      dataAtual.getDate()
    );

    // Obtenha o vencimento
    const vencimento = new Date(this.despesaForm.value.vencimento);
    const vencimentoSemHora = new Date(
      vencimento.getFullYear(),
      vencimento.getMonth(),
      vencimento.getDate()
    );

    let status = ''; // Status default
    let tipoGasto: 0 | 1 | 2 | 3 = 0; // Valor inicial como Pendente (0)

    // Comparação de datas normalizadas
    if (vencimentoSemHora < hojeSemHora) {
      // } else if (vencimentoSemHora.getTime() === hojeSemHora.getTime()) {
      status = 'vencido';
      tipoGasto = 2; // Vencido
    } else if (vencimentoSemHora === hojeSemHora) {
      // } else if (vencimentoSemHora.getTime() === hojeSemHora.getTime()) {
      status = 'vencendo';
      tipoGasto = 3; // Vencendo
    } else {
      status = 'pendente';
      tipoGasto = 0; // Pendente
    }

    // Criação do objeto despesa com o status calculado
    const despesa: Gasto = {
      nome: this.despesaForm.value.nome,
      categoria: this.despesaForm.value.categoria,
      valor: +this.despesaForm.value.valor,
      vencimento: this.despesaForm.value.vencimento,
      tipo: tipoGasto, // 0 indica que a despesa está pendente
      status: status, // Status já atribuído
      id: 0,
    };

    // Cria a despesa
    this.gastoService.criarGasto(despesa).subscribe({
      next: (despesaCriada) => {
        console.log('Despesa criada com sucesso:', despesaCriada);
        this.localService.adicionarDespesa(despesaCriada); // Atualiza a lista de despesas

        // Recarregar as despesas do mês após adicionar
        this.gastoService.getDespesas(this.currentMonth).subscribe({
          next: (despesas) => {
            console.log('Despesas do mês atual recarregadas:', despesas);
            this.localService.atualizarDespesas(despesas); // Atualiza a lista no BehaviorSubject
            // Dispara o evento para notificar que o status mudou
            this.eventService.notifyStatusChange();
          },
          error: (error) => {
            console.error('Erro ao carregar as despesas do mês:', error);
          },
        });

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
