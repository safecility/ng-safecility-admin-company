import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRoleoutComponent } from './company-roleout.component';

describe('CompanyRoleoutComponent', () => {
  let component: CompanyRoleoutComponent;
  let fixture: ComponentFixture<CompanyRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
