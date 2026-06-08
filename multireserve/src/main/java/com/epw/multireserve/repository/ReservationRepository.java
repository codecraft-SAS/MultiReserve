package com.epw.multireserve.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.epw.multireserve.entity.Reservation;
import com.epw.multireserve.entity.ReservationStatus; // Importamos tu Enum

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

        @Query("""
                        SELECT COUNT(r) > 0
                        FROM Reservation r
                        WHERE lower(trim(r.resourceName)) = lower(trim(:resourceName))
                        AND r.reservationDate = :reservationDate
                        AND (:startTime < r.endTime AND :endTime > r.startTime)
                        """)
        boolean existsOverlappingReservation(
                        @Param("resourceName") String resourceName,
                        @Param("reservationDate") LocalDate reservationDate,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime);

        // =========================
        // FIND BY USER
        // =========================
        List<Reservation> findByUserId(Long userId);

        // ========================================================
        // MÉTODOS PARA DATOS REALES DEL DASHBOARD
        // ========================================================

        // 1. Cuenta el total global de reservas en el sistema
        long count();

        // 2. CORRECCIÓN NATIVA: Usamos el Enum real para que Spring Data haga la magia
        // solo
        long countByStatus(ReservationStatus status);

        // 3. Calcula los ingresos sumando precios reales entre dos fechas
        @Query("""
                        SELECT COALESCE(SUM(r.amount), 0.0)
                        FROM Reservation r
                        WHERE r.reservationDate >= :startDate
                        AND r.reservationDate <= :endDate
                        """)
        Double sumRevenueBetweenDates(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}