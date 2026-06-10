import { useState } from "react";
import { useReservations } from "../hooks/useReservations";
import type { Reservation } from "../types/Reservation";
import {
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  User,
  Layers,
  Inbox,
  Store,
  RefreshCw,
  ListTodo,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { colors, layout, statusBadges, loadingSpinner, emptyState } from "../utils/colors";

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Aprobada",
  CANCELLED: "Cancelada",
  REJECTED: "Rechazada",
  COMPLETED: "Completada",
};

export default function EmployeePanel() {
  const { reservations, loading, updateReservationStatus, refresh } = useReservations();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  if (loading) {
    return (
      <div style={{ ...loadingSpinner.container, flexDirection: "column", gap: "12px" }}>
        <div style={loadingSpinner.spinner} />
        <span style={{ fontSize: "13px", color: colors.textMuted, fontWeight: 500 }}>Cargando panel de gestión...</span>
      </div>
    );
  }

  const counts = {
    total: reservations.length,
    PENDING: reservations.filter((r: Reservation) => r.status === "PENDING").length,
    CONFIRMED: reservations.filter((r: Reservation) => r.status === "CONFIRMED").length,
    COMPLETED: reservations.filter((r: Reservation) => r.status === "COMPLETED").length,
    CANCELLED: reservations.filter((r: Reservation) => r.status === "CANCELLED" || r.status === "REJECTED").length,
  };

  const filteredReservations = reservations.filter((res: Reservation) => {
    if (filterStatus === "ALL") return true;
    return res.status === filterStatus;
  });

  const handleAction = async (id: number, status: "CONFIRMED" | "CANCELLED") => {
    try {
      await updateReservationStatus(id, status);
      toast.success(status === "CONFIRMED" ? "Reserva aprobada con éxito" : "Reserva rechazada");
    } catch (error) {
      toast.error("Error al actualizar el estado de la reserva");
    }
  };

  const kpiCard = (label: string, value: number, color: string, icon: React.ReactNode) => (
    <div style={{
      backgroundColor: colors.bgCard,
      border: `1px solid ${colors.border}`,
      borderRadius: "12px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "14px",
    }}>
      <div style={{ color, display: "flex", alignItems: "center" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "22px", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: "12px", color: colors.textMuted, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div style={{ ...layout.page, gap: "28px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div style={layout.header}>
          <div style={layout.headerRow}>
            <h1 style={{ ...layout.title, fontSize: "32px" }}>
              Panel de Control
            </h1>
            <span style={{
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "4px 10px", borderRadius: "6px",
              backgroundColor: "rgba(59, 130, 246, 0.1)", color: colors.info, border: "1px solid rgba(59, 130, 246, 0.2)"
            }}>
              Colaborador
            </span>
          </div>
          <p style={layout.description}>
            Gestiona, aprueba o rechaza las solicitudes de reserva asignadas a tu establecimiento en tiempo real.
          </p>
        </div>

        <button onClick={refresh} title="Actualizar" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(37, 99, 235, 0.1)", border: "1px solid rgba(37, 99, 235, 0.25)", borderRadius: "8px", padding: "6px 14px", color: "#3b82f6", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          <RefreshCw size={13} />
          Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
        {kpiCard("Pendientes", counts.PENDING, colors.warningLight, <Clock size={18} />)}
        {kpiCard("Aprobadas", counts.CONFIRMED, colors.successLight, <CheckCircle2 size={18} />)}
        {kpiCard("Completadas", counts.COMPLETED, colors.info, <ListTodo size={18} />)}
        {kpiCard("Canceladas", counts.CANCELLED, colors.dangerLight, <XCircle size={18} />)}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { key: "ALL", label: "Todas" },
          { key: "PENDING", label: "Pendientes" },
          { key: "CONFIRMED", label: "Aprobadas" },
          { key: "CANCELLED", label: "Canceladas" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 700,
              border: filterStatus === tab.key ? "none" : `1px solid ${colors.border}`,
              cursor: "pointer", transition: "all 0.2s",
              backgroundColor: filterStatus === tab.key ? colors.primary : "transparent",
              color: filterStatus === tab.key ? colors.textPrimary : colors.textMuted,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredReservations.length === 0 ? (
        <div style={{ ...emptyState.container, backgroundColor: "transparent", border: `1px solid ${colors.border}`, borderRadius: "16px", maxWidth: "480px", margin: "0 auto" }}>
          <Inbox size={44} style={emptyState.icon} />
          <p style={emptyState.title}>No hay registros</p>
          <p style={emptyState.message}>
            No se encontraron solicitudes de reserva que coincidan con el estado seleccionado.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "24px" }}>
          {filteredReservations.map((res: Reservation) => {
            const badge = statusBadges[res.status];
            return (
              <div
                key={res.id}
                style={{
                  backgroundColor: colors.glass,
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <User size={14} style={{ color: colors.textDim }} />
                      <span style={{ fontSize: "14px", fontWeight: 700, color: colors.textPrimary }}>
                        {res.customerName || "Cliente Registrado"}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: colors.textDimmer, fontWeight: 500 }}>Reserva ID: #{res.id}</span>
                  </div>
                  <span style={badge}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: badge.color }} />
                    {statusLabels[res.status] || res.status}
                  </span>
                </div>

                {/* Details */}
                <div style={{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  border: `1px solid ${colors.borderSubtle}`,
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Layers size={16} style={{ color: colors.primaryLight, flexShrink: 0 }} />
                    <span style={{ fontSize: "14px", fontWeight: 500, color: colors.textSecondary }}>{res.resourceName}</span>
                  </div>

                  {res.businessName && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Store size={14} style={{ color: colors.textDim, flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: colors.textMuted }}>{res.businessName}</span>
                    </div>
                  )}

                  <div style={{ borderTop: `1px solid ${colors.divider}`, paddingTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px", color: colors.textMuted }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={14} style={{ color: colors.textDim }} />
                      <span>{formatDate(res.reservationDate)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={14} style={{ color: colors.textDim }} />
                      <span>{res.startTime} - {res.endTime}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${colors.divider}`, paddingTop: "12px" }}>
                  <div style={{ fontSize: "13px", color: colors.textMuted }}>
                    Monto: <span style={{ color: colors.textPrimary, fontWeight: 700 }}>{formatCurrency(res.amount || 0)}</span>
                  </div>

                  {res.status === "PENDING" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => handleAction(res.id, "CANCELLED")}
                        title="Rechazar solicitud"
                        style={{
                          padding: "8px", borderRadius: "10px", border: `1px solid ${colors.border}`,
                          backgroundColor: colors.bgApp, color: colors.textMuted, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => handleAction(res.id, "CONFIRMED")}
                        style={{
                          display: "flex", alignItems: "center", gap: "6px",
                          padding: "8px 12px", borderRadius: "10px", border: "none",
                          backgroundColor: colors.primary, color: colors.textPrimary, cursor: "pointer",
                          fontSize: "12px", fontWeight: 700,
                        }}
                      >
                        <Check size={14} />
                        <span>Aprobar</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: colors.textDim }}>
                      {res.status === "CONFIRMED" || res.status === "COMPLETED" ? (
                        <>
                          <CheckCircle2 size={12} style={{ color: colors.successLight }} />
                          <span style={{ color: colors.successLight }}>Aceptada</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} style={{ color: colors.danger }} />
                          <span style={{ color: colors.danger }}>Cancelada</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
