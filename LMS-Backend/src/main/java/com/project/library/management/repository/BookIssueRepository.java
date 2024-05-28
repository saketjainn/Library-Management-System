package com.project.library.management.repository;

import com.project.library.management.entity.BookIssue;
import com.project.library.management.entity.Fine;
import com.project.library.management.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;


public interface BookIssueRepository extends JpaRepository<BookIssue, Long>{
//    @Query("SELECT b FROM BookIssue b WHERE b.user.username=:username AND b.fineStatus='UNPAID'")
    @Query("SELECT b FROM BookIssue b WHERE b.user.username=:username AND b.fineStatus='UNPAID'")
    Page<BookIssue> calculateFinesByUserName(String username,Pageable p);

    Page<BookIssue> findByUserUsernameAndReturnDateIsNull(String username, Pageable p);
    
    @Query("SELECT COUNT(bi) > 0 FROM BookIssue bi WHERE bi.book.bookId = :bookId")
    boolean existsByBookId(Long bookId);
    @Query("SELECT bi.book, COUNT(bi) AS issueCount " +
            "FROM BookIssue bi " +
            "WHERE bi.issueDate BETWEEN :startDate AND :endDate " +
            "GROUP BY bi.book " +
            "ORDER BY issueCount DESC")
    List<Object[]> findByWIssueDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


    @Query(value = "SELECT b.title, COUNT(bi.issueId) AS issueCount " +
            "FROM BookIssue bi " +
            "JOIN bi.book b " +
            "GROUP BY b.title " +
            "ORDER BY issueCount DESC " +
            "FETCH NEXT 5 ROWS ONLY")
    List<Object[]> getMostRequestedBooks();

    @Query("SELECT b.author, COUNT(bi) " +
            "FROM BookIssue bi " +
            "JOIN bi.book b " +
            "GROUP BY b.author " +
            "ORDER BY COUNT(bi) DESC " +
            "FETCH FIRST 5 ROWS ONLY")
    List<Object[]> findTopAuthorsWithBooksIssued();

    @Query("SELECT SUM(CASE WHEN bi.returnDate IS NOT NULL THEN bi.fine ELSE 0 END), " +
            "SUM(CASE WHEN bi.returnDate IS NULL THEN bi.fine ELSE 0 END) " +
            "FROM BookIssue bi")
    List<Object[]> getTotalFinesPaidAndDue();


    @Query(value = "SELECT u.username, COUNT(*) as booksBorrowed " +
            "FROM BookIssue bi " +
            "JOIN User u ON bi.user.userId = u.userId " +
            "GROUP BY u.username " +
            "ORDER BY booksBorrowed DESC"
            )
    List<Object[]> findUserActivity();
    @Query("SELECT b.book.genre, COUNT(b) " +
            "FROM BookIssue b " +
            "WHERE b.user = ?1 " +
            "GROUP BY b.book.genre")
    List<Object[]> getGenreWiseSplitByUser(User user);

    @Query("SELECT bi.book.title, COUNT(bi) " +
            "FROM BookIssue bi " +
            "WHERE bi.user = ?1 " +
            "GROUP BY bi.book.title " +
            "ORDER BY COUNT(bi) DESC " +
            "FETCH FIRST 5 ROWS ONLY")
    List<Object[]> getFavoriteBooksByUser(User user);

    @Query("SELECT bi.book.author, COUNT(bi) " +
            "FROM BookIssue bi " +
            "WHERE bi.user = ?1 " +
            "GROUP BY bi.book.author " +
            "ORDER BY COUNT(bi) DESC " +
            "FETCH FIRST 5 ROWS ONLY")
    List<Object[]> getFavoriteAuthorsByUser(User user);

    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.user = :user AND bi.returnDate IS NULL")
    Long getTotalBooksBorrowedByUser(User user);


    @Query("SELECT bi.user.username, " +
            "SUM(CASE WHEN bi.fineStatus = :paidStatus THEN bi.fine ELSE 0 END) as totalFinePaid, " +
            "SUM(CASE WHEN bi.fineStatus = :unpaidStatus THEN bi.fine ELSE 0 END) as totalFineDue " +
            "FROM BookIssue bi " +
            "WHERE bi.fineStatus IN (:paidStatus, :unpaidStatus) " +
            "GROUP BY bi.user.username")
    List<Object[]> getUsersWithTotalFineAmountPaidAndDue(Fine paidStatus,Fine unpaidStatus);
    @Query("SELECT SUM(CASE WHEN bi.fineStatus = :unpaidStatus THEN bi.fine ELSE 0 END) as totalDuesAmount " +
            "FROM BookIssue bi " +
            "WHERE bi.fineStatus = :unpaidStatus AND bi.user.username = :username")
    Integer getUsersWithTotalFineAmountDue(Fine unpaidStatus,String username);


    List<BookIssue> findByFineStatus(Fine fineStatus);
    
    List<BookIssue> findByIssueDateBetween(Date startDate, Date endDate);

    List<BookIssue> findByReturnDateBetween(Date startDate, Date endDate);

    List<BookIssue> findByUserUsernameAndIssueDateBetweenOrUserUsernameAndReturnDateBetween(String username, Date issueStartDate, Date issueEndDate,String userName, Date returnStartDate, Date returnEndDate);

    List<BookIssue> findByUserUsernameAndFineStatus(String username ,Fine fineStatus);

}
