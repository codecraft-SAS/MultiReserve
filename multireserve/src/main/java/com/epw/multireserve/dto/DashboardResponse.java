package com.epw.multireserve.dto;

public class DashboardResponse {

    private Long totalBusinesses;
    private Long totalResources;
    private Long totalReservations;
    private Long pendingReservations;
    private Long confirmedReservations;
    private Long completedReservations;
    private Long totalClients;
    private Double monthlyRevenue;
    private Long totalEmployees; // ◄ Nuevo campo agregado

    // =========================
    // CONSTRUCTORES
    // =========================
    public DashboardResponse() {
    }

    public DashboardResponse(Long totalBusinesses, Long totalResources, Long totalReservations,
            Long pendingReservations, Long confirmedReservations,
            Long completedReservations, Long totalClients,
            Double monthlyRevenue, Long totalEmployees) {
        this.totalBusinesses = totalBusinesses;
        this.totalResources = totalResources;
        this.totalReservations = totalReservations;
        this.pendingReservations = pendingReservations;
        this.confirmedReservations = confirmedReservations;
        this.completedReservations = completedReservations;
        this.totalClients = totalClients;
        this.monthlyRevenue = monthlyRevenue;
        this.totalEmployees = totalEmployees;
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================
    public Long getTotalBusinesses() {
        return totalBusinesses;
    }

    public void setTotalBusinesses(Long totalBusinesses) {
        this.totalBusinesses = totalBusinesses;
    }

    public Long getTotalResources() {
        return totalResources;
    }

    public void setTotalResources(Long totalResources) {
        this.totalResources = totalResources;
    }

    public Long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(Long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public Long getPendingReservations() {
        return pendingReservations;
    }

    public void setPendingReservations(Long pendingReservations) {
        this.pendingReservations = pendingReservations;
    }

    public Long getConfirmedReservations() {
        return confirmedReservations;
    }

    public void setConfirmedReservations(Long confirmedReservations) {
        this.confirmedReservations = confirmedReservations;
    }

    public Long getCompletedReservations() {
        return completedReservations;
    }

    public void setCompletedReservations(Long completedReservations) {
        this.completedReservations = completedReservations;
    }

    public Long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(Long totalClients) {
        this.totalClients = totalClients;
    }

    public Double getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(Double monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public Long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }
}
