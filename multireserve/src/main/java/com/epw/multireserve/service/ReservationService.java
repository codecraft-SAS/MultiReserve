package com.epw.multireserve.service;

import java.util.List;

import com.epw.multireserve.dto.CreateReservationRequest;
import com.epw.multireserve.dto.ReservationResponse;
import com.epw.multireserve.dto.UpdateReservationRequest;

public interface ReservationService {

    // =========================
    // CREATE
    // =========================
    ReservationResponse create(CreateReservationRequest request);

    // =========================
    // LIST ALL
    // =========================
    List<ReservationResponse> list();

    // =========================
    // GET BY ID
    // =========================
    ReservationResponse getById(Long id);

    // =========================
    // UPDATE
    // =========================
    ReservationResponse update(
            Long id,
            UpdateReservationRequest request);

    // =========================
    // DELETE
    // =========================
    void delete(Long id);

    // =========================
    // CONFIRM RESERVATION
    // =========================
    ReservationResponse confirm(Long id);

    // =========================
    // CHANGE STATUS
    // =========================
    ReservationResponse changeStatus(
            Long id,
            String status);
}