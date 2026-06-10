package com.epw.multireserve.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;

        public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
                this.jwtAuthFilter = jwtAuthFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                // =========================================================
                                // 1. Habilitar CORS con las reglas del Bean de abajo
                                // =========================================================
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                                .csrf(csrf -> csrf.disable())

                                .authorizeHttpRequests(auth -> auth

                                                // =========================================================
                                                // AUTH: Reglas segmentadas para proteger el Perfil
                                                // =========================================================
                                                // Rutas estrictamente públicas
                                                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                                                // Exigir autenticación explícita para la actualización de perfil
                                                .requestMatchers("/api/auth/update-profile").authenticated()

                                                // =====================================================================
                                                // BUSINESSES: Reglas jerárquicas calibradas
                                                // =====================================================================
                                                // 1. Permisiones públicas o para cualquier rol de lectura
                                                .requestMatchers(
                                                                "/api/businesses",
                                                                "/api/businesses/active",
                                                                "/api/businesses/search/**",
                                                                "/api/businesses/search",
                                                                "/api/businesses/category/**",
                                                                "/api/businesses/city/**",
                                                                "/api/businesses/{id}")
                                                .permitAll()

                                                // 2. KPIs con coincidencia exacta de Authority sin prefijo ROLE_
                                                .requestMatchers("/api/businesses/kpis").hasAuthority("ADMIN")

                                                // 3. Escritura de negocios con coincidencia exacta de Authority
                                                .requestMatchers("/api/businesses/**").hasAuthority("ADMIN")

                                                // =========================================================
                                                // RESERVATIONS: 🔥 BLINDADO DOBLE PARA EVITAR EL 403
                                                // =========================================================
                                                // Acepta roles con y sin el prefijo ROLE_ según cómo viaje en tu JWT
                                                .requestMatchers("/api/reservations/**")
                                                .hasAnyAuthority("ADMIN", "CLIENT", "EMPLOYEE", "ROLE_ADMIN",
                                                                "ROLE_CLIENT", "ROLE_EMPLOYEE")

                                                // =========================================================
                                                // TODO LO DEMÁS: Requiere token válido
                                                // =========================================================
                                                .anyRequest().authenticated())

                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // =====================================================================
        // 2. BEAN: Definición explícita de permisos de CORS para React
        // =====================================================================
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(List.of("http://localhost:5173"));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}