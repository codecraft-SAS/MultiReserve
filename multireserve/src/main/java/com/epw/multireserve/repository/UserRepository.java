package com.epw.multireserve.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.epw.multireserve.entity.Role;
import com.epw.multireserve.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar usuario por email (para login y asignación de owner)
    // Devuelve Optional para manejar caso de email no encontrado
    Optional<User> findByEmail(String email);

    // Validar existencia de email (para registro)
    boolean existsByEmail(String email);

    // KPIs Dashboard: contar usuarios por rol usando entidad Role
    long countByRole(Role role);

    // KPIs Dashboard: contar usuarios por rol usando String (ej: "CLIENT",
    // "EMPLOYEE")
    long countByRole(String role);
}
