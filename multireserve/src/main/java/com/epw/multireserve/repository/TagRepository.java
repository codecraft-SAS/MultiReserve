package com.epw.multireserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.epw.multireserve.entity.Tag;

public interface TagRepository
        extends JpaRepository<Tag, Long> {

}