package com.epw.multireserve.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.AuthResponse;
import com.epw.multireserve.dto.RegisterRequest;
import com.epw.multireserve.service.AuthService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final AuthService authService;

    // Inyectamos el servicio de autenticación y usuarios real de Spring
    public UserController(AuthService authService) {
        this.authService = authService;
    }

    // 🌟 1. Listar todos los usuarios
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<AuthResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.findAllUsers());
    }

    // 🌟 2. Crear un empleado o administrador desde el panel
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AuthResponse> createUserFromAdmin(@RequestBody RegisterRequest dto) {
        return ResponseEntity.ok(authService.saveUserFromAdmin(dto));
    }

    // 🌟 3. Modificar un usuario
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AuthResponse> updateUser(@PathVariable Long id, @RequestBody RegisterRequest dto) {
        return ResponseEntity.ok(authService.updateUserFields(id, dto));
    }

    // 🌟 4. Eliminar un usuario
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        authService.removeUser(id);
        return ResponseEntity.noContent().build();
    }
}