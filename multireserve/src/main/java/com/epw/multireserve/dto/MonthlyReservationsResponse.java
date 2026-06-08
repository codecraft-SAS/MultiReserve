package com.epw.multireserve.dto;

public class MonthlyReservationsResponse {

    private String month;
    private Long reservations;

    // =========================
    // CONSTRUCTORES
    // =========================
    public MonthlyReservationsResponse() {
    }

    public MonthlyReservationsResponse(String month, Long reservations) {
        this.month = month;
        this.reservations = reservations;
    }

    // =========================
    // GETTERS AND SETTERS
    // =========================
    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Long getReservations() {
        return reservations;
    }

    public void setReservations(Long reservations) {
        this.reservations = reservations;
    }
}
