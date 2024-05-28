import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFineModalComponent } from './view-fine-modal.component';

describe('ViewFineModalComponent', () => {
  let component: ViewFineModalComponent;
  let fixture: ComponentFixture<ViewFineModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFineModalComponent]
    });
    fixture = TestBed.createComponent(ViewFineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
