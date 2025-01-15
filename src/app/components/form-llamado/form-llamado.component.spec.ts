import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLlamadoComponent } from './form-llamado.component';

describe('FormLlamadoComponent', () => {
  let component: FormLlamadoComponent;
  let fixture: ComponentFixture<FormLlamadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormLlamadoComponent]
    });
    fixture = TestBed.createComponent(FormLlamadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
