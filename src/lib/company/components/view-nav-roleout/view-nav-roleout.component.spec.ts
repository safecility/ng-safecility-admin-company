import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNavRoleoutComponent } from './view-nav-roleout.component';

describe('ViewNavRoleoutComponent', () => {
  let component: ViewNavRoleoutComponent;
  let fixture: ComponentFixture<ViewNavRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewNavRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNavRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
