import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddEditorComponent } from './company-add-editor.component';

describe('CompanyAddEditorComponent', () => {
  let component: CompanyAddEditorComponent;
  let fixture: ComponentFixture<CompanyAddEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAddEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAddEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
