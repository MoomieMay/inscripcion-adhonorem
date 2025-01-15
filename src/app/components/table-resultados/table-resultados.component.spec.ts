import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableResultadosComponent } from './table-resultados.component';

describe('TableResultadosComponent', () => {
  let component: TableResultadosComponent;
  let fixture: ComponentFixture<TableResultadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableResultadosComponent]
    });
    fixture = TestBed.createComponent(TableResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
