package com.epw.multireserve.dto;

import com.epw.multireserve.entity.ResourceStatus;
import com.epw.multireserve.entity.ResourceType;
import com.fasterxml.jackson.annotation.JsonProperty; // 🌟 IMPORTACIÓN REQUERIDA

public class ResourceResponse {

    private Long id;

    private String name;

    private ResourceType type;

    @JsonProperty("pricePerHour") // 🌟 FUERZA EL CAMELCASE EN EL JSON
    private Double pricePerHour;

    // Imagen del recurso
    private String imageUrl;

    // Descripción detallada
    private String description;

    // Capacidad (número de personas)
    private Integer capacity;

    // Estado del recurso
    private ResourceStatus status;

    // Horario de apertura/cierre
    private String openingHour;
    private String closingHour;

    private Long businessId;

    private String businessName;

    // =========================
    // GETTERS AND SETTERS
    // =========================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ResourceType getType() {
        return type;
    }

    public void setType(ResourceType type) {
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

    public ResourceStatus getStatus() {
        return status;
    }

    public void setStatus(ResourceStatus status) {
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

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
}