package ru.kata.spring.boot_security.demo.controller;

import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/he")
public class Restcontroller {
    private final UserService userService;

    public Restcontroller(UserService userService) {
        this.userService = userService;
    }

    //GET:
    //Метод контроллера, который возвращает всех юзеров:
    @GetMapping("/all")
    public List<User> all() {
        return userService.back();//Jackson конвертирует эти объекты в JSON
    }

    //GET:
    //Метод контроллера, который возвращает авторизованного юзера:
    @GetMapping("/userAuth")
    public User auth() {
        return userService.backAuthorized();//Jackson конвертирует этот объект в JSON
    }

    //GET:
    //Метод контроллера, который возвращает юзера по id:
    @GetMapping("/{id}")
    public User one(@PathVariable("id") long id) {
        return userService.backByID(id);//Jackson конвертирует этот объект в JSON
    }

    //POST
    @PostMapping()
    //@RequestBody User user - аннотация нужна, чтобы сконвертировать входящий JSON-объект в объект класса User.
    //@Valid - аннотация нужна, чтобы проверять на валидность поля нашего Usera
    //В методе надо от клиента принять JSON и сконверитировать его в объект класса User:
    public User create(@RequestBody @Valid User user) {
        userService.save(user);
        //Самый простой способ сказать, что всепрошло ок (когда мы не хотим создавать отдельный объект для сообщения об успехе):
        //Отправляем HTTP ответ с пустым телом и статусом 200:
        return user;
    }

    //PATCH
    @PatchMapping("/{id}")
    public User update(@RequestBody @Valid User user,
                       @PathVariable("id") long id) {
        userService.update(id, user);
        return user;
    }

    //DELETE
    @DeleteMapping("/{id}")
    public Long delete(@PathVariable("id") long id) {
        userService.delete(userService.backByID(id));
        return id;
//        return ResponseEntity.ok(HttpStatus.OK);
    }
}
