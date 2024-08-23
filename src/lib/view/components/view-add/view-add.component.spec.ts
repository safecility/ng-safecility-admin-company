import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAddComponent } from './view-add.component';

describe('ViewAddComponent', () => {
  let component: ViewAddComponent;
  let fixture: ComponentFixture<ViewAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
