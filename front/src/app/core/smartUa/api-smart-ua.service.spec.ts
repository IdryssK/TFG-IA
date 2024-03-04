import { TestBed } from '@angular/core/testing';

import { ApiSmartUaService } from './api-smart-ua.service';

describe('ApiSmartUaService', () => {
  let service: ApiSmartUaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSmartUaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
