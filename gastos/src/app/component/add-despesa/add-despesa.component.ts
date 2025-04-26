import {
  ChangeDetectorRef,
  ViewEncapsulation,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Gasto, TipoGasto } from '../../models/gasto.model';
import { GastoService } from '../../service/gasto.service';
import { LocalService } from '../../service/local.service';
import { EventService } from '../../service/event.service';
import { CategoriaService } from '../../service/categoria.service';
import {
  parseISO,
  startOfDay,
  isAfter,
  isEqual,
  isValid,
  format,
} from 'date-fns';

/**
 * Componente para criar novas despesas no sistema.
 */
@Component({
  selector: 'app-add-despesa',
  templateUrl: './add-despesa.component.html',
  styleUrls: ['./add-despesa.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: false,
})
export class AddDespesaComponent implements OnInit {
  /**
   * Formulário com as informações da despesa.
   */
  despesaForm!: FormGroup;
  formEnviado = false;

  /**
   * Variáveis para controlar o mês e ano selecionado na hora de criar uma despesa.
   */
  currentMonth = new Date().getMonth() + 1;
  mesSelecionado: number = this.currentMonth;
  anoSelecionado: number = new Date().getFullYear();

  meses = [
    { nome: 'Janeiro', value: 1 },
    { nome: 'Fevereiro', value: 2 },
    { nome: 'Março', value: 3 },
    { nome: 'Abril', value: 4 },
    { nome: 'Maio', value: 5 },
    { nome: 'Junho', value: 6 },
    { nome: 'Julho', value: 7 },
    { nome: 'Agosto', value: 8 },
    { nome: 'Setembro', value: 9 },
    { nome: 'Outubro', value: 10 },
    { nome: 'Novembro', value: 11 },
    { nome: 'Dezembro', value: 12 },
  ];
  maxRepeticoes: number = 0;

  /**
   * O usuário deve escolher uma categoria.
   */
  categorias: string[] = [];

  constructor(
    private fb: FormBuilder,
    private gastoService: GastoService,
    private localService: LocalService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
    private eventService: EventService
  ) {}

  /**
   * Inicializa o formulário e define o que é obrigatório em cada campo.
   */
  ngOnInit(): void {
    this.categorias = this.categoriaService.getCategorias();
    this.despesaForm = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(17),
        ],
      ],
      categoria: ['', Validators.required],
      valor: [
        '',
        [Validators.required, Validators.pattern(/^\d+([.,]?\d{0,2})?$/)],
      ],
      vencimento: ['', Validators.required],
      repeticoes: [
        0,
        [Validators.required, Validators.min(0), Validators.max(11)],
      ],
      mesSelecionado: [this.currentMonth, [Validators.required]],
      anoSelecionado: [new Date().getFullYear(), [Validators.required]],
    });

    this.despesaForm.updateValueAndValidity();
    this.onVencimentoChange();
  }

  onVencimentoChange() {
    const vencimento = this.despesaForm.get('vencimento')?.value;

    // Verifica se a data de vencimento é válida
    if (vencimento) {
      const vencimentoDate = parseISO(vencimento);
      const mesSelecionado = vencimentoDate.getMonth() + 1;
      const anoSelecionado = vencimentoDate.getFullYear();

      // Calcula o número máximo de repetições até o final do ano
      const mesesRestantes = 12 - mesSelecionado;
      this.maxRepeticoes = mesesRestantes;

      // Atualiza o campo mesSelecionado e anoSelecionado no formulário
      this.despesaForm.patchValue({
        mesSelecionado: mesSelecionado,
        anoSelecionado: anoSelecionado,
      });

      // Atualiza a validação para o campo de repetições
      const repeticoesControl = this.despesaForm.get('repeticoes');
      repeticoesControl?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(this.maxRepeticoes),
      ]);
      repeticoesControl?.updateValueAndValidity();
    }
  }

  verificarRepeticoes() {
    const repeticoesControl = this.despesaForm.get('repeticoes');
    if (repeticoesControl?.value > this.maxRepeticoes) {
      repeticoesControl?.setValue(this.maxRepeticoes);
      alert(`O número máximo de repetições é ${this.maxRepeticoes}`);
    }
  }

  private determinarStatusETipo(
    vencimento: string | Date,
    pago: boolean
  ): { status: string; tipo: TipoGasto } {
    const hojeSemHora = startOfDay(new Date());
    const vencimentoDate =
      vencimento instanceof Date ? vencimento : parseISO(vencimento);
    const vencimentoSemHora = startOfDay(vencimentoDate);

    if (pago) {
      return { status: 'pago', tipo: TipoGasto.pago };
    }

    if (isAfter(vencimentoSemHora, hojeSemHora)) {
      return { status: 'pendente', tipo: TipoGasto.pendente };
    }

    if (isEqual(vencimentoSemHora, hojeSemHora)) {
      return { status: 'vencendo', tipo: TipoGasto.vencendo };
    }

    return { status: 'vencido', tipo: TipoGasto.vencido };
  }

  onNomeInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // Limitar o número de caracteres a 30
    if (input.value.length > 17) {
      input.value = input.value.slice(0, 17);
    }
  }

  validarRepeticoes(event: any) {
    const valor = event.target.value;

    // Verifica se o valor começa com mais de um 0
    if (valor === '0') {
      event.target.value = '0';
    } else if (valor.startsWith('00')) {
      event.target.value = '0';
    }
  }

  verificarInput(event: KeyboardEvent): void {
    const regex = /^[0-9.,]$/;
    const inputChar = event.key;

    if (!regex.test(inputChar)) {
      event.preventDefault();
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    const cursorPosition = inputElement.selectionStart || 0;

    // Verifica se já existe um separador decimal no valor atual
    const hasDot = currentValue.includes('.');
    const hasComma = currentValue.includes(',');

    // Permite apenas um separador decimal (ponto ou vírgula, mas não ambos)
    if ((inputChar === '.' && hasDot) || (inputChar === ',' && hasComma)) {
      event.preventDefault();
      return;
    }

    // Impede a digitação de um separador adicional se já existir um diferente
    if ((inputChar === '.' && hasComma) || (inputChar === ',' && hasDot)) {
      event.preventDefault();
      return;
    }

    // Se já existe um separador decimal, limita a parte decimal a dois dígitos
    const separator = hasDot ? '.' : hasComma ? ',' : null;
    if (separator) {
      const [integerPart, decimalPart] = currentValue.split(separator);

      // Verifica se o cursor está na parte decimal e impede mais de dois dígitos
      if (
        cursorPosition > currentValue.indexOf(separator) &&
        decimalPart?.length >= 2
      ) {
        event.preventDefault();
      }
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // Permitir as teclas de controle: Backspace (8), Tab (9), Enter (13), Delete (46)
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'Delete'];

    // Se a tecla pressionada for uma tecla permitida, não bloqueie a ação
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Verificar se a tecla pressionada é um número
    const isNumber = event.key >= '0' && event.key <= '9';
    if (!isNumber) {
      event.preventDefault();
    }

    // Verificar o valor atual do campo após a tecla pressionada
    const inputValue = (event.target as HTMLInputElement).value + event.key;
    const inputNumber = parseInt(inputValue, 10);

    // Bloquear se o valor digitado for maior que 11
    if (inputNumber > 11) {
      event.preventDefault();
    }
  }

  /**
   * A despesa é criada e enviada para o servidor.
   */
  onSubmit() {
    this.formEnviado = true;

    if (this.despesaForm.valid) {
      let vencimento = this.despesaForm.value.vencimento;
      const pago = this.despesaForm.value.pago || false;
      const { status, tipo } = this.determinarStatusETipo(vencimento, pago);
      const mesSelecionado = this.despesaForm.value.mesSelecionado;
      const anoSelecionado = this.despesaForm.value.anoSelecionado;

      let valor = this.despesaForm.value.valor;

      // Substituir vírgulas por pontos
      valor = valor.replace(',', '.');

      if (vencimento instanceof Date && isValid(vencimento)) {
        vencimento = format(vencimento, 'yyyy-MM-dd');
      } else if (typeof vencimento === 'string') {
        const parsedDate = parseISO(vencimento);
        if (isValid(parsedDate)) {
          vencimento = format(parsedDate, 'yyyy-MM-dd');
        } else {
          console.error('Data inválida (string):', vencimento);
          return;
        }
      } else {
        console.error('Tipo de vencimento inválido:', vencimento);
        return;
      }
      const repeticoes = (this.despesaForm.value.repeticoes as number) || 0;

      const despesa: Gasto = {
        nome: this.despesaForm.value.nome,
        categoria: this.despesaForm.value.categoria,
        valor: valor,
        vencimento,
        tipo: tipo,
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

          // Recarrega a página após adicionar a despesa para limpar o estado do formulário
          window.location.reload();
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
    const repeticoes =
      despesa.repeticoes === 0 ||
      (despesa.repeticoes > 0 && despesa.repeticoes.toString().trim() !== '0')
        ? despesa.repeticoes
        : 0;

    // const repeticoes = despesa.repeticoes || 0;
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

    Object.keys(this.despesaForm.controls).forEach((campo) => {
      const controle = this.despesaForm.get(campo);
      controle?.markAsPristine();
      controle?.markAsUntouched();
      controle?.updateValueAndValidity();
    });

    // Forçar atualização do estado do formulário
    this.despesaForm.markAsPristine();
    this.despesaForm.markAsUntouched();
  }
}
