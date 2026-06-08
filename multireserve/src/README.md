# CodeCraft-SAS

<!-- LOGO -->
<p align="center">
  <img width="200" alt="Xilon Digital Logo" src="https://github.com/user-attachments/assets/6d94182b-59e8-451c-abe1-1a6180290c86" />
</p>


  <!-- Aquí va el LOGO de CodeCraft-SAS -->
</p>

## About the Company

**CodeCraft-SAS** is a company dedicated to developing innovative technological solutions, focused on creating high-quality, scalable software aligned with business needs.

Our goal is to transform ideas into efficient, secure, and easy-to-use digital products.

---

## 📌 Proposals

### 🔹 Proposal 1  
**Digital Reservation System for Synthetic Soccer Fields – Xilon Digital**

📖 **Description**  
Xilon Digital is a web platform designed for the management and reservation of synthetic soccer fields. It allows users to view available fields, check schedules in real time, and make reservations easily.  
The system also provides administrative features for efficient management of fields, schedules, and bookings, centralizing information and optimizing operational processes.

🎯 **Objective**  
Develop a technological solution that digitizes the reservation process for synthetic soccer fields in the city of Pasto, offering a modern, accessible, and efficient alternative to traditional manual management methods.

✅ **Benefits**  
- Automation of the reservation process.  
- Clear real-time availability visualization.  
- Reduction of scheduling errors.  
- Improved end-user experience.  
- Platform access from any device.  
- Scalable base for future features such as online payments and notifications.  

---

### 🔹 Proposal 2  
**Billiard Management System**

📖 **Description**  
It is a web application designed to optimize and automate the administration of a billiard business. It enables efficient control of tables, usage time, payments, customers, and daily income, facilitating decision-making and improving customer service.

🎯 **Objective**  
- Automate the management of billiard tables and matches.  
- Accurately control usage time and payments.  
- Record daily income and business activities.  
- Improve organization and operational efficiency.  

✅ **Benefits**  
- Optimizes control of tables and playing time.  
- Automates payments, reducing manual errors.  
- Improves organization and business administration.  
- Enables clear tracking of income and matches.  
- Saves time and increases operational efficiency.  
- Easy access from any internet-enabled device.  

---

### 🔹 Proposal 3  
**🐾 Pet Adoption System**

📖 **Description**  
Web system to manage pet adoption, allowing registration of available animals, adoption requests, and process tracking by administrators and users.

🎯 **Objective**  
Facilitate responsible adoption through a platform that connects interested people with available pets in an organized and simple way.

✅ **Benefits**  
- Centralizes pet and adopter information.  
- Streamlines the adoption process.  
- Improves request control and tracking.  
- Promotes responsible adoption.  

---
# Multireserve API 🔥

Backend empresarial desarrollado con **Spring Boot 3**, **Spring Security**, **JWT** y **Spring Data JPA** para la gestión de reservas de espacios (canchas, salas, etc.).

---

## 🚀 Características principales
- Autenticación con JWT.
- Roles: ADMIN, CLIENT, EMPLOYEE.
- Seguridad con Spring Security (RBAC).
- CRUD de negocios (solo ADMIN).
- Sistema de reservas con validación de disponibilidad y solapamiento.
- Asociación de reservas al usuario autenticado.
- Restricción de acceso por rol (ownership security).
- Manejo global de errores y excepciones.

---

## 📂 Arquitectura

El proyecto sigue una arquitectura en capas clara y mantenible:

- **config/** → Configuración general de la aplicación (Spring Boot, beans, etc.).
- **controller/** → Controladores REST que exponen los endpoints.
- **dto/** → Data Transfer Objects, usados para transportar datos entre cliente y servidor sin exponer directamente las entidades.
- **entity/** → Entidades JPA que representan las tablas de la base de datos.
- **exception/** → Manejo global de errores y excepciones personalizadas.
- **repository/** → Interfaces de acceso a datos usando Spring Data JPA.
- **security/** → Configuración de seguridad, filtros JWT, RBAC y `SecurityConfig`.
- **service/** → Lógica de negocio, validaciones y coordinación entre controladores y repositorios.
- **resources/** → Archivos de configuración (`application.properties`), plantillas y estáticos.
- **MultireserveApplication.java** → Clase principal que arranca la aplicación Spring Boot.

---

## ⚙️ Implementación del Proyecto

### 📌 1. Arquitectura general
- Spring Boot 3, Spring Security + JWT, Spring Data JPA, Hibernate.
- Arquitectura en capas: Controller → Service → Repository → Entity.

### 🔐 2. Autenticación y Seguridad
- Login con JWT y Registro de usuarios.
- Password encriptada con BCrypt.
- Filtro JWT (`JwtAuthenticationFilter`) y `SecurityConfig` centralizado.

### 🧠 3. Control de acceso (RBAC)
- `/api/businesses/**` → SOLO ADMIN.
- `/api/reservations/**` → ADMIN, CLIENT, EMPLOYEE.
- `/api/auth/**` → Público.
- `/api/admin/**` → Creación de usuarios admin/employee.

### 👤 4. Gestión de usuarios
- Registro de clientes automático.
- Endpoint separado para crear ADMIN/EMPLOYEE.
- Seeder inicial de ADMIN (`CommandLineRunner`).

### 🏢 5. Módulo Business
- CRUD de negocios y relación con reservas. Solo ADMIN puede gestionarlo.

### 📅 6. Módulo Reservations
- Crear reservas autenticadas (usuario extraído desde JWT).
- Estados: PENDING, CONFIRMED, CANCELLED.
- Validaciones: hora inicio < hora fin, evitar solapamientos, disponibilidad de recursos.
- Relación con User y Business.

### 🔥 7. Seguridad a nivel de datos (Ownership Security)
- Cada reserva está ligada al usuario autenticado.
- El CLIENT solo ve sus propias reservas. El ADMIN ve todas las reservas.

### 💡 8. Mejoras recientes
- Validación de enums (`ResourceType`, `Status`).
- Limpieza de seguridad en endpoints.
- Listado dinámico según rol.

---

## 📋 Endpoints y Guía de Pruebas (Flujo de Validación)

El sistema inicializa automáticamente un usuario **ADMIN** por defecto para facilitar las pruebas iniciales:
- **Email:** `admin@gmail.com`
- **Password:** `123456`

### 🔐 1. Autenticación
| Endpoint | Método | Descripción | Body (JSON) |
| :--- | :---: | :--- | :--- |
| `/api/auth/login` | `POST` | Login de usuario (Retorna Token) | `{"email": "admin@gmail.com", "password": "123456"}` |
| `/api/auth/register` | `POST` | Registro de cliente nuevo | `{"fullName": "Juan Perez", "email": "juan@gmail.com", "password": "123456", "role": "CLIENT"}` |

### 👥 2. Gestión de Usuarios
| Endpoint | Método | Permiso | Descripción |
| :--- | :---: | :---: | :--- |
| `/api/admin/users` | `POST` | `ADMIN` | Crea un usuario interno (`EMPLOYEE` o `ADMIN`). |
| `/api/admin/users` | `GET` | `ADMIN` | Lista todos los usuarios registrados. Un `CLIENT` o `EMPLOYEE` recibe `403 Forbidden`. |

### 🏢 3. Gestión de Negocios
| Endpoint | Método | Permiso | Descripción |
| :--- | :---: | :---: | :--- |
| `/api/businesses` | `POST` | `ADMIN` | Crea un negocio. Un `CLIENT` recibe `403 Forbidden`. |
| `/api/businesses` | `GET` | `ADMIN` | Lista todos los negocios registrados en el sistema. |
| `/api/businesses/{id}` | `PUT/DEL` | `ADMIN` | Actualiza o elimina un negocio existente. |

### 📅 4. Gestión de Reservas

| Escenario | Permiso | Request | Resultado Esperado |
| :--- | :---: | :--- | :--- |
| **Crear Reserva** | `CLIENT` | `POST /api/reservations` | `201 Created` (Asignada a estado `PENDING` por defecto) |
| **Listar Reservas** | `CLIENT` | `GET /api/reservations` | Solo ve sus propias reservas. |
| **Listar Reservas** | `ADMIN` | `GET /api/reservations` | Ve la totalidad de reservas del sistema. |
| **Reserva Solapada** | `CLIENT` | `POST /api/reservations` | `400 Bad Request` o `409 Conflict` (Conflicto de horario). |

### ⚠️ 5. Manejo de Errores Esperados
- **Registro sin rol:** `400 Bad Request`.
- **Login con credenciales erróneas:** `401 Unauthorized`.
- **Acceso a ruta protegida sin permisos (Ej. Cliente en /api/admin):** `403 Forbidden`.
- **Reserva con hora de fin anterior a la hora de inicio:** `400 Bad Request` (`IllegalArgumentException` controlado).

---

## 📌 Cómo ejecutar

```bash
# Clonar el repositorio
git clone [https://github.com/codecraft-SAS/EX1.git](https://github.com/codecraft-SAS/EX1.git)

# Entrar al directorio
cd EX1

# Compilar e instalar dependencias
mvn clean install

# Ejecutar el proyecto
mvn spring-boot:run
