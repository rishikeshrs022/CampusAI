package com.campusai.assistant.service;

import com.campusai.assistant.entity.User;
import com.campusai.assistant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthenticationService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.campusai.assistant.repository.StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        java.util.Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (!userOpt.isPresent()) {
            java.util.Optional<com.campusai.assistant.entity.Student> studentOpt = studentRepository.findByEmail(username);
            if (studentOpt.isPresent()) {
                userOpt = userRepository.findByUsername(studentOpt.get().getId());
            }
        }

        User user = userOpt.orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
