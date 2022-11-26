package ru.kata.spring.boot_security.demo.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

@EnableWebSecurity
//Настройка секьюрности по определенным URL, а также настройка UserDetails и GrantedAuthority:
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final SuccessUserHandler successUserHandler;
    private final UserServiceImpl userService;

    public WebSecurityConfig(SuccessUserHandler successUserHandler, UserServiceImpl userService) {
        this.successUserHandler = successUserHandler;
        this.userService = userService;
    }

    //Конфигурируем SpringSecurity (какая страница за что отвечеат + конфигурация авторизации)
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http    .csrf().disable()//это отключает csrf-защиту (* так же во вью login)
                .authorizeRequests()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user").hasRole("USER")
                //для всех остальных страниц мы даем доступ и юзеру и админу
                .anyRequest().hasAnyRole("USER", "ADMIN")
                .and()
                .formLogin()
                .loginPage("/")
                .loginProcessingUrl("/process_login")
                .defaultSuccessUrl("/admin", true)
                .failureUrl("/?error")
                .and()
                .formLogin().successHandler(successUserHandler)
                .permitAll()
                .and()
                .logout()
                .permitAll();
    }

    //Преобразователь паролей:
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Настройка аутентификации:
    @Bean
    //Методу daoAuthenticationProvider() мы отдали логин и пароль,
    //а его задача сказать, существует такой пользователь или нет
    //если существует, то его нужно положить в SpringSecurity контекст
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(userService);
        return authenticationProvider;
    }

}