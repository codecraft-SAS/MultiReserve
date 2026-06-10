package com.epw.multireserve.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTagRequest {

    @NotBlank(message = "name is required")
    @Size(max = 80, message = "name must be <= 80 chars")
    private String name;

    public String getName() {
        return name;
    }
// No se permite setear el ID, ya que es autogenerado por la base de datos
    public void setName(String name) {
        this.name = name;
    }
}