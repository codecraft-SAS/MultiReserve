package com.epw.multireserve.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DashboardStatsDTO {

    private long totalBusinesses;
    private long totalResources;
    private long totalReservations;
    private long pendingReservations;
    private long confirmedReservations;

    // Usamos JsonProperty para asegurar la coincidencia exacta con
    // 'cancelledReservations' en React
    @JsonProperty("cancelledReservations")
    private long cancelledReservations;

    // Constructor vacío requerido por los serializadores
    public DashboardStatsDTO() {
    }

    // Constructor completo para instanciarlo fácilmente en el Service
    public DashboardStatsDTO(long totalBusinesses, long totalResources, long totalReservations,
            long pendingReservations, long confirmedReservations, long cancelledReservations) {
        this.totalBusinesses = totalBusinesses;
        this.totalResources = totalResources;
        this.totalReservations = totalReservations;
        this.pendingReservations = pendingReservations;
        this.confirmedReservations = confirmedReservations;
        this.cancelledReservations = cancelledReservations;
    }

    // Getters y Setters
    public long getTotalBusinesses() {
        return totalBusinesses;
    }

    public void setTotalBusinesses(long totalBusinesses) {
        this.totalBusinesses = totalBusinesses;
    }

    public long getTotalResources() {
        return totalResources;
    }

    public void setTotalResources(long totalResources) {
        this.totalResources = totalResources;
    }

    public long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public long getPendingReservations() {
        return pendingReservations;
    }

    public void setPendingReservations(long pendingReservations) {
        this.pendingReservations = pendingReservations;
    }

    public long getConfirmedReservations() {
        return confirmedReservations;
    }

    public void setConfirmedReservations(long confirmedReservations) {
        this.confirmedReservations = confirmedReservations;
    }

    public long getCancelledReservations() {
        return cancelledReservations;
    }

    public void setCancelledReservations(long cancelledReservations) {
        this.cancelledReservations = cancelledReservations;
    }
}