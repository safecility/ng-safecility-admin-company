import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNavRoleoutComponent } from './company-nav-roleout.component';

describe('CompanyNavRoleoutComponent', () => {
  let component: CompanyNavRoleoutComponent;
  let fixture: ComponentFixture<CompanyNavRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyNavRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyNavRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
