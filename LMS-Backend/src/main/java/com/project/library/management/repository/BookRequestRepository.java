package com.project.library.management.repository;

import com.project.library.management.entity.Book;
import com.project.library.management.entity.BookIssue;
import com.project.library.management.entity.BookRequest;
import com.project.library.management.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.library.management.entity.User;
import com.project.library.management.entity.Book;


import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Date;


public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {

    @Query("SELECT bookRequest FROM BookRequest bookRequest WHERE bookRequest.user.username = :userName")
    List<BookRequest> findAllRequestByUserId(String userName);

    List<BookRequest> findListByUserAndBook(User user, Book book);
    BookRequest findByUserAndBook(User user, Book book);

    //filter it by sending only the books that have status PENDING
    List<BookRequest> findTop10ByOrderByRequestDateDesc();

    List<BookRequest> findByUserUsername(String username);

    @Query("SELECT br FROM BookRequest br WHERE br.status IN (:statuses)")
    Page<BookRequest> findFilteredRequests(List<String> statuses,Pageable p);

    @Query("SELECT br FROM BookRequest br WHERE LOWER(br.user.username) LIKE CONCAT('%', LOWER(:username), '%') AND br.status IN (:statuses)")
    Page<BookRequest> findFilteredRequestsByUserName(List<String> statuses,String username,Pageable p);

    List<BookRequest> findByRequestDateBetween(Date startDate,Date endDate);

    List<BookRequest> findByUserUsernameAndRequestDateBetween(String username,Date startDate,Date endDate);

    @Query("SELECT COUNT(br) > 0 FROM BookRequest br WHERE br.book.bookId = :bookId")
    boolean existsByBookId(Long bookId);
     
    // @Query("SELECT br WHERE br.requestId =  :requestId")
    // BookRequest getUserUsernameByRequestId(Long requestId);
}
