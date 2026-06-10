import { useBusinesses } from "../../hooks/useBusinesses";
import { Plus, Edit2, Trash2, Store, MapPin, Layers, CalendarCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

export default function ManageBusinesses({ onNavigate }: { onNavigate: (page: string, id?: number) => void }) {
  const { businesses, loading, toggleBusinessStatus, deleteBusiness } = useBusinesses();
  
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  const safeBusinesses = useMemo(() => {
    if (!businesses) return [];
    if (Array.isArray(businesses)) return businesses;
    if (typeof businesses === 'object' && 'data' in businesses) return (businesses as any).data;
    return [];
  }, [businesses]);

  const formatCategory = (cat: string) => {
    if (!cat) return "🏢 Negocio";
    const upper = cat.toUpperCase();
    if (upper.includes("REST")) return "🌐 Resto";
    if (upper.includes("SPOR") || upper.includes("CAN")) return "🌐 Deporte";
    if (upper.includes("HOT")) return "🌐 Hotel";
    return `🌐 ${cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}`;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <Loader2 size={36} className="animate-spin" style={{ color: "#2563eb" }} />
        <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>Consultando base de datos de MultiReserve...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", boxSizing: "border-box" }}>
      
      {/* ─── ENCABEZADO Y BOTÓN DE ACCIÓN ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Store size={24} style={{ color: "#2563eb" }} />
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
              Gestión de Negocios
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>
            Administra y supervisa tus establecimientos, controla sus estados operativos y coberturas asignadas.
          </p>
        </div>

        <button
          onClick={() => onNavigate("/admin/create-business")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "10px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
          }}
        >
          <Plus size={18} />
          <span>Nuevo Negocio</span>
        </button>
      </div>

      {/* ─── BARRA DE BÚSQUEDA INTEGRAL ─── */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
        <span style={{ position: "absolute", left: "16px", fontSize: "14px" }}>🏢</span>
        <input
          type="text"
          disabled
          placeholder="Filtro integrado de establecimientos comerciales activos..."
          style={{
            width: "100%",
            backgroundColor: "rgba(23, 23, 23, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            padding: "14px 14px 14px 48px",
            color: "#71717a",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
            cursor: "not-allowed"
          }}
        />
      </div>

      {/* ─── GRILLA DE TARJETAS CORREGIDA ─── */}
      {safeBusinesses.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
          gap: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}>
          {safeBusinesses.map((biz: any) => (
            <div
              key={biz.id}
              style={{
                backgroundColor: "#131314",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.03)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxSizing: "border-box"
              }}
            >
              {/* FILA DE BADGES SUPERIORES */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "#a1a1aa", backgroundColor: "rgba(255, 255, 255, 0.06)", padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>
                  {formatCategory(biz.category)}
                </span>

                <span style={{ 
                  fontSize: "11px", 
                  fontWeight: 600, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  backgroundColor: biz.active ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)", 
                  color: biz.active ? "#10b981" : "#ef4444", 
                  padding: "4px 12px", 
                  borderRadius: "20px" 
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: biz.active ? "#10b981" : "#ef4444" }}></span>
                  {biz.active ? "Disponible" : "Inactivo"}
                </span>
              </div>

              {/* IMAGEN DEL ESTABLECIMIENTO */}
              <div style={{ width: "100%", height: "160px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#1c1c1e", border: "1px solid rgba(255, 255, 255, 0.02)" }}>
                {biz.imageUrl ? (
                  <img 
                    src={biz.imageUrl} 
                    alt={biz.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#52525b", fontSize: "12px", fontWeight: 600 }}>
                    SIN IMAGEN DE PORTADA
                  </div>
                )}
              </div>

              {/* CUERPO CENTRAL DE TEXTO */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                  {biz.name}
                </h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a1a1aa", fontSize: "13px" }}>
                  <MapPin size={13} style={{ color: "#52525b" }} />
                  <span>{biz.city || "Pasto"} • <span style={{ color: "#71717a" }}>{biz.address || "Dirección comercial"}</span></span>
                </div>
              </div>

              {/* CONTADORES MÉTRICOS EN LA BASE */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "4px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#71717a", display: "block", marginBottom: "2px" }}>Recursos</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                    <Layers size={14} style={{ color: "#3b82f6" }} />
                    <span>{biz.totalResources || 0} items</span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", color: "#71717a", display: "block", marginBottom: "2px" }}>Reservas</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 700, color: "#10b981", justifyContent: "flex-end" }}>
                    <CalendarCheck size={14} />
                    <span>{biz.totalReservations || 0}</span>
                  </div>
                </div>
              </div>

              {/* BOTONERA DE ACCIONES */}
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                
                <button
                  onClick={() => toggleBusinessStatus(biz.id, biz.active)}
                  title={biz.active ? "Ocultar Negocio" : "Mostrar Negocio"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    padding: "8px",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  {biz.active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                <button
                  onClick={() => onNavigate("/admin/edit-business", biz.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    flex: 2
                  }}
                >
                  <Edit2 size={14} />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => setConfirmDelete({ id: biz.id, name: biz.name })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#a1a1aa",
                    padding: "8px 12px",
                    cursor: "pointer"
                  }}
                >
                  <Trash2 size={14} />
                </button>

              </div>

            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#71717a", border: "1px dashed rgba(255, 255, 255, 0.08)", borderRadius: "16px" }}>
          No se encontraron establecimientos.
        </div>
      )}

      {/* MODAL DE ELIMINACIÓN */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div style={{ backgroundColor: "#131314", padding: "24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "360px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0", color: "#fff" }}>Confirmar eliminación</h2>
            <p style={{ fontSize: "14px", color: "#a1a1aa", margin: "0 0 24px 0" }}>
              ¿Estás seguro de que deseas eliminar el negocio <span style={{ color: "#fff", fontWeight: 600 }}>"{confirmDelete.name}"</span>?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)", color: "#fff", border: "none", cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => { deleteBusiness(confirmDelete.id); setConfirmDelete(null); }} style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}