package com.epw.multireserve.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.CreateUserRequest;
import com.epw.multireserve.dto.UserResponse;
import com.epw.multireserve.entity.User;
import com.epw.multireserve.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            UserRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // CREATE USER (ADMIN ONLY) - POST /api/admin/users
    // ==========================================
    @PostMapping("/users")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(
            @Validated(CreateUserRequest.OnCreate.class) @RequestBody CreateUserRequest request) { // 🌟 Exige la clave
                                                                                                   // solo al crear

        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        User savedUser = repository.save(user);

        UserResponse dto = new UserResponse();
        dto.setId(savedUser.getId());
        dto.setFullName(savedUser.getFullName());
        dto.setEmail(savedUser.getEmail());
        dto.setRole(savedUser.getRole());
        return dto;
    }

    // ==========================================
    // LIST USERS (ADMIN ONLY) - GET /api/admin/users
    // ==========================================
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> listUsers() {
        return repository.findAll().stream()
                .map(u -> {
                    UserResponse dto = new UserResponse();
                    dto.setId(u.getId());
                    dto.setFullName(u.getFullName());
                    dto.setEmail(u.getEmail());
                    dto.setRole(u.getRole());
                    return dto;
                })
                .toList();
    }

    // ==========================================
    // UPDATE USER (ADMIN ONLY) - PUT /api/admin/users/{id}
    // ==========================================
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateUser(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreateUserRequest request) { // 🌟 Valida campos generales, pero ignora la clave si
                                                             // viene vacía

        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        // Validar que el correo no le pertenezca a un tercero usando primitivos
        // estricto
        if (request.getEmail() != null) {
            repository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
                if (existingUser.getId().longValue() != id.longValue()) {
                    throw new IllegalArgumentException("Email already in use by another account");
                }
            });
            user.setEmail(request.getEmail());
        }

        // Actualizar campos básicos de manera segura ante nulos
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        // 🌟 Solo si el Administrador digitó algo nuevo en el modal, se encripta y
        // sobreescribe
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = repository.save(user);

        UserResponse dto = new UserResponse();
        dto.setId(updatedUser.getId());
        dto.setFullName(updatedUser.getFullName());
        dto.setEmail(updatedUser.getEmail());
        dto.setRole(updatedUser.getRole());
        return dto;
    }

    // ==========================================
    // DELETE USER (ADMIN ONLY) - DELETE /api/admin/users/{id}
    // ==========================================
    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable("id") Long id) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }

        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        repository.deleteById(id);
    }
}