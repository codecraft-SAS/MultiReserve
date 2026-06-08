package com.epw.multireserve.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

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
}
