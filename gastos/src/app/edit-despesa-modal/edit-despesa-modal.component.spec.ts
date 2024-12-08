import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDespesaModalComponent } from './edit-despesa-modal.component';

describe('EditDespesaModalComponent', () => {
  let component: EditDespesaModalComponent;
  let fixture: ComponentFixture<EditDespesaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDespesaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDespesaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
