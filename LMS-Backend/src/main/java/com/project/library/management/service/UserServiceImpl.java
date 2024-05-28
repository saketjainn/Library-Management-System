package com.project.library.management.service;

import com.project.library.management.dto.*;
import com.project.library.management.entity.BookIssue;
import com.project.library.management.entity.User;
import com.project.library.management.exception.*;
import com.project.library.management.repository.BookIssueRepository;
import com.project.library.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final BookIssueRepository bookIssueRepository;

    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    public UserDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(null);

        return convertToDTO(user);
    }

    public UserProfile getUserProfile(String username) throws UserNotFoundException{
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found!!"));

        UserProfile userProfile = new UserProfile();
        userProfile.setAddress(user.getAddress());
        userProfile.setMobileNo(user.getMobileNo());
        userProfile.setName(user.getName());

        return userProfile;
    }

    private UserDTO convertToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setName(user.getName());
        userDTO.setUsername(user.getUsername());
        userDTO.setAddress(user.getAddress());
        userDTO.setMobileNo(user.getMobileNo());
        userDTO.setPassword(user.getPassword());
        userDTO.setRole(user.getRole().toString());
        return userDTO;
    }

    public UserPaginationDTO getAllUsers(int pageNumber, int pageSize, String sortBy, String sortDir) throws UserNotFoundException {

        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> userPage = userRepository.findAll(p);
        if(userPage.isEmpty()){
            throw new UserNotFoundException("No users found!!");
        }

        List<User> users = userPage.getContent();

        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO userDTO = convertToDTO(user);
            return userDTO;
        }).collect(Collectors.toList());

        UserPaginationDTO userPaginationDTO = new UserPaginationDTO();
        userPaginationDTO.setContent(userDTOs);
        userPaginationDTO.setPageNumber(pageNumber);
        userPaginationDTO.setPageSize(pageSize);
        userPaginationDTO.setTotalElements(userPage.getTotalElements());
        userPaginationDTO.setTotalPages(userPage.getTotalPages());
        userPaginationDTO.setLastPage(userPage.isLast());

        return userPaginationDTO;
    }

    // keep this service also
    public UserPaginationDTO getUserByUsername(int pageNumber, int pageSize, String sortBy, String sortDir,
            String username) throws UserNotFoundException {

        Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable p = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> userPage = userRepository.findByUsernameContainingIgnoreCase(username, p);
        if(userPage.isEmpty()){
            throw new UserNotFoundException();
        }

        List<User> users = userPage.getContent();

        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO userDTO = convertToDTO(user);
            return userDTO;
        }).collect(Collectors.toList());

        UserPaginationDTO userPaginationDTO = new UserPaginationDTO();
        userPaginationDTO.setContent(userDTOs);
        userPaginationDTO.setPageNumber(pageNumber);
        userPaginationDTO.setPageSize(pageSize);
        userPaginationDTO.setTotalElements(userPage.getTotalElements());
        userPaginationDTO.setTotalPages(userPage.getTotalPages());
        userPaginationDTO.setLastPage(userPage.isLast());

        return userPaginationDTO;
    }

    // keep this
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

    public Optional<User> getUserByUsernameforDashboard(String username) {
        return userRepository.findByUsername(username);
    }

    public UserProfile updateUser(String username,UserProfile userProfile) throws UserNotFoundException, IllegalMobileNoException, MobileNoExistsException, NothingToUpdateException, AddressLengthException {
        User user = userRepository.findByUsername(username).orElseThrow(()->new UserNotFoundException());
        System.out.println(userProfile.getMobileNo().length());
        if(userProfile.getName().equals(user.getName()) && userProfile.getAddress().equals(user.getAddress()) && userProfile.getMobileNo().equals(user.getMobileNo())){
            throw new NothingToUpdateException();
        }


        if(userProfile.getMobileNo().length()!=10){
            throw new IllegalMobileNoException();
        }
        if(userProfile.getAddress().length()>=30){
            throw new AddressLengthException();
        }





        user.setName(userProfile.getName());
        user.setAddress(userProfile.getAddress());
        user.setMobileNo(userProfile.getMobileNo());

        userRepository.save(user);

        return userProfile;
    }
}