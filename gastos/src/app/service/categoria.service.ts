import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private categorias: string[] = [
    'Alimentação',
    'Aluguel',
    'Água',
    'Cartão',
    'Celular',
    'Empréstimo',
    'Internet',
    'Lazer',
    'Licenc.',
    'Luz',
    'IPTU',
    'IPVA',
    'Outros',
    'Pets',
    'Saúde',
    'Transporte',
  ];

  getCategorias(): string[] {
    return this.categorias;
   }
}
