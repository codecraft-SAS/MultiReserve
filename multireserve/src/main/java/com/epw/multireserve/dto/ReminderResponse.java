package com.epw.multireserve.dto;

import java.time.LocalDateTime;

public class ReminderResponse {

    private Long id;

    private LocalDateTime remindAt;

    private String note;

    private Long reservationId;

    public Long getId() {
        return id;
    }

    public LocalDateTime getRemindAt() {
        return remindAt;
    }

    public String getNote() {
        return note;
    }

    public Long getReservationId() {
        return reservationId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRemindAt(LocalDateTime remindAt) {
        this.remindAt = remindAt;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }
}