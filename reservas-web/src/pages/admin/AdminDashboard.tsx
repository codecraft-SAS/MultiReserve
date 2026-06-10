import { useState, useEffect } from "react";
import { BusinessChart } from "../../components/dashboard/BusinessChart";
import { ReservationChart } from "../../components/dashboard/ReservationChart";
import { toast } from "react-hot-toast";
import { http } from "../../api/http"; 
import { formatCurrency } from "../../utils/formatCurrency"; 

import {
  Store,
  Layers,
  CalendarCheck,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
  Briefcase, // ◄ 1. IMPORTAMOS EL ICONO PARA LOS EMPLEADOS
} from "lucide-react";

// Sincronizado perfectamente con DashboardResponse.java
interface DashboardStats {
  totalBusinesses: number;
  totalResources: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number; 
  totalClients: number;          
  totalEmployees: number; // ◄ 2. AGREGAMOS EL CAMPO A LA INTERFAZ DE TYPESCRIPT
  monthlyRevenue: number;        
}

function LocalKPICard({ 
  title, 
  value, 
  icon, 
  glowColor,
  isCurrency = false
}: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  glowColor: string; 
  isCurrency?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(23, 23, 23, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.7)",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box"
      }}
    >
      <div 
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "60px",
          height: "60px",
          backgroundColor: glowColor,
          filter: "blur(35px)",
          opacity: 0.35,
          pointerEvents: "none"
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa", letterSpacing: "0.2px" }}>
          {title}
        </span>
        <div style={{ color: glowColor, display: "flex", alignItems: "center" }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>
        {isCurrency ? formatCurrency(value) : value}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await http<DashboardStats>('/reports/stats');
        setStats(response);
      } catch (error) {
        toast.error("Error al sincronizar las métricas en tiempo real");
        console.error("Dashboard stats error:", error);
        
        setStats({
          totalBusinesses: 0,
          totalResources: 0,
          totalReservations: 0,
          pendingReservations: 0,
          confirmedReservations: 0,
          completedReservations: 0,
          totalClients: 0,
          totalEmployees: 0, // Fallback por seguridad
          monthlyRevenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading || !stats) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
        <div 
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid rgba(37, 99, 235, 0.1)",
            borderTopColor: "#2563eb",
            animation: "spin 0.8s linear infinite"
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-1px" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0, fontWeight: 400 }}>
          Resumen operativo global y control analítico de la plataforma MultiReserve.
        </p>
      </div>

      {/* Grid fluido auto-ajustable de alto rendimiento para soportar las 9 tarjetas */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // ◄ Optimización responsiva nativa
          gap: "20px",
          width: "100%"
        }}
      >
        <LocalKPICard title="Negocios" value={stats.totalBusinesses} icon={<Store size={18} />} glowColor="#2563eb" />
        <LocalKPICard title="Recursos" value={stats.totalResources} icon={<Layers size={18} />} glowColor="#8b5cf6" />
        <LocalKPICard title="Total Clientes" value={stats.totalClients} icon={<Users size={18} />} glowColor="#ec4899" />
        
        {/* 🚨 3. NUEVA TARJETA: RENDERIZADO DE EMPLEADOS REGISTRADOS */}
        <LocalKPICard title="Personal / Socios" value={stats.totalEmployees} icon={<Briefcase size={18} />} glowColor="#fb923c" />
        
        <LocalKPICard title="Ingresos del Mes" value={stats.monthlyRevenue} icon={<DollarSign size={18} />} glowColor="#10b981" isCurrency={true} />
        <LocalKPICard title="Total Reservas" value={stats.totalReservations} icon={<CalendarCheck size={18} />} glowColor="#6366f1" />
        <LocalKPICard title="Pendientes" value={stats.pendingReservations} icon={<Clock size={18} />} glowColor="#f59e0b" />
        <LocalKPICard title="Confirmadas" value={stats.confirmedReservations} icon={<CheckCircle size={18} />} glowColor="#06b6d4" />
        <LocalKPICard title="Completadas" value={stats.completedReservations} icon={<CheckCircle size={18} />} glowColor="#10b981" />
      </div>

      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
          gap: "24px",
          width: "100%"
        }}
      >
        <div style={{ backgroundColor: "rgba(23, 23, 23, 0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.03)", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)", boxSizing: "border-box" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 20px 0", letterSpacing: "-0.3px" }}>
            Negocios por Categoría
          </h3>
          <div style={{ width: "100%", position: "relative" }}>
            <BusinessChart />
          </div>
        </div>

        <div style={{ backgroundColor: "rgba(23, 23, 23, 0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255, 255, 255, 0.03)", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.8)", boxSizing: "border-box" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: "0 0 20px 0", letterSpacing: "-0.3px" }}>
            Flujo Mensual de Reservas
          </h3>
          <div style={{ width: "100%", position: "relative" }}>
            <ReservationChart />
          </div>
        </div>
      </div>
    </div>
  );
}