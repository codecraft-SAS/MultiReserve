import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Store,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Layers,
  CalendarCheck
} from "lucide-react";

interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  imageUrl: string;
  rating: number;
  totalResources: number;
  totalReservations: number;
  active: boolean;
}

export default function ManageBusinesses() {
  const navigate = useNavigate();

  // Estados de control de datos y carga
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de control interactivo de interfaz
  const [searchTerm, setSearchTerm] = useState("");
  const [createHover, setCreateHover] = useState(false);
  const [actionHover, setActionHover] = useState<{ id: number; btn: string } | null>(null);

  // Inyectar estilos para la animación del loader si no usas Tailwind
  useEffect(() => {
    if (!document.getElementById("spinner-style")) {
      const style = document.createElement("style");
      style.id = "spinner-style";
      style.innerHTML = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .custom-spin { animation: spin 1s linear infinite; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // =====================================================================
  // EFECTO: Carga de negocios reales desde el Backend
  // =====================================================================
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8080/api/businesses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBusinesses(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error("Error al cargar los negocios:", err);
      setError("No se pudieron cargar los establecimientos comerciales. Verifica tu sesión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // =====================================================================
  // MANEJADOR: Cambiar visibilidad/estado (Active) del negocio
  // =====================================================================
  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:8080/api/businesses/${id}/toggle-active`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setBusinesses(businesses.map(b => b.id === id ? { ...b, active: !currentStatus } : b));
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del establecimiento.");
    }
  };

  // =====================================================================
  // MANEJADOR: Eliminar un negocio de la Base de Datos
  // =====================================================================
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el negocio "${name}"?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/businesses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBusinesses(businesses.filter(b => b.id !== id));
      } catch (err) {
        console.error("Error al eliminar el negocio:", err);
        alert("Hubo un error al intentar eliminar el establecimiento.");
      }
    }
  };

  const formatCategory = (cat: string) => {
    if (!cat) return "🏢 Negocio";
    const upper = cat.toUpperCase();
    if (upper.includes("REST")) return "🌐 Resto";
    if (upper.includes("SPOR") || upper.includes("CAN")) return "🌐 Deporte";
    if (upper.includes("HOT")) return "🌐 Hotel";
    return `🌐 ${cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}`;
  };

  const filteredBusinesses = businesses.filter((b) =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={() => navigate("/admin/create-business")}
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
          <span>Nuevo Negocio</span>
        </button>
      </div>

      {/* ─── BARRA DE BÚSQUEDA ─── */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
        <Search size={18} style={{ position: "absolute", left: "16px", color: "#52525b" }} />
        <input
          type="text"
          placeholder="Filtro integrado de establecimientos comerciales activos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            backgroundColor: "rgba(23, 23, 23, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "12px",
            padding: "14px 14px 14px 48px",
            color: "#ffffff",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* ─── ESTADOS DE CARGA O ERROR ─── */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
          <Loader2 size={36} className="custom-spin" style={{ color: "#2563eb" }} />
          <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>Consultando base de datos de MultiReserve...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#ef4444" }}>
          <p style={{ fontWeight: 600, margin: "0 0 8px 0" }}>⚠️ Error de Conectividad</p>
          <p style={{ color: "#a1a1aa", fontSize: "13px", margin: 0 }}>{error}</p>
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "#71717a", border: "1px dashed rgba(255, 255, 255, 0.08)", borderRadius: "16px" }}>
          No se encontraron establecimientos que coincidan con la búsqueda.
        </div>
      ) : (
        /* ─── GRILLA DE TARJETAS ─── */
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
          gap: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}>
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
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
                  {formatCategory(business.category)}
                </span>

                <span style={{ 
                  fontSize: "11px", 
                  fontWeight: 600, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  backgroundColor: business.active ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)", 
                  color: business.active ? "#10b981" : "#ef4444", 
                  padding: "4px 12px", 
                  borderRadius: "20px" 
                }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: business.active ? "#10b981" : "#ef4444" }}></span>
                  {business.active ? "Disponible" : "Inactivo"}
                </span>
              </div>

              {/* IMAGEN DEL ESTABLECIMIENTO */}
              <div style={{ width: "100%", height: "160px", borderRadius: "10px", overflow: "hidden", backgroundColor: "#1c1c1e", border: "1px solid rgba(255, 255, 255, 0.02)" }}>
                {business.imageUrl ? (
                  <img 
                    src={business.imageUrl} 
                    alt={business.name} 
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
                  {business.name}
                </h3>
                
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a1a1aa", fontSize: "13px" }}>
                  <MapPin size={13} style={{ color: "#52525b" }} />
                  <span>{business.city || "Pasto"} • <span style={{ color: "#71717a" }}>{business.address}</span></span>
                </div>
              </div>

              {/* CONTADORES MÉTRICOS EN LA BASE */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "4px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#71717a", display: "block", marginBottom: "2px" }}>Recursos</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                    <Layers size={14} style={{ color: "#3b82f6" }} />
                    <span>{business.totalResources || 0} items</span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", color: "#71717a", display: "block", marginBottom: "2px" }}>Reservas</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 700, color: "#10b981", justifyContent: "flex-end" }}>
                    <CalendarCheck size={14} />
                    <span>{business.totalReservations || 0}</span>
                  </div>
                </div>
              </div>

              {/* BOTONERA DE ACCIONES */}
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                
                <button
                  onClick={() => handleToggleActive(business.id, business.active)}
                  onMouseEnter={() => setActionHover({ id: business.id, btn: "toggle" })}
                  onMouseLeave={() => setActionHover(null)}
                  title={business.active ? "Ocultar Negocio" : "Mostrar Negocio"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: actionHover?.id === business.id && actionHover?.btn === "toggle" ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    padding: "8px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    flex: 1
                  }}
                >
                  {business.active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                <button
                  onClick={() => navigate(`/admin/edit-business/${business.id}`)}
                  onMouseEnter={() => setActionHover({ id: business.id, btn: "edit" })}
                  onMouseLeave={() => setActionHover(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    backgroundColor: actionHover?.id === business.id && actionHover?.btn === "edit" ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    flex: 2
                  }}
                >
                  <Edit3 size={14} />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => handleDelete(business.id, business.name)}
                  onMouseEnter={() => setActionHover({ id: business.id, btn: "delete" })}
                  onMouseLeave={() => setActionHover(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: actionHover?.id === business.id && actionHover?.btn === "delete" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    border: "none",
                    borderRadius: "8px",
                    color: actionHover?.id === business.id && actionHover?.btn === "delete" ? "#ef4444" : "#a1a1aa",
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  <Trash2 size={14} />
                </button>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}