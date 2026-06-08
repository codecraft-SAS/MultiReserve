import { useState, useEffect } from "react";
import api from "../../api/axios";

interface CategoryData {
  name: string;
  count: number;
  percentage: string;
  color: string;
}

export function BusinessChart() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setLoading(true);
        // Consumimos el endpoint de Spring Boot: retorna un Array de tuplas [String, Long]
        const response = await api.get<[string, number][]>('/reports/categories');
        
        if (response.data && response.data.length > 0) {
          // 1. Encontrar el valor máximo para que la barra más alta use el 100% y las demás sean proporcionales
          const maxCount = Math.max(...response.data.map(item => item[1]), 1);

          // Paleta de colores Premium fija para asignar cíclicamente
          const colors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500"];

          // 2. Mapear y parsear los datos reales
          const parsedData = response.data.map((item, index) => {
            const rawCategory = item[0] || "Otros";
            const count = item[1];
            
            // Calculamos el porcentaje dinámico real
            const percentage = `${Math.round((count / maxCount) * 100)}%`;

            // Traducimos o formateamos el nombre estético de la categoría
            let formattedName = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1).toLowerCase();
            if (rawCategory.toUpperCase() === "DEPORTE") formattedName = "🏀 Canchas Sintéticas / Deporte";
            if (rawCategory.toUpperCase() === "RESTAURANTE") formattedName = "🍔 Restaurantes / Mesas";

            return {
              name: formattedName,
              count,
              percentage,
              color: colors[index % colors.length] // Asigna un color diferente por cada iteración
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
      <div className="flex flex-col gap-2 py-6 items-center justify-center text-xs text-slate-500 animate-pulse">
        <span>Calculando desgloses comerciales...</span>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-xs text-slate-500 text-center py-6">
        No hay establecimientos registrados en el sistema.
      </p>
    );
  }

  return (
    <div className="space-y-4 pt-2">
      {categories.map((cat, index) => (
        <div key={index} className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">{cat.name}</span>
            <span className="text-slate-400">
              {cat.count} {cat.count === 1 ? 'establecimiento' : 'establecimientos'}
            </span>
          </div>
          {/* Contenedor de la barra proporcional en tiempo real */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full ${cat.color} rounded-full transition-all duration-500`} 
              style={{ width: cat.percentage }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}