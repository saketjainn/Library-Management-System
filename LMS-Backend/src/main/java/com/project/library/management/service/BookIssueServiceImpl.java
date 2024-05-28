package com.project.library.management.service;

import com.project.library.management.dto.BookIssueDTO;
import com.project.library.management.dto.BookIssuePaginationDTO;
import com.project.library.management.entity.*;
import com.project.library.management.exception.BookIssueNotFoundException;
import com.project.library.management.exception.UserNotFoundException;
import com.project.library.management.repository.BookIssueRepository;
import com.project.library.management.repository.BookRepository;
import com.project.library.management.repository.BookRequestRepository;
import com.project.library.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookIssueServiceImpl implements BookIssueService {
    private final BookIssueRepository bookIssueRepository;
    private final BookRequestRepository bookRequestRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final MailServiceImpl mailServiceImpl;
    @Value("${spring.mail.username}")
    private String mail;

    public BookIssuePaginationDTO viewBorrowedBooks(String username, int pageNumber, int pageSize, String sortBy, String sortDir) throws BookIssueNotFoundException, UserNotFoundException {
        boolean isUsernameValid = userRepository.existsByUsername(username);
        if (!isUsernameValid) {
            throw new UserNotFoundException("User with username '" + username + "' does not exist!!");
        }

        Sort sort= (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);
        Page<BookIssue> bookIssuePage= bookIssueRepository.findByUserUsernameAndReturnDateIsNull(username,p);
        if(bookIssuePage==null){
            throw new BookIssueNotFoundException("No borrowed books found for given user!!");
        }

        List<BookIssue> bookIssues = bookIssuePage.getContent();
        List<BookIssueDTO> borrowedBooks = bookIssues.stream().filter(bookIssue -> bookIssue.getReturnDate() == null).map(bookIssue->
                BookIssueDTO.builder()
                        .issueId(bookIssue.getIssueId())
                        .bookId(bookIssue.getBook().getBookId())
                        .bookTitle(bookIssue.getBook().getTitle())
                        .userId(bookIssue.getUser().getUserId())
                        .issueDate(bookIssue.getIssueDate())
                        .dueDate(bookIssue.getDueDate())
                        .returnDate(bookIssue.getReturnDate())
                        .fine(bookIssue.getFine())
                        .fineStatus(bookIssue.getFineStatus())
                        .build()).toList();

        return BookIssuePaginationDTO.builder()
                .content(borrowedBooks)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(bookIssuePage.getTotalElements())
                .totalPages(bookIssuePage.getTotalPages())
                .isLastPage(bookIssuePage.isLast())
                .build();
    }

    public boolean acceptReturn(Long issueId) throws BookIssueNotFoundException {

        boolean isReturnAccepted=false;

        BookIssue bookIssue = bookIssueRepository.findById(issueId).orElseThrow(()-> new BookIssueNotFoundException());

        //setting return date as current system date
        bookIssue.setReturnDate(new Date());

        if(bookIssue.getFine()>0) bookIssue.setFineStatus(Fine.valueOf("PAID"));

        //set status of that book as returned in book request table
        Book book= bookIssue.getBook();
        // BookRequest bookRequest= bookRequestRepository.findById(bookIssue.getRequestId()).orElseThrow(BookIssueNotFoundException::new);
        BookRequest bookRequest= bookIssue.getBookRequest();
        bookRequest.setStatus("RETURNED");


        //increase the quantity available of that book by one
        book.setQuantityAvailable(book.getQuantityAvailable()+1);

        bookIssueRepository.save(bookIssue);
        bookRequestRepository.save(bookRequest);
        bookRepository.save(book);
        User user= bookIssue.getUser();
        String to=user.getEmail();
        String subject="Book Return Confirmation";
        String body="Your book with title '"+book.getTitle()+"' has been successfully returned. Thank you for using our services.";
        mailServiceImpl.sendEmail(to,mail,subject,body);


        isReturnAccepted=true;

        return isReturnAccepted;
    }


}
