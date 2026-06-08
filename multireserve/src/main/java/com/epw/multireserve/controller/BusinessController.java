package com.epw.multireserve.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.BusinessResponse;
import com.epw.multireserve.dto.CreateBusinessRequest;
import com.epw.multireserve.dto.UpdateBusinessRequest;
import com.epw.multireserve.service.BusinessService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/businesses")
public class BusinessController {

    private final BusinessService service;

    public BusinessController(BusinessService service) {
        this.service = service;
    }

    // =========================
    // CREATE
    // =========================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BusinessResponse create(
            @Valid @RequestBody CreateBusinessRequest request,
            Principal principal) {
        // principal.getName() devolverá el email del usuario logueado
        return service.create(request, principal.getName());
    }

    // =========================
    // LIST
    // =========================
    @GetMapping
    public List<BusinessResponse> list() {
        return service.list();
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/{id}")
    public BusinessResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping("/{id}")
    public BusinessResponse update(@PathVariable Long id,
            @Valid @RequestBody UpdateBusinessRequest request) {
        return service.update(id, request);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // =========================
    // BY OWNER
    // =========================
    @GetMapping("/owner/{ownerId}")
    public List<BusinessResponse> getByOwner(@PathVariable Long ownerId) {
        return service.getByOwner(ownerId);
    }

    // =========================
    // NUEVOS ENDPOINTS PRO
    // =========================
    @GetMapping("/active")
    public List<BusinessResponse> getActiveBusinesses() {
        return service.getActiveBusinesses();
    }

    @GetMapping("/category/{category}")
    public List<BusinessResponse> getByCategory(@PathVariable String category) {
        return service.getByCategory(category);
    }

    @GetMapping("/city/{city}")
    public List<BusinessResponse> getByCity(@PathVariable String city) {
        return service.getByCity(city);
    }

    @GetMapping("/search")
    public List<BusinessResponse> searchByName(@RequestParam String keyword) {
        return service.searchByName(keyword);
    }

    @GetMapping("/kpis")
    public String getKPIs() {
        Long total = service.countBusinesses();
        Long active = service.countActiveBusinesses();
        Long inactive = total - active;

        return String.format("Total negocios: %d | Activos: %d | Inactivos: %d",
                total, active, inactive);
    }

    // =========================
    // CAMBIAR ESTADO (PATCH)
    // =========================
    @PatchMapping("/{id}/status")
    public BusinessResponse toggleStatus(@PathVariable Long id) {
        return service.toggleStatus(id);
    }
}
