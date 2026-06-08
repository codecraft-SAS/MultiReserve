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
                                                // AUTH: Rutas públicas de acceso
                                                // =========================================================
                                                .requestMatchers("/api/auth/**").permitAll()

                                                // =====================================================================
                                                // BUSINESSES: Reglas jerárquicas calibradas (De lo específico a lo
                                                // general)
                                                // =====================================================================

                                                // 1. Permisiones públicas o para cualquier rol de lectura (Catálogo
                                                // accesible)
                                                .requestMatchers(
                                                                "/api/businesses", // El listado general
                                                                "/api/businesses/active", // Negocios activos
                                                                "/api/businesses/search/**", // Buscador
                                                                "/api/businesses/search", // Buscador con QueryParams
                                                                                          // (?keyword=)
                                                                "/api/businesses/category/**", // Filtro de categoría
                                                                "/api/businesses/city/**", // Filtro de ciudad
                                                                "/api/businesses/{id}" // Ver detalle de un negocio
                                                                                       // específico
                                                ).permitAll()

                                                // 2. KPIS y Métricas exclusivas del Dashboard de Administración
                                                .requestMatchers("/api/businesses/kpis").hasRole("ADMIN")

                                                // 3. Restricción absoluta para operaciones de escritura (Crear,
                                                // Modificar, Eliminar)
                                                .requestMatchers("/api/businesses/**").hasRole("ADMIN")

                                                // =========================================================
                                                // RESERVATIONS: Acceso a todos los roles autenticados
                                                // =========================================================
                                                .requestMatchers("/api/reservations/**")
                                                .hasAnyRole("ADMIN", "CLIENT", "EMPLOYEE")

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

                // Autorizamos al frontend de React corriendo en Vite a comunicarse con el
                // backend
                configuration.setAllowedOrigins(List.of("http://localhost:5173"));

                // ✅ Métodos permitidos ahora incluyen PATCH
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                // Cabeceras permitidas
                configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));

                // Permitir credenciales si fuesen necesarias
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration); // Aplicar estas reglas a todos los endpoints
                return source;
        }
}
