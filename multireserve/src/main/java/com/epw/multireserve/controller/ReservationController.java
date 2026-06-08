package com.epw.multireserve.controller;

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

import com.epw.multireserve.dto.CreateReservationRequest;
import com.epw.multireserve.dto.ReservationResponse;
import com.epw.multireserve.dto.UpdateReservationRequest;
import com.epw.multireserve.service.ReservationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    // ==========================================
    // CREATE
    // ==========================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse create(
            @Valid @RequestBody CreateReservationRequest request) {
        return service.create(request);
    }

    // ==========================================
    // LIST ALL (Consumido por la tabla del Admin)
    // ==========================================
    @GetMapping
    public List<ReservationResponse> list() {
        return service.list();
    }

    // ==========================================
    // GET BY ID
    // ==========================================
    @GetMapping("/{id}")
    public ReservationResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ==========================================
    // UPDATE (Full modification)
    // ==========================================
    @PutMapping("/{id}")
    public ReservationResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationRequest request) {
        return service.update(id, request);
    }

    // ==========================================
    // DELETE
    // ==========================================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // ==========================================
    // CONFIRM RESERVATION (Acción directa alternativa)
    // ==========================================
    @PatchMapping("/{id}/confirm")
    public ReservationResponse confirm(@PathVariable Long id) {
        return service.confirm(id);
    }

    // ==========================================
    // CHANGE STATUS (Consumido por los botones Check y X del front)
    // ==========================================
    @PatchMapping("/{id}/status")
    public ReservationResponse changeStatus(
            @PathVariable Long id,
            @RequestParam String value) {
        // Convierte a mayúsculas para evitar errores de case-sensitivity del cliente
        return service.changeStatus(id, value.toUpperCase().trim());
    }
}