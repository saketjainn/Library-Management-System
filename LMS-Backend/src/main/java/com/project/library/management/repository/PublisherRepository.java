package com.project.library.management.repository;

import com.project.library.management.entity.Book;
import com.project.library.management.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


public interface PublisherRepository extends JpaRepository<Publisher, Long> {

    Optional<Publisher> findByPublisherId(Long publisherId);
    boolean existsByName(String name);

    @Query("select publisher from Publisher publisher where publisher.id= :publisherId")  
    Publisher findPublisherById(Long publisherId);
    

//    Optional<Publisher> findByPublisherId(Long publisherId);
//    void deleteByPublisherId(Long publisherId);

}
