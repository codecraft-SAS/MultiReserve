package com.epw.multireserve.service;

import com.epw.multireserve.dto.ReservationTagResponse;

public interface ReservationTagService {

    ReservationTagResponse assignTag(
            Long reservationId,
            Long tagId);

    ReservationTagResponse removeTag(
            Long reservationId,
            Long tagId);
}