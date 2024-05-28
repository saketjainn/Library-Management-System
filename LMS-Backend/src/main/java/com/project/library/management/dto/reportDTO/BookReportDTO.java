package com.project.library.management.dto.reportDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookReportDTO {
   private Long bookId;
   private String title;
   private String author;
   private String genre;
   private String isbn;
   private int printYear;
   private int quantityAvailable;
   private String activeStatus;
   private String publisherName;
}
