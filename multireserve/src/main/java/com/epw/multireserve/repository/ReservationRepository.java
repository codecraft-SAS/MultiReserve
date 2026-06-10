package com.epw.multireserve.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.epw.multireserve.entity.Reservation;
import com.epw.multireserve.entity.ReservationStatus;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

        /**
         * Valida solapamientos de horarios.
         * ✅ Optimizado: Excluye las reservas canceladas para liberar los bloques de
         * tiempo en el frontend.
         */
        @Query("""
                        SELECT COUNT(r) > 0
                        FROM Reservation r
                        WHERE lower(trim(r.resourceName)) = lower(trim(:resourceName))
                        AND r.reservationDate = :reservationDate
                        AND (:startTime < r.endTime AND :endTime > r.startTime)
                        AND r.status <> com.epw.multireserve.entity.ReservationStatus.CANCELLED
                        """)
        boolean existsOverlappingReservation(
                        @Param("resourceName") String resourceName,
                        @Param("reservationDate") LocalDate reservationDate,
                        @Param("startTime") LocalTime startTime,
                        @Param("endTime") LocalTime endTime);

        // ========================================================
        // CONSULTAS POR USUARIO Y CLIENTE
        // ========================================================

        // Obtener reservas por ID de usuario (Filtro JWT seguro en list())
        List<Reservation> findByUserId(Long userId);

        // 🌟 Añadido para dar soporte a la consulta por nombre del Service
        List<Reservation> findByCustomerName(String customerName);

        // ========================================================
        // MÉTODOS PARA DATOS REALES DEL DASHBOARD
        // ========================================================

        // 1. Cuenta el total global de reservas en el sistema
        long count();

        // 2. Cuenta las reservas nativamente filtradas por el Enum de estado (PENDING,
        // CONFIRMED, etc.)
        long countByStatus(ReservationStatus status);

        // 3. Calcula los ingresos sumando precios reales entre dos fechas para
        // analíticas
        @Query("""
                        SELECT COALESCE(SUM(r.amount), 0.0)
                        FROM Reservation r
                        WHERE r.reservationDate >= :startDate
                        AND r.reservationDate <= :endDate
                        AND r.status = com.epw.multireserve.entity.ReservationStatus.CONFIRMED
                        """)
        Double sumRevenueBetweenDates(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}