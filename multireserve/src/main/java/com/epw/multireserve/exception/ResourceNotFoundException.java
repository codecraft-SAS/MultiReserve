package com.epw.multireserve.exception;

public class ResourceNotFoundException extends RuntimeException {
// Constructor que recibe un mensaje de error personalizado
    public ResourceNotFoundException(String message) {
        super(message);
    }
}