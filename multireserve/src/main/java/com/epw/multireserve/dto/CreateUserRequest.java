package com.epw.multireserve.dto;

import com.epw.multireserve.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateUserRequest {

    // 🌟 1. Creamos una interfaz interna que servirá de marcador para el flujo de
    // creación
    public interface OnCreate {
    }

    @NotBlank(message = "El nombre completo es obligatorio")
    private String fullName;

    @Email(message = "Debe proporcionar un correo válido")
    @NotBlank(message = "El correo es obligatorio")
    private String email;

    // 🌟 2. Le indicamos a @NotBlank que actúe SOLO en el grupo OnCreate
    @NotBlank(groups = OnCreate.class, message = "La contraseña es obligatoria al crear un usuario")
    private String password;

    @NotNull(message = "El rol es obligatorio")
    private Role role;

    private Long businessId;

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }
}