import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { 
  Layers, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Edit3, 
  Trash2, 
  UserCheck, 
  Building2, 
  CheckCircle2, 
  XCircle,
  Clock,
  Save,
  X
} from "lucide-react";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";

// Modelo de datos real acoplado a las respuestas de Spring Boot 3
interface Resource {
  id: number;
  name: string;
  type: "COURT" | "ROOM" | "CABIN" | "TABLE";
  businessId: number;
  businessName: string;
  capacity: number;
  pricePerHour: number;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
  imageUrl?: string;
  openingHour?: string;
  closingHour?: string;
  description?: string;
}

export default function ResourceManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados de datos de la API
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados interactivos de control local
  const [searchTerm, setSearchTerm] = useState("");
  const [createHover, setCreateHover] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [hoveredAction, setHoveredAction] = useState<{ cardId: number, btn: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);

  // Estados para el Modal de Edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [updating, setUpdating] = useState(false);

  // 1. Cargar recursos reales del Backend al montar el componente
  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await api.get<Resource[]>("/resources");
      setResources(response.data);
    } catch (err: any) {
      toast.error("Error al conectar con el servidor de recursos");
      console.error("Backend fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 2. Eliminar Recurso de forma reactiva
  const handleDelete = (id: number, name: string) => {
    setConfirmDelete({ id, name });
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/resources/${confirmDelete.id}`);
      toast.success("Recurso eliminado correctamente");
      setResources((prev) => prev.filter((r) => r.id !== confirmDelete.id));
    } catch (err: any) {
      const msg = err.response?.data?.message || "No se pudo eliminar el recurso";
      toast.error(msg);
    } finally {
      setConfirmDelete(null);
    }
  };

  // 3. Abrir Modal de Edición cargando datos previos
  const openEditModal = (resource: Resource) => {
    setEditingResource({ ...resource });
    setIsEditModalOpen(true);
  };

  // 4. Enviar actualización al Backend (PUT)
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    setUpdating(true);
    try {
      const payload = {
        name: editingResource.name,
        type: editingResource.type,
        pricePerHour: Number(editingResource.pricePerHour),
        imageUrl: editingResource.imageUrl || "",
        description: editingResource.description || "",
        capacity: Number(editingResource.capacity),
        status: editingResource.status,
        openingHour: editingResource.openingHour || "06:00",
        closingHour: editingResource.closingHour || "22:00",
        businessId: editingResource.businessId
      };

      const response = await api.put<Resource>(`/resources/${editingResource.id}`, payload);
      toast.success("Recurso actualizado con éxito");
      
      // Actualizar el estado local ordenadamente
      setResources((prev) => prev.map((r) => (r.id === editingResource.id ? response.data : r)));
      setIsEditModalOpen(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al actualizar el recurso";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  // Filtrado reactivo en tiempo real
  const filteredResources = resources.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mapeador estético para los Enums reales del Backend
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { text: "Disponible", color: "#34d399", bg: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.15)", icon: <CheckCircle2 size={12} /> };
      case "MAINTENANCE":
        return { text: "Mantenimiento", color: "#fbbf24", bg: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.15)", icon: <SlidersHorizontal size={12} /> };
      default: // INACTIVE
        return { text: "Inactivo", color: "#f87171", bg: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.15)", icon: <XCircle size={12} /> };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "COURT": return "⚽ Cancha";
      case "ROOM": return "🏢 Sala / Salón";
      case "CABIN": return "🏡 Cabaña";
      case "TABLE": return "🍽️ Mesa";
      default: return "📦 Recurso";
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
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%", boxSizing: "border-box" }}>
      
      {/* ─── ENCABEZADO PRINCIPAL ─── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Layers size={24} style={{ color: "#2563eb" }} />
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", margin: 0, letterSpacing: "-0.5px" }}>
              Gestión de Recursos
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0 }}>
            Configura los inventarios de MultiReserve, asigna tarifas por hora y administra la disponibilidad técnica.
          </p>
        </div>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin/create-resource")}
            onMouseEnter={() => setCreateHover(true)}
            onMouseLeave={() => setCreateHover(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "10px",
              backgroundColor: createHover ? "#1d4ed8" : "#2563eb",
              color: "#ffffff",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: createHover ? "0 8px 24px rgba(37, 99, 235, 0.4)" : "0 4px 12px rgba(37, 99, 235, 0.2)"
            }}
          >
            <Plus size={18} />
            <span>Nuevo Recurso</span>
          </button>
        )}
      </div>

      {/* ─── BARRA DE BÚSQUEDA ─── */}
      <div style={{ backgroundColor: "rgba(23, 23, 23, 0.4)", border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px", alignItems: "center", boxSizing: "border-box" }}>
        <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", color: "#71717a" }} />
          <input
            type="text"
            placeholder="Buscar por recurso o nombre del establecimiento socio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "8px", padding: "12px 12px 12px 42px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* ─── GRILLA DE TARJETAS MODULARES ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", width: "100%", boxSizing: "border-box" }}>
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => {
            const isCardHovered = hoveredCardId === resource.id;
            const statusConfig = getStatusStyles(resource.status);

            return (
              <div
                key={resource.id}
                onMouseEnter={() => setHoveredCardId(resource.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                style={{
                  backgroundColor: "rgba(23, 23, 23, 0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: isCardHovered ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(255, 255, 255, 0.04)",
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isCardHovered ? "translateY(-4px)" : "none",
                  boxShadow: isCardHovered ? "0 12px 30px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.3)",
                  boxSizing: "border-box"
                }}
              >
                {/* Cabecera Tarjeta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", backgroundColor: "#1e1e1f", color: "#a1a1aa", padding: "4px 8px", borderRadius: "6px", fontWeight: 500 }}>
                    {getTypeLabel(resource.type)}
                  </span>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700, backgroundColor: statusConfig.bg, color: statusConfig.color, border: statusConfig.border }}>
                    {statusConfig.icon}
                    <span>{statusConfig.text}</span>
                  </div>
                </div>

                {/* Renderizado opcional de imagen guardada en base de datos */}
                {resource.imageUrl && (
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.name}
                    style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "10px", backgroundColor: "#111" }}
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                )}

                {/* Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.3px" }}>
                    {resource.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#71717a", marginTop: "4px" }}>
                    <Building2 size={14} />
                    <span style={{ fontSize: "12px" }}>{resource.businessName}</span>
                  </div>
                  {resource.openingHour && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a1a1aa", fontSize: "11px", marginTop: "2px" }}>
                      <Clock size={12} style={{ color: "#3b82f6" }} />
                      <span>{resource.openingHour} - {resource.closingHour}</span>
                    </div>
                  )}
                </div>

                {/* Métricas */}
                <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#141414", padding: "12px", borderRadius: "10px", boxSizing: "border-box" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "11px", color: "#71717a" }}>Capacidad</span>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                      <UserCheck size={14} style={{ color: "#3b82f6" }} />
                      {resource.capacity} paxs
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "11px", color: "#71717a" }}>Precio / Hora</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#34d399", marginTop: "2px" }}>
                      {resource.pricePerHour > 0 ? `$${resource.pricePerHour.toLocaleString()}` : "Gratuito"}
                    </span>
                  </div>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.03)", width: "100%" }} />

                {/* Acciones Reales */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                  <button
                    onClick={() => openEditModal(resource)}
                    onMouseEnter={() => setHoveredAction({ cardId: resource.id, btn: "edit" })}
                    onMouseLeave={() => setHoveredAction(null)}
                    style={{ backgroundColor: hoveredAction?.cardId === resource.id && hoveredAction?.btn === "edit" ? "rgba(37, 99, 235, 0.15)" : "#1a1a1a", border: "1px solid rgba(255,255,255,0.02)", padding: "8px 12px", borderRadius: "8px", color: hoveredAction?.cardId === resource.id && hoveredAction?.btn === "edit" ? "#3b82f6" : "#e4e4e7", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
                  >
                    <Edit3 size={14} />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => handleDelete(resource.id, resource.name)}
                    onMouseEnter={() => setHoveredAction({ cardId: resource.id, btn: "delete" })}
                    onMouseLeave={() => setHoveredAction(null)}
                    style={{ backgroundColor: hoveredAction?.cardId === resource.id && hoveredAction?.btn === "delete" ? "rgba(239, 68, 68, 0.15)" : "#1a1a1a", border: "1px solid rgba(255,255,255,0.02)", padding: "8px 12px", borderRadius: "8px", color: hoveredAction?.cardId === resource.id && hoveredAction?.btn === "delete" ? "#ef4444" : "#a1a1aa", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }}
                  >
                    <Trash2 size={14} />
                    <span>Eliminar</span>
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", padding: "40px", backgroundColor: "rgba(23, 23, 23, 0.4)", borderRadius: "12px", textAlign: "center", color: "#71717a" }}>
            No se encontraron recursos registrados en la base de datos.
          </div>
        )}
      </div>

      {/* ─── MODAL DE EDICIÓN ─── */}
      {isEditModalOpen && editingResource && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
          <div style={{ backgroundColor: "#141414", border: "1px solid #27272a", borderRadius: "16px", width: "100%", maxWidth: "550px", padding: "24px", boxSizing: "border-box", color: "#e4e4e7", maxHeight: "90vh", overflowY: "auto" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #27272a", paddingBottom: "12px" }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", color: "#ffffff" }}>
                <Edit3 size={20} style={{ color: "#3b82f6" }} /> Editar Recurso
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ backgroundColor: "transparent", border: "none", color: "#71717a", cursor: "pointer", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>Nombre del Recurso</label>
                <input type="text" required style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", boxSizing: "border-box", outline: "none" }} value={editingResource.name} onChange={(e) => setEditingResource({ ...editingResource, name: e.target.value })} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>Categoría / Tipo</label>
                  <select style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", cursor: "pointer", outline: "none", colorScheme: "dark", boxSizing: "border-box" }} value={editingResource.type} onChange={(e) => setEditingResource({ ...editingResource, type: e.target.value as any })}>
                    <option value="COURT">Cancha</option>
                    <option value="ROOM">Sala / Salón</option>
                    <option value="CABIN">Cabaña</option>
                    <option value="TABLE">Mesa</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>Estado Operativo</label>
                  <select style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", cursor: "pointer", outline: "none", colorScheme: "dark", boxSizing: "border-box" }} value={editingResource.status} onChange={(e) => setEditingResource({ ...editingResource, status: e.target.value as any })}>
                    <option value="ACTIVE">Disponible</option>
                    <option value="MAINTENANCE">Mantenimiento</option>
                    <option value="INACTIVE">Inactivo</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>Precio por Hora ($)</label>
                  <input type="number" required min="0" style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", boxSizing: "border-box", outline: "none" }} value={editingResource.pricePerHour} onChange={(e) => setEditingResource({ ...editingResource, pricePerHour: Number(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>Capacidad Máxima</label>
                  <input type="number" required min="1" style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", boxSizing: "border-box", outline: "none" }} value={editingResource.capacity} onChange={(e) => setEditingResource({ ...editingResource, capacity: Number(e.target.value) || 1 })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>Hora Apertura</label>
                  <input type="time" style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", boxSizing: "border-box", outline: "none", colorScheme: "dark" }} value={editingResource.openingHour || "06:00"} onChange={(e) => setEditingResource({ ...editingResource, openingHour: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>Hora Cierre</label>
                  <input type="time" style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", boxSizing: "border-box", outline: "none", colorScheme: "dark" }} value={editingResource.closingHour || "22:00"} onChange={(e) => setEditingResource({ ...editingResource, closingHour: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", color: "#a1a1aa", fontWeight: 600 }}>URL de la Imagen</label>
                <input type="url" style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", marginTop: "6px", boxSizing: "border-box", outline: "none" }} value={editingResource.imageUrl || ""} onChange={(e) => setEditingResource({ ...editingResource, imageUrl: e.target.value })} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid #27272a", paddingTop: "16px" }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ backgroundColor: "transparent", border: "1px solid #27272a", color: "#a1a1aa", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={updating} style={{ backgroundColor: "#2563eb", border: "none", color: "#ffffff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                  <Save size={16} />
                  {updating ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmDelete !== null}
        title="Eliminar recurso"
        message={`¿Estás seguro de que deseas eliminar el recurso "${confirmDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        confirmColor="#ef4444"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}