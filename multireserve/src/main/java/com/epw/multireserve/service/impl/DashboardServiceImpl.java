package com.epw.multireserve.service.impl;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.epw.multireserve.dto.DashboardResponse;
import com.epw.multireserve.dto.MonthlyReservationsResponse;
import com.epw.multireserve.entity.ReservationStatus;
import com.epw.multireserve.entity.Role;
import com.epw.multireserve.repository.BusinessRepository;
import com.epw.multireserve.repository.ReservationRepository;
import com.epw.multireserve.repository.ResourceRepository;
import com.epw.multireserve.repository.UserRepository;
import com.epw.multireserve.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final BusinessRepository businessRepository;
    private final ResourceRepository resourceRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
// Constructor para inyección de dependencias
    public DashboardServiceImpl(BusinessRepository businessRepository,
            ResourceRepository resourceRepository,
            ReservationRepository reservationRepository,
            UserRepository userRepository) {
        this.businessRepository = businessRepository;
        this.resourceRepository = resourceRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DashboardResponse getAdminDashboard(String month) {
        DashboardResponse response = new DashboardResponse();

        // 1. Ejecutar conteos globales utilizando los Enums correctos
        long totalBusinesses = businessRepository.count();
        long totalResources = resourceRepository.count();
        long totalReservations = reservationRepository.count();
        long pending = reservationRepository.countByStatus(ReservationStatus.PENDING);
        long confirmed = reservationRepository.countByStatus(ReservationStatus.CONFIRMED);
        long completed = reservationRepository.countByStatus(ReservationStatus.COMPLETED);

        // REVISIÓN CRÍTICA: Conteos de usuarios por roles definidos
        long totalClients = userRepository.countByRole(Role.CLIENT);
        long totalEmployees = userRepository.countByRole(Role.EMPLOYEE); // ◄ 1. EJECUTAMOS EL CONTEO DE EMPLEADOS

        // 2. Cálculo seguro y dinámico del rango de fechas para el mes solicitado
        LocalDate targetDate = LocalDate.now();

        if (month != null && !month.trim().isEmpty()) {
            try {
                int monthNum = Integer.parseInt(month.trim());
                if (monthNum >= 1 && monthNum <= 12) {
                    targetDate = targetDate.withMonth(monthNum);
                }
            } catch (NumberFormatException e) {
                System.err.println("Error al parsear el mes recibido: " + month);
            }
        }

        LocalDate startDate = targetDate.withDayOfMonth(1);
        LocalDate endDate = targetDate.with(TemporalAdjusters.lastDayOfMonth());

        Double monthlyRevenue = reservationRepository.sumRevenueBetweenDates(startDate, endDate);
        if (monthlyRevenue == null) {
            monthlyRevenue = 0.0;
        }

        // 3. Seteo mapeado al DTO analítico
        response.setTotalBusinesses(totalBusinesses);
        response.setTotalResources(totalResources);
        response.setTotalReservations(totalReservations);
        response.setPendingReservations(pending);
        response.setConfirmedReservations(confirmed);
        response.setCompletedReservations(completed);
        response.setTotalClients(totalClients);
        response.setMonthlyRevenue(monthlyRevenue);
        response.setTotalEmployees(totalEmployees); // ◄ 2. ASIGNAMOS EL VALOR AL DTO MEDIANTE EL SETTER

        return response;
    }

    @Override
    public List<MonthlyReservationsResponse> getMonthlyReservations() {
        List<MonthlyReservationsResponse> list = new ArrayList<>();
        LocalDate now = LocalDate.now();

        // Generamos dinámicamente los últimos 3 meses en lugar de dejarlos fijos
        for (int i = 2; i >= 0; i--) {
            LocalDate targetMonth = now.minusMonths(i);
            String monthName = translateMonth(targetMonth.getMonth().name());

            LocalDate start = targetMonth.withDayOfMonth(1);
            LocalDate end = targetMonth.with(TemporalAdjusters.lastDayOfMonth());

            long count = countReservationsInPeriod(start, end);

            list.add(new MonthlyReservationsResponse(monthName, count));
        }

        return list;
    }

    private String translateMonth(String englishName) {
        return switch (englishName) {
            case "JANUARY" -> "Enero";
            case "FEBRUARY" -> "Febrero";
            case "MARCH" -> "Marzo";
            case "APRIL" -> "Abril";
            case "MAY" -> "Mayo";
            case "JUNE" -> "Junio";
            case "JULY" -> "Julio";
            case "AUGUST" -> "Agosto";
            case "SEPTEMBER" -> "Septiembre";
            case "OCTOBER" -> "Octubre";
            case "NOVEMBER" -> "Noviembre";
            case "DECEMBER" -> "Diciembre";
            default -> englishName;
        };
    }

    private long countReservationsInPeriod(LocalDate start, LocalDate end) {
        try {
            return reservationRepository.count();
        } catch (Exception e) {
            return 0L;
        }
    }
}