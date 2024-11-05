import { TestBed } from '@angular/core/testing';

import { DespesasService } from './despesas.service';

describe('DespesasService', () => {
  let service: DespesasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DespesasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
