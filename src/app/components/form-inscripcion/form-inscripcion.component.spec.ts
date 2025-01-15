import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInscripcionComponent } from './form-inscripcion.component';

describe('FormInscripcionComponent', () => {
  let component: FormInscripcionComponent;
  let fixture: ComponentFixture<FormInscripcionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormInscripcionComponent]
    });
    fixture = TestBed.createComponent(FormInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
