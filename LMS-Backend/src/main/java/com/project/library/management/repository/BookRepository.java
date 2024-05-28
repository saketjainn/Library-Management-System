package com.project.library.management.repository;

import com.project.library.management.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long>{




    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable p);

    Page<Book> findByAuthorContainingIgnoreCase(String authorName, Pageable p);

    List<Book> findByDateAddedBetween(Date startDate, Date endDate);

    List<Book> findByDateAddedBetweenAndIsActiveIsTrueAndQuantityAvailableGreaterThan(Date startDate, Date endDate, int quantityAvailable);

    //keep this also
    @Query("SELECT b FROM Book b WHERE UPPER(b.genre) LIKE CONCAT('%', UPPER(:genre), '%')")
    Page<Book> findByGenreContainingIgnoreCase(String genre, Pageable p);


    Book findByBookId(Long id);

    void deleteByBookId(Long bookId);

    @Query(value = "SELECT genre, COUNT(*) FROM Book GROUP BY genre", nativeQuery = true)
    List<Object[]> getGenreWiseSplit();
    @Query("SELECT COUNT(b) FROM Book b")
    int getTotalBooksAvailable();


    @Query("SELECT b FROM Book b WHERE b.dateAdded >= :twoWeeksAgo")
    Page<Book> findNewArrivalsBooks(Date twoWeeksAgo, Pageable p);

    boolean existsByIsbn(String isbn);

}
