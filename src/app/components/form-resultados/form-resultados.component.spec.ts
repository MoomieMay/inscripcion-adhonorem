import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResultadosComponent } from './form-resultados.component';

describe('FormResultadosComponent', () => {
  let component: FormResultadosComponent;
  let fixture: ComponentFixture<FormResultadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormResultadosComponent]
    });
    fixture = TestBed.createComponent(FormResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
