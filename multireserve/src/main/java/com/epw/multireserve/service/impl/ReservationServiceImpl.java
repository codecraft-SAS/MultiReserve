package com.epw.multireserve.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.epw.multireserve.dto.CreateReservationRequest;
import com.epw.multireserve.dto.ReservationResponse;
import com.epw.multireserve.dto.UpdateReservationRequest;
import com.epw.multireserve.entity.Business;
import com.epw.multireserve.entity.Reservation;
import com.epw.multireserve.entity.ReservationStatus;
import com.epw.multireserve.entity.Resource;
import com.epw.multireserve.entity.User;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.BusinessRepository;
import com.epw.multireserve.repository.ReservationRepository;
import com.epw.multireserve.repository.ResourceRepository;
import com.epw.multireserve.repository.UserRepository;
import com.epw.multireserve.service.ReservationService;

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository repository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;

    public ReservationServiceImpl(
            ReservationRepository repository,
            BusinessRepository businessRepository,
            UserRepository userRepository,
            ResourceRepository resourceRepository) {

        this.repository = repository;
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
        this.resourceRepository = resourceRepository;
    }

    // ==========================================
    // CREATE
    // ==========================================
    @Override
    public ReservationResponse create(CreateReservationRequest request) {

        if (request.getStartTime().isAfter(request.getEndTime())
                || request.getStartTime().equals(request.getEndTime())) {
            throw new IllegalArgumentException("La hora de inicio debe ser anterior a la hora de fin");
        }

        if (request.getReservationDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de reserva no puede ser anterior a la fecha actual");
        }

        validateOperatingHours(request.getResourceName(), request.getStartTime(), request.getEndTime());

        boolean existsOverlap = repository.existsOverlappingReservation(
                request.getResourceName(),
                request.getReservationDate(),
                request.getStartTime(),
                request.getEndTime());

        if (existsOverlap) {
            throw new IllegalArgumentException("Este recurso ya está reservado para ese rango de tiempo");
        }

        Reservation r = new Reservation();

        r.setCustomerName(request.getCustomerName());
        r.setResourceType(request.getResourceType());
        r.setResourceName(request.getResourceName());
        r.setReservationDate(request.getReservationDate());
        r.setStartTime(request.getStartTime());
        r.setEndTime(request.getEndTime());

        r.setStatus(ReservationStatus.PENDING);
        r.setAmount(request.getAmount());
        r.setAmountPaid(request.getAmountPaid() != null ? request.getAmountPaid() : 0.0);
        r.setPaymentMethod(request.getPaymentMethod());

        // Link resource and derive business from it
        if (request.getResourceId() != null) {
            Resource resource = resourceRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Recurso " + request.getResourceId() + " no encontrado"));
            r.setResource(resource);
            if (resource.getBusiness() != null) {
                r.setBusiness(resource.getBusiness());
            }
        }

        // businessId in request overrides the resource-derived business
        if (request.getBusinessId() != null) {
            Business business = businessRepository.findById(request.getBusinessId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Negocio " + request.getBusinessId() + " no encontrado"));
            r.setBusiness(business);
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        r.setUser(user);

        Reservation saved = repository.save(r);

        return toResponse(saved);
    }

    // ==========================================
    // LIST
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> list() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole().name().equals("ADMIN")) {
            return repository.findAll()
                    .stream()
                    .map(this::toResponse)
                    .toList();
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

        return repository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ==========================================
    // LIST BY CUSTOMER NAME
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> findByCustomerName(String customerName) {
        return repository.findByCustomerName(customerName)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ==========================================
    // GET BY ID
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public ReservationResponse getById(Long id) {
        Reservation r = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation " + id + " not found"));
        return toResponse(r);
    }

    // ==========================================
    // UPDATE
    // ==========================================
    @Override
    public ReservationResponse update(Long id, UpdateReservationRequest request) {
        Reservation r = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva " + id + " no encontrada"));

        if (request.getStartTime().isAfter(request.getEndTime())
                || request.getStartTime().equals(request.getEndTime())) {
            throw new IllegalArgumentException("La hora de inicio debe ser anterior a la hora de fin");
        }

        if (request.getReservationDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha de reserva no puede ser anterior a la fecha actual");
        }

        validateOperatingHours(request.getResourceName(), request.getStartTime(), request.getEndTime());

        r.setCustomerName(request.getCustomerName());
        r.setResourceType(request.getResourceType());
        r.setResourceName(request.getResourceName());
        r.setReservationDate(request.getReservationDate());
        r.setStartTime(request.getStartTime());
        r.setEndTime(request.getEndTime());

        if (request.getStatus() != null) {
            r.setStatus(request.getStatus());
        }

        r.setAmount(request.getAmount());

        return toResponse(repository.save(r));
    }

    // ==========================================
    // DELETE
    // ==========================================
    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Reserva " + id + " no encontrada");
        }
        repository.deleteById(id);
    }

    // ==========================================
    // CONFIRM
    // ==========================================
    @Override
    public ReservationResponse confirm(Long id) {
        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva " + id + " no encontrada"));

        reservation.setStatus(ReservationStatus.CONFIRMED);

        return toResponse(repository.save(reservation));
    }

    // ==========================================
    // CHANGE STATUS
    // ==========================================
    @Override
    public ReservationResponse changeStatus(Long id, String status) {
        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva " + id + " no encontrada"));

        ReservationStatus newStatus;
        try {
            newStatus = ReservationStatus.valueOf(status);
        } catch (Exception e) {
            throw new IllegalArgumentException("Estado inválido: " + status);
        }

        reservation.setStatus(newStatus);

        return toResponse(repository.save(reservation));
    }

    // ==========================================
    // MAPPER
    // ==========================================
    private ReservationResponse toResponse(Reservation r) {
        ReservationResponse res = new ReservationResponse();

        res.setId(r.getId());
        res.setCustomerName(r.getCustomerName());
        res.setResourceType(r.getResourceType());
        res.setResourceName(r.getResourceName());
        res.setReservationDate(r.getReservationDate());
        res.setStartTime(r.getStartTime());
        res.setEndTime(r.getEndTime());
        res.setStatus(r.getStatus());
        res.setAmount(r.getAmount());

        // 🔄 NUEVOS CAMPOS DE PAGO
        res.setAmountPaid(r.getAmountPaid());
        res.setPaymentMethod(r.getPaymentMethod());
        res.setRemainingBalance(r.getRemainingBalance());

        // USER
        if (r.getUser() != null) {
            res.setUserId(r.getUser().getId());
            res.setUserName(r.getUser().getFullName());
            res.setUserEmail(r.getUser().getEmail());
        }

        // BUSINESS
        if (r.getBusiness() != null) {
            res.setBusinessId(r.getBusiness().getId());
            res.setBusinessName(r.getBusiness().getName());
        }

        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());

        return res;
    }

    private void validateOperatingHours(String resourceName, LocalTime startTime, LocalTime endTime) {
        resourceRepository.findByNameIgnoreCase(resourceName).ifPresent(resource -> {
            if (resource.getOpeningHour() != null && resource.getClosingHour() != null) {
                LocalTime opening = LocalTime.parse(resource.getOpeningHour());
                LocalTime closing = LocalTime.parse(resource.getClosingHour());
                if (startTime.isBefore(opening) || endTime.isAfter(closing)) {
                    throw new IllegalArgumentException(
                            "El horario del recurso es de " + resource.getOpeningHour()
                            + " a " + resource.getClosingHour()
                            + ". La reserva debe estar dentro de ese rango");
                }
            }
        });
    }
}
