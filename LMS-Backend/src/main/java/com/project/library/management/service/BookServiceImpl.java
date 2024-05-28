package com.project.library.management.service;

import com.project.library.management.dto.BookDTO;
import com.project.library.management.dto.BookPaginationDTO;
import com.project.library.management.entity.Book;
import com.project.library.management.entity.Genre;
import com.project.library.management.entity.Publisher;
import com.project.library.management.exception.*;
import com.project.library.management.repository.BookIssueRepository;
import com.project.library.management.repository.BookRepository;
import com.project.library.management.repository.BookRequestRepository;
import com.project.library.management.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private static final Logger logger = Logger.getLogger(BookServiceImpl.class);
    private final BookRepository bookRepository;
    private final PublisherRepository publisherRepository;
    private final PublisherService publisherService;
    private final BookIssueRepository bookIssueRepository;
    private final BookRequestRepository bookRequestRepository;

    public boolean addBook(BookDTO bookDTO) throws PublisherNotFoundException, IsbnLengthException, IllegalQuantityException, IllegalPrintYear, IllegalAuthorNameException, IllegalTitleException, InvalidIsbnException {

        if (bookDTO.getQuantityAvailable() <= 0) {
            logger.error("Quantity should be greater than 0");
            throw new IllegalQuantityException("Quantity should be greater than 0");
        }

        if (bookDTO.getAuthor().length() < 3 || bookDTO.getAuthor().length() > 50) {
            logger.error("Author name should be between 3 and 50 characters.");
            throw new IllegalAuthorNameException();
        }

        if (bookDTO.getTitle().length() < 3 || bookDTO.getTitle().length() > 50) {
            logger.error("Title should be between 3 and 50 characters.");
            throw new IllegalTitleException();
        }

        if (bookDTO.getPrintYear() > new Date().getYear() + 1900 || bookDTO.getPrintYear() < 0) {
            logger.error("Print year should be less than or equal to the current year");
            throw new IllegalPrintYear("Print year should be less than or equal to the current year");
        }

        if (bookDTO.getIsbn().length() != 10 && bookDTO.getIsbn().length() != 13) {
            logger.error("ISBN length should be either 10 or 13 characters.");
            throw new IsbnLengthException("ISBN length should be either 10 or 13 characters.");
        }

        if (!isValidIsbn(bookDTO.getIsbn())) {
            logger.error("Invalid ISBN.");
            throw new InvalidIsbnException();
        }
//    bookRepository.existsByIsbn(bookDTO.getIsbn()).ifPresent(book -> {
//      throw new ISBNExistsException();
//    });


        Publisher publisher = publisherRepository.findById(bookDTO.getPublisherId()).orElseThrow(() -> new PublisherNotFoundException("Publisher corresponding to the given book not found!!"));
        logger.debug("Query fired for getting Publisher by Id");

        Book book = new Book();
        book.setAuthor(bookDTO.getAuthor());
        book.setTitle(bookDTO.getTitle());
        Genre genre = Genre.valueOf(bookDTO.getGenre().toUpperCase());
        book.setGenre(genre);
        book.setIsbn(bookDTO.getIsbn());
        book.setPrintYear(bookDTO.getPrintYear());
        book.setQuantityAvailable(bookDTO.getQuantityAvailable());
        book.setActive(bookDTO.isActive());
        book.setPublisher(publisher);
        book.setDateAdded(new Date());
        bookRepository.save(book);
        logger.debug("Saved the Book details in the database");
        return true;
    }

    public boolean isValidIsbn(String isbn) {
        // Remove any non-digit characters from the ISBN
        isbn = isbn.replaceAll("[^0-9]", "");

        if (isbn.length() == 10) {
            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += (i + 1) * Character.getNumericValue(isbn.charAt(i));
            }

            int checksum = Character.getNumericValue(isbn.charAt(9));
            if (checksum == sum % 11 || (checksum == 10 && isbn.charAt(9) == 'X')) {
                return true;
            }
        } else if (isbn.length() == 13) {
            int sum = 0;
            for (int i = 0; i < 12; i++) {
                if (i % 2 == 0) {
                    sum += Character.getNumericValue(isbn.charAt(i));
                } else {
                    sum += Character.getNumericValue(isbn.charAt(i)) * 3;
                }
            }

            int checksum = Character.getNumericValue(isbn.charAt(12));
            if (checksum == (10 - (sum % 10)) % 10) {
                return true;
            }
        }

        return false;
    }


    public BookPaginationDTO getBookListByTitle(String title, int pageNumber, int pageSize, String sortBy, String sortDir)
            throws BookNotFoundException {
        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);
        Page<Book> bookPage = bookRepository.findByTitleContainingIgnoreCase(title, p);
        logger.debug("Query fired for getting the Book by title");
        if (bookPage.isEmpty()) {
            logger.error("Book Not Found Exception generated !");
            throw new BookNotFoundException("Book with title '" + title + "' not found");
        }
        List<Book> books = bookPage.getContent();

        List<BookDTO> bookDTOs = books.stream().map(book -> convertToDTO(book)).toList();

        return BookPaginationDTO.builder()
                .content(bookDTOs)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .isLastPage(bookPage.isLast())
                .build();
    }

    public BookDTO getBookById(Long id) throws BookNotFoundException {
        Book book = bookRepository.findByBookId(id);
        if (book == null) {
            throw new BookNotFoundException("Book with title '" + id + "' not found");
        }
        BookDTO bookDTO = new BookDTO();
        bookDTO.setBookId(book.getBookId());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setGenre(String.valueOf(book.getGenre()));
        bookDTO.setIsbn(book.getIsbn());
        bookDTO.setPrintYear(book.getPrintYear());
        bookDTO.setQuantityAvailable(book.getQuantityAvailable());
        bookDTO.setActive(bookDTO.isActive());
        bookDTO.setPublisherId(book.getPublisher().getPublisherId());
        return bookDTO;
    }

    public BookPaginationDTO getBooksByAuthor(String author, int pageNumber, int pageSize, String sortBy, String sortDir) throws BookNotFoundException {

        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);
        Page<Book> bookPage = bookRepository.findByAuthorContainingIgnoreCase(author, p);
        if (bookPage.isEmpty()) {
            logger.error("Author Not Found Exception generated !");
            throw new BookNotFoundException("No books found by author '" + author + "'");
        }

        List<Book> books = bookPage.getContent();
        logger.debug("Query fired for Finding the Book by Author Name");

        List<BookDTO> bookDTOs = books.stream().map(book -> convertToDTO(book)).toList();

        return BookPaginationDTO.builder()
                .content(bookDTOs)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .isLastPage(bookPage.isLast())
                .build();
    }

//  public List<BookDTO> getBooksByPublisher(String publisherName) throws BookNotFoundException {
//
//    List<Book> books = bookRepository.findByPublisher(publisherName);
//
//    if (books.isEmpty()) {
//      throw new BookNotFoundException("No books found for publisher '" + publisherName + "'");
//    }
//
//    List<BookDTO> bookDTOs = new ArrayList<>();
//    for (Book book : books) {
//      BookDTO bookDTO = new BookDTO();
//      bookDTO.setAuthor(book.getAuthor());
//      bookDTO.setTitle(book.getTitle());
//      bookDTO.setGenre(book.getGenre());
//      bookDTO.setIsbn(book.getIsbn());
//      bookDTO.setPrintYear(book.getPrintYear());
//      bookDTO.setQuantityAvailable(book.getQuantityAvailable());
//      bookDTO.setActive(book.isActive());
//      bookDTO.setPublisherId(book.getPublisher().getPublisherId());
//      bookDTOs.add(bookDTO);
//    }
//
//    return bookDTOs;
//  }

    public boolean enableDisableBook(Long id) throws BookNotFoundException {
        Book book = bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException("Book with Id " + id + " not found"));
        logger.debug("Query fired for finding the Book by Id");

        boolean isEnable = true;

        if (isEnable == book.isActive()) {
            book.setActive(false);
            System.out.println("here");
            isEnable = false;
        } else {
            book.setActive(true);
        }
        bookRepository.save(book);
        logger.debug("Enabled/Disabled the book by Id");

        return !isEnable;
    }

    public void updateBook(BookDTO updateBookRequest) throws BookNotFoundException, IllegalPrintYear, IsbnLengthException, IllegalQuantityException, PublisherNotFoundException {
        if (updateBookRequest.getQuantityAvailable() <= 0) {
            logger.error("Quantity should be greater than 0");
            throw new IllegalQuantityException("Quantity should be greater than 0");
        }

        if (updateBookRequest.getPrintYear() > new Date().getYear() + 1900 || updateBookRequest.getPrintYear() < 0) {
            logger.error("Print year should be less than or equal to current year");
            throw new IllegalPrintYear("Print year should be less than or equal to current year");
        }

        if (updateBookRequest.getIsbn().length() != 13) {
            logger.error("ISBN length should be 13 characters.");
            throw new IsbnLengthException("ISBN length should be 13 characters.");
        }
        Long bookId = updateBookRequest.getBookId();
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new BookNotFoundException());
        Publisher publisher = publisherRepository.findById(updateBookRequest.getPublisherId()).orElseThrow(() -> new PublisherNotFoundException("Publisher corresponding to given book not found!!"));
        if (!publisher.getPublisherId().equals(updateBookRequest.getPublisherId())) {
            book.setPublisher(publisher);
        }
        // Update book properties based on DTO values
        book.setTitle(updateBookRequest.getTitle());
        book.setAuthor(updateBookRequest.getAuthor());
        book.setIsbn(updateBookRequest.getIsbn());
        book.setPrintYear(updateBookRequest.getPrintYear());
        book.setGenre(Genre.valueOf(updateBookRequest.getGenre()));
        book.setQuantityAvailable(updateBookRequest.getQuantityAvailable());
        bookRepository.save(book);
    }


    private BookDTO convertToDTO(Book book) {

        return BookDTO.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .printYear(book.getPrintYear())
                .genre(String.valueOf(book.getGenre()))
                .quantityAvailable(book.getQuantityAvailable())
                .isActive(book.isActive())
                .publisherId(book.getPublisher().getPublisherId())
                .build();
    }

    public BookPaginationDTO getAllBooks(int pageNumber, int pageSize, String sortBy, String sortDir)
            throws BookNotFoundException {

        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);
        Page<Book> bookPage = bookRepository.findAll(p);
        logger.debug("Query fired for finding all Books");
        if (bookPage.isEmpty()) {
            logger.error("Book Not Found Exception generated!!");
            throw new BookNotFoundException("Books not found!!");
        }

        List<Book> books = bookPage.getContent();

        List<BookDTO> bookDTOs = books.stream().map(book -> {
            BookDTO bookDTO = convertToDTO(book);
            return bookDTO;
        }).collect(Collectors.toList());

        return BookPaginationDTO.builder()
                .content(bookDTOs)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .isLastPage(bookPage.isLast())
                .build();
    }

    // keep this service
    @Transactional
    public boolean deleteBook(Long bookId) throws BookNotDeletedException {
        boolean isBookIssued = bookIssueRepository.existsByBookId(bookId);
        boolean isBookRequested = bookRequestRepository.existsByBookId(bookId);

        if (isBookIssued == true) {
            throw new BookNotDeletedException("Book with ID " + bookId + " can not be deleted, as it is already issued to a user");
        }

        if (isBookRequested == true) {
            throw new BookNotDeletedException("Book with ID " + bookId + " can not be deleted, as it is already requested by a user");
        }

        bookRepository.deleteByBookId(bookId);
        return true;

    }

    //keep this
    public BookPaginationDTO getBooksByGenre(String genre, int pageNumber, int pageSize, String sortBy, String sortDir) throws BookNotFoundException {

        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);
        // String genreString = genre.toString();
        Page<Book> bookPage = bookRepository.findByGenreContainingIgnoreCase(genre, p);
        if (bookPage.isEmpty()) {
            logger.error("Genre Not Found Exception generated !");
            throw new BookNotFoundException("No books found by Genre '" + genre + "'");
        }

        List<Book> books = bookPage.getContent();
        logger.debug("Query fired for Finding the Book by Genre");

        List<BookDTO> bookDTOs = books.stream().map(book -> convertToDTO(book)).toList();

        return BookPaginationDTO.builder()
                .content(bookDTOs)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .isLastPage(bookPage.isLast())
                .build();
    }

    public BookDTO getBookOfTheWeek(Date startDate, Date endDate) {
//    LocalDate endDate = LocalDate.now();
//    LocalDate startDate = endDate.minusWeeks(1);

        List<Object[]> bookIssues = bookIssueRepository.findByWIssueDateBetween(startDate, endDate);


//    Map<Long, Long> bookIssueCountMap = bookIssues.stream()
//            .collect(Collectors.groupingBy(issue -> issue.getBook().getId(), Collectors.counting()));
        Map<Long, Long> bookIssueCountMap = bookIssues.stream()
                .collect(Collectors.groupingBy(
                        objArray -> ((Book) objArray[0]).getId(),
                        Collectors.counting()
                ));

        Long mostBorrowedBookId = bookIssueCountMap.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        // Retrieve the book details for the most borrowed book
        if (mostBorrowedBookId != null) {
            // Here, you would retrieve book details from your BookRepository
            // and convert to a BookDTO
            BookDTO mostBorrowedBookDTO = new BookDTO();
            mostBorrowedBookDTO.setId(mostBorrowedBookId);
            // Set other book details
            return mostBorrowedBookDTO;
        }

        return null; // No books found
    }

    public BookPaginationDTO getNewArrivalsBooks(int pageNumber, int pageSize, String sortBy, String sortDir) {

        // Calculate the date two weeks ago
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -14);
        Date twoWeeksAgo = calendar.getTime();

        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);

        Page<Book> bookPage = bookRepository.findNewArrivalsBooks(twoWeeksAgo, p);
        List<Book> books = bookPage.getContent();
        List<BookDTO> bookDTOs = books.stream().map(book ->
                BookDTO.builder()
                        .bookId(book.getBookId())
                        .title(book.getTitle())
                        .author(book.getAuthor())
                        .isbn(book.getIsbn())
                        .printYear(book.getPrintYear())
                        .genre(book.getGenre().toString())
                        .quantityAvailable(book.getQuantityAvailable())
                        .isActive(book.isActive())
                        .dateAdded(book.getDateAdded())
                        .publisherId(book.getPublisher().getPublisherId())
                        .build()).toList();

        return BookPaginationDTO.builder()
                .content(bookDTOs)
                .pageNumber(pageNumber)
                .pageSize(pageSize)
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .isLastPage(bookPage.isLast()).build();


        // Retrieve new arrivals books from repository
//    return bookRepository.findNewArrivalsBooks(twoWeeksAgo);
    }

    @Transactional
    public void updateBookQuantity(Long bookId, int quantity) throws BookNotFoundException, IllegalQuantityException {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new BookNotFoundException("Book with Id: " + bookId + " Not found!!"));
        if (quantity < 1) {
            throw new IllegalQuantityException("Quantity should be atleast 1");
        }
        book.setQuantityAvailable(quantity);
        bookRepository.save(book);
    }
}
