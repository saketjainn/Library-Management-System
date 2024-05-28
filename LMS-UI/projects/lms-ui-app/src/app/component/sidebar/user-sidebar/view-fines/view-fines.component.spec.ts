import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFinesComponent } from './view-fines.component';

describe('ViewFinesComponent', () => {
  let component: ViewFinesComponent;
  let fixture: ComponentFixture<ViewFinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewFinesComponent]
    });
    fixture = TestBed.createComponent(ViewFinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
