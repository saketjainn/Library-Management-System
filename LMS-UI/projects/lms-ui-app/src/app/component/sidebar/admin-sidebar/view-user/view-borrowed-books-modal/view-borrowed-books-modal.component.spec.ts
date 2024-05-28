import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBorrowedBooksModalComponent } from './view-borrowed-books-modal.component';

describe('ViewBorrowedBooksModalComponent', () => {
  let component: ViewBorrowedBooksModalComponent;
  let fixture: ComponentFixture<ViewBorrowedBooksModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBorrowedBooksModalComponent]
    });
    fixture = TestBed.createComponent(ViewBorrowedBooksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
