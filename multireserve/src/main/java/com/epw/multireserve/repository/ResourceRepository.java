package com.epw.multireserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.epw.multireserve.entity.Resource;

public interface ResourceRepository
        extends JpaRepository<Resource, Long> {

    List<Resource> findByBusinessId(Long businessId);

}