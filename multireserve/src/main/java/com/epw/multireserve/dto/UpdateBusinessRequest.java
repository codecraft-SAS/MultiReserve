package com.epw.multireserve.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateBusinessRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 200)
    private String address;

    @Size(max = 30)
    private String phone;

    @Email
    @Size(max = 120)
    private String email;

    @NotNull
    private Long ownerId;

    // =========================
    // NUEVOS CAMPOS
    // =========================
    @Size(max = 50000)
    private String imageUrl;

    @Size(max = 500)
    private String description;

    @Size(max = 50)
    private String category; // HOTEL, SPORT, RESTAURANT, EVENT, COWORKING

    @Size(max = 100)
    private String city;

    private Boolean active;

    // =========================
    // GETTERS AND SETTERS
    // =========================
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
