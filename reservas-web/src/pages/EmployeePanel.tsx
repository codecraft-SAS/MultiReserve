import { useState } from "react";
import { useReservations } from "../hooks/useReservations"; 
import { 
  Check, 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  Layers, 
  Inbox
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { getStatusBadgeStyles, getStatusText } from "../utils/statusColor";

// Interfaz adaptada para evitar conflictos con propiedades opcionales del hook
interface SystemReservation {
  id: number;
  clientName?: string; 
  businessName?: string;
  resourceName: string;
  resourceType: string;
  date: string;
  startTime: string;
  endTime: string;
  status: any; // Usamos any temporalmente para flexibilizar la comparación visual de estados
  pricePaid?: number;
}

export default function EmployeePanel() {
  // ✅ CORRECCIÓN: Extraemos 'updateReservationStatus' que es el nombre real en tu hook
  const { reservations, loading, updateReservationStatus } = useReservations();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 text-blue-500 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <span className="text-sm text-slate-400 font-medium">Cargando panel de gestión...</span>
      </div>
    );
  }

  const filteredReservations = reservations.filter((res: SystemReservation) => {
    if (filterStatus === "ALL") return true;
    return res.status === filterStatus;
  });

  // ✅ CORRECCIÓN: Sintaxis '=>' arreglada y mapeo de estados correcto para el backend ("CONFIRMED" / "CANCELLED")
  const handleAction = async (id: number, status: "CONFIRMED" | "CANCELLED") => {
    try {
      await updateReservationStatus(id, status);
      toast.success(status === "CONFIRMED" ? "Reserva aprobada con éxito" : "Reserva rechazada");
    } catch (error) {
      toast.error("Error al actualizar el estado de la reserva");
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Panel de Control <span className="text-xs font-bold uppercase px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md tracking-widest">Colaborador</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Gestiona, aprueba o rechaza las solicitudes de reserva asignadas a tu establecimiento en tiempo real.
          </p>
        </div>

        {/* Filtros de Estado */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-center">
          {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === status
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {status === "ALL" ? "Todas" : status === "PENDING" ? "Pendientes" : status === "CONFIRMED" ? "Aprobadas" : "Rechazadas"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Reservas */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800/80 rounded-2xl max-w-xl mx-auto p-8 flex flex-col items-center gap-3 shadow-xl">
          <Inbox size={44} className="text-slate-600" />
          <p className="text-lg font-bold text-slate-300">No hay registros</p>
          <p className="text-sm text-slate-500 max-w-sm">
            No se encontraron solicitudes de reserva que coincidan con el estado seleccionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReservations.map((res: SystemReservation) => (
            <div
              key={res.id}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl p-6 flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300"
            >
              {/* Top info */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    <User size={14} className="text-slate-500" />
                    <span>{res.clientName || "Cliente Registrado"}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-medium">Reserva ID: #{res.id}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(res.status)}`}>
                  {getStatusText(res.status)}
                </span>
              </div>

              {/* Detalles */}
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

              {/* Acciones o Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 mt-1">
                <div className="text-xs text-slate-400 font-medium">
                  Monto: <span className="text-white font-bold">{formatCurrency(res.pricePaid || 0)}</span>
                </div>

                {res.status === "PENDING" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(res.id, "CANCELLED")}
                      className="p-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 rounded-xl transition-all"
                      title="Rechazar solicitud"
                    >
                      <X size={14} />
                    </button>
                    <button
                      onClick={() => handleAction(res.id, "CONFIRMED")}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/10 transition-all"
                    >
                      <Check size={14} />
                      <span>Aprobar</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    {/* ✅ CORRECCIÓN: Renderizado condicional basado en los tipos CONFIRMED del backend */}
                    {res.status === "CONFIRMED" ? (
                      <>
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span>Aceptada</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={12} className="text-rose-500" />
                        <span>Cancelada</span>
                      </>
                    )}
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