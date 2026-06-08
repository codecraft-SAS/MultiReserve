package com.epw.multireserve.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.epw.multireserve.entity.Business;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {

        // Negocios por propietario
        List<Business> findByOwnerId(Long ownerId);

        // Negocios activos
        List<Business> findByActiveTrue();

        // Filtro por categoría (ignora mayúsculas/minúsculas)
        List<Business> findByCategoryIgnoreCase(String category);

        // Filtro por ciudad (ignora mayúsculas/minúsculas)
        List<Business> findByCityIgnoreCase(String city);

        // Buscador por nombre (ignora mayúsculas/minúsculas)
        List<Business> findByNameContainingIgnoreCase(String name);

        // Contador de negocios activos
        long countByActiveTrue();

        // ========================================================
        // MÉTRICAS PARA DASHBOARD
        // ========================================================

        /**
         * Devuelve un arreglo de objetos con la categoría y el número de negocios en
         * cada una.
         * Ejemplo: [ [ "DEPORTE", 24 ], [ "RESTAURANTE", 12 ] ]
         */
        @Query("SELECT b.category, COUNT(b) FROM Business b GROUP BY b.category")
        List<Object[]> countBusinessesByCategory();
}
