import { TestBed } from '@angular/core/testing';

import { EnableDisableBookService } from './enable-disable-book.service';

describe('EnableDisableBookService', () => {
  let service: EnableDisableBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnableDisableBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
