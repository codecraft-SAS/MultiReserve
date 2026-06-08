import { useReservations } from "../hooks/useReservations";
import { Calendar, Clock, MapPin, Layers, AlertCircle, CalendarX } from "lucide-react";
import { formatDate } from "../utils/formatDate"; 
import { formatCurrency } from "../utils/formatCurrency";
import { getStatusBadgeStyles, getStatusText, type ReservationStatus } from "../utils/statusColor";

// ✅ TIPADO CORREGIDO: Coincide exactamente con las propiedades del hook useReservations
interface Reservation {
  id: number;
  businessName?: string; 
  resourceName: string;
  resourceType: string;
  city?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  pricePaid?: number; // ✅ Cambiado a opcional para solucionar el error 2345
}

export default function ClientReservations() {
  const { reservations, loading } = useReservations();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 text-blue-500 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <span className="text-sm text-slate-400 font-medium">Cargando tus reservas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Mis Reservas
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Monitorea el estado de tus solicitudes de reserva, horarios y detalles de asistencia.
        </p>
      </div>

      {(!reservations || reservations.length === 0) ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800/80 rounded-2xl max-w-xl mx-auto p-8 flex flex-col items-center gap-3 shadow-xl">
          <CalendarX size={44} className="text-slate-600" />
          <p className="text-lg font-bold text-slate-300">Aún no tienes reservas</p>
          <p className="text-sm text-slate-500 max-w-sm">
            Explora nuestro catálogo de establecimientos y agenda tu primer recurso en pocos clics.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res: Reservation) => (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl shadow-slate-950/20 p-6 flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {res.businessName || "Establecimiento"}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin size={12} className="text-slate-500" />
                    <span>{res.city || "Nariño"}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(res.status)}`}>
                  {getStatusText(res.status)}
                </span>
              </div>

              <div className="bg-slate-950/50 border border-slate-800/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Layers size={16} className="text-blue-500" />
                  <span>{res.resourceName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                    {res.resourceType === "COURT" ? "Cancha" : res.resourceType === "TABLE" ? "Mesa" : "Salón"}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-3 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-500" />
                    <span>{formatDate(res.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-slate-500" />
                    <span>{res.startTime} - {res.endTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-medium">
                <div className="text-slate-400">
                  {/* ✅ PROTECCIÓN: Si el valor es undefined, pasamos 0 al formateador */}
                  Valor total: <span className="text-white font-bold">{formatCurrency(res.pricePaid || 0)}</span>
                </div>

                {res.status === "PENDING" && (
                  <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
                    <AlertCircle size={12} />
                    <span>Espera confirmación</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}