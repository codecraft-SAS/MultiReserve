import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; 
import toast from "react-hot-toast";
import { ArrowLeft, Save, Sliders, Image as ImageIcon } from "lucide-react";

interface Business {
  id: number;
  name: string;
}

export default function CreateResourceForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // Añadimos imageUrl al estado
  const [formData, setFormData] = useState({
    name: "",
    type: "COURT", 
    businessId: 0, 
    capacity: 5,
    pricePerHour: 50000,
    description: "",
    imageUrl: "", // Ahora es un campo editable
    openingHour: "06:00",
    closingHour: "22:00"
  });

  const defaultImages: Record<string, string> = {
    COURT: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    ROOM: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop",
    TABLE: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop",
    CABIN: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop",
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await api.get("/businesses");

        console.log("Negocios cargados:", response.data);

        setBusinesses(response.data);

        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            businessId: response.data[0].id
          }));
        }
      } catch (error) {
        console.error("Error cargando negocios:", error);
        toast.error("No se pudieron cargar los negocios");
      }
    };

    fetchBusinesses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Si el usuario escribió una URL, usamos esa; si no, usamos la automática
    const finalImageUrl = formData.imageUrl.trim() !== "" 
      ? formData.imageUrl 
      : (defaultImages[formData.type] || defaultImages.COURT);

    const payload = {
      ...formData,
      businessId: Number(formData.businessId),
      capacity: Number(formData.capacity),
      pricePerHour: Number(formData.pricePerHour),
      description: formData.description.trim(),
      imageUrl: finalImageUrl 
    };

    console.log("Payload enviado:", payload);

    try {
      await api.post("/resources", payload);
      toast.success("¡Recurso creado exitosamente!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Error en el servidor:", err);
      const backendMessage = err.response?.data?.message || "Error al crear el recurso";
      toast.error(`No se pudo crear: ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#ffffff" }}>
      <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "transparent", border: "none", color: "#a1a1aa", cursor: "pointer", marginBottom: "20px", fontSize: "14px" }}>
        <ArrowLeft size={16} /> Volver
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <Sliders size={24} style={{ color: "#2563eb" }} />
        <h1 style={{ fontSize: "28px", fontWeight: 800, margin: 0 }}>Crear Nuevo Recurso</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "rgba(23, 23, 23, 0.6)", padding: "28px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
        
        {/* Selector de Negocio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Asignar al Negocio (ID)</label>
          <select
            value={formData.businessId}
            onChange={(e) =>
              setFormData({
                ...formData,
                businessId: Number(e.target.value)
              })
            }
            style={{
              width: "100%",
              backgroundColor: "#111111",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              padding: "12px",
              color: "#ffffff",
              outline: "none"
            }}
          >
            {businesses.length === 0 ? (
              <option>Cargando negocios...</option>
            ) : (
              businesses.map((business) => (
                <option
                  key={business.id}
                  value={business.id}
                >
                  {business.name} (ID: {business.id})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Nombre */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Nombre del Recurso</label>
          <input type="text" required placeholder="Ej. Cancha Sintética Premium" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none" }} />
        </div>

        {/* Tipo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Tipo de Recurso</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none" }}>
            <option value="COURT">⚽ Cancha / Escenario Deportivo</option>
            <option value="ROOM">🏢 Sala / Salón / Coworking</option>
            <option value="TABLE">🍽️ Mesa / Sector Gastronómico</option>
            <option value="CABIN">🏡 Cabaña / Hospedaje</option>
          </select>
        </div>

        {/* URL de la Imagen */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>URL de la imagen</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <ImageIcon size={18} style={{ position: "absolute", left: "12px", color: "#666" }} />
            <input 
              type="url" 
              placeholder="Deja vacío para auto-asignar imagen..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px 12px 12px 40px", color: "#ffffff", outline: "none" }}
            />
          </div>
        </div>

        {/* Capacidad y Precio */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Capacidad (Personas)</label>
            <input type="number" required min="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Precio por Hora ($)</label>
            <input type="number" required min="0" value={formData.pricePerHour} onChange={(e) => setFormData({ ...formData, pricePerHour: Number(e.target.value) })} style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none" }} />
          </div>
        </div>

        {/* Horarios */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Hora de Apertura</label>
            <input type="time" required value={formData.openingHour} onChange={(e) => setFormData({ ...formData, openingHour: e.target.value })} style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Hora de Cierre</label>
            <input type="time" required value={formData.closingHour} onChange={(e) => setFormData({ ...formData, closingHour: e.target.value })} style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none" }} />
          </div>
        </div>

        {/* Detalles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#a1a1aa" }}>Detalles / Especificaciones</label>
          <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", backgroundColor: "#111111", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", padding: "12px", color: "#ffffff", outline: "none", resize: "none" }} />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: "10px", padding: "14px", borderRadius: "8px", border: "none", backgroundColor: "#2563eb", color: "#ffffff", fontWeight: 700, cursor: "pointer" }}>
          {loading ? "Guardando..." : "Guardar Recurso"}
        </button>
      </form>
    </div>
  );
}
