import { useState, useEffect } from "react";
import api from "../api/axios"; 
import toast from "react-hot-toast";
import { 
  CalendarCheck, 
  Search, 
  Check, 
  X, 
  Eye, 
  Clock, 
  User,
  Mail,
  Building,
  Layers,
  Calendar,
  ShieldCheck
} from "lucide-react";

// Sincronizado exactamente con las propiedades de ReservationResponse.java
interface Reservation {
  id: number;
  customerName: string | null;
  userName: string | null;
  resourceType: string | null; // e.g., SPORTS_FIELD, RESTAURANT_TABLE
  resourceName: string;
  businessId: number;
  businessName: string | null;
  reservationDate: string; // YYYY-MM-DD
  startTime: string;       // HH:mm:ss o HH:mm
  endTime: string;         // HH:mm:ss o HH:mm
  amount: number | null;   // Mapeado desde Double de Java
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  userId: number | null;
  userEmail: string | null;
  createdAt: string | null; // Instant de Java (ISO String)
  updatedAt: string | null; // Instant de Java (ISO String)
}

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de interacción
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [actionHover, setActionHover] = useState<{row: number, btn: string} | null>(null);
  
  // Estado para controlar el Modal del Ojo
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Carga inicial sincronizada con la API
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get<Reservation[]>("/reservations");
      setReservations(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error("Error al cargar reservas:", err);
      toast.error("No se pudieron sincronizar las reservas del servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Actualización de estado persistente y segura
  const updateStatus = async (id: number, newStatus: "CONFIRMED" | "CANCELLED") => {
    const actionText = newStatus === "CONFIRMED" ? "confirmar" : "cancelar";
    if (!window.confirm(`¿Estás seguro de que deseas ${actionText} esta reserva?`)) {
      return;
    }

    try {
      await api.patch(`/reservations/${id}/status`, null, {
        params: { value: newStatus }
      });
      
      // Actualización reactiva e inmediata de la UI local
      setReservations(prev => 
        prev.map(res => res.id === id ? { ...res, status: newStatus } : res)
      );

      // Si el modal está abierto viendo esta misma reserva, actualizamos su estado también
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation(prev => prev ? { ...prev, status: newStatus } : null);
      }

      toast.success(`Reserva ${newStatus === "CONFIRMED" ? "confirmada" : "cancelada"} con éxito`);
    } catch (err: any) {
      console.error("Error al actualizar estado en el servidor:", err);
      const backendMessage = err.response?.data?.message || "No se pudo actualizar la reserva";
      toast.error(backendMessage);
    }
  };

  // Filtrado reactivo multivariable
  const filteredReservations = reservations.filter(r => {
    const client = (r.customerName || r.userName || "").toLowerCase();
    const resource = (r.resourceName || "").toLowerCase();
    const business = (r.businessName || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return client.includes(term) || resource.includes(term) || business.includes(term);
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return { text: "Confirmada", color: "#34d399", bg: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.15)" };
      case "PENDING":
        return { text: "Pendiente", color: "#fbbf24", bg: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.15)" };
      default:
        return { text: "Cancelada", color: "#f87171", bg: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.15)" };
    }
  };

  // Helper para limpiar formatos de horas (HH:mm)
  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "--:--";
    return timeStr.substring(0, 5);
  };

  // Helper para convertir los Instant de auditoría de Java a algo legible local
  const formatInstant = (instantStr: string | null) => {
    if (!instantStr) return "No disponible";
    try {
      const date = new Date(instantStr);
      return date.toLocaleString("es-CO", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    } catch {
      return instantStr;
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%", boxSizing: "border-box", position: "relative" }}>
      
      {/* ─── ENCABEZADO ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CalendarCheck size={24} style={{ color: "#2563eb" }} />
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
            Gestión de Reservas
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>
          Monitorea las solicitudes de cupos de tus clientes, aprueba transacciones pendientes y gestiona el calendario general.
        </p>
      </div>

      {/* ─── BARRA DE BÚSQUEDA ─── */}
      <div style={{ backgroundColor: "rgba(23, 23, 23, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", boxSizing: "border-box" }}>
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", color: "#71717a" }} />
          <input
            type="text"
            placeholder="Buscar por cliente, recurso o establecimiento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "8px", padding: "12px 12px 12px 42px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* ─── TABLA DE RESERVAS ─── */}
      <div style={{ backgroundColor: "rgba(23, 23, 23, 0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)", boxSizing: "border-box", width: "100%" }}>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "#141414", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600 }}>Cliente</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600 }}>Recurso / Negocio</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600 }}>Horario</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600, textAlign: "right" }}>Total</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600, textAlign: "center" }}>Estado</th>
                <th style={{ padding: "16px 20px", color: "#a1a1aa", fontWeight: 600, textAlign: "center" }}>Acciones rápidas</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => {
                  const isRowFocused = focusedRow === res.id;
                  const statusStyles = getStatusConfig(res.status);
                  const hasPrice = res.amount !== null && res.amount > 0;
                  const finalClientName = res.customerName || res.userName || "Cliente Registrado";

                  return (
                    <tr 
                      key={res.id}
                      onMouseEnter={() => setFocusedRow(res.id)}
                      onMouseLeave={() => setFocusedRow(null)}
                      style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.03)", backgroundColor: isRowFocused ? "rgba(255, 255, 255, 0.015)" : "transparent", transition: "background-color 0.15s ease" }}
                    >
                      {/* Cliente */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#27272a", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}>
                            <User size={14} />
                          </div>
                          <span style={{ color: "#ffffff", fontWeight: 600 }}>{finalClientName}</span>
                        </div>
                      </td>

                      {/* Recurso / Negocio */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ color: "#e4e4e7", fontWeight: 500 }}>{res.resourceName || "Recurso"}</span>
                          <span style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}>{res.businessName || "Establecimiento"}</span>
                        </div>
                      </td>

                      {/* Horario */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e4e4e7" }}>
                          <Clock size={14} style={{ color: "#2563eb" }} />
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>{`${formatTime(res.startTime)} - ${formatTime(res.endTime)}`}</span>
                            <span style={{ fontSize: "11px", color: "#71717a", marginTop: "1px" }}>{res.reservationDate}</span>
                          </div>
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "16px 20px", textAlign: "right", fontWeight: 700, color: hasPrice ? "#34d399" : "#a1a1aa" }}>
                        {hasPrice ? `$${res.amount!.toLocaleString()}` : "Gratis"}
                      </td>

                      {/* Estado */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.3px", backgroundColor: statusStyles.bg, color: statusStyles.color, border: statusStyles.border, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: statusStyles.color }} />
                          {statusStyles.text}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                          {res.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => updateStatus(res.id, "CONFIRMED")}
                                onMouseEnter={() => setActionHover({ row: res.id, btn: "approve" })}
                                onMouseLeave={() => setActionHover(null)}
                                style={{ background: "none", border: "1px solid rgba(16, 185, 129, 0.2)", cursor: "pointer", padding: "6px", borderRadius: "6px", backgroundColor: actionHover?.row === res.id && actionHover?.btn === "approve" ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.04)", color: "#34d399", transition: "all 0.15s" }}
                                title="Confirmar Reserva"
                              >
                                <Check size={14} />
                              </button>

                              <button
                                onClick={() => updateStatus(res.id, "CANCELLED")}
                                onMouseEnter={() => setActionHover({ row: res.id, btn: "reject" })}
                                onMouseLeave={() => setActionHover(null)}
                                style={{ background: "none", border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer", padding: "6px", borderRadius: "6px", backgroundColor: actionHover?.row === res.id && actionHover?.btn === "reject" ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.04)", color: "#f87171", transition: "all 0.15s" }}
                                title="Cancelar Reserva"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setSelectedReservation(res)} // Abre el modal de auditoría
                            onMouseEnter={() => setActionHover({ row: res.id, btn: "view" })}
                            onMouseLeave={() => setActionHover(null)}
                            style={{ background: "none", border: "1px solid rgba(255,255,255,0.03)", cursor: "pointer", padding: "6px", borderRadius: "6px", backgroundColor: actionHover?.row === res.id && actionHover?.btn === "view" ? "rgba(255,255,255,0.05)" : "#1c1c1e", color: "#a1a1aa", transition: "all 0.15s" }}
                            title="Ver detalles completos de auditoría"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#71717a" }}>
                    No se encontraron registros de reservas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL PREMIUM DE DETALLES DE AUDITORÍA (EYE COMPONENT) ─── */}
      {selectedReservation && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px", boxSizing: "border-box" }}>
          <div style={{ backgroundColor: "#141414", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", width: "100%", maxWidth: "550px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            
            {/* Header del Modal */}
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1a1a1a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={20} style={{ color: "#2563eb" }} />
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>
                  Auditoría de Reserva #{selectedReservation.id}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedReservation(null)}
                style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer", padding: "4px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#a1a1aa")}
              >
                <X size={18} />
              </button>
            </div>

            {/* Cuerpo del Modal */}
           <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", maxHeight: "65vh" }}>
              
              {/* Sección Cliente */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717a", letterSpacing: "0.5px", textTransform: "uppercase" }}>Información del Solicitante</span>
                <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#ffffff" }}>
                    <User size={14} style={{ color: "#a1a1aa" }} />
                    <span style={{ fontWeight: 600 }}>{selectedReservation.customerName || selectedReservation.userName || "No registrado"}</span>
                    <span style={{ fontSize: "12px", color: "#71717a" }}>(ID Usuario: {selectedReservation.userId || "N/A"})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#a1a1aa" }}>
                    <Mail size={14} style={{ color: "#71717a" }} />
                    <span>{selectedReservation.userEmail || "Sin correo electrónico asignado"}</span>
                  </div>
                </div>
              </div>

              {/* Sección Establecimiento y Recurso */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717a", letterSpacing: "0.5px", textTransform: "uppercase" }}>Destino del Cupo</span>
                <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#a1a1aa" }}>
                      <Building size={12} /> <span>Establecimiento</span>
                    </div>
                    <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "14px" }}>{selectedReservation.businessName}</span>
                    <span style={{ fontSize: "11px", color: "#71717a" }}>ID Negocio: {selectedReservation.businessId}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#a1a1aa" }}>
                      <Layers size={12} /> <span>Recurso / Tipo</span>
                    </div>
                    <span style={{ color: "#ffffff", fontWeight: 600, fontSize: "14px" }}>{selectedReservation.resourceName}</span>
                    <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: 500 }}>{selectedReservation.resourceType || "GENERAL"}</span>
                  </div>
                </div>
              </div>

              {/* Tiempos y Estado */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717a", letterSpacing: "0.5px", textTransform: "uppercase" }}>Fecha y Horario</span>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "#e4e4e7" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={13} style={{ color: "#71717a" }} />
                      <span>{selectedReservation.reservationDate}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={13} style={{ color: "#71717a" }} />
                      <span>{`${formatTime(selectedReservation.startTime)} a ${formatTime(selectedReservation.endTime)}`}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717a", letterSpacing: "0.5px", textTransform: "uppercase" }}>Estado Transaccional</span>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", boxSizing: "border-box" }}>
                    <span style={{ padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, textAlign: "center", backgroundColor: getStatusConfig(selectedReservation.status).bg, color: getStatusConfig(selectedReservation.status).color, border: getStatusConfig(selectedReservation.status).border }}>
                      {getStatusConfig(selectedReservation.status).text.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fechas de Sistema (Auditoría Técnica) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717a", letterSpacing: "0.5px", textTransform: "uppercase" }}>Registro de Auditoría Técnica</span>
                <div style={{ borderTop: "1px dashed rgba(255,255,255,0.08)", paddingTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", color: "#71717a" }}>
                  <div>Creación: <span style={{ color: "#a1a1aa" }}>{formatInstant(selectedReservation.createdAt)}</span></div>
                  <div>Última Modif: <span style={{ color: "#a1a1aa" }}>{formatInstant(selectedReservation.updatedAt)}</span></div>
                </div>
              </div>

            </div>

            {/* Footer / Botones del Modal */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", gap: "10px", justifyContent: "flex-end", backgroundColor: "#1a1a1a" }}>
              {selectedReservation.status === "PENDING" && (
                <>
                  <button
                    onClick={() => updateStatus(selectedReservation.id, "CANCELLED")}
                    style={{ backgroundColor: "transparent", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Rechazar Solicitud
                  </button>
                  <button
                    onClick={() => updateStatus(selectedReservation.id, "CONFIRMED")}
                    style={{ backgroundColor: "#2563eb", border: "none", color: "#ffffff", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
                  >
                    Aprobar Reserva
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedReservation(null)}
                style={{ backgroundColor: "#27272a", border: "none", color: "#ffffff", padding: "8px 14px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3f3f46")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}