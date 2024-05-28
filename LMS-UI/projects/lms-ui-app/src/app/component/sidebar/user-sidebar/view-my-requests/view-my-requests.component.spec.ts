import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyRequestsComponent } from './view-my-requests.component';

describe('ViewMyRequestsComponent', () => {
  let component: ViewMyRequestsComponent;
  let fixture: ComponentFixture<ViewMyRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMyRequestsComponent]
    });
    fixture = TestBed.createComponent(ViewMyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
