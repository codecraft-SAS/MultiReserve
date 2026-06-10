package com.epw.multireserve.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.epw.multireserve.dto.ReservationTagResponse;
import com.epw.multireserve.dto.TagResponse;
import com.epw.multireserve.entity.Reservation;
import com.epw.multireserve.entity.Tag;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.ReservationRepository;
import com.epw.multireserve.repository.TagRepository;
import com.epw.multireserve.service.ReservationTagService;

@Service
@Transactional
public class ReservationTagServiceImpl
        implements ReservationTagService {

    private final ReservationRepository reservationRepository;
    private final TagRepository tagRepository;
// Constructor para inyección de dependencias
    public ReservationTagServiceImpl(
            ReservationRepository reservationRepository,
            TagRepository tagRepository) {

        this.reservationRepository = reservationRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public ReservationTagResponse assignTag(
            Long reservationId,
            Long tagId) {

        Reservation reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reservation " + reservationId + " not found"));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tag " + tagId + " not found"));

        reservation.getTags().add(tag);

        Reservation saved = reservationRepository.save(reservation);

        return toResponse(saved);
    }

    @Override
    public ReservationTagResponse removeTag(
            Long reservationId,
            Long tagId) {

        Reservation reservation = reservationRepository
                .findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Reservation " + reservationId + " not found"));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tag " + tagId + " not found"));

        reservation.getTags().remove(tag);

        Reservation saved = reservationRepository.save(reservation);

        return toResponse(saved);
    }

    private ReservationTagResponse toResponse(
            Reservation reservation) {

        ReservationTagResponse response = new ReservationTagResponse();

        response.setReservationId(reservation.getId());
        response.setCustomerName(reservation.getCustomerName());

        List<TagResponse> tags = reservation.getTags()
                .stream()
                .map(tag -> {

                    TagResponse tr = new TagResponse();

                    tr.setId(tag.getId());
                    tr.setName(tag.getName());

                    return tr;
                })
                .toList();

        response.setTags(tags);

        return response;
    }
}