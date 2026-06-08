# 🚀 MultiReserve - Sistema Inteligente de Reservas y Gestión Operativa

<p align="center">
  <img width="200" alt="CodeCraft-SAS Logo" src="https://avatars.githubusercontent.com/u/260481609?s=200&v=4" />
</p>

## 🏢 About the Company

**CodeCraft-SAS** is a company dedicated to developing innovative technological solutions, focused on creating high-quality, scalable software aligned with business needs. Our goal is to transform ideas into efficient, secure, and easy-to-use digital products.

---

## 📌 Origen del Proyecto: De las Propuestas a la Centralización

**MultiReserve** nace como la evolución y consolidación estratégica de tres propuestas de negocio clave evaluadas por **CodeCraft-SAS**:

* **🔹 Propuesta 1 (Digital Reservation System for Synthetic Soccer Fields – Xilon Digital):** Diseñada para digitalizar el agendamiento y la visualización de disponibilidad en tiempo real de escenarios deportivos en la ciudad de Pasto, optimizando procesos operativos manuales.
* **🔹 Propuesta 2 (Billiard Management System):** Enfocada en automatizar la administración de mesas de juego, el control exacto del tiempo de uso, las tarifas dinámicas y el registro analítico de los ingresos diarios.
* **🔹 Propuesta 3 (🐾 Pet Adoption System):** Orientada a centralizar y hacer un seguimiento riguroso del flujo de solicitudes y estados transaccionales (Pendiente, Aprobado, Finalizado).

### 🎯 El Enfoque Modular de MultiReserve

En lugar de construir tres sistemas aislados, **CodeCraft-SAS** diseñó una **Plataforma Centralizada e Inteligente**. Bajo esta arquitectura, cualquier establecimiento comercial (canchas sintéticas o billares) se mapea como un **Negocio**, y sus activos físicos o espacios se gestionan de forma dinámica como **Recursos** independientes, aplicando un flujo transaccional y analítico seguro heredado de los mejores flujos de procesos.

---

## 🏗️ Arquitectura General del Sistema

El proyecto está construido bajo una arquitectura desacoplada que separa de forma estricta las responsabilidades del servidor y la interfaz de usuario:

```text
reservas/ (Raíz del Repositorio)
├── multireserve/   ──> Backend (Java 17 / Spring Boot 3)
└── reservas-web/   ──> Frontend (React / TypeScript / Vite)
```

---

## ☕ 1. Backend API (multireserve)

Servidor empresarial REST robusto desarrollado con Spring Boot 3, Spring Security, JWT y Spring Data JPA para la gestión analítica y segura de espacios y activos.

📂 **Arquitectura en Capas**
- `config/` → Configuración general de la aplicación, inyección de beans y políticas CORS.
- `controller/` → Controladores REST que exponen los endpoints estructurados de la API.
- `dto/` → Data Transfer Objects, usados para transportar datos de manera segura sin exponer directamente las entidades JPA.
- `entity/` → Entidades relacionales mapeadas con Hibernate (Users, Business, Resource, Reservation).
- `exception/` → Centralización del manejo global de errores y excepciones personalizadas (@RestControllerAdvice).
- `repository/` → Interfaces de acceso a datos de alto rendimiento optimizadas con Spring Data JPA.
- `security/` → Filtros de interceptación (JwtAuthenticationFilter), encriptación de credenciales con BCrypt y reglas en SecurityConfig.
- `service/` → Lógica del núcleo de negocio, validaciones transaccionales y de disponibilidad horaria.

🔐 **Características Principales del Servidor**
- Control de Acceso basado en Roles (RBAC).
- Seguridad a Nivel de Datos (Ownership Security).
- Validación Anti-Solapamiento de reservas.

---

## ⚛️ 2. Frontend Web (reservas-web)

Aplicación SPA desarrollada con React, TypeScript y Vite, garantizando una experiencia de usuario fluida, tipada y veloz.

📂 **Características Interactivas Avanzadas**
- Estado Global y Consumo de API con Axios + JWT.
- Dashboard Analítico con CSS Grid responsivo.
- Renderizado Condicional y rutas protegidas según rol.

👥 **Control de Accesos y Permisos por Rol**
- **ADMIN**: KPIs globales, gestión de usuarios, negocios y recursos.
- **EMPLOYEE**: Métricas de su negocio, gestión de reservas.
- **CLIENT**: Catálogo público, creación y cancelación de reservas propias.

---

## 📋 Endpoints y Guía de Pruebas

🔐 **Autenticación y Cuentas**
- `POST /api/auth/login` → Login de usuario (JWT).
- `POST /api/auth/register` → Registro automático de cliente.
- `POST /api/admin/users` → Crear usuario interno (EMPLOYEE/ADMIN).
- `GET /api/admin/users` → Listar todos los usuarios.

🏢 **Gestión de Negocios y Recursos**
- `POST /api/businesses` → Crear negocio.
- `GET /api/businesses` → Listar negocios.
- `PUT/DELETE /api/businesses/{id}` → Actualizar/eliminar negocio.

📊 **Módulo Analítico y KPIs (Dashboard)**
- `GET /api/reports/stats` → KPIs del mes actual (?month=6 opcional).
- `GET /api/reports/charts/monthly` → Histórico mensual de reservas.

📅 **Módulo de Reservas**
- `POST /api/reservations` → Crear reserva (CLIENT/EMPLOYEE).
- `GET /api/reservations` → Listar reservas (CLIENT ve solo las suyas, ADMIN todas).
- Validación anti-solapamiento con errores 400/409.

---

## 🛠️ Requisitos de Instalación y Despliegue Local

⚙️ **Prerrequisitos**
- Java JDK 17+
- Node.js 18+
- Base de Datos Relacional

🟢 **Backend (multireserve)**
```bash
cd multireserve
# Configura application.properties
./mvnw clean install
./mvnw spring-boot:run
```
Disponible en: `http://localhost:8080`

🔵 **Frontend (reservas-web)**
```bash
cd reservas-web
npm install
# Configura .env
VITE_API_BASE_URL=http://localhost:8080
npm run dev
```
Disponible en: `http://localhost:5173`
```

