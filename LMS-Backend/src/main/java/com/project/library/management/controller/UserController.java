 package com.project.library.management.controller;

import com.project.library.management.dto.*;
import com.project.library.management.entity.User;
import com.project.library.management.exception.*;
import com.project.library.management.repository.BookIssueRepository;
import com.project.library.management.service.BookIssueService;
import com.project.library.management.service.BookRequestService;
import com.project.library.management.service.BookService;
import com.project.library.management.service.ReportService;
import com.project.library.management.service.UserActivityService;
import com.project.library.management.service.UserDashboardService;
import com.project.library.management.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin("http://localhost:4200")
@RequiredArgsConstructor
public class UserController {
    private static final Logger logger = LogManager.getLogger(UserController.class);
    private final UserService userService;
    private final BookRequestService bookRequestService;
    private final BookService bookService;
    private final BookIssueService bookIssueService;
    private final ReportService reportService;
    private final UserActivityService userActivityService;
    private final UserDashboardService userDashboardService;


    @GetMapping("/test")
    protected ResponseEntity<String> test() {
        return ResponseEntity.ok("Hello from user only url");
    }
    @GetMapping("/is-username-available")
    //working
    protected ResponseEntity<Boolean> isUsernameAvailable(@Param("username") String username) {
        logger.debug("Debug message");
        return ResponseEntity.ok(userService.isUsernameAvailable(username));
    }

    @PutMapping("/update-user")
    protected ResponseEntity<UserProfile> updateUser(HttpServletRequest request,@RequestBody UserProfile userProfile) throws UserNotFoundException, IllegalMobileNoException, MobileNoExistsException, NothingToUpdateException, AddressLengthException {
        String username=request.getUserPrincipal().getName();
        System.out.println("username: "+username);
        System.out.println("userProfile: "+userProfile);
        UserProfile updatedUserProfile=userService.updateUser(username,userProfile);
        return ResponseEntity.ok().body(updatedUserProfile);
    }

    @PostMapping("/request-book")
    //working //changed for frontend
    public ResponseEntity<Boolean> issueBookRequest(@RequestBody BookRequestDTO bookRequestDTO, HttpServletRequest request) throws BookNotFoundException, DisabledBookException, BookAlreadyRequestedExecption, IllegalWeeksRequestedException ,FineLimitExcededException,RequestedLimitExcededException{
        String username = request.getUserPrincipal().getName();
        System.out.println("username: "+username);
        boolean isIssueSuccessful = bookRequestService.issueRequest(username, bookRequestDTO);
        System.out.println(isIssueSuccessful);
        return ResponseEntity.ok(isIssueSuccessful);
    }
    @GetMapping("/cancel-request")
    //working
    public ResponseEntity<Boolean> declineBookRequest(@Param("requestId") Long requestId) throws BookRequestNotFoundException {

        boolean isRequestCancelled = bookRequestService.cancelRequest(requestId);
        return ResponseEntity.ok(isRequestCancelled);

    }
    @GetMapping("/view-request")
    public ResponseEntity<List<ViewRequestsDTO>> viewRequests(HttpServletRequest request) throws BookRequestNotFoundException{
        String userName=request.getUserPrincipal().getName();
         List<ViewRequestsDTO> viewRequestDTOs=bookRequestService.viewRequest(userName);

        return ResponseEntity.ok(viewRequestDTOs);
    }

    @GetMapping("/view-borrowed-books")
    protected ResponseEntity<BookIssuePaginationDTO> viewBorrowedBooks(HttpServletRequest request,
                                                                         @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
                                                                         @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
                                                                         @RequestParam(value = "sortBy", defaultValue ="issueDate", required = false) String sortBy,
                                                                         @RequestParam(value = "sortDir", defaultValue ="asc", required = false) String sortDir ) throws BookIssueNotFoundException, UserNotFoundException {
        String username = request.getUserPrincipal().getName();
        BookIssuePaginationDTO borrowedBooks = bookIssueService.viewBorrowedBooks(username,pageNumber,pageSize,sortBy,sortDir);
        return ResponseEntity.ofNullable(borrowedBooks);
    }


    @GetMapping("/get-book-List-by-title" )
    protected ResponseEntity<BookPaginationDTO> getBookByTitle (
        @RequestParam("title") String title,
        @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
        @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
        @RequestParam(value = "sortBy", defaultValue ="title", required = false) String sortBy,
        @RequestParam(value = "sortDir", defaultValue ="asc", required = false) String sortDir) throws BookNotFoundException {

        BookPaginationDTO bookPaginationDTO=bookService.getBookListByTitle(title,pageNumber,pageSize,sortBy,sortDir);
        return ResponseEntity.of(Optional.of(bookPaginationDTO));
    }
     //keep these changes
     @GetMapping("/get-book-by-id" )
    protected ResponseEntity<BookDTO> getBookById (@Param("id") Long id) throws BookNotFoundException {
       BookDTO book=bookService.getBookById(id);

       return ResponseEntity.of(Optional.of(book));
    }




    @GetMapping("/get-book-by-authorName" )
    protected ResponseEntity<BookPaginationDTO> getBooksByAuthorName (
        @RequestParam("author") String author,
        @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
        @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
        @RequestParam(value = "sortBy", defaultValue ="title", required = false) String sortBy,
        @RequestParam(value = "sortDir", defaultValue ="asc", required = false) String sortDir) throws BookNotFoundException{

        BookPaginationDTO bookPaginationDTO=bookService.getBooksByAuthor(author,pageNumber,pageSize,sortBy,sortDir);

       return ResponseEntity.of(Optional.of(bookPaginationDTO));
    }

    @Autowired
    private BookIssueRepository booksIssuedRepository;

    @GetMapping("/fines")
    public ResponseEntity<FinePaginationDTO> getUserFines(HttpServletRequest request,
    @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
    @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
    @RequestParam(value = "sortBy", defaultValue ="returnDate", required = false) String sortBy,
    @RequestParam(value = "sortDir", defaultValue ="asc", required = false) String sortDir) throws NoFineFoundException {
        String username = request.getUserPrincipal().getName();

        FinePaginationDTO finePaginationDTO = userService.viewFine(pageNumber, pageSize, sortBy, sortDir,username);

        return ResponseEntity.ok(finePaginationDTO);
    }

    @GetMapping("/view-all-books")
    protected ResponseEntity<BookPaginationDTO> getAllBooks(
        @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
        @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
        @RequestParam(value = "sortBy", defaultValue ="title", required = false) String sortBy,
        @RequestParam(value = "sortDir", defaultValue ="asc", required = false) String sortDir ) throws BookNotFoundException{

        BookPaginationDTO bookPaginationDTO = bookService.getAllBooks(pageNumber, pageSize, sortBy, sortDir);

        return ResponseEntity.of(Optional.of(bookPaginationDTO));
    }
 ///keep this
    @GetMapping("/view-requests")
    public ResponseEntity<BookRequestPaginationDTO> getPendingRequestsByUser(HttpServletRequest request,
        @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
        @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
        @RequestParam(value = "sortBy", defaultValue ="requestDate", required = false) String sortBy,
        @RequestParam(value = "sortDir", defaultValue ="asc", required = false) String sortDir,
        @RequestParam(value = "filterBy",required = false) String filterBy) throws BookRequestNotFoundException, UserNotFoundException {

        String username = request.getUserPrincipal().getName();
        BookRequestPaginationDTO bookRequestPaginationDTO=bookRequestService.viewRequestsByUserName(pageNumber, pageSize, sortBy, sortDir,username,filterBy);

        return ResponseEntity.of(Optional.of(bookRequestPaginationDTO));
    }
    ///keep this
    @GetMapping("/get-book-by-genre" )
    protected ResponseEntity<BookPaginationDTO> getBooksByGenre (
        @RequestParam("genre") String genre,
        @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
        @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
        @RequestParam(value = "sortBy", defaultValue ="genre", required = false) String sortBy,
        @RequestParam(value = "sortDir", defaultValue ="asc", required = false) String sortDir) throws BookNotFoundException{

        BookPaginationDTO bookPaginationDTO=bookService.getBooksByGenre(genre,pageNumber,pageSize,sortBy,sortDir);

       return ResponseEntity.of(Optional.of(bookPaginationDTO));
    }
    @GetMapping("/userActivity")
    public ResponseEntity<List<UserActivityDTO>> getUserActivityReport() {
        List<UserActivityDTO> userActivityReport = userActivityService.getUserActivityReport();
        return ResponseEntity.ok(userActivityReport);
    }
    @GetMapping("/user-dashboard")
    public ResponseEntity<UserDashboardDTO> userDashboard(HttpServletRequest request) {
        String username = request.getUserPrincipal().getName();
        Optional<User> optionalUser = userService.getUserByUsernameforDashboard(username);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return ResponseEntity.ok(UserDashboardDTO.builder()
                    .genreWiseSplit(userDashboardService.getGenreWiseSplitForUser(user))
                    .favoriteBooks(userDashboardService.getFavoriteBooksForUser(user))
                    .favoriteAuthors(userDashboardService.getFavoriteAuthorsForUser(user))
                    .totalBooksBorrowed(userDashboardService.getTotalBooksBorrowedByUser(user))
                    .totalDuesAmount(userDashboardService.getTotalDuesAmountForUser(username))
                    .build());
        }
        else {
            // Handle case where user is not found
            return ResponseEntity.notFound().build();
        }

    }


    @GetMapping("/newArrivals")
    public ResponseEntity<BookPaginationDTO> getNewArrivalsBooks(
            @RequestParam(value = "pageNumber", defaultValue ="0", required = false) int pageNumber,
            @RequestParam(value = "pageSize", defaultValue ="10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue ="dateAdded", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue ="desc", required = false) String sortDir) {

        BookPaginationDTO newBooks = bookService.getNewArrivalsBooks(pageNumber, pageSize, sortBy, sortDir);
        return ResponseEntity.ok(newBooks);
    }


    @GetMapping("generate-report")
    protected ResponseEntity<byte[]> generateReport(HttpServletRequest request,
        @RequestParam("reportName") String reportName,
        @RequestParam(value = "startDate", required=false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
        @RequestParam(value = "endDate", required=false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate)  throws JRException,FileNotFoundException, ReportGenerationException {
            
        String username=request.getUserPrincipal().getName();
        ByteArrayOutputStream byteArrayOutputStream = reportService.getUserReport(username,reportName,startDate, endDate);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_PDF);
        return ResponseEntity.ok().headers(httpHeaders).body(byteArrayOutputStream.toByteArray());
    }

    @GetMapping("/get-user-details" )
    protected ResponseEntity<UserProfile> getUserDetails(HttpServletRequest request) throws UserNotFoundException {
        String username = request.getUserPrincipal().getName();
        UserProfile userProfile = userService.getUserProfile(username);
        return ResponseEntity.of(Optional.of(userProfile));
    }
}


