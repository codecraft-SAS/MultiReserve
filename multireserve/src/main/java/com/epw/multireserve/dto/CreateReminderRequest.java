package com.epw.multireserve.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public class CreateReminderRequest {

    @NotNull(message = "La fecha de recordatorio es obligatoria")
    private LocalDateTime remindAt;

    private String note;

    // =========================
    // GETTERS AND SETTERS
    // =========================

    public LocalDateTime getRemindAt() {
        return remindAt;
    }

    public void setRemindAt(LocalDateTime remindAt) {
        this.remindAt = remindAt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}