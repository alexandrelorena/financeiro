import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthComponent } from './month.component';

describe('MesComponent', () => {
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
