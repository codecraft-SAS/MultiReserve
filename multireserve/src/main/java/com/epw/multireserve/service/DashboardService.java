package com.epw.multireserve.service;

import java.util.List;

import com.epw.multireserve.dto.DashboardResponse;
import com.epw.multireserve.dto.MonthlyReservationsResponse;

public interface DashboardService {

    // =========================
    // ADMIN DASHBOARD KPIs
    // =========================
    // Ahora recibe el mes como parámetro (String) para calcular métricas dinámicas
    DashboardResponse getAdminDashboard(String month);

    // =========================
    // CHARTS DATA
    // =========================
    List<MonthlyReservationsResponse> getMonthlyReservations();
}
