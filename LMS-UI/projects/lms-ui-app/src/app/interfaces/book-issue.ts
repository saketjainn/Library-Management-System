export interface BookIssue {
  issueId: number;

  bookId: number;

  userId: string;

  issueDate: Date;

  dueDate: Date | any;

  returnDate: Date;

  fine: number;

    fineStatus: 'PAID' | 'NOFINE' | 'UNPAID';

    bookTitle : string;
}
