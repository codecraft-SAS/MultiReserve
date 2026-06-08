import { useState } from "react";
import { Menu, X, Bell, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estados locales para los efectos hover reactivos
  const [menuHover, setMenuHover] = useState(false);
  const [bellHover, setBellHover] = useState(false);
  const [logoutHover, setLogoutHover] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "rgba(15, 15, 15, 0.75)", // Fondo oscuro translúcido premium
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        display: "flex",
        flexDirection: "row",       // Asegura flujo horizontal estricto
        alignItems: "center",       // Alineación vertical perfecta al centro
        justifyContent: "space-between",
        padding: "0 24px",
        position: "relative",
        zIndex: 40,
        boxSizing: "border-box",
        width: "100%"
      }}
    >
      {/* ─── SECCIÓN IZQUIERDA: CONTROL Y MARCA ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        
        {/* Botón de control del Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          onMouseEnter={() => setMenuHover(true)}
          onMouseLeave={() => setMenuHover(false)}
          style={{
            background: "none",
            border: "none",
            color: menuHover ? "#ffffff" : "#a1a1aa",
            cursor: "pointer",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            borderRadius: "6px"
          }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Identificador de Marca en Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "12px",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
            }}
          >
            MR
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "14px", letterSpacing: "-0.3px", lineHeight: 1 }}>
              MultiReserve
            </span>
            <span style={{ fontSize: "10px", color: "#71717a", marginTop: "2px" }}>
              Smart Booking
            </span>
          </div>
        </div>
      </div>

      {/* ─── SECCIÓN DERECHA: ACCIONES Y PERFIL DE USUARIO ─── */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        {/* Alertas / Notificaciones */}
        <button
          onMouseEnter={() => setBellHover(true)}
          onMouseLeave={() => setBellHover(false)}
          style={{
            background: "none",
            border: "none",
            position: "relative",
            color: bellHover ? "#ffffff" : "#a1a1aa",
            cursor: "pointer",
            transition: "color 0.2s",
            display: "flex",
            alignItems: "center",
            padding: "6px"
          }}
        >
          <Bell size={18} />
          <style>{`
            @keyframes pulseAlert { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
          `}</style>
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              animation: "pulseAlert 2s infinite"
            }}
          />
        </button>

        {/* Separador sutil */}
        <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.08)", height: "20px" }} />

        {/* Datos del Administrador / Empleado logueado */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <UserCircle size={28} style={{ color: "#e4e4e7" }} />
          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <span style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600, lineHeight: 1 }}>
              {user?.fullName || "Administrador"}
            </span>
            <span style={{ color: "#71717a", fontSize: "11px", marginTop: "2px" }}>
              {user?.email || "admin@gmail.com"}
            </span>
          </div>

          {/* Tag de Rol Estilizado */}
          <span
            style={{
              marginLeft: "6px",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "9px",
              fontWeight: 800,
              backgroundColor: "rgba(37, 99, 235, 0.12)",
              color: "#3b82f6",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              letterSpacing: "0.5px"
            }}
          >
            {user?.role || "ADMIN"}
          </span>
        </div>

        {/* Botón "Salir" integrado y estilizado */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: logoutHover ? "#dc2626" : "rgba(220, 38, 38, 0.08)",
            border: "1px solid rgba(220, 38, 38, 0.15)",
            color: logoutHover ? "#ffffff" : "#ef4444",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "12px",
            fontWeight: 600
          }}
        >
          <LogOut size={14} />
          <span>Salir</span>
        </button>

      </div>
    </header>
  );
}