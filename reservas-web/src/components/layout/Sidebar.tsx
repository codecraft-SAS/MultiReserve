import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Layers,
  CalendarCheck,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ isOpen, currentPage, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [logoutHover, setLogoutHover] = useState(false);

  if (!user) return null;

  const role = user.role?.toUpperCase();

  const menuConfig: Record<string, { name: string; page: string; icon: React.ReactNode }[]> = {
    ADMIN: [
      { name: "Dashboard", page: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Usuarios", page: "/admin/users", icon: <Users size={18} /> },
      { name: "Negocios", page: "/admin/businesses", icon: <Store size={18} /> },
      { name: "Recursos", page: "/admin/resources", icon: <Layers size={18} /> },
      { name: "Reservas", page: "/admin/reservations", icon: <CalendarCheck size={18} /> },
      { name: "Reportes", page: "/admin/reports", icon: <BarChart3 size={18} /> },
      { name: "Mi Perfil", page: "/admin/profile", icon: <User size={18} /> },
    ],
    EMPLOYEE: [
      { name: "Dashboard", page: "/employee/dashboard", icon: <LayoutDashboard size={18} /> },
      { name: "Recursos", page: "/employee/resources", icon: <Layers size={18} /> },
      { name: "Reservas", page: "/employee/reservations", icon: <CalendarCheck size={18} /> },
      { name: "Mi Perfil", page: "/employee/profile", icon: <User size={18} /> },
    ],
    CLIENT: [
      { name: "Buscar Locales", page: "/client/catalog", icon: <Store size={18} /> },
      { name: "Mis Reservas", page: "/client/my-reservations", icon: <CalendarCheck size={18} /> },
      { name: "Mi Perfil", page: "/client/profile", icon: <User size={18} /> },
    ],
  };

  const menu = menuConfig[role] || [];

  const getRoleBadgeStyles = (r: string) => {
    switch (r) {
      case "ADMIN":
        return { backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" };
      case "EMPLOYEE":
        return { backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", border: "1px solid rgba(245, 158, 11, 0.2)" };
      default:
        return { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)" };
    }
  };

  return (
    <aside
      style={{
        backgroundColor: "#111111",
        borderRight: "1px solid rgba(255, 255, 255, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        width: isOpen ? "260px" : "0px",
        height: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <div>
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255, 255, 255, 0.03)", boxSizing: "border-box" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#2563eb", margin: 0, letterSpacing: "-0.5px" }}>
            Multi<span style={{ color: "#ffffff", fontWeight: 300, fontSize: "18px" }}>reserve</span>
          </h1>
          <div
            style={{
              marginTop: "12px",
              display: "inline-flex",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              ...getRoleBadgeStyles(user.role),
            }}
          >
            {user.role === "CLIENT" ? "Cliente Final" : user.role}
          </div>
        </div>

        <nav style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "4px", boxSizing: "border-box" }}>
          {menu.map((item) => {
            const active = currentPage === item.page;
            const isHovered = hoveredPath === item.page;

            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                onMouseEnter={() => setHoveredPath(item.page)}
                onMouseLeave={() => setHoveredPath(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 500,
                  transition: "all 0.2s ease",
                  boxSizing: "border-box",
                  backgroundColor: active ? "#2563eb" : isHovered ? "rgba(255, 255, 255, 0.03)" : "transparent",
                  color: active ? "#ffffff" : isHovered ? "#ffffff" : "#a1a1aa",
                  boxShadow: active ? "0 4px 14px rgba(37, 99, 235, 0.3)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: active ? "#ffffff" : isHovered ? "#2563eb" : "#a1a1aa",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </div>
                <span style={{ whiteSpace: "nowrap" }}>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.03)", padding: "12px", boxSizing: "border-box" }}>
        <button
          onClick={() => {
            logout();
          }}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 0.2s ease",
            boxSizing: "border-box",
            backgroundColor: logoutHover ? "rgba(239, 68, 68, 0.1)" : "transparent",
            color: logoutHover ? "#ef4444" : "#a1a1aa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <LogOut size={18} />
          </div>
          <span style={{ whiteSpace: "nowrap" }}>Cerrar sesión</span>
        </button>
        <p
          style={{
            textAlign: "center",
            fontSize: "10px",
            color: "#3f3f46",
            marginTop: "16px",
            marginBottom: "4px",
            fontFamily: "monospace",
            letterSpacing: "0.5px",
          }}
        >
          MultiReserve v1.0
        </p>
      </div>
    </aside>
  );
}
