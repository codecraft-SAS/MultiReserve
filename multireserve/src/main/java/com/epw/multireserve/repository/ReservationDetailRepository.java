package com.epw.multireserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.epw.multireserve.entity.ReservationDetail;

public interface ReservationDetailRepository
        extends JpaRepository<ReservationDetail, Long> {

}