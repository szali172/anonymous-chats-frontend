import { TestBed } from '@angular/core/testing';

import { TextFilterService } from './text-filter.service';

describe('TextFilterService', () => {
  let service: TextFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
