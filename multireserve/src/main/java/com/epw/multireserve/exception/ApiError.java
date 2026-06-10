package com.epw.multireserve.exception;

import java.time.LocalDateTime;

public class ApiError {

    private String message;
    private int status;
    private LocalDateTime timestamp;

    public ApiError() {
    }
// Constructor para facilitar creación de objetos ApiError con todos los campos
    public ApiError(
            String message,
            int status,
            LocalDateTime timestamp) {

        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    }
// Getters y setters para todos los campos (message, status, timestamp)
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(
            LocalDateTime timestamp) {

        this.timestamp = timestamp;
    }
}