import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRoleoutComponent } from './client-roleout.component';

describe('ClientRoleoutComponent', () => {
  let component: ClientRoleoutComponent;
  let fixture: ComponentFixture<ClientRoleoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRoleoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRoleoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
