package com.epw.multireserve.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails { // 🚀 CORRECCIÓN: Implementar UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // =========================
    // NEGOCIOS DEL ADMIN
    // =========================
    @OneToMany(mappedBy = "owner")
    @Builder.Default
    private List<Business> businesses = new ArrayList<>();

    // =========================
    // RESERVAS DEL USUARIO
    // =========================
    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Reservation> reservations = new ArrayList<>();

    // =========================
    // RELACIÓN BUSINESS (EMPLOYEE)
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id")
    private Business business;

    // =====================================================================
    // 🔐 MÉTODOS OBLIGATORIOS DE USERDETAILS (SPRING SECURITY)
    // =====================================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 🔥 CRÍTICO: Mapea tu Enum Role a una autoridad limpia reconocida por
        // .hasAuthority()
        return List.of(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public String getUsername() {
        // Tu sistema se autentica con el Email
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Cuenta activa siempre
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Cuenta no bloqueada
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Credenciales vigentes
    }

    @Override
    public boolean isEnabled() {
        return true; // Usuario habilitado
    }
}