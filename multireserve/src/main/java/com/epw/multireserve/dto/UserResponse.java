package com.epw.multireserve.dto;

import com.epw.multireserve.entity.Role;

public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private Role role;

    private Long businessId;

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }
}