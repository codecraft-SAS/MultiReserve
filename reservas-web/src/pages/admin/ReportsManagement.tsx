import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  BarChart3,
  DollarSign,
  Layers,
  Users,
  Percent,
  Download,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase // ◄ Añadimos un icono semántico para los empleados
} from "lucide-react";

// Mapeado exactamente igual a tu clase DashboardResponse.java (Actualizado)
interface DashboardResponse {
  totalBusinesses: number;
  totalResources: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  totalClients: number;
  totalEmployees: number; // ◄ Añadido para el mapeo del conteo de empleados
  monthlyRevenue: number | null;
}

// COINCIDE EXACTAMENTE con el campo 'reservations' de tu MonthlyReservationsResponse.java
interface MonthlyReservations {
  month: string;
  reservations: number;
}

export default function ReportsManagement() {
  // Calculamos el mes actual (1 a 12) para que sea el filtro por defecto al cargar
  const currentMonthNumber = (new Date().getMonth() + 1).toString();

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [chartData, setChartData] = useState<MonthlyReservations[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(currentMonthNumber); 

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Apuntamos a las rutas unificadas en /reports
      const [responseMetrics, responseChart] = await Promise.all([
        api.get<DashboardResponse>(`/reports/stats?month=${period}`), 
        api.get<MonthlyReservations[]>("/reports/monthly")             
      ]);

      setData(responseMetrics.data);
      setChartData(responseChart.data);
    } catch (err: any) {
      console.error("Error al cargar métricas reales del dashboard:", err);
      toast.error("No se pudieron sincronizar las estadísticas del servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const handleExportPDF = () => {
    toast.success(`Exportando métricas del periodo seleccionado a PDF...`);
  };

  if (loading || !data) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 🧮 CÁLCULOS EN TIEMPO REAL
  const finalRevenue = data.monthlyRevenue || 0;

  const occupationRate = data.totalReservations > 0
    ? Math.round((data.completedReservations / data.totalReservations) * 100)
    : 0;

  const maxReservations = chartData.length > 0 ? Math.max(...chartData.map(m => m.reservations)) : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%", boxSizing: "border-box" }}>

      {/* ─── ENCABEZADO Y FILTROS ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BarChart3 size={24} style={{ color: "#2563eb" }} />
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
              Informes y Estadísticas
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>
            Métricas reales consolidadas de los negocios, recursos y estados de flujo transaccional en la plataforma.
          </p>
        </div>

        {/* CONTENEDOR DE CONTROLES */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Calendar size={15} style={{ position: "absolute", left: "12px", color: "#a1a1aa", zIndex: 1 }} />

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                backgroundColor: "#141414",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "8px",
                padding: "10px 16px 10px 36px",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
                appearance: "none"
              }}
            >
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>

          <button
            onClick={handleExportPDF}
            style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#ffffff", border: "none", borderRadius: "8px", padding: "10px 16px", color: "#000000", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e4e4e7")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            <Download size={15} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* ─── GRID DE MÉTRICAS REALES (ACTUALIZADO A 5 TARJETAS) ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", width: "100%" }}>

        {/* KPI 1: Ingresos Mensuales */}
        <div style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#71717a", fontWeight: 500 }}>Ingresos del Mes</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399" }}><DollarSign size={16} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>${finalRevenue.toLocaleString("es-CO")}</span>
            <span style={{ fontSize: "11px", color: "#34d399", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={12} /> Facturación <span style={{ color: "#71717a", fontWeight: 400 }}>en tiempo real</span>
            </span>
          </div>
        </div>

        {/* KPI 2: Reservas Solicitadas */}
        <div style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#71717a", fontWeight: 500 }}>Reservas Totales</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}><Layers size={16} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>{data.totalReservations.toLocaleString()}</span>
            <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: 600 }}>
              Historial global <span style={{ color: "#71717a", fontWeight: 400 }}>de transacciones</span>
            </span>
          </div>
        </div>

        {/* KPI 3: Clientes Activos */}
        <div style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#71717a", fontWeight: 500 }}>Clientes Registrados</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc" }}><Users size={16} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>{data.totalClients.toLocaleString()}</span>
            <span style={{ fontSize: "11px", color: "#c084fc", fontWeight: 600 }}>
              Usuarios únicos <span style={{ color: "#71717a", fontWeight: 400 }}>en la app</span>
            </span>
          </div>
        </div>

        {/* 🚨 NUEVO KPI 4: Empleados Registrados */}
        <div style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#71717a", fontWeight: 500 }}>Personal / Socios</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fb923c" }}><Briefcase size={16} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>{(data.totalEmployees || 0).toLocaleString()}</span>
            <span style={{ fontSize: "11px", color: "#fb923c", fontWeight: 600 }}>
              Colaboradores <span style={{ color: "#71717a", fontWeight: 400 }}>de establecimientos</span>
            </span>
          </div>
        </div>

        {/* KPI 5: Tasa de Ocupación */}
        <div style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: "#71717a", fontWeight: 500 }}>Eficiencia de Cierre</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fbbf24" }}><Percent size={16} /></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>{occupationRate}%</span>
            <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 600 }}>
              Tasa de ocupación <span style={{ color: "#71717a", fontWeight: 400 }}>operativa</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── SECCIÓN INTERMEDIA: GRÁFICO DINÁMICO DE BARRAS ─── */}
      <div style={{ backgroundColor: "rgba(18, 18, 18, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px", width: "100%", boxSizing: "border-box" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>Volumen de Reservas por Mes</h3>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "180px", width: "100%", padding: "0 10px", gap: "12px", boxSizing: "border-box" }}>
          {chartData.map((item, idx) => {
            const heightPercentage = Math.max(((item.reservations / maxReservations) * 100), 8);
            return (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: 1, height: "100%", justifyContent: "flex-end" }}>
                <span style={{ color: "#2563eb", fontSize: "12px", fontWeight: 700 }}>{item.reservations}</span>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "40px",
                    height: `${heightPercentage}%`,
                    backgroundColor: "rgba(37, 99, 235, 0.8)",
                    borderRadius: "6px 6px 0 0",
                    transition: "all 0.3s ease-in-out"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(37, 99, 235, 0.8)"}
                />
                <span style={{ color: "#71717a", fontSize: "12px", fontWeight: 500 }}>{item.month}</span>
              </div>
            );
          })}
          {chartData.length === 0 && (
            <div style={{ color: "#71717a", fontSize: "14px", width: "100%", textAlign: "center", paddingBottom: "40px" }}>
              No hay registros mensuales disponibles.
            </div>
          )}
        </div>
      </div>

      {/* ─── SECCIÓN INFERIOR: ESTADOS DEL FLUJO INTERNO Y ACTIVOS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", width: "100%" }}>

        {/* PANEL IZQUIERDO: Desglose de Estados de Reserva */}
        <div style={{ backgroundColor: "rgba(18, 18, 18, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>Distribución y Flujo de Reservas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} style={{ color: "#34d399" }} />
                  <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "14px" }}>Confirmadas</span>
                </div>
                <span style={{ color: "#34d399", fontWeight: 700 }}>{data.confirmedReservations}</span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "#1f1f23", borderRadius: "9999px" }}>
                <div style={{ width: `${data.totalReservations > 0 ? (data.confirmedReservations / data.totalReservations) * 100 : 0}%`, height: "100%", backgroundColor: "#34d399", borderRadius: "9999px" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={16} style={{ color: "#fbbf24" }} />
                  <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "14px" }}>Pendientes de Aprobación</span>
                </div>
                <span style={{ color: "#fbbf24", fontWeight: 700 }}>{data.pendingReservations}</span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "#1f1f23", borderRadius: "9999px" }}>
                <div style={{ width: `${data.totalReservations > 0 ? (data.pendingReservations / data.totalReservations) * 100 : 0}%`, height: "100%", backgroundColor: "#fbbf24", borderRadius: "9999px" }} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <BarChart3 size={16} style={{ color: "#2563eb" }} />
                  <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "14px" }}>Ejecutadas / Completadas</span>
                </div>
                <span style={{ color: "#2563eb", fontWeight: 700 }}>{data.completedReservations}</span>
              </div>
              <div style={{ width: "100%", height: "6px", backgroundColor: "#1f1f23", borderRadius: "9999px" }}>
                <div style={{ width: `${data.totalReservations > 0 ? (data.completedReservations / data.totalReservations) * 100 : 0}%`, height: "100%", backgroundColor: "#2563eb", borderRadius: "9999px" }} />
              </div>
            </div>

          </div>
        </div>

        {/* PANEL DERECHO: Infraestructura de la Plataforma */}
        <div style={{ backgroundColor: "rgba(18, 18, 18, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>Infraestructura de Activos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.02)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ color: "#e4e4e7", fontWeight: 600, fontSize: "14px" }}>Establecimientos Socios</span>
                <span style={{ color: "#71717a", fontSize: "12px" }}>Comercios y negocios integrados</span>
              </div>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px" }}>{data.totalBusinesses}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.02)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ color: "#e4e4e7", fontWeight: 600, fontSize: "14px" }}>Recursos Disponibles</span>
                <span style={{ color: "#71717a", fontSize: "12px" }}>Canchas, mesas o auditorios creados</span>
              </div>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "16px" }}>{data.totalResources}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(37, 99, 235, 0.05)", border: "1px solid rgba(37, 99, 235, 0.1)", padding: "12px", borderRadius: "8px", marginTop: "4px" }}>
              <AlertCircle size={14} style={{ color: "#2563eb", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: "11px", color: "#a1a1aa" }}>
                Cada establecimiento tiene en promedio {data.totalBusinesses > 0 ? (data.totalResources / data.totalBusinesses).toFixed(1) : 0} recursos asignados en el sistema actual.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}