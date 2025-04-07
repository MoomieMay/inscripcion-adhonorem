import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableLlamadosComponent } from './table-llamados.component';

describe('TableLlamadosComponent', () => {
  let component: TableLlamadosComponent;
  let fixture: ComponentFixture<TableLlamadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableLlamadosComponent]
    });
    fixture = TestBed.createComponent(TableLlamadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
