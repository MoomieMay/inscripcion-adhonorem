import { TestBed } from '@angular/core/testing';

import { LlamadosService } from './llamados.service';

describe('LlamadosService', () => {
  let service: LlamadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LlamadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
