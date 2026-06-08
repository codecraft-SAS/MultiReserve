package com.epw.multireserve.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.epw.multireserve.dto.BusinessResponse;
import com.epw.multireserve.dto.CreateBusinessRequest;
import com.epw.multireserve.dto.UpdateBusinessRequest;
import com.epw.multireserve.entity.Business;
import com.epw.multireserve.entity.User;
import com.epw.multireserve.exception.ResourceNotFoundException;
import com.epw.multireserve.repository.BusinessRepository;
import com.epw.multireserve.repository.UserRepository;
import com.epw.multireserve.service.BusinessService;

@Service
@Transactional
public class BusinessServiceImpl implements BusinessService {

        private final BusinessRepository repository;
        private final UserRepository userRepository;

        public BusinessServiceImpl(
                        BusinessRepository repository,
                        UserRepository userRepository) {
                this.repository = repository;
                this.userRepository = userRepository;
        }

        // =========================
        // CREATE (CORREGIDO)
        // =========================
        @Override
        public BusinessResponse create(CreateBusinessRequest request, String email) {
                // Buscamos al usuario por su email (obtenido del Token JWT)
                User owner = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Usuario no encontrado con email: " + email));

                Business business = new Business();
                business.setName(request.getName());
                business.setAddress(request.getAddress());
                business.setPhone(request.getPhone());
                business.setEmail(request.getEmail());
                business.setImageUrl(request.getImageUrl());
                business.setDescription(request.getDescription());
                business.setCategory(request.getCategory());
                business.setCity(request.getCity());
                business.setActive(request.getActive() != null ? request.getActive() : true);

                // Asignamos el dueño real extraído del token
                business.setOwner(owner);

                return toResponse(repository.save(business));
        }

        // =========================
        // LIST
        // =========================
        @Override
        @Transactional(readOnly = true)
        public List<BusinessResponse> list() {
                return repository.findAll().stream().map(this::toResponse).toList();
        }

        // =========================
        // GET BY ID
        // =========================
        @Override
        @Transactional(readOnly = true)
        public BusinessResponse getById(Long id) {
                Business business = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Business " + id + " not found"));
                return toResponse(business);
        }

        // =========================
        // UPDATE
        // =========================
        @Override
        public BusinessResponse update(Long id, UpdateBusinessRequest request) {
                Business business = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Business " + id + " not found"));

                // Nota: aquí aún se usa ownerId del request.
                // Si quieres máxima seguridad, puedes cambiarlo para usar Principal como en
                // create.
                User owner = userRepository.findById(request.getOwnerId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User " + request.getOwnerId() + " not found"));

                business.setName(request.getName());
                business.setAddress(request.getAddress());
                business.setPhone(request.getPhone());
                business.setEmail(request.getEmail());
                business.setImageUrl(request.getImageUrl());
                business.setDescription(request.getDescription());
                business.setCategory(request.getCategory());
                business.setCity(request.getCity());
                business.setActive(request.getActive() != null ? request.getActive() : business.getActive());
                business.setOwner(owner);

                return toResponse(repository.save(business));
        }

        // =========================
        // DELETE
        // =========================
        @Override
        public void delete(Long id) {
                if (!repository.existsById(id)) {
                        throw new ResourceNotFoundException("Business " + id + " not found");
                }
                repository.deleteById(id);
        }

        // =========================
        // BY OWNER
        // =========================
        @Override
        @Transactional(readOnly = true)
        public List<BusinessResponse> getByOwner(Long ownerId) {
                return repository.findByOwnerId(ownerId).stream().map(this::toResponse).toList();
        }

        // =========================
        // NUEVOS MÉTODOS PRO
        // =========================
        @Override
        @Transactional(readOnly = true)
        public List<BusinessResponse> getActiveBusinesses() {
                return repository.findByActiveTrue().stream().map(this::toResponse).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<BusinessResponse> getByCategory(String category) {
                return repository.findByCategoryIgnoreCase(category).stream().map(this::toResponse).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<BusinessResponse> getByCity(String city) {
                return repository.findByCityIgnoreCase(city).stream().map(this::toResponse).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<BusinessResponse> searchByName(String keyword) {
                return repository.findByNameContainingIgnoreCase(keyword).stream().map(this::toResponse).toList();
        }

        @Override
        @Transactional(readOnly = true)
        public Long countBusinesses() {
                return repository.count();
        }

        @Override
        @Transactional(readOnly = true)
        public Long countActiveBusinesses() {
                return repository.countByActiveTrue();
        }

        // =========================
        // CAMBIAR ESTADO (PATCH)
        // =========================
        @Override
        public BusinessResponse toggleStatus(Long id) {
                Business business = repository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Business " + id + " not found"));
                business.setActive(!business.getActive());
                repository.save(business);
                return toResponse(business);
        }

        // =========================
        // MAPPER
        // =========================
        private BusinessResponse toResponse(Business business) {
                BusinessResponse response = new BusinessResponse();
                response.setId(business.getId());
                response.setName(business.getName());
                response.setAddress(business.getAddress());
                response.setPhone(business.getPhone());
                response.setEmail(business.getEmail());
                if (business.getOwner() != null) {
                        response.setOwnerId(business.getOwner().getId());
                        response.setOwnerName(business.getOwner().getFullName());
                }
                response.setImageUrl(business.getImageUrl());
                response.setDescription(business.getDescription());
                response.setCategory(business.getCategory());
                response.setCity(business.getCity());
                response.setActive(business.getActive());
                response.setTotalResources(business.getResources() != null ? business.getResources().size() : 0);
                response.setTotalReservations(
                                business.getReservations() != null ? business.getReservations().size() : 0);
                response.setRating(business.getRating());
                return response;
        }
}
