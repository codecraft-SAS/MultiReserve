package com.epw.multireserve.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.epw.multireserve.dto.CreateResourceRequest;
import com.epw.multireserve.dto.ResourceResponse;
import com.epw.multireserve.dto.UpdateResourceRequest;
import com.epw.multireserve.entity.Business;
import com.epw.multireserve.entity.Resource;
import com.epw.multireserve.entity.ResourceStatus;
import com.epw.multireserve.entity.ResourceType;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.BusinessRepository;
import com.epw.multireserve.repository.ResourceRepository;
import com.epw.multireserve.service.ResourceService;

@Service
@Transactional
@SuppressWarnings("null") // 🌟 Silencia falsos positivos de Null type safety del validador de código
public class ResourceServiceImpl implements ResourceService {

        private final ResourceRepository repository;
        private final BusinessRepository businessRepository;

        public ResourceServiceImpl(
                        ResourceRepository repository,
                        BusinessRepository businessRepository) {
                this.repository = repository;
                this.businessRepository = businessRepository;
        }

        // Método utilitario interno para traducir de React a los Enums reales de la DB
        private ResourceType parseResourceType(String input) {
                if (input == null)
                        return ResourceType.ROOM;
                String normalized = input.toUpperCase().trim();
                if (normalized.contains("CANCHA") || normalized.equals("COURT"))
                        return ResourceType.COURT;
                if (normalized.contains("SALA") || normalized.contains("SALÓN") || normalized.equals("ROOM"))
                        return ResourceType.ROOM;
                if (normalized.contains("CABAÑA") || normalized.equals("CABIN"))
                        return ResourceType.CABIN;
                if (normalized.contains("MESA") || normalized.equals("TABLE"))
                        return ResourceType.TABLE;
                try {
                        return ResourceType.valueOf(normalized);
                } catch (IllegalArgumentException e) {
                        return ResourceType.ROOM; // Por defecto seguro
                }
        }

        private ResourceStatus parseResourceStatus(String input) {
                if (input == null)
                        return ResourceStatus.ACTIVE;
                String normalized = input.toUpperCase().trim();
                if (normalized.contains("DISPONIBLE") || normalized.equals("ACTIVE"))
                        return ResourceStatus.ACTIVE;
                if (normalized.contains("MANTENIMIENTO") || normalized.equals("MAINTENANCE"))
                        return ResourceStatus.MAINTENANCE;
                if (normalized.contains("INACTIVO") || normalized.equals("INACTIVE"))
                        return ResourceStatus.INACTIVE;
                try {
                        return ResourceStatus.valueOf(normalized);
                } catch (IllegalArgumentException e) {
                        return ResourceStatus.ACTIVE;
                }
        }

        // ==========================================
        // CREATE
        // ==========================================
        @Override
        public ResourceResponse create(CreateResourceRequest request) {
                Business business = businessRepository
                                .findById(request.getBusinessId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Business " + request.getBusinessId() + " not found"));

                Resource resource = new Resource();
                resource.setName(request.getName());
                resource.setPricePerHour(request.getPricePerHour());
                resource.setImageUrl(request.getImageUrl());
                resource.setDescription(request.getDescription());
                resource.setCapacity(request.getCapacity());
                resource.setOpeningHour(request.getOpeningHour());
                resource.setClosingHour(request.getClosingHour());
                resource.setBusiness(business);

                // Traducción controlada de tipos y estados
                resource.setType(parseResourceType(request.getType()));
                resource.setStatus(parseResourceStatus(request.getStatus()));

                Resource saved = repository.save(resource);
                return toResponse(saved);
        }

        // ==========================================
        // LIST
        // ==========================================
        @Override
        @Transactional(readOnly = true)
        public List<ResourceResponse> list() {
                return repository.findAll().stream().map(this::toResponse).toList();
        }

        // ==========================================
        // GET BY ID
        // ==========================================
        @Override
        @Transactional(readOnly = true)
        public ResourceResponse getById(Long id) {
                Resource resource = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Resource " + id + " not found"));
                return toResponse(resource);
        }

        // ==========================================
        // UPDATE
        // ==========================================
        @Override
        public ResourceResponse update(Long id, UpdateResourceRequest request) {
                Resource resource = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Resource " + id + " not found"));

                Business business = businessRepository
                                .findById(request.getBusinessId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Business " + request.getBusinessId() + " not found"));

                resource.setName(request.getName());
                resource.setPricePerHour(request.getPricePerHour());
                resource.setImageUrl(request.getImageUrl());
                resource.setDescription(request.getDescription());
                resource.setCapacity(request.getCapacity());
                resource.setOpeningHour(request.getOpeningHour());
                resource.setClosingHour(request.getClosingHour());
                resource.setBusiness(business);

                // Mapeos controlados de Strings a Enums en la actualización
                resource.setType(parseResourceType(request.getType()));
                resource.setStatus(parseResourceStatus(request.getStatus()));

                return toResponse(repository.save(resource));
        }

        // ==========================================
        // DELETE
        // ==========================================
        @Override
        public void delete(Long id) {
                if (!repository.existsById(id)) {
                        throw new ResourceNotFoundException("Resource " + id + " not found");
                }
                repository.deleteById(id);
        }

        // ==========================================
        // LIST BY BUSINESS
        // ==========================================
        @Override
        @Transactional(readOnly = true)
        public List<ResourceResponse> getByBusiness(Long businessId) {
                return repository.findByBusinessId(businessId).stream().map(this::toResponse).toList();
        }

        // ==========================================
        // MAPPER
        // ==========================================
        private ResourceResponse toResponse(Resource resource) {
                ResourceResponse response = new ResourceResponse();
                response.setId(resource.getId());
                response.setName(resource.getName());
                response.setType(resource.getType());
                response.setPricePerHour(resource.getPricePerHour());
                response.setImageUrl(resource.getImageUrl());
                response.setDescription(resource.getDescription());
                response.setCapacity(resource.getCapacity());
                response.setStatus(resource.getStatus());
                response.setOpeningHour(resource.getOpeningHour());
                response.setClosingHour(resource.getClosingHour());

                if (resource.getBusiness() != null) {
                        response.setBusinessId(resource.getBusiness().getId());
                        response.setBusinessName(resource.getBusiness().getName());
                }
                return response;
        }
}