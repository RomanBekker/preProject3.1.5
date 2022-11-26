package ru.kata.spring.boot_security.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.Set;


@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
    private String name;
    private String lastname;
    private int age;
    private String username;
    private String password;

    @ManyToMany
    //отдельная связывающая таблица
    @JoinTable(name = "users_roles",
            //колонка, которая принадлежит текущей сущности:
            joinColumns = @JoinColumn(name = "users_id"),
            //колонка, которая принадлежит Role:
            inverseJoinColumns = @JoinColumn(name = "roles_id"))

    private Set<Role> roles;

    public User() {
    }

    public User(Long id, String name, String lastname, int age, String username, String password, Set<Role> roles) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.age = age;
        this.username = username;
        this.password = password;
        this.roles = roles;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    //Возвращает логин нашей сущности (Для Spring Security):
    @Override
    public String getUsername() {
        return username;
    }

    //Возвращает пароль нашей сущности (Для Spring Security):
    @Override
    public String getPassword() {
        return password;
    }

    //Для авторизации:
    //Список прав Usera:
    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
    }

    //Аккаунт не просрочен:
    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    //Аккаунт не заблокирован:
    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    //Пароль не просрочен:
    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //Аккаунт "включен"
    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }

}
