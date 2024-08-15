import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationRoleoutComponent } from './location-roleout.component';

describe('LocationRoleoutComponent', () => {
  let component: LocationRoleoutComponent;
  let fixture: ComponentFixture<LocationRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
