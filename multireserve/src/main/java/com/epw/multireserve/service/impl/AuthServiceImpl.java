package com.epw.multireserve.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.epw.multireserve.dto.AuthResponse;
import com.epw.multireserve.dto.LoginRequest;
import com.epw.multireserve.dto.RegisterRequest;
import com.epw.multireserve.dto.UpdateProfileRequest;
import com.epw.multireserve.entity.Role;
import com.epw.multireserve.entity.User;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.UserRepository;
import com.epw.multireserve.security.JwtService;
import com.epw.multireserve.service.AuthService;

@Service
@SuppressWarnings("null")
public class AuthServiceImpl implements AuthService {

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

        // ==========================================
        // REGISTRO (Público)
        // ==========================================
        @Override
        public AuthResponse register(RegisterRequest request) {
                if (repository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("El correo ya está registrado");
                }
// Por defecto, cualquier usuario que se registre desde la web será CLIENT
                User user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.CLIENT) // Por defecto es Cliente
                                .build();
// Guardar el nuevo usuario en la base de datos
                repository.save(user);

                String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
                return new AuthResponse(token, user.getFullName(), user.getEmail(), user.getRole().name());
        }

        // ==========================================
        // INICIO DE SESIÓN
        // ==========================================
        @Override
        public AuthResponse login(LoginRequest request) {
                User user = repository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
// Validar contraseña usando PasswordEncoder
                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        throw new IllegalArgumentException("Credenciales inválidas");
                }
// Generar token JWT con email y rol del usuario
                String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
                return new AuthResponse(token, user.getFullName(), user.getEmail(), user.getRole().name());
        }

        // ==========================================
        // ACTUALIZAR PERFIL (Usuario autenticado)
        // ==========================================
        @Override
        @Transactional
        public AuthResponse updateProfile(String currentEmail, UpdateProfileRequest request) {
                // 1. Buscar al usuario dueño del perfil en la base de datos
                User user = repository.findByEmail(currentEmail)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuario no encontrado con el email: " + currentEmail));

                // 🔍 VALIDACIÓN EVITA-ERROR-500: ¿El usuario cambió de verdad su email?
                if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
                        // Si el nuevo email ya existe en BD bajo el control de OTRA persona, arrojamos
                        // un error limpio
                        if (repository.existsByEmail(request.getEmail())) {
                                throw new IllegalArgumentException(
                                                "El correo electrónico ya se encuentra registrado por otro usuario");
                        }
                        // Si nadie lo usa, actualizamos de forma segura
                        user.setEmail(request.getEmail());
                }

                // 2. Actualizar el resto de campos permitidos
                user.setFullName(request.getFullName());

                // 3. Guardar cambios de forma permanente en la Base de Datos
                User updatedUser = repository.save(user);

                // 4. Generar un nuevo token (ya que el email puede haber cambiado)
                String newToken = jwtService.generateToken(updatedUser.getEmail(), updatedUser.getRole().name());

                // 5. Devolver la respuesta estructurada hacia React
                return new AuthResponse(
                                newToken,
                                updatedUser.getFullName(),
                                updatedUser.getEmail(),
                                updatedUser.getRole().name());
        }

        // ==========================================
        // MÉTODOS DE ADMINISTRACIÓN DE USUARIOS
        // ==========================================
        @Override
        public List<AuthResponse> findAllUsers() {
                return repository.findAll().stream()
                                .map(user -> new AuthResponse(
                                                null,
                                                user.getFullName(),
                                                user.getEmail(),
                                                user.getRole() != null ? user.getRole().name() : "CLIENT"))
                                .collect(Collectors.toList());
        }

        @Override
        public AuthResponse saveUserFromAdmin(RegisterRequest request) {
                if (repository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("El correo ya está registrado");
                }

                Role assignedRole = Role.CLIENT;
                if (request.getRole() != null) {
                        try {
                                assignedRole = Role.valueOf(request.getRole().toString().toUpperCase().trim());
                        } catch (IllegalArgumentException e) {
                                // Rol inválido, se mantiene CLIENT
                        }
                }

                User user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(assignedRole)
                                .build();

                repository.save(user);
                return new AuthResponse(null, user.getFullName(), user.getEmail(), user.getRole().name());
        }

        @Override
        public AuthResponse updateUserFields(Long id, RegisterRequest request) {
                User user = repository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

                user.setFullName(request.getFullName());
                user.setEmail(request.getEmail());

                if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                }

                if (request.getRole() != null) {
                        try {
                                user.setRole(Role.valueOf(request.getRole().toString().toUpperCase().trim()));
                        } catch (IllegalArgumentException e) {
                                // Mantiene el rol previo si el valor es erróneo
                        }
                }

                repository.save(user);
                return new AuthResponse(null, user.getFullName(), user.getEmail(), user.getRole().name());
        }

        @Override
        public void removeUser(Long id) {
                if (!repository.existsById(id)) {
                        throw new IllegalArgumentException("Usuario no encontrado");
                }
                repository.deleteById(id);
        }
}