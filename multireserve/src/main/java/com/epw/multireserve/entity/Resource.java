package com.epw.multireserve.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del recurso
    @Column(nullable = false, length = 120)
    private String name;

    // Tipo de recurso (enum)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ResourceType type;

    // Precio por hora
    @Column(nullable = false)
    private Double pricePerHour;

    // Imagen del recurso
    @Column(length = 500)
    private String imageUrl;

    // Descripción detallada
    @Column(length = 1000)
    private String description;

    // Capacidad (número de personas)
    private Integer capacity;

    // Estado del recurso (enum: ACTIVE, MAINTENANCE, INACTIVE)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ResourceStatus status = ResourceStatus.ACTIVE;

    // Horario de apertura/cierre (opcional)
    private String openingHour;
    private String closingHour;

    // =========================
    // BUSINESS
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    // =========================
    // CONSTRUCTORES
    // =========================
    public Resource() {
    }

    public Resource(Long id, String name, ResourceType type,
            Double pricePerHour, String imageUrl,
            String description, Integer capacity,
            ResourceStatus status, String openingHour,
            String closingHour, Business business) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.pricePerHour = pricePerHour;
        this.imageUrl = imageUrl;
        this.description = description;
        this.capacity = capacity;
        this.status = status;
        this.openingHour = openingHour;
        this.closingHour = closingHour;
        this.business = business;
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ResourceType getType() {
        return type;
    }

    public void setType(ResourceType type) {
        this.type = type;
    }

    public Double getPricePerHour() {
        return pricePerHour;
    }

    public void setPricePerHour(Double pricePerHour) {
        this.pricePerHour = pricePerHour;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
        this.status = status;
    }

    public String getOpeningHour() {
        return openingHour;
    }

    public void setOpeningHour(String openingHour) {
        this.openingHour = openingHour;
    }

    public String getClosingHour() {
        return closingHour;
    }

    public void setClosingHour(String closingHour) {
        this.closingHour = closingHour;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }
}
