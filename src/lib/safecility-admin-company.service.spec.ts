import { TestBed } from '@angular/core/testing';

import { SafecilityAdminCompanyService } from './safecility-admin-company.service';

describe('SafecilityAdminCompanyService', () => {
  let service: SafecilityAdminCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafecilityAdminCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
