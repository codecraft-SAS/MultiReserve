package com.epw.multireserve.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.epw.multireserve.dto.DashboardResponse;
import com.epw.multireserve.dto.MonthlyReservationsResponse;
import com.epw.multireserve.repository.BusinessRepository;
import com.epw.multireserve.service.DashboardService;

@RestController
// 🚨 Cambiamos a "/api/reports" para que coincida exactamente con lo que busca
// tu Axios en React
@RequestMapping("/api/reports")
public class DashboardController {

    private final DashboardService dashboardService;
    private final BusinessRepository businessRepository;

    // Inyección limpia por constructor de ambos componentes analíticos
    public DashboardController(DashboardService dashboardService, BusinessRepository businessRepository) {
        this.dashboardService = dashboardService;
        this.businessRepository = businessRepository;
    }

    // ===================================
    // ADMIN DASHBOARD KPIs (Antes /admin)
    // ===================================
    // Ahora escucha en: /api/reports/stats
    @GetMapping("/stats")
    public DashboardResponse getAdminDashboard(@RequestParam(value = "month", required = false) String month) {
        return dashboardService.getAdminDashboard(month);
    }

    // ===================================
    // CHARTS DATA (Gráficos)
    // ===================================

    // 1. Gráfico de barras horizontales (Categorías comerciales)
    // Ahora escucha en: /api/reports/categories
    @GetMapping("/categories")
    public ResponseEntity<List<Object[]>> getBusinessesByCategory() {
        return ResponseEntity.ok(businessRepository.countBusinessesByCategory());
    }

    // 2. Gráfico de barras verticales (Flujo mensual de reservas)
    // Ahora escucha en: /api/reports/monthly
    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyReservationsResponse>> getMonthlyReservations() {
        return ResponseEntity.ok(dashboardService.getMonthlyReservations());
    }
}