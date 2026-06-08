import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout principal
import MainLayout from "./layouts/MainLayout";

// Componente de protección de rutas
import PrivateRoute from "./routes/PrivateRoute";

// Páginas públicas
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Páginas de ADMINISTRADOR
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageBusinesses from "./pages/admin/ManageBusinesses";
import CreateBusinessForm from "./pages/admin/CreateBusinessForm";
/* 🏢 1. IMPORTA TU FORMULARIO DE EDICIÓN AQUÍ */
import EditBusinessForm from "./pages/admin/EditBusinessForm"; // ◄ Cambia el nombre si tu archivo se llama diferente
import CreateResourceForm from "./pages/admin/CreateResourceForm";
import UserManagement from "./pages/admin/UserManagement"; 
import ReportsManagement from "./pages/admin/ReportsManagement"; 

// Módulos operativos vinculados
import ResourceManagement from "./pages/ResourceManagement";
import ReservationManagement from "./pages/ReservationManagement";

// Páginas de EMPLEADO
import EmployeePanel from "./pages/EmployeePanel"; 

// Páginas de CLIENTE
import BusinessCatalog from "./pages/BusinessCatalog";
import ClientReservations from "./pages/ClientReservations";

function App() {
  return (
    <>
      {/* Proveedor global de notificaciones */}
      <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#fff' } }} />

      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 👑 PANEL DE ADMINISTRADOR (Protegido) */}
        <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<MainLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="businesses" element={<ManageBusinesses />} />
            <Route path="create-business" element={<CreateBusinessForm />} />
            
            {/* 🏢 2. AGREGA LA RUTA DE EDICIÓN AQUÍ */}
            <Route path="edit-business/:id" element={<EditBusinessForm />} /> 

            {/* Rutas de control operativo, personal y estadísticas */}
            <Route path="resources" element={<ResourceManagement />} />
            <Route path="create-resource" element={<CreateResourceForm />} />
            <Route path="reservations" element={<ReservationManagement />} />
            <Route path="users" element={<UserManagement />} /> 
            <Route path="reports" element={<ReportsManagement />} /> 
          </Route>
        </Route>

        {/* 🧑‍💼 PANEL DE EMPLEADO (Protegido) */}
        <Route element={<PrivateRoute allowedRoles={['EMPLOYEE']} />}>
          <Route path="/employee" element={<MainLayout />}>
            <Route path="dashboard" element={<EmployeePanel />} />
          </Route>
        </Route>

        {/* 👤 PANEL DE CLIENTE (Protegido) */}
        <Route element={<PrivateRoute allowedRoles={['CLIENT']} />}>
          <Route path="/client" element={<MainLayout />}>
            <Route path="catalog" element={<BusinessCatalog />} />
            <Route path="my-reservations" element={<ClientReservations />} />
          </Route>
        </Route>

        {/* Comodín para rutas no encontradas o accesos no autorizados */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;