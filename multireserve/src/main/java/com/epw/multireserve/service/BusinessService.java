package com.epw.multireserve.service;

import java.util.List;

import com.epw.multireserve.dto.BusinessResponse;
import com.epw.multireserve.dto.CreateBusinessRequest;
import com.epw.multireserve.dto.UpdateBusinessRequest;

public interface BusinessService {

        // =========================
        // CRUD básico
        // =========================
        // Ahora recibe también el username del usuario autenticado
        BusinessResponse create(CreateBusinessRequest request, String username);

        List<BusinessResponse> list();

        BusinessResponse getById(Long id);

        BusinessResponse update(Long id, UpdateBusinessRequest request);

        void delete(Long id);

        List<BusinessResponse> getByOwner(Long ownerId);

        // =========================
        // NUEVOS MÉTODOS PRO
        // =========================

        List<BusinessResponse> getActiveBusinesses();

        List<BusinessResponse> getByCategory(String category);

        List<BusinessResponse> getByCity(String city);

        List<BusinessResponse> searchByName(String keyword);

        Long countBusinesses();

        Long countActiveBusinesses();

        // =========================
        // CAMBIAR ESTADO (PATCH)
        // =========================
        BusinessResponse toggleStatus(Long id);
}
