import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { registrationAuthGuard } from './registration-auth.guard';

describe('registrationAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => registrationAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
