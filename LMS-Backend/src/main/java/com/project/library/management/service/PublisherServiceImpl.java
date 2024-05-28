package com.project.library.management.service;


import com.project.library.management.dto.PublisherDTO;
import com.project.library.management.entity.Publisher;
import com.project.library.management.exception.LMSException;
import com.project.library.management.exception.PublisherNotFoundException;
import com.project.library.management.repository.PublisherRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PublisherServiceImpl implements PublisherService{


    private final PublisherRepository publisherRepository;

    public Publisher addPublisher(PublisherDTO publisherDTO) throws LMSException{

            if(publisherRepository.existsByName(publisherDTO.getName())){
                throw new LMSException("Publisher with name '"+publisherDTO.getName()+"' already exists!!");
            }
        Publisher publisher = new Publisher();
        publisher.setName(publisherDTO.getName());
        publisher.setEmail(publisherDTO.getEmail());
        publisher.setPhoneNo(publisherDTO.getPhoneNo());

        Publisher savedPublisher = publisherRepository.save(publisher);
        return savedPublisher;
    }

    public PublisherDTO getPublisher(Long publisherId) throws PublisherNotFoundException{
        Publisher publisher= publisherRepository.findById(publisherId).orElseThrow(()->new PublisherNotFoundException());
        PublisherDTO publisherDTO = new PublisherDTO();
        publisherDTO.setName(publisher.getName());
        publisherDTO.setPhoneNo(publisher.getPhoneNo());
        publisherDTO.setEmail(publisher.getEmail());

        return publisherDTO;
    }

    public void updatePublisher(PublisherDTO publisherDTO, Long publisherId) throws PublisherNotFoundException{
        Publisher publisher = publisherRepository.findById(publisherId).orElseThrow(PublisherNotFoundException::new);
        publisher.setName(publisherDTO.getName());
        publisher.setEmail(publisherDTO.getEmail());
        publisher.setPhoneNo(publisherDTO.getPhoneNo());

        publisherRepository.save(publisher);
    }

    @Transactional
    public void deletePublisher(Long publisherId) throws PublisherNotFoundException{
        Publisher publisher= publisherRepository.findById(publisherId).orElseThrow(()->new PublisherNotFoundException());
        publisherRepository.deleteById(publisherId);
    }

    public PublisherDTO convertToDTO(Publisher publisher){
        return PublisherDTO.builder()
                           .publisherId(publisher.getPublisherId())
                           .name(publisher.getName())
                           .email(publisher.getEmail())
                           .phoneNo(publisher.getPhoneNo())
                           .build();
    }

    public List<PublisherDTO> getAllPublishers() throws PublisherNotFoundException{
        List<Publisher> publishers=publisherRepository.findAll();
        
        if(publishers.isEmpty()){
            throw new PublisherNotFoundException();
        }

        List<PublisherDTO> publisherDTOs=publishers.stream().map(publisher->convertToDTO(publisher)).toList();
        return publisherDTOs;
    }
}
