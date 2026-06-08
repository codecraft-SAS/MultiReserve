import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  allowedRoles?: string[]; // opcional: restringir acceso por roles
  redirectPath?: string;   // opcional: ruta de redirección si no hay acceso
}

export default function PrivateRoute({
  allowedRoles,
  redirectPath = "/login",
}: PrivateRouteProps) {
  const { user, loading } = useAuth(); // 🌟 Extraemos el estado loading

  // 🌟 SI ESTÁ CARGANDO: Frena la redirección y muestra un indicador limpio
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        backgroundColor: "#09090b", 
        color: "#a1a1aa",
        fontSize: "14px",
        fontWeight: 500
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          {/* Un spinner CSS minimalista */}
          <div style={{
            width: "24px",
            height: "24px",
            border: "2px solid rgba(255,255,255,0.05)",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span>Sincronizando credenciales de MultiReserve...</span>
        </div>
      </div>
    );
  }

  // Si ya terminó de cargar y no hay usuario autenticado → redirigir al login
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si hay roles permitidos y el rol del usuario no está incluido → redirigir
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Te sugiero este log temporal para que verifiques en consola qué string está llegando
    console.log("⚠️ Acceso denegado. Rol del JWT:", user.role, "Roles permitidos:", allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  // Si pasa las validaciones → renderizar las rutas hijas
  return <Outlet />;
}