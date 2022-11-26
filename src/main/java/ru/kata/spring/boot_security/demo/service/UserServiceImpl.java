package ru.kata.spring.boot_security.demo.service;


import org.springframework.context.annotation.Lazy;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    //Аннотация @Lazy -> циклической зависимости больше нет каким то чудом
    public UserServiceImpl(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @Override
    public void save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Transactional
    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }

    @Transactional
    @Override
    public void update(long id, User newUser) {
        User oldUser = userRepository.getReferenceById(id);
        oldUser.setName(newUser.getName());
        oldUser.setLastname(newUser.getLastname());
        oldUser.setAge(newUser.getAge());
        oldUser.setUsername(newUser.getUsername());
        if (newUser.getPassword() == "" || newUser.getPassword() == null) {
            oldUser.setPassword(oldUser.getPassword());
        } else {
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            oldUser.setPassword(newUser.getPassword());
        }
        oldUser.setRoles(newUser.getRoles());
    }

    @Override
    public List<User> back() {
        return userRepository.findAll();
    }

    @Override
    public User backByID(@Param("id") Long id) {
        return userRepository.findById(id).orElse(null);
    }

    //Задача метода вернуть именно авторизованного юзера с ролью USER или ролью ADMIN и USER
    @Override
    public User backAuthorized() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        return userRepository.findByUsername(name);
    }

    //Задача всего нижеследующего: ПО ИМЕНИ ПОЛЬЗОВАТЕЛЯ ПРЕДОСТАВИТЬ САМОГО ЮЗЕРА
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        //Перегоняем наших юзеров в тех, что понимает SpringSecurity
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                mapRolesToAuthorities(user.getRoles()));
    }

    //Метод, который из коллекции ролей получает коллекцию прав доступа
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(r -> new SimpleGrantedAuthority(r.getName())).toList();
    }
}
