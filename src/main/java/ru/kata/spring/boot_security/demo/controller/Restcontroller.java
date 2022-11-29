package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
public class Restcontroller {
    private final UserService userService;

    public Restcontroller(UserService userService) {
        this.userService = userService;
    }

    //GET:
    //Метод контроллера, который возвращает всех юзеров:
    @GetMapping("/all")
    public ResponseEntity<List<User>> all() {
        List<User> users = userService.back();//Jackson конвертирует эти объекты в JSON
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    //GET:
    //Метод контроллера, который возвращает авторизованного юзера:
    @GetMapping("/userAuth")
    public ResponseEntity<User> auth() {
        User user = userService.backAuthorized();//Jackson конвертирует этот объект в JSON
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    //GET:
    //Метод контроллера, который возвращает юзера по id:
    @GetMapping("/{id}")
    public ResponseEntity<User> one(@PathVariable("id") long id) {
        User user = userService.backByID(id);//Jackson конвертирует этот объект в JSON
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    //POST
    @PostMapping()
    //@RequestBody User user - аннотация нужна, чтобы сконвертировать входящий JSON-объект в объект класса User.
    //@Valid - аннотация нужна, чтобы проверять на валидность поля нашего Usera
    //В методе надо от клиента принять JSON и сконверитировать его в объект класса User:
    public ResponseEntity<User> create(@RequestBody @Valid User user) {
        userService.save(user);
        //Самый простой способ сказать, что всепрошло ок (когда мы не хотим создавать отдельный объект для сообщения об успехе):
        //Отправляем HTTP ответ с пустым телом и статусом 200:
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    //PATCH
    @PatchMapping("/{id}")
    public ResponseEntity<User> update(@RequestBody @Valid User user,
                       @PathVariable("id") long id) {
        userService.update(id, user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    //DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable("id") long id) {
        userService.delete(userService.backByID(id));
        return new ResponseEntity<>(id, HttpStatus.OK);
    }
}
