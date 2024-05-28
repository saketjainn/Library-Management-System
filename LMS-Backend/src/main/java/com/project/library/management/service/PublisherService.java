package com.project.library.management.service;

import java.util.List;

import com.project.library.management.dto.PublisherDTO;
import com.project.library.management.entity.Publisher;
import com.project.library.management.exception.LMSException;
import com.project.library.management.exception.PublisherNotFoundException;

public interface PublisherService {

    Publisher addPublisher(PublisherDTO publisherDTO) throws LMSException;

    PublisherDTO getPublisher(Long publisherId) throws PublisherNotFoundException;

    void updatePublisher(PublisherDTO publisherDTO, Long publisherId) throws PublisherNotFoundException;

    void deletePublisher(Long publisherId) throws PublisherNotFoundException;

    List<PublisherDTO> getAllPublishers() throws PublisherNotFoundException;
}
