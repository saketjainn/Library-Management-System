import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRequestUserComponent } from './manage-request-user.component';

describe('ManageRequestUserComponent', () => {
  let component: ManageRequestUserComponent;
  let fixture: ComponentFixture<ManageRequestUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageRequestUserComponent]
    });
    fixture = TestBed.createComponent(ManageRequestUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
