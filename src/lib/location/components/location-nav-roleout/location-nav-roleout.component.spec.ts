import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationNavRoleoutComponent } from './location-nav-roleout.component';

describe('LocationNavRoleoutComponent', () => {
  let component: LocationNavRoleoutComponent;
  let fixture: ComponentFixture<LocationNavRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationNavRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationNavRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
