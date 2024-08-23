import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRoleoutComponent } from './view-roleout.component';

describe('ViewRoleoutComponent', () => {
  let component: ViewRoleoutComponent;
  let fixture: ComponentFixture<ViewRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
