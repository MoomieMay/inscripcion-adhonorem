import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableVencidasComponent } from './table-vencidas.component';

describe('TableVencidasComponent', () => {
  let component: TableVencidasComponent;
  let fixture: ComponentFixture<TableVencidasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableVencidasComponent]
    });
    fixture = TestBed.createComponent(TableVencidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
