import { useState, useEffect } from "react";
import api from "../../api/axios";

interface MonthlyData {
  month: string;  
  count: number;  
  heightPercentage: string; 
}

export function ReservationChart() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        setLoading(true);
        // Tipamos la respuesta de forma flexible para admitir tanto 'name' como 'month'
        const response = await api.get<{ name?: string; month?: string; count: number }[]>('/reports/monthly');
        
        if (response.data && response.data.length > 0) {
          const maxReservations = Math.max(...response.data.map(m => m.count), 1);

          const parsedData = response.data.map(item => {
            const percentage = (item.count / maxReservations) * 100;
            
            // 🚨 SOLUCIÓN: Buscamos el nombre del mes de forma segura sin importar cómo venga del DTO
            // Si item.name no existe, intentamos usar item.month, y si ninguno existe usamos "Mes"
            const rawMonthName = item.name || item.month || "Mes";
            
            return {
              // Cortamos de manera segura sabiendo que rawMonthName siempre será un string válido
              month: rawMonthName.substring(0, 3), 
              count: item.count,
              heightPercentage: `${Math.max(percentage, 8)}%` 
            };
          });

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
      <div className="flex items-center justify-center h-44 text-xs text-slate-500 animate-pulse">
        <span>Analizando métricas temporales...</span>
      </div>
    );
  }

  if (monthlyStats.length === 0) {
    return (
      <div className="flex items-center justify-center h-44 text-xs text-slate-500">
        <span>Sin registros de actividad mensual.</span>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between h-44 pt-6 px-2 bg-slate-950/40 rounded-xl border border-slate-800/50">
      {monthlyStats.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 group h-full justify-end">
          
          {/* Contenedor de la barra vertical interactiva */}
          <div 
            className="w-6 sm:w-8 relative rounded-t-md bg-gradient-to-t from-blue-600/80 to-blue-500 group-hover:from-blue-500 group-hover:to-cyan-400 transition-all duration-500 flex items-end justify-center shadow-lg shadow-blue-500/10"
            style={{ height: item.heightPercentage }}
          >
            {/* Tooltip interactivo */}
            <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-950 text-[10px] text-white font-bold px-1.5 py-0.5 rounded border border-slate-800 transition-all shadow-xl z-10 whitespace-nowrap">
              {item.count} {item.count === 1 ? 'reserva' : 'reservas'}
            </div>
          </div>
          
          {/* Nombre resumido del Mes */}
          <span className="text-[11px] text-slate-500 font-medium mt-3 mb-1 group-hover:text-slate-300 transition-colors">
            {item.month}
          </span>
        </div>
      ))}
    </div>
  );
}