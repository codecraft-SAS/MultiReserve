package com.epw.multireserve.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

        @Value("${jwt.secret}")
        private String secret;

        @Value("${jwt.expiration}")
        private long expiration;

        private Key getSigningKey() {
                return Keys.hmacShaKeyFor(secret.getBytes());
        }

        // ✅ Genera token con email y rol como claims
        public String generateToken(String email, String role) {
                return Jwts.builder()
                                .subject(email)
                                .claim("role", role) // aquí agregamos el rol
                                .issuedAt(new Date())
                                .expiration(new Date(System.currentTimeMillis() + expiration))
                                .signWith(getSigningKey())
                                .compact();
        }

        // Extrae el email del token
        public String extractEmail(String token) {
                Claims claims = Jwts.parser()
                                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                return claims.getSubject();
        }

        // ✅ Validación rápida del token
        public boolean isTokenValid(String token) {
                try {
                        Jwts.parser()
                                        .verifyWith((javax.crypto.SecretKey) getSigningKey())
                                        .build()
                                        .parseSignedClaims(token);
                        return true;
                } catch (Exception e) {
                        return false;
                }
        }

        // ✅ Extrae el rol del token
        public String extractRole(String token) {
                Claims claims = Jwts.parser()
                                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                return claims.get("role", String.class);
        }

        // ✅ Verifica si el token está expirado
        private boolean isTokenExpired(String token) {
                Claims claims = Jwts.parser()
                                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                return claims.getExpiration().before(new Date());
        }

        // ✅ Valida el token contra el usuario
        public boolean isTokenValid(String token, String email) {
                final String extractedEmail = extractEmail(token);
                return (extractedEmail.equals(email) && !isTokenExpired(token));
        }
}
