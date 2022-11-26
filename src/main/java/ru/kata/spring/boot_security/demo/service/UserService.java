package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    void save(User user);

    void delete(User user);

    void update(long id, User newUser);

    List<User> back();

    User backByID(Long id);

    User backAuthorized();
}
