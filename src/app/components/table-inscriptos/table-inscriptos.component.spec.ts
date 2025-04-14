import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInscriptosComponent } from './table-inscriptos.component';

describe('TableInscriptosComponent', () => {
  let component: TableInscriptosComponent;
  let fixture: ComponentFixture<TableInscriptosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableInscriptosComponent]
    });
    fixture = TestBed.createComponent(TableInscriptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
