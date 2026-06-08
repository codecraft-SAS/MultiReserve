import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Guard de seguridad veloz
  if (!user) {
    return (
      <div 
        style={{ 
          height: "100vh", 
          width: "100vw",
          backgroundColor: "#09090b", 
          color: "#ffffff", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          fontFamily: "sans-serif"
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: 500, color: "#a1a1aa" }}>
          No has iniciado sesión. Redirigiendo...
        </p>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        display: "flex", 
        height: "100vh", 
        width: "100vw", 
        backgroundColor: "#09090b", // zinc-950 base de la plataforma
        color: "#f4f4f5",           // zinc-100 para textos
        fontFamily: "sans-serif", 
        overflow: "hidden",
        userSelect: "none",
        boxSizing: "border-box"
      }}
    >
      {/* Inyección de scroll minimalista premium para mantener consistencia con el dashboard de la derecha */}
      <style>{`
        .dashboard-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .dashboard-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
        }
        .dashboard-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 9999px;
        }
        .dashboard-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>

      {/* 1. Componente Modular del Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Contenedor Derecho Completo */}
      <div 
        style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          height: "100%", 
          overflow: "hidden",
          minWidth: 0, // Evita que tablas anchas a la derecha rompan el layout
          position: "relative"
        }}
      >
        
        {/* 2. Componente Modular del Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* 3. Panel de Contenido Principal Dinámico */}
        <main 
          className="dashboard-scrollbar"
          style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: window.innerWidth < 768 ? "24px 16px" : "32px", 
            boxSizing: "border-box",
            backgroundColor: "#09090b",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* Contenedor interno que limita el ancho de tablas, usuarios y reportes para un look limpio */}
          <div 
            style={{ 
              flex: 1,
              maxWidth: "1280px", 
              width: "100%", 
              marginLeft: "auto", 
              marginRight: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}