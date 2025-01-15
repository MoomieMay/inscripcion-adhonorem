import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableVigentesComponent } from './table-vigentes.component';

describe('TableVigentesComponent', () => {
  let component: TableVigentesComponent;
  let fixture: ComponentFixture<TableVigentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableVigentesComponent]
    });
    fixture = TestBed.createComponent(TableVigentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
