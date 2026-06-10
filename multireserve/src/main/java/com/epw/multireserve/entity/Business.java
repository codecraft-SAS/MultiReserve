package com.epw.multireserve.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreRemove; // 🌟 Importación necesaria para el ciclo de vida de JPA
import jakarta.persistence.Table;

@Entity
@Table(name = "businesses")
public class Business {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre negocio
    @Column(nullable = false, length = 120, unique = true)
    private String name;

    // Descripción
    @Column(length = 1000)
    private String description;

    // Categoría
    @Column(length = 100)
    private String category;

    // Ciudad
    @Column(length = 100)
    private String city;

    // Dirección
    @Column(length = 200)
    private String address;

    // Teléfono
    @Column(length = 30)
    private String phone;

    // Email
    @Column(length = 120)
    private String email;

    // Imagen (soporta base64)
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    // Activo / Inactivo
    @Column(nullable = false)
    private Boolean active = true;

    // Fecha de creación
    private LocalDateTime createdAt = LocalDateTime.now();

    // Rating promedio
    private Double rating = 0.0;

    // =========================
    // OWNER (ADMIN)
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // =========================
    // RESERVAS DEL NEGOCIO
    // =========================
    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    // =========================
    // RECURSOS DEL NEGOCIO
    // =========================
    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resource> resources = new ArrayList<>();

    // =========================
    // EMPLEADOS DEL NEGOCIO
    // =========================
    @OneToMany(mappedBy = "business")
    private List<User> employees = new ArrayList<>();

    // =========================================================
    // 🌟 LOGICA OPCIÓN A: EVITAR ERROR 500 DESVINCULANDO EMPLEADOS
    // =========================================================
    @PreRemove
    private void preRemove() {
        if (employees != null) {
            for (User employee : employees) {
                employee.setBusiness(null); // Borra la llave foránea en los usuarios sin eliminarlos
            }
        }
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getCity() {
        return city;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Double getRating() {
        return rating;
    }

    public User getOwner() {
        return owner;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public List<User> getEmployees() {
        return employees;
    }

    public void setEmployees(List<User> employees) {
        this.employees = employees;
    }
}