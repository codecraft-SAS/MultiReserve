package com.epw.multireserve.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservation_details")
public class ReservationDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lugar específico
    @Column(length = 150)
    private String place;

    // Duración estimada
    private Integer estimatedMinutes;

    // Notas privadas
    @Column(length = 1000)
    private String privateNotes;

    // Relación OneToOne con Reservation
    @OneToOne
    @JoinColumn(name = "reservation_id", unique = true, nullable = false)
    private Reservation reservation;

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getPlace() {
        return place;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public String getPrivateNotes() {
        return privateNotes;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public void setPrivateNotes(String privateNotes) {
        this.privateNotes = privateNotes;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }
}