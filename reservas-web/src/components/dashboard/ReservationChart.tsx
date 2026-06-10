import { useState, useEffect } from "react";
import { http } from "../../api/http";

interface MonthlyData {
  month: string;
  count: number;
  heightPercent: number;
}

export function ReservationChart() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        const response = await http<{ month: string; reservations: number }[]>('/reports/monthly');

        if (response && response.length > 0) {
          const maxReservations = Math.max(...response.map(m => m.reservations), 1);
          const parsedData = response.map(item => ({
            month: item.month ? item.month.substring(0, 3) : "---",
            count: item.reservations,
            heightPercent: Math.max((item.reservations / maxReservations) * 100, 8),
          }));
          setMonthlyStats(parsedData);
        }
      } catch (error) {
        console.error("Error al cargar el flujo mensual de reservas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthlyData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "176px", fontSize: "12px", color: "#71717a" }}>
        <span>Analizando métricas temporales...</span>
      </div>
    );
  }

  if (monthlyStats.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "176px", fontSize: "12px", color: "#71717a" }}>
        <span>Sin registros de actividad mensual.</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "176px", padding: "24px 8px 0", backgroundColor: "rgba(9, 9, 11, 0.4)", borderRadius: "12px", border: "1px solid rgba(39, 39, 42, 0.5)", boxSizing: "border-box" }}>
      {monthlyStats.map((item, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, height: "100%", justifyContent: "flex-end", position: "relative" }}>
          <div
            style={{
              width: "28px",
              borderRadius: "6px 6px 0 0",
              background: "linear-gradient(to top, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.6))",
              height: `${item.heightPercent}%`,
              minHeight: "8px",
              position: "relative",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <div style={{ position: "absolute", top: "-28px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#09090b", color: "#ffffff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", border: "1px solid #27272a", whiteSpace: "nowrap", opacity: 0, transition: "opacity 0.2s", pointerEvents: "none" }}
              className="chart-tooltip">
              {item.count} {item.count === 1 ? 'reserva' : 'reservas'}
            </div>
          </div>
          <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 500, marginTop: "12px", marginBottom: "4px" }}>
            {item.month}
          </span>
          <style>{`
            .chart-tooltip { opacity: 0; }
            div:hover > .chart-tooltip { opacity: 1; }
          `}</style>
        </div>
      ))}
    </div>
  );
}
