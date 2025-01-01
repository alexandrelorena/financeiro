import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto, TipoGasto } from '../../models/gasto.model';
import { GastoService } from '../../service/gasto.service';
import { LocalService } from '../../service/local.service';
import { EventService } from '../../service/event.service';
import { parseISO, isValid, format } from 'date-fns';

/**
 * Componente para criar novas despesas no sistema.
 */
@Component({
  selector: 'app-add-despesa',
  templateUrl: './add-despesa.component.html',
  styleUrls: ['./add-despesa.component.css'],
})
export class AddDespesaComponent implements OnInit {
  /**
   * Formulário com as informações da despesa.
   */
  despesaForm!: FormGroup;

  /**
   * Variáveis para controlar o mês e ano selecionado na hora de criar uma despesa.
   */
  currentMonth = new Date().getMonth() + 1;
  mesSelecionado: number = this.currentMonth;
  anoSelecionado: number = new Date().getFullYear();

  /**
   * O usuário deve escolher uma categoria.
   */
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

  constructor(
    private fb: FormBuilder,
    private gastoService: GastoService,
    private localService: LocalService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService
  ) {}

  /**
   * Inicializa o formulário e define o que é obrigatório em cada campo.
   */
  ngOnInit(): void {
    this.despesaForm = this.fb.group({
      nome: ['', Validators.required],
      categoria: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      vencimento: ['', Validators.required],
      repeticoes: [0, [Validators.required, Validators.min(0)]],
      mesSelecionado: [this.currentMonth, [Validators.required]],
      anoSelecionado: [new Date().getFullYear(), [Validators.required]],
    });

    this.despesaForm.updateValueAndValidity();
  }

  private determinarStatusETipo(
    vencimento: string | Date,
    pago: boolean
  ): { status: string; tipo: TipoGasto } {
    const hoje = new Date();
    const hojeSemHora = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    );

    const vencimentoDate =
      typeof vencimento === 'string' ? new Date(vencimento) : vencimento;
    const vencimentoSemHora = new Date(
      vencimentoDate.getFullYear(),
      vencimentoDate.getMonth(),
      vencimentoDate.getDate()
    );

    if (pago) {
      return { status: 'pago', tipo: TipoGasto.pago };
    }

    if (vencimentoSemHora > hojeSemHora && !pago) {
      return { status: 'pendente', tipo: TipoGasto.pendente };
    }

    if (vencimentoSemHora.getTime() === hojeSemHora.getTime() && !pago) {
      return { status: 'vencendo', tipo: TipoGasto.vencendo };
    }

    return { status: 'vencido', tipo: TipoGasto.vencido };
  }

  /**
   * A despesa é criada e enviada para o servidor.
   */
  onSubmit() {
    if (this.despesaForm.valid) {
      let vencimento = this.despesaForm.value.vencimento;
      const pago = this.despesaForm.value.pago || false;
      const { status, tipo } = this.determinarStatusETipo(vencimento, pago);
      const mesSelecionado = this.despesaForm.value.mesSelecionado;
      const anoSelecionado = this.despesaForm.value.anoSelecionado;

      const parsedDate = parseISO(vencimento);

      if (isValid(parsedDate)) {
        vencimento = format(parsedDate, 'yyyy-MM-dd');
      } else {
        console.error('Data inválida:', vencimento);
        return;
      }

      const repeticoes = (this.despesaForm.value.repeticoes as number) || 0;

      const despesa: Gasto = {
        nome: this.despesaForm.value.nome,
        categoria: this.despesaForm.value.categoria,
        valor: this.despesaForm.value.valor,
        vencimento,
        tipo: this.despesaForm.value.TipoGasto,
        status,
        id: 0,
        repeticoes,
        origem: 'original',
      };

      console.log('Despesa a ser enviada:', despesa);

      this.gastoService.criarGasto(despesa).subscribe({
        next: (response) => {
          console.log('Despesa criada com sucesso!', response);

          // Atualiza a lista de despesas
          this.gastoService.getDespesas(this.currentMonth).subscribe({
            next: (despesasAtualizadas) => {
              this.localService.atualizarDespesas(despesasAtualizadas);
              console.log('Lista de despesas atualizada!');
            },
            error: (error) => {
              console.error('Erro ao atualizar despesas:', error);
            },
          });

          this.criarDespesasRecorrentes(despesa);

          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao adicionar a despesa:', error);
        },
      });
    } else {
      console.error('Formulário inválido!');
    }
  }

  criarDespesasRecorrentes(despesa: Gasto) {
    const repeticoes = despesa.repeticoes || 0;
    let vencimentoOriginal = new Date(despesa.vencimento);

    for (let i = 0; i < repeticoes; i++) {
      let novaData = new Date(vencimentoOriginal);
      novaData.setMonth(vencimentoOriginal.getMonth() + i + 1);

      // Se o dia do mês mudar, ajusta para o último dia do mês
      if (novaData.getDate() !== vencimentoOriginal.getDate()) {
        novaData.setDate(0);
      }

      let formattedDate = novaData.toISOString().split('T')[0];

      const hoje = new Date();
      let status: 'pendente' | 'vencido';
      let tipo: TipoGasto;

      if (novaData > hoje) {
        status = 'pendente';
        tipo = TipoGasto.pendente;
      } else {
        status = 'vencido';
        tipo = TipoGasto.vencido;
      }

      let novaDespesa: Gasto = {
        ...despesa,
        vencimento: formattedDate,
        origem: 'recorrente',
        status,
        tipo: this.despesaForm.value.TipoGasto,
      };

      // Envia a despesa recorrente para o servidor
      this.gastoService.criarGasto(novaDespesa).subscribe({
        next: (response) => {
          console.log(
            `Despesa recorrente ${i + 1} criada com sucesso!`,
            response
          );
        },
        error: (error) => {
          console.error('Erro ao criar despesa recorrente:', error);
        },
      });
    }
  }

  resetForm() {
    this.despesaForm.reset();

    // Redefinir valores padrão
    this.despesaForm.patchValue({
      mesSelecionado: this.currentMonth,
      anoSelecionado: this.anoSelecionado,
      repeticoes: 0,
    });

    // Atualize a validade do formulário
    this.despesaForm.updateValueAndValidity();
  }
}
