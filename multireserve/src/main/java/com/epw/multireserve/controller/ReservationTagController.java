package com.epw.multireserve.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.ReservationTagResponse;
import com.epw.multireserve.service.ReservationTagService;

@RestController
@RequestMapping("/api/reservations/{reservationId}/tags")
public class ReservationTagController {

    private final ReservationTagService reservationTagService;

    public ReservationTagController(
            ReservationTagService reservationTagService) {

        this.reservationTagService = reservationTagService;
    }

    @PostMapping("/{tagId}")
    public ReservationTagResponse assignTag(
            @PathVariable Long reservationId,
            @PathVariable Long tagId) {

        return reservationTagService.assignTag(
                reservationId,
                tagId);
    }

    @DeleteMapping("/{tagId}")
    public ReservationTagResponse removeTag(
            @PathVariable Long reservationId,
            @PathVariable Long tagId) {

        return reservationTagService.removeTag(
                reservationId,
                tagId);
    }
}