package com.epw.multireserve.service;

import java.util.List;

import com.epw.multireserve.dto.CreateResourceRequest;
import com.epw.multireserve.dto.ResourceResponse;
import com.epw.multireserve.dto.UpdateResourceRequest;

public interface ResourceService {

    // =========================
    // CREATE
    // =========================
    ResourceResponse create(
            CreateResourceRequest request);

    // =========================
    // LIST
    // =========================
    List<ResourceResponse> list();

    // =========================
    // GET BY ID
    // =========================
    ResourceResponse getById(Long id);

    // =========================
    // UPDATE
    // =========================
    ResourceResponse update(
            Long id,
            UpdateResourceRequest request);

    // =========================
    // DELETE
    // =========================
    void delete(Long id);

    // =========================
    // LIST BY BUSINESS
    // =========================
    List<ResourceResponse> getByBusiness(
            Long businessId);
}