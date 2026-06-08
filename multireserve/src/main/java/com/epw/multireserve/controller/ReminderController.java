package com.epw.multireserve.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.CreateReminderRequest;
import com.epw.multireserve.dto.ReminderResponse;
import com.epw.multireserve.entity.Reminder;
import com.epw.multireserve.entity.Reservation;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.ReminderRepository;
import com.epw.multireserve.repository.ReservationRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations/{reservationId}/reminders")
public class ReminderController {

    private final ReservationRepository reservationRepository;
    private final ReminderRepository reminderRepository;

    public ReminderController(
            ReservationRepository reservationRepository,
            ReminderRepository reminderRepository) {

        this.reservationRepository = reservationRepository;
        this.reminderRepository = reminderRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReminderResponse create(
            @PathVariable Long reservationId,
            @Valid @RequestBody CreateReminderRequest request) {

        Reservation reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reservation " + reservationId + " not found"));

        Reminder reminder = new Reminder();

        reminder.setRemindAt(request.getRemindAt());
        reminder.setNote(request.getNote());
        reminder.setReservation(reservation);

        Reminder saved = reminderRepository.save(reminder);

        ReminderResponse response = new ReminderResponse();

        response.setId(saved.getId());
        response.setRemindAt(saved.getRemindAt());
        response.setNote(saved.getNote());
        response.setReservationId(
                saved.getReservation().getId());

        return response;
    }
}