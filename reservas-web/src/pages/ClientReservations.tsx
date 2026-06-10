import { useReservations } from "../hooks/useReservations";
import { useEffect, useState, useCallback } from "react";
import { Calendar, Clock, MapPin, Layers, AlertCircle, CalendarX, Trash2, XCircle, RefreshCw } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import type { Reservation } from "../types/Reservation";
import { getStatusText } from "../utils/statusColor";
import { statusBadges } from "../utils/colors";
import toast from "react-hot-toast";

export default function ClientReservations() {
  const { reservations, loading, cancelExistingReservation, refresh } = useReservations();

  // Refetch al recibir foco (el empleado pudo haber cambiado el estado en otra pestaña)
  const handleFocus = useCallback(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [handleFocus]);

  // 🛠️ Estados para el modal de advertencia de cancelación
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<number | null>(null);

  // 🛠️ Estados para el nuevo modal de eliminación definitiva
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);

  // 🛠️ LÓGICA PARA ABRIR EL MODAL DE CANCELACIÓN
  const handleCancelClick = (id: number) => {
    setReservationToCancel(id);
    setIsCancelModalOpen(true);
  };

  // LÓGICA QUE EJECUTA LA CANCELACIÓN REAL EN EL BACKEND
  const confirmCancelation = async () => {
    if (!reservationToCancel) return;

    try {
      const success = await cancelExistingReservation(reservationToCancel);
      if (success) {
        toast.success("Reserva marcada como cancelada");
      } else {
        toast.error("No se pudo cancelar la reserva. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      toast.error("Ocurrió un error inesperado al procesar la cancelación.");
    } finally {
      setIsCancelModalOpen(false);
      setReservationToCancel(null);
    }
  };

  // 🛠️ ABRIR EL MODAL DE ELIMINACIÓN
  const handleDeleteClick = (id: number) => {
    setReservationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 🛠️ EJECUTAR EL BORRADO REAL EN LA BD
  const confirmDeleteComplete = async () => {
    if (!reservationToDelete) return;

    try {
      const response = await fetch(`/api/reservations/${reservationToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        toast.success("Reserva eliminada permanentemente del sistema");
        window.location.reload();
      } else {
        toast.error("No se pudo eliminar la reserva de la base de datos.");
      }
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      toast.error("Ocurrió un error al intentar eliminar el registro.");
    } finally {
      setIsDeleteModalOpen(false);
      setReservationToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 gap-4 bg-[#09090b] min-h-screen" style={{ backgroundColor: '#09090b', minHeight: '100vh' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-800 border-t-blue-500"></div>
        <span className="text-xs text-zinc-400 font-medium tracking-wide">Cargando tus reservas...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 min-h-screen text-white font-sans" style={{ backgroundColor: '#09090b', color: '#ffffff' }}>

      {/* ─── ENCABEZADO ─── */}
      <div className="space-y-2 border-b border-zinc-800/60 pb-6 mb-8" style={{ borderBottom: '1px solid #27272a' }}>
        <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800" style={{ backgroundColor: '#18181b', padding: '8px', borderRadius: '12px', border: '1px solid #27272a' }}>
            <Calendar className="text-blue-500" size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
            <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Mis Reservas
            </h1>
            <button onClick={refresh} title="Actualizar" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(37, 99, 235, 0.1)", border: "1px solid rgba(37, 99, 235, 0.25)", borderRadius: "8px", padding: "6px 16px", color: "#3b82f6", fontSize: "13px", fontWeight: 600, cursor: "pointer", marginLeft: "24px" }}>
              <RefreshCw size={13} />
              Actualizar
            </button>
          </div>

        </div>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-3xl leading-relaxed" style={{ color: '#a1a1aa', marginTop: '8px' }}>
          Administra y supervisa tus solicitudes de reserva, controla sus estados operativos y coberturas asignadas.
        </p>
      </div>

      {/* ─── ESTADO VACÍO O MAPEO ─── */}
      {(!reservations || reservations.length === 0) ? (
        <div className="text-center py-20 bg-[#121214] border border-zinc-800/40 rounded-2xl max-w-md mx-auto p-8 flex flex-col items-center gap-4 shadow-2xl"
          style={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '16px', padding: '32px', textAlign: 'center', maxWidth: '28rem', margin: '0 auto' }}>
          <div className="p-4 bg-zinc-900/50 rounded-full border border-zinc-800/80 mb-2">
            <CalendarX size={32} className="text-zinc-500" style={{ color: '#71717a' }} />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-zinc-200">Aún no tienes reservas</p>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed" style={{ color: '#71717a' }}>
              Explora nuestro catálogo de establecimientos y agenda tu primer recurso en pocos clics.
            </p>
          </div>
        </div>
      ) : (

        /* ─── GRILLA DE TARJETAS ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>

          {reservations.map((res: Reservation) => {
            const isCancelable = res.status !== "CANCELLED" && res.status !== "REJECTED" && res.status !== "COMPLETED";
            const isInactive = res.status === "CANCELLED" || res.status === "REJECTED";

            const basePrice = (res as any).resourceType === "TABLE" ? 70000 : 60000;
            let calculatedCost = basePrice;

            if (res.startTime && res.endTime) {
              const startHour = parseInt(res.startTime.split(":")[0], 10);
              const endHour = parseInt(res.endTime.split(":")[0], 10);
              const totalHours = endHour - startHour;
              if (totalHours > 0) {
                calculatedCost = basePrice * totalHours;
              }
            }

            return (
              <div
                key={res.id}
                className={`bg-[#121214] border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between gap-5 relative overflow-hidden transition-all duration-300 shadow-xl ${isInactive ? "opacity-60 grayscale-[10%]" : ""
                  }`}
                style={{
                  backgroundColor: '#121214',
                  border: '1px solid #27272a',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                }}
              >
                {/* Bloque Superior */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1"
                      style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '2px 10px', borderRadius: '9999px', fontSize: '11px', color: '#d4d4d8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                      Colombia
                    </span>

                    <span style={statusBadges[res.status] || statusBadges.PENDING}>
                      {getStatusText(res.status)}
                    </span>
                  </div>

                  {/* NOMBRE DEL ESTABLECIMIENTO */}
                  <div className="space-y-1 pt-1" style={{ marginTop: '12px' }}>
                    <h2 className="text-base font-bold text-zinc-100 tracking-tight line-clamp-1" style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f4f4f5' }}>
                      {res.businessName || ((res as any).resourceType === "TABLE" ? "Restaurante / Bar" : "Centro Deportivo")}
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-zinc-500" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#71717a', marginTop: '4px' }}>
                      <MapPin size={12} />
                      <span>Colombia</span>
                    </div>
                  </div>
                </div>

                {/* Bloque Central */}
                <div className="bg-[#09090b] border border-zinc-800/50 rounded-xl p-4 space-y-3"
                  style={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', padding: '16px', marginTop: '12px' }}>
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-zinc-200" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={14} className="text-blue-500" style={{ color: '#3b82f6' }} />
                      <span style={{ fontWeight: 600 }}>{res.resourceName}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800/80 text-zinc-400 font-medium tracking-wider uppercase"
                      style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#a1a1aa' }}>
                      Escenario
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-900/80 grid grid-cols-2 gap-3 text-[11px] text-zinc-400 font-medium"
                    style={{ borderTop: '1px solid #1c1c1f', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a1a1aa' }}>
                    <div className="flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={13} className="text-zinc-500" />
                      <span>{formatDate(res.reservationDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} className="text-zinc-500" />
                      <span className="tabular-nums">{res.startTime?.slice(0, 5)} - {res.endTime?.slice(0, 5)}</span>
                    </div>
                  </div>
                </div>

                {/* Bloque Inferior */}
                <div className="space-y-4 pt-1" style={{ marginTop: '12px' }}>
                  <div className="flex justify-between items-center text-xs font-semibold" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="flex flex-col" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold" style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase' }}>Costo Total</span>
                      <span className="text-sm font-extrabold text-white mt-0.5" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                        {formatCurrency(res.amount || calculatedCost)}
                      </span>
                    </div>

                    {res.status === "PENDING" && (
                      <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 font-bold text-[10px] uppercase tracking-wider"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}>
                        <AlertCircle size={12} />
                        <span>Por confirmar</span>
                      </div>
                    )}
                  </div>

                  {/* ─── BOTONES DE ACCIÓN ─── */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>

                    {/* Botón 1: Cancelar Reserva (Solo activo si es cancelable) */}
                    {isCancelable ? (
                      <button
                        onClick={() => handleCancelClick(res.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          backgroundColor: '#1c1917',
                          border: '1px solid #78350f',
                          color: '#f59e0b',
                          padding: '8px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        <XCircle size={13} />
                        <span>Cancelar Reserva</span>
                      </button>
                    ) : (
                      <div style={{ width: '100%', textAlign: 'center', padding: '6px', backgroundColor: 'rgba(24, 24, 27, 0.3)', border: '1px solid #27272a', borderRadius: '10px', color: '#52525b', fontSize: '11px' }}>
                        Historial Archivado ({getStatusText(res.status)})
                      </div>
                    )}

                    {/* Botón 2: Eliminar Registro */}
                    <button
                      onClick={() => handleDeleteClick(res.id)} // 🛠️ Cambiado aquí para disparar el nuevo modal
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        backgroundColor: '#1c1c1f',
                        border: '1px solid #27272a',
                        color: '#ef4444',
                        padding: '8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Eliminar del Historial</span>
                    </button>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ─── PASO 4: MODAL FLOTANTE INTERACTIVO DE CANCELACIÓN ─── */}
      {isCancelModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000
        }}>
          <div style={{
            backgroundColor: "#0c0c0e", border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px",
            boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.15)"
          }}>
            {/* Encabezado del Modal */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "14px" }}>
              <div style={{
                padding: "16px", backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: "9999px",
                border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444"
              }}>
                <XCircle size={36} />
              </div>
              <h3 style={{ margin: 0, color: "#ffffff", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                ¿Confirmas la cancelación?
              </h3>
            </div>

            {/* Cuerpo de Alerta */}
            <div style={{
              backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.15)",
              borderRadius: "12px", padding: "16px", display: "flex", gap: "12px"
            }}>
              <AlertCircle size={20} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b" }}>Política de Pérdida de Depósito</span>
                <p style={{ margin: 0, fontSize: "12px", color: "#d4d4d8", lineHeight: "1.5" }}>
                  Al cancelar esta solicitud, <strong>perderás el valor abonado previamente</strong> como garantía de reserva del escenario. Esta acción cambiará el estado a cancelado y liberará el cupo inmediatamente.
                </p>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: "13px", color: "#a1a1aa", textAlign: "center", lineHeight: "1.5" }}>
              ¿Estás completamente seguro de proceder? Esta operación no se puede deshacer de forma automática.
            </p>

            {/* Acciones del Modal */}
            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setReservationToCancel(null);
                }}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "#18181b",
                  color: "#e4e4e7", border: "1px solid #27272a", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Volver Atrás
              </button>
              <button
                onClick={confirmCancelation}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "#ef4444",
                  color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)", transition: "all 0.2s"
                }}
              >
                Sí, Cancelar Reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL FLOTANTE DE ELIMINACIÓN DEFINITIVA (CRÍTICO) ─── */}
      {isDeleteModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000
        }}>
          <div style={{
            backgroundColor: "#0c0c0e", border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", gap: "24px",
            boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)"
          }}>
            {/* Encabezado Peligro */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "14px" }}>
              <div style={{
                padding: "16px", backgroundColor: "rgba(239, 68, 68, 0.15)", borderRadius: "9999px",
                border: "1px solid #ef4444", color: "#ef4444"
              }}>
                <Trash2 size={36} />
              </div>
              <h3 style={{ margin: 0, color: "#ffffff", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
                ¿Eliminar del historial?
              </h3>
            </div>

            {/* Advertencia Destructiva */}
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.03)", border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px", padding: "16px", display: "flex", gap: "12px"
            }}>
              <AlertCircle size={20} style={{ color: "#ef4444", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444" }}>Acción irreversible</span>
                <p style={{ margin: 0, fontSize: "12px", color: "#a1a1aa", lineHeight: "1.5" }}>
                  Esta acción <strong>borrará permanentemente</strong> el registro de la base de datos. Perderás la visibilidad de esta tarjeta y no aparecerá nunca más en tus auditorías ni paneles de control.
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setReservationToDelete(null);
                }}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "#18181b",
                  color: "#e4e4e7", border: "1px solid #27272a", fontSize: "13px", fontWeight: 600, cursor: "pointer"
                }}
              >
                Conservar Registro
              </button>
              <button
                onClick={confirmDeleteComplete}
                style={{
                  flex: 1, padding: "12px", borderRadius: "10px", backgroundColor: "#ef4444",
                  color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(239, 68, 68, 0.4)"
                }}
              >
                Sí, Eliminar de la BD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}