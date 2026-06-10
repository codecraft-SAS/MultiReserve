import { useState, useEffect } from "react";
import { http } from "../../api/http";

interface CategoryData {
  name: string;
  count: number;
  percent: number;
  color: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  RESTAURANT: "🍔 Restaurantes / Mesas",
  RESTAURANTE: "🍔 Restaurantes / Mesas",
  SPORT: "⚽ Canchas Sintéticas / Deporte",
  DEPORTE: "⚽ Canchas Sintéticas / Deporte",
  HOTEL: "🏨 Hotel / Alojamiento",
  EVENT: "🎉 Eventos",
  COWORKING: "💻 Coworking",
};

const BAR_COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

export function BusinessChart() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setLoading(true);
        const response = await http<[string, number][]>('/reports/categories');

        if (response && response.length > 0) {
          const maxCount = Math.max(...response.map(item => item[1]), 1);
          const parsedData = response.map((item, index) => {
            const raw = item[0] || "OTROS";
            const label = CATEGORY_LABELS[raw.toUpperCase()] || raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
            return {
              name: label,
              count: item[1],
              percent: Math.round((item[1] / maxCount) * 100),
              color: BAR_COLORS[index % BAR_COLORS.length],
            };
          });
          setCategories(parsedData);
        }
      } catch (error) {
        console.error("Error fetching business category stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "24px 0", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#71717a" }}>
        <span>Calculando desgloses comerciales...</span>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p style={{ fontSize: "12px", color: "#71717a", textAlign: "center", padding: "24px 0" }}>
        No hay establecimientos registrados en el sistema.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "8px" }}>
      {categories.map((cat, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 600 }}>
            <span style={{ color: "#e4e4e7" }}>{cat.name}</span>
            <span style={{ color: "#a1a1aa" }}>
              {cat.count} {cat.count === 1 ? "establecimiento" : "establecimientos"}
            </span>
          </div>
          <div style={{ width: "100%", height: "10px", backgroundColor: "#09090b", borderRadius: "9999px", overflow: "hidden", border: "1px solid #27272a" }}>
            <div style={{ height: "100%", borderRadius: "9999px", backgroundColor: cat.color, width: `${cat.percent}%`, transition: "width 0.5s" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
