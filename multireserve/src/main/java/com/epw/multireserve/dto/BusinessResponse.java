package com.epw.multireserve.dto;

public class BusinessResponse {

    private Long id;

    private String name;

    private String address;

    private String phone;

    private String email;

    private Long ownerId;

    private String ownerName;

    // =========================
    // CAMPOS EXTRA PARA CATÁLOGO
    // =========================
    private String imageUrl; // Foto principal del negocio
    private String description; // Descripción detallada
    private String category; // HOTEL, SPORT, RESTAURANT, EVENT, COWORKING
    private Double rating; // Promedio de reseñas
    private Integer totalResources; // Número de recursos asociados
    private Integer totalReservations;// Número de reservas realizadas
    private String city; // Ciudad del negocio
    private Boolean active; // Estado activo/inactivo

    // =========================
    // GETTERS
    // =========================
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public Double getRating() {
        return rating;
    }

    public Integer getTotalResources() {
        return totalResources;
    }

    public Integer getTotalReservations() {
        return totalReservations;
    }

    public String getCity() {
        return city;
    }

    public Boolean getActive() {
        return active;
    }

    // =========================
    // SETTERS
    // =========================
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public void setTotalResources(Integer totalResources) {
        this.totalResources = totalResources;
    }

    public void setTotalReservations(Integer totalReservations) {
        this.totalReservations = totalReservations;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
