package com.epw.multireserve.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.CreateResourceRequest;
import com.epw.multireserve.dto.ResourceResponse;
import com.epw.multireserve.dto.UpdateResourceRequest;
import com.epw.multireserve.service.ResourceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    // ==========================================
    // CREATE RESOURCE - POST /api/resources
    // ==========================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceResponse create(
            @Valid @RequestBody CreateResourceRequest request) {
        return service.create(request);
    }

    // ==========================================
    // LIST ALL RESOURCES - GET /api/resources
    // ==========================================
    @GetMapping
    public List<ResourceResponse> list() {
        return service.list();
    }

    // ==========================================
    // GET RESOURCE BY ID - GET /api/resources/{id}
    // ==========================================
    @GetMapping("/{id}")
    public ResourceResponse getById(
            @PathVariable("id") Long id) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }
        return service.getById(id);
    }

    // ==========================================
    // UPDATE RESOURCE - PUT /api/resources/{id}
    // ==========================================
    @PutMapping("/{id}")
    public ResourceResponse update(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateResourceRequest request) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }
        return service.update(id, request);
    }

    // ==========================================
    // DELETE RESOURCE - DELETE /api/resources/{id}
    // ==========================================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable("id") Long id) {
        if (id == null) {
            throw new IllegalArgumentException("The given id must not be null");
        }
        service.delete(id);
    }

    // ==========================================
    // LIST BY BUSINESS - GET /api/resources/business/{businessId}
    // ==========================================
    @GetMapping("/business/{businessId}")
    public List<ResourceResponse> getByBusiness(
            @PathVariable("businessId") Long businessId) {
        if (businessId == null) {
            throw new IllegalArgumentException("The given businessId must not be null");
        }
        return service.getByBusiness(businessId);
    }

    // ==========================================
    // GET AVAILABILITY - GET /api/resources/{id}/availability
    // ==========================================
    @GetMapping("/{id}/availability")
    public List<String> getAvailability(
            @PathVariable("id") Long id,
            @RequestParam("date") String date) {
        return service.getAvailability(id, date);
    }
}
