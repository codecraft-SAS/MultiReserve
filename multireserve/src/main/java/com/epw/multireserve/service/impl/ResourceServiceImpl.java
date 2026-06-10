package com.epw.multireserve.service.impl;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.epw.multireserve.dto.CreateResourceRequest;
import com.epw.multireserve.dto.ResourceResponse;
import com.epw.multireserve.dto.UpdateResourceRequest;
import com.epw.multireserve.entity.Business;
import com.epw.multireserve.entity.Resource;
import com.epw.multireserve.entity.ResourceStatus;
import com.epw.multireserve.entity.ResourceType;
import com.epw.multireserve.entity.User;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.BusinessRepository;
import com.epw.multireserve.repository.ReservationRepository;
import com.epw.multireserve.repository.ResourceRepository;
import com.epw.multireserve.repository.UserRepository;
import com.epw.multireserve.service.ResourceService;

@Service
@Transactional
@SuppressWarnings("null")
public class ResourceServiceImpl implements ResourceService {

        private final ResourceRepository repository;
        private final BusinessRepository businessRepository;
        private final ReservationRepository reservationRepository;
        private final UserRepository userRepository;

        public ResourceServiceImpl(
                        ResourceRepository repository,
                        BusinessRepository businessRepository,
                        ReservationRepository reservationRepository,
                        UserRepository userRepository) {
                this.repository = repository;
                this.businessRepository = businessRepository;
                this.reservationRepository = reservationRepository;
                this.userRepository = userRepository;
        }

        // ==========================================
        // CREAR
        // ==========================================
        @Override
        public ResourceResponse create(CreateResourceRequest request) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String email = auth.getName();
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Business business;
                if (user.getRole().name().equals("EMPLOYEE")) {
                        if (user.getBusiness() == null) {
                                throw new IllegalStateException("No tienes un negocio asignado");
                        }
                        business = user.getBusiness();
                } else {
                        business = businessRepository
                                .findById(request.getBusinessId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Business " + request.getBusinessId() + " not found"));
                }

                Resource resource = new Resource();
                resource.setName(request.getName());
                resource.setPricePerHour(request.getPricePerHour());
                resource.setImageUrl(request.getImageUrl());
                resource.setDescription(request.getDescription());
                resource.setCapacity(request.getCapacity());
                resource.setOpeningHour(request.getOpeningHour());
                resource.setClosingHour(request.getClosingHour());
                resource.setBusiness(business);

                resource.setType(parseResourceType(request.getType()));
                resource.setStatus(parseResourceStatus(request.getStatus()));

                Resource saved = repository.save(resource);
                return toResponse(saved);
        }

        // ==========================================
        // LISTAR
        // ==========================================
        @Override
        @Transactional(readOnly = true)
        public List<ResourceResponse> list() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String email = auth.getName();

                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                if (user.getRole().name().equals("ADMIN")) {
                        return repository.findAll().stream().map(this::toResponse).toList();
                }

                if (user.getRole().name().equals("EMPLOYEE")) {
                        if (user.getBusiness() != null) {
                                return repository.findByBusinessId(user.getBusiness().getId())
                                        .stream()
                                        .map(this::toResponse)
                                        .toList();
                        }
                        return List.of();
                }

                return repository.findAll().stream().map(this::toResponse).toList();
        }

        // ==========================================
        // OBTENER POR ID
        // ==========================================
        @Override
        @Transactional(readOnly = true)
        public ResourceResponse getById(Long id) {
                Resource resource = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Resource " + id + " not found"));
                return toResponse(resource);
        }

        // ==========================================
        // ACTUALIZAR
        // ==========================================
        @Override
        public ResourceResponse update(Long id, UpdateResourceRequest request) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String email = auth.getName();
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Resource resource = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Resource " + id + " not found"));

                Business business;
                if (user.getRole().name().equals("EMPLOYEE")) {
                        if (user.getBusiness() == null) {
                                throw new IllegalStateException("No tienes un negocio asignado");
                        }
                        if (!resource.getBusiness().getId().equals(user.getBusiness().getId())) {
                                throw new IllegalStateException("No puedes modificar recursos de otros negocios");
                        }
                        business = user.getBusiness();
                } else {
                        business = businessRepository
                                .findById(request.getBusinessId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Business " + request.getBusinessId() + " not found"));
                }

                resource.setName(request.getName());
                resource.setPricePerHour(request.getPricePerHour());
                resource.setImageUrl(request.getImageUrl());
                resource.setDescription(request.getDescription());
                resource.setCapacity(request.getCapacity());
                resource.setOpeningHour(request.getOpeningHour());
                resource.setClosingHour(request.getClosingHour());
                resource.setBusiness(business);

                resource.setType(parseResourceType(request.getType()));
                resource.setStatus(parseResourceStatus(request.getStatus()));

                return toResponse(repository.save(resource));
        }

        // ==========================================
        // ELIMINAR
        // ==========================================
        @Override
        public void delete(Long id) {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                String email = auth.getName();
                User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Resource resource = repository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Resource " + id + " not found"));

                if (user.getRole().name().equals("EMPLOYEE")) {
                        if (user.getBusiness() == null
                                || !resource.getBusiness().getId().equals(user.getBusiness().getId())) {
                                throw new IllegalStateException("No puedes eliminar recursos de otros negocios");
                        }
                }

                repository.deleteById(id);
        }

        // ==========================================
        // LISTAR POR NEGOCIO
        // ==========================================
        @Override
        @Transactional(readOnly = true)
        public List<ResourceResponse> getByBusiness(Long businessId) {
                return repository.findByBusinessId(businessId).stream().map(this::toResponse).toList();
        }

        // ==========================================
        // OBTENER DISPONIBILIDAD
        // ==========================================
        @Override
        @Transactional(readOnly = true)
        public List<String> getAvailability(Long resourceId, String date) {
                if (!repository.existsById(resourceId)) {
                        throw new ResourceNotFoundException("Recurso " + resourceId + " no encontrado");
                }

                LocalDate localDate;
                try {
                        // Aseguramos que el formato sea ISO (YYYY-MM-DD)
                        localDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
                } catch (DateTimeParseException e) {
                        throw new IllegalArgumentException("Formato de fecha inválido. Se esperaba YYYY-MM-DD");
                }

                // Aquí obtienes las reservas para ese recurso en ese día específico
                // Necesitarás un método en tu ReservationRepository como:
                // findByResourceIdAndReservationDate(Long resourceId, LocalDate date)

                // Por ahora, retornamos una lista vacía para probar que el 500 desaparezca
                return new ArrayList<>();
        }

        // ==========================================
        // MAPEADOR
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

        // ==========================================
        // PARSEADORES DE ENUM
        // ==========================================
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
                        return ResourceType.ROOM;
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
}
