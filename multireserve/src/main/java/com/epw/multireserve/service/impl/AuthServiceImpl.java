package com.epw.multireserve.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.epw.multireserve.dto.AuthResponse;
import com.epw.multireserve.dto.LoginRequest;
import com.epw.multireserve.dto.RegisterRequest;
import com.epw.multireserve.entity.Role;
import com.epw.multireserve.entity.User;
import com.epw.multireserve.repository.UserRepository;
import com.epw.multireserve.security.JwtService;
import com.epw.multireserve.service.AuthService;

@Service
public class AuthServiceImpl
                implements AuthService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;

        public AuthServiceImpl(
                        UserRepository repository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {

                this.repository = repository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
        }

        // =========================
        // REGISTER
        // =========================
        @Override
        public AuthResponse register(
                        RegisterRequest request) {

                // Verificar email duplicado
                if (repository.existsByEmail(
                                request.getEmail())) {

                        throw new IllegalArgumentException(
                                        "Email already registered");
                }

                // Crear usuario
                User user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(
                                                passwordEncoder.encode(
                                                                request.getPassword()))

                                // TODOS los usuarios registrados serán CLIENT
                                .role(Role.CLIENT)

                                .build();

                repository.save(user);

                // Generar token con email + rol
                String token = jwtService.generateToken(
                                user.getEmail(),
                                user.getRole().name());

                return new AuthResponse(
                                token,
                                user.getFullName(),
                                user.getEmail(),
                                user.getRole().name());
        }

        // =========================
        // LOGIN
        // =========================
        @Override
        public AuthResponse login(
                        LoginRequest request) {

                User user = repository.findByEmail(
                                request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Invalid credentials"));

                // Verificar password
                if (!passwordEncoder.matches(
                                request.getPassword(),
                                user.getPassword())) {

                        throw new IllegalArgumentException(
                                        "Invalid credentials");
                }

                // Generar token con email + rol
                String token = jwtService.generateToken(
                                user.getEmail(),
                                user.getRole().name());

                return new AuthResponse(
                                token,
                                user.getFullName(),
                                user.getEmail(),
                                user.getRole().name());
        }
}
