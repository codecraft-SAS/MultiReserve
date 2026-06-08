package com.epw.multireserve.entity;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del cliente (para invitados sin cuenta)
    @Column(nullable = false, length = 120)
    private String customerName;

    // Tipo de recurso (fase 1: compatibilidad)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType resourceType;

    // Nombre del recurso (fase 1: compatibilidad)
    @Column(nullable = false, length = 100)
    private String resourceName;

    // Fecha reserva
    @Column(nullable = false)
    private LocalDate reservationDate;

    // Hora inicio
    @Column(nullable = false)
    private LocalTime startTime;

    // Hora final
    @Column(nullable = false)
    private LocalTime endTime;

    // Duración total en horas
    private Integer totalHours;

    // Estado reserva
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    // Precio final
    private Double amount;

    // =========================
    // RELACIÓN BUSINESS
    // =========================
    @ManyToOne
    @JoinColumn(name = "business_id")
    private Business business;

    // =========================
    // RELACIÓN USER (lazy)
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // =========================
    // RELACIÓN RESOURCE
    // =========================
    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    // =========================
    // RELACIÓN REMINDERS
    // =========================
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reminder> reminders = new ArrayList<>();

    // =========================
    // RELACIÓN DETAIL
    // =========================
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private ReservationDetail detail;

    // =========================
    // RELACIÓN TAGS
    // =========================
    @ManyToMany
    @JoinTable(name = "reservation_tag", joinColumns = @JoinColumn(name = "reservation_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    // =========================
    // FECHAS
    // =========================
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        calculateDurationAndAmount();
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
        calculateDurationAndAmount();
    }

    // =========================
    // MÉTODO AUXILIAR
    // =========================
    private void calculateDurationAndAmount() {
        if (startTime != null && endTime != null) {
            long hours = Duration.between(startTime, endTime).toHours();
            this.totalHours = (int) hours;
        }
        if (resource != null && totalHours != null) {
            this.amount = resource.getPricePerHour() * totalHours;
        }
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public ResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(ResourceType resourceType) {
        this.resourceType = resourceType;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public LocalDate getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDate reservationDate) {
        this.reservationDate = reservationDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Integer getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Integer totalHours) {
        this.totalHours = totalHours;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public List<Reminder> getReminders() {
        return reminders;
    }

    public void setReminders(List<Reminder> reminders) {
        this.reminders = reminders;
    }

    public ReservationDetail getDetail() {
        return detail;
    }

    public void setDetail(ReservationDetail detail) {
        this.detail = detail;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
