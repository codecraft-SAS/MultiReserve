package com.epw.multireserve.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.epw.multireserve.entity.Role;
import com.epw.multireserve.entity.User;
import com.epw.multireserve.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(
            UserRepository repository,
            PasswordEncoder encoder) {

        return args -> {

            if (!repository.existsByEmail(
                    "admin@gmail.com")) {

                User admin = User.builder()
                        .fullName("Administrador")
                        .email("admin@gmail.com")
                        .password(
                                encoder.encode("123456"))
                        .role(Role.ADMIN)
                        .build();

                repository.save(admin);

                System.out.println(
                        "🔥 ADMIN CREATED");
            }
        };
    }
}