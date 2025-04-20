import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLlamadosComponent } from './gestion-llamados.component';

describe('GestionLlamadosComponent', () => {
  let component: GestionLlamadosComponent;
  let fixture: ComponentFixture<GestionLlamadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionLlamadosComponent]
    });
    fixture = TestBed.createComponent(GestionLlamadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
