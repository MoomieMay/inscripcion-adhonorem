import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLlamadoEditComponent } from './form-llamado-edit.component';

describe('FormLlamadoEditComponent', () => {
  let component: FormLlamadoEditComponent;
  let fixture: ComponentFixture<FormLlamadoEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormLlamadoEditComponent]
    });
    fixture = TestBed.createComponent(FormLlamadoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
