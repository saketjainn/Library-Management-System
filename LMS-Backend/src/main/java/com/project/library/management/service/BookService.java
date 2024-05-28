package com.project.library.management.service;

import com.project.library.management.dto.BookDTO;
import com.project.library.management.dto.BookPaginationDTO;
import com.project.library.management.exception.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

public interface BookService {
    boolean addBook(BookDTO bookDTO) throws PublisherNotFoundException, IsbnLengthException, IllegalQuantityException, IllegalPrintYear, IllegalAuthorNameException, IllegalTitleException, InvalidIsbnException;

    boolean isValidIsbn(String isbn);

    BookPaginationDTO getBookListByTitle(String title, int pageNumber, int pageSize, String sortBy, String sortDir) throws BookNotFoundException;

    BookDTO getBookById(Long id) throws BookNotFoundException;

    BookPaginationDTO getBooksByAuthor(String author, int pageNumber, int pageSize, String sortBy, String sortDir) throws BookNotFoundException;

    boolean enableDisableBook(Long id) throws BookNotFoundException;

    void updateBook(BookDTO updateBookRequest) throws BookNotFoundException, IllegalPrintYear, IsbnLengthException, IllegalQuantityException, PublisherNotFoundException;

    BookPaginationDTO getAllBooks(int pageNumber, int pageSize, String sortBy, String sortDir) throws BookNotFoundException;

    boolean deleteBook(Long bookId) throws BookNotDeletedException;

    BookPaginationDTO getBooksByGenre(String genre, int pageNumber, int pageSize, String sortBy, String sortDir) throws BookNotFoundException;

    BookDTO getBookOfTheWeek(Date startDate, Date endDate);

    BookPaginationDTO getNewArrivalsBooks(int pageNumber, int pageSize, String sortBy,String sortDir);

    @Transactional
    void updateBookQuantity(Long bookId, int quantity) throws BookNotFoundException, IllegalQuantityException;
}
