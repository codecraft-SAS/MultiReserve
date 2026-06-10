package com.epw.multireserve.service;

import java.util.List;

import com.epw.multireserve.dto.AuthResponse;
import com.epw.multireserve.dto.LoginRequest;
import com.epw.multireserve.dto.RegisterRequest;
import com.epw.multireserve.dto.UpdateProfileRequest;

public interface AuthService {

        // 🔐 Métodos existentes de Autenticación
        AuthResponse register(RegisterRequest request);

        AuthResponse login(LoginRequest request);

        // 🆕 NUEVO: Actualizar perfil del usuario autenticado
        AuthResponse updateProfile(String currentEmail, UpdateProfileRequest request);

        // 🛠️ MÉTODOS NUEVOS PARA EL PANEL DE ADMINISTRACIÓN DE USUARIOS

        // 🌟 1. Listar todos los usuarios
        List<AuthResponse> findAllUsers();

        // 🌟 2. Crear un usuario desde el panel de administración
        AuthResponse saveUserFromAdmin(RegisterRequest request);

        // 🌟 3. Modificar un usuario existente (Usamos RegisterRequest para reutilizar
        // los campos editables)
        AuthResponse updateUserFields(Long id, RegisterRequest request);

        // 🌟 4. Eliminar un usuario
        void removeUser(Long id);
}
