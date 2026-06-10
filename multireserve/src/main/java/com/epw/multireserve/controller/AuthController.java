package com.epw.multireserve.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.AuthResponse;
import com.epw.multireserve.dto.LoginRequest;
import com.epw.multireserve.dto.RegisterRequest;
import com.epw.multireserve.dto.UpdateProfileRequest;
import com.epw.multireserve.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    // ==========================================
    // REGISTER
    // ==========================================
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request) {
        return service.register(request);
    }

    // ==========================================
    // LOGIN
    // ==========================================
    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }

    // ==========================================
    // UPDATE PROFILE (Añadido para conectar con React)
    // ==========================================
    @PutMapping("/update-profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {

        // Si por alguna razón el contexto de seguridad está vacío o el token expiró
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extraemos el email actual del token decodificado por Spring Security
        String currentEmail = userDetails.getUsername();

        // Ejecutamos la lógica segura que creamos en el Service
        AuthResponse response = service.updateProfile(currentEmail, request);

        return ResponseEntity.ok(response);
    }
}