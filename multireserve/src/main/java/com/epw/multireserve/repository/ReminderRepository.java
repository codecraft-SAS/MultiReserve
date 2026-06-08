package com.epw.multireserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.epw.multireserve.entity.Reminder;

public interface ReminderRepository
        extends JpaRepository<Reminder, Long> {

}