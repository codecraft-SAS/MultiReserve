import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Guardarraíl directo: Si no hay usuario activo, redirigir inmediatamente
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div 
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        backgroundColor: "#09090b", // zinc-950 puro
        color: "#f4f4f5",           // zinc-100
        overflow: "hidden",
        userSelect: "none",
        fontFamily: "sans-serif",
        boxSizing: "border-box"
      }}
    >
      {/* Inyección de estilos de scroll directos en el DOM para la consistencia visual */}
      <style>{`
        .view-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .view-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
        }
        .view-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 9999px;
        }
        .view-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
      
      {/* Sidebar - Mantiene su estado y se acopla al flujo */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Contenedor Secundario (Header + Área de Contenido) */}
      <div 
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#09090b"
        }}
      >
        
        {/* Header - Barra superior unificada con transparencias */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Área Principal de Scroll para las Vistas (Dashboard, Catálogo, etc.) */}
        <main 
          className="view-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            width: "100%",
            backgroundColor: "#09090b",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div 
            style={{
              flex: 1,
              maxWidth: "1280px", // max-w-7xl
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
              padding: window.innerWidth < 768 ? "24px 16px" : "32px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "24px" // space-y-6 alternativo
            }}
          >
            
            {/* Aquí se inyectan dinámicamente las páginas del panel */}
            <Outlet />
            
          </div>
        </main>
        
      </div>
    </div>
  );
}