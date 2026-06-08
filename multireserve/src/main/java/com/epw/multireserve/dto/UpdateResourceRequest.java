package com.epw.multireserve.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class UpdateResourceRequest {

    @NotBlank(message = "El nombre del recurso es obligatorio")
    private String name;

    @NotBlank(message = "El tipo de recurso es obligatorio")
    private String type; // 🌟 Cambiado a String para flexibilidad en el PUT

    @NotNull(message = "El precio por hora es obligatorio")
    @Positive(message = "El precio debe ser un número positivo")
    private Double pricePerHour;

    private String imageUrl;
    private String description;
    private Integer capacity;

    @NotBlank(message = "El estado del recurso es obligatorio")
    private String status; // 🌟 Cambiado a String para evitar fallos de casteo

    private String openingHour;
    private String closingHour;

    @NotNull(message = "El ID del negocio es obligatorio")
    private Long businessId;

    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    public Long getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }
}