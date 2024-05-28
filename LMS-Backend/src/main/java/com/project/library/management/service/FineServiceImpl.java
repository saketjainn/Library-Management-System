package com.project.library.management.service;

import com.project.library.management.dto.FineDTO;
import com.project.library.management.dto.FinePaginationDTO;
import com.project.library.management.entity.BookIssue;
import com.project.library.management.entity.Fine;
import com.project.library.management.exception.NoFineFoundException;
import com.project.library.management.repository.BookIssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Component
public class FineServiceImpl implements FineService{

    @Value("${fine.amount.perday}")
    private int fineAmountPerDay;
    public FinePaginationDTO viewFine(int pageNumber, int pageSize, String sortBy, String sortDir, String username) throws NoFineFoundException {
        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);

        Page<BookIssue> finePage = bookIssueRepository.calculateFinesByUserName(username, p);
        if (finePage.isEmpty()) {
            throw new NoFineFoundException();
        }
        List<BookIssue> fines = finePage.getContent();
        List<FineDTO> fineDTOs = fines.stream().map((BookIssue bookIssue) -> FineDTO.builder()
                .issueId(bookIssue.getIssueId())
                .fine(bookIssue.getFine())
                .bookName(bookIssue.getBook().getTitle())
                .build()).toList();

        FinePaginationDTO finePaginationDTO = new FinePaginationDTO();
        finePaginationDTO.setContent(fineDTOs);
        finePaginationDTO.setPageNumber(pageNumber);
        finePaginationDTO.setPageSize(pageSize);
        finePaginationDTO.setTotalElements(finePage.getTotalElements());
        finePaginationDTO.setTotalPages(finePage.getTotalPages());
        finePaginationDTO.setLastPage(finePage.isLast());

        System.out.println(finePaginationDTO);
        return finePaginationDTO;
    }
    private final BookIssueRepository bookIssueRepository;
    @Scheduled(cron = "0 0 0 * * ?") //12 AM (Midnight)
    //@Scheduled(cron = "0 */2 * * * ?")  //Every 2 minutes
    public void runDailyTask() {
        System.out.println("Running scheduler task");
        List<BookIssue> bookIssueListNoFine = bookIssueRepository.findByFineStatus(Fine.valueOf("NOFINE"));
        List<BookIssue> bookIssueListUnPaid = bookIssueRepository.findByFineStatus(Fine.valueOf("UNPAID"));
        Date currentDate = new Date(); // Set current date

        bookIssueListNoFine.forEach(bookIssue -> {

                if (bookIssue.getDueDate().before(currentDate)) {
                bookIssue.setFineStatus(Fine.valueOf("UNPAID"));
                long diff = currentDate.getTime() - bookIssue.getDueDate().getTime();
                long diffDays = diff / (24 * 60 * 60 * 1000);
                    bookIssue.setFine(Math.min(((int) diffDays * fineAmountPerDay), Integer.MAX_VALUE));

            }
        });
        bookIssueRepository.saveAll(bookIssueListNoFine);

        bookIssueListUnPaid.forEach(bookIssue -> {
            long diff = currentDate.getTime() - bookIssue.getDueDate().getTime();
            long diffDays = diff / (24 * 60 * 60 * 1000);
            bookIssue.setFine(Math.min(((int) diffDays * fineAmountPerDay), Integer.MAX_VALUE));
        });
        bookIssueRepository.saveAll(bookIssueListUnPaid);

    }
}