package com.epw.multireserve.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.epw.multireserve.dto.CreateReservationDetailRequest;
import com.epw.multireserve.dto.ReservationDetailResponse;
import com.epw.multireserve.entity.Reservation;
import com.epw.multireserve.entity.ReservationDetail;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.ReservationDetailRepository;
import com.epw.multireserve.repository.ReservationRepository;

@RestController
@RequestMapping("/api/reservations/{reservationId}/detail")
public class ReservationDetailController {

    private final ReservationRepository reservationRepository;
    private final ReservationDetailRepository detailRepository;

    public ReservationDetailController(
            ReservationRepository reservationRepository,
            ReservationDetailRepository detailRepository) {

        this.reservationRepository = reservationRepository;
        this.detailRepository = detailRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationDetailResponse create(
            @PathVariable Long reservationId,
            @RequestBody CreateReservationDetailRequest request) {

        Reservation reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reservation " + reservationId + " not found"));

        ReservationDetail detail = new ReservationDetail();

        detail.setPlace(request.getPlace());
        detail.setEstimatedMinutes(
                request.getEstimatedMinutes());
        detail.setPrivateNotes(
                request.getPrivateNotes());

        detail.setReservation(reservation);

        ReservationDetail saved = detailRepository.save(detail);

        ReservationDetailResponse response = new ReservationDetailResponse();

        response.setId(saved.getId());
        response.setPlace(saved.getPlace());
        response.setEstimatedMinutes(
                saved.getEstimatedMinutes());

        response.setPrivateNotes(
                saved.getPrivateNotes());

        response.setReservationId(
                saved.getReservation().getId());

        return response;
    }
}